import { Head, useForm } from "@inertiajs/react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { BreadcrumbItem, PageProps } from "@/types";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { Loader2Icon } from "lucide-react";
import InputError from "@/components/input-error";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormEventHandler } from "react";
import { toast } from "sonner";


type DivisionForm = {
    name: string;
    description: string;
    office_: number;
};

export default function Divisions({ offices }: PageProps) {
    console.info(offices)
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Divisions / Create',
            href: '/divisions/create',
        },
    ];


    const { data, setData, post, errors, processing, reset } = useForm<Required<DivisionForm>>({
        name: "",
        description: '',
        office_id: ''
    });
    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('divisions.store'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Success', {
                    description: `Division created successfully`,
                });
                reset();
            },
            onError: (errors) => {
                console.error(errors);
            },
        });
    };

    const handlePerPageChange = (value: string) => {
        console.info(value)
        // router.get(
        //     meta.path,
        //     { per_page: value, page: 1 }, // Reset to first page when changing per_page
        //     {
        //         preserveState: true,
        //         preserveScroll: true,
        //         replace: true,
        //     }
        // );
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Division" />
            <div className="container mx-auto space-y-6 px-5 py-6">
                <div className="flex items-center justify-between">
                    <h6 className="text-2x font-bold">Create Division</h6>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-3 py-4">

                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing}
                                placeholder="Name"
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                type="description"
                                tabIndex={2}
                                autoComplete="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                disabled={processing}
                                placeholder="Description"
                            />
                            <InputError message={errors.description} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="office">Office</Label>
                            <Select
                                value={String(data.office_id)} // Ensure it’s string
                                onValueChange={(value) => setData('office_id', value)} // Keep as string
                            >
                                <SelectTrigger className="h-8 w-full">
                                    <SelectValue placeholder="Select office" />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {offices.map((office, index) => {
                                        return (
                                            <SelectItem key={index} value={String(office.id)}>
                                                {office.name} - {office.description}
                                            </SelectItem>
                                        )
                                    })}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.office_id} />
                        </div>




                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing ? <>
                            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> Saving...
                        </> : 'Save'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
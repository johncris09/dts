import { Head, useForm, usePage } from "@inertiajs/react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { BreadcrumbItem, PageProps, SharedData } from "@/types";
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

export default function Divisions({ division, offices }: PageProps) {
    const { auth } = usePage<SharedData>().props
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Divisions / Edit',
            href: '/divisions/edit',
        },
    ];


    const { data, setData, patch, errors, processing, reset } = useForm<Required<DivisionForm>>({
        id: division.id || "",
        name: division.name || "",
        description: division.description || "",
        office_id: division.office_id || "",
    });
    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route(`divisions.update`, division), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Success', {
                    description: 'Division updated successfully',
                });
                reset();
            },
            onError: (errors) => {
                console.error(errors);
            },
        });

    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Division" />
            <div className="container mx-auto space-y-6 px-5 py-6">
                <div className="flex items-center justify-between">
                    <h6 className="text-2x font-bold">Edit Division</h6>
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
                        {auth?.roles?.includes('Super Admin') && <div className="grid gap-2">
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
                        </div>}

                    </div>

                    <div className="flex justify-end ">
                        <Button type="submit" disabled={processing}>
                            {processing ? <>
                                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> Updating...
                            </> : 'Update'}
                        </Button>
                    </div>


                </form>
            </div>
        </AppLayout>
    );
}
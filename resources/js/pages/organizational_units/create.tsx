import { Head, useForm, usePage } from "@inertiajs/react";
import { BreadcrumbItem, PageProps, SharedData } from "@/types";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { Loader2Icon } from "lucide-react";
import InputError from "@/components/input-error";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormEventHandler } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type RegisterForm = {
    name: string;
    description: string;
    parent_id: number | string,
};
export default function CreateOrganizationalUnits({ roles, parentUnits }: PageProps) {
    const { auth } = usePage<SharedData>().props
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Organizational Units / Create',
            href: '/users/create',
        },
    ];


    const { data, setData, post, errors, processing, reset } = useForm<Required<RegisterForm>>({
        name: "",
        description: '',
        parent_id: '',
    });
    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('organizational_units.store'), {
            preserveScroll: true,

            onSuccess: () => {
                toast.success('Success', {
                    description: `Organizational Unit created successfully`,
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
            <Head title="Create Organizational Unit" />
            <div className="container mx-auto space-y-6 px-5 py-6">
                <div className="flex items-center justify-between">
                    <h6 className="text-2x font-bold">Create Organizational Unit</h6>
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
                            <Label htmlFor="parent_id">Select Parent Unit</Label>
                            <Select
                                value={String(data.parent_id)} // Ensure it’s string
                                onValueChange={(value) => {
                                    setData('parent_id', value);

                                }}
                            >
                                <SelectTrigger tabIndex={2} className="h-8 w-full">
                                    <SelectValue placeholder="Select parent unit" />
                                </SelectTrigger>
                                <SelectContent side="bottom">

                                    <SelectItem>
                                        Select
                                    </SelectItem>
                                    {parentUnits.map((organizationalUnit, index) => {
                                        return (
                                            <SelectItem key={index} value={String(organizationalUnit.id)}>
                                                {organizationalUnit.hierarchy_path}
                                            </SelectItem>
                                        )
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                type="text"

                                autoFocus
                                tabIndex={3}
                                autoComplete="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                disabled={processing}
                                placeholder="Description"
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>


                    </div>
                    <div className="flex justify-end ">
                        <Button type="submit" disabled={processing}>
                            {processing ? <>
                                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> Saving...
                            </> : 'Save'}
                        </Button>
                    </div>

                </form>
            </div>
        </AppLayout>
    );
}
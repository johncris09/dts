import { Head, useForm } from "@inertiajs/react";
import { BreadcrumbItem, PageProps } from "@/types";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { Loader2Icon } from "lucide-react";
import InputError from "@/components/input-error";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";


type OfficeForm = {
    id: number,
    name: string;
    description: string;
};

export default function Offices({ office }: PageProps) {

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Offices / Edit',
            href: '/offices/edit',
        },
    ];
    const { data, setData, patch, errors, processing, reset } = useForm<Required<OfficeForm>>({
        id: office.id || "",
        name: office.name || "",
        description: office.description || "",
    });
    const handleSubmit = (e) => {
        e.preventDefault();

        patch(route(`offices.update`, office), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Success', {
                    description: `Office updated successfully`,
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
            <Head title="Edit User" />
            <div className="container mx-auto space-y-6 px-5 py-6">
                <div className="flex items-center justify-between">
                    <h6 className="text-2x font-bold">Edit User</h6>
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

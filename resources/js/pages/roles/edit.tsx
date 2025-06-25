import { Head, useForm } from "@inertiajs/react";
import { BreadcrumbItem, PageProps } from "@/types";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { Loader2Icon } from "lucide-react";
import InputError from "@/components/input-error";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { FormEventHandler } from "react";


type RoleForm = {
    name: string;
    permissions: [];
};

export default function Users({ role, permissions }: PageProps) {

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Roles / Edit',
            href: '/roles/edit',
        },
    ];

    const { data, setData, patch, errors, processing, reset } = useForm<RoleForm>({
        name: role?.name || "",
        permissions: role?.permissions
            ? role.permissions.map((p) => p.name)
            : [],
    });


    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route(`roles.update`, role), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Success', {
                    description: `Role updated successfully`,
                });
                reset();
            },
            onError: (errors) => {
                console.error(errors);
            },
        });
    };

    const handlePermissionChange = (permissionName, checked) => {
        if (checked) {
            setData('permissions', [...data.permissions, permissionName])
        } else {
            setData("permissions", data.permissions.filter(name => name !== permissionName))
        }
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Role" />
            <div className="container mx-auto space-y-6 px-5 py-6">
                <div className="flex items-center justify-between">
                    <h6 className="text-2x font-bold">Edit Role</h6>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-3 py-4">

                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                placeholder="Name"
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="grid">
                            <Label htmlFor="permission">Permissions</Label>
                            {permissions.map((permission) => (
                                <div key={permission}>
                                    <label className="capitalize">
                                        <input
                                            id="permission"
                                            type="checkbox"
                                            name="permissions[]"
                                            checked={data.permissions.includes(permission)}
                                            value={permission}
                                            onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                                            className="mr-2 "
                                        />
                                        {permission}
                                    </label>
                                </div>
                            ))}
                            <InputError message={errors.permission} className="mt-2" />
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
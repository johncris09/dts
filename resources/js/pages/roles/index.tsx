import { useState } from "react";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head } from "@inertiajs/react";
import { BreadcrumbItem, Meta } from "@/types";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { getColumns } from "./columns";
import { CrudForm } from "@/components/crud-form";
import InputError from "@/components/input-error";
import type { Role } from './columns';
import { Permission } from "../permissions/columns";
import { can, groupByAction } from "@/lib/utils";

export default function Offices({ roles, permissions }: {
    roles: {
        data: Role[];
        meta?: Meta;
    };
    permissions: Permission[]
}) {
    const [open, setOpen] = useState(false);
    const [selectedData, setSelectedData] = useState<Role | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Roles",
            href: "/roles",
        },
    ];
    const handleOpenModal = (data: Role | null = null) => {

        setSelectedData(data);
        setOpen(true);
    };


    return (

        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <div className="container mx-auto space-y-6 px-5 py-6">
                <div className="flex items-center justify-between">
                    <h6 className="text-2x font-bold">Roles</h6>
                    {can('create roles') && <Button className="cursor-pointer" size={'sm'} onClick={() => handleOpenModal()}>
                        <Plus />
                        Add New
                    </Button>}


                </div>
                <DataTable columns={getColumns(handleOpenModal)} data={roles.data} meta={roles.meta} />
            </div>
            <CrudForm<Role>
                key={selectedData?.id ?? 'new'}
                open={open}
                setOpen={(isOpen) => {
                    setOpen(isOpen);
                    if (!isOpen) setSelectedData(null);
                }}
                title="Role"
                initialData={{
                    id: selectedData?.id || "",
                    name: selectedData?.name || "",
                    permissions: Array.isArray(selectedData?.permissions)
                        ? selectedData.permissions.map((p: any) =>
                            typeof p === "string" ? p : p.name
                        )
                        : [],
                }}
                isEdit={!!selectedData?.id}
                routeName="roles"
                onSuccess={() => setSelectedData(null)}
            >
                {({ data, setData, errors }) => {

                    const handlePermissionChange = (permission: string, checked: boolean) => {
                        // Ensure permissions is always a string[]
                        const currentPermissions: string[] = Array.isArray(data.permissions)
                            ? data.permissions.map((p) =>
                                typeof p === "string" ? p : p.name
                            )
                            : [];
                        if (checked) {
                            setData("permissions", [...currentPermissions, permission]);
                        } else {
                            setData(
                                "permissions",
                                currentPermissions.filter((p) => p !== permission)
                            );
                        }
                    };
                    return (
                        <>
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
                                    placeholder="Name"
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Permissions</Label>
                                {Object.entries(groupByAction(permissions)).map(([action, perms]) => (
                                    <div key={action} className="mb-4">
                                        <div className="font-semibold capitalize mb-1">{action}</div>

                                        <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                                            {perms.map((permissionObj) => {
                                                // permissionObj is likely a Permission object, not a string
                                                const permissionName = typeof permissionObj === "string" ? permissionObj : permissionObj.name;
                                                return (
                                                    <label
                                                        key={permissionName}
                                                        className="flex items-start gap-2 text-sm capitalize"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={Array.isArray(data.permissions) && data.permissions.includes(permissionName)}
                                                            onChange={(e) =>
                                                                handlePermissionChange(permissionName, e.target.checked)
                                                            }
                                                            className="mt-1"
                                                        />
                                                        {permissionName.replace(`${action} `, "")}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                                <InputError message={errors.permissions} />
                            </div>
                        </>
                    )
                }

                }
            </CrudForm>

        </AppLayout>
    );
}

import { useState } from "react";
import { Head } from "@inertiajs/react";
import { BreadcrumbItem, Meta } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CrudForm } from "@/components/crud-form";
import AppLayout from "@/layouts/app-layout";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { can } from "@/lib/can";
import { getColumns } from "./columns";
import { Permission } from "./columns";
import InputError from "@/components/input-error";


interface PermissionProps {
    permissions: {
        data: Permission[];
        meta?: Meta;
    };
}

export default function Offices({ permissions }: PermissionProps) {
    const [open, setOpen] = useState(false);
    const [selectedData, setSelectedData] = useState<Permission | null>(null);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Permissions",
            href: "/permissions",
        },
    ];

    const handleOpenModal = (data: Permission | null = null) => {
        setSelectedData(data);
        setOpen(true);
    };

    return (

        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permissions" />
            <div className="container mx-auto space-y-6 px-5 py-6">
                <div className="flex items-center justify-between">
                    <h6 className="text-2x font-bold">Permissions</h6>
                    {can('create permissions') && <Button className="cursor-pointer" size={'sm'} onClick={() => handleOpenModal()}>
                        <Plus />
                        Add New
                    </Button>}


                </div>
                <DataTable columns={getColumns(handleOpenModal)} data={permissions.data} meta={permissions.meta} />
            </div>
            <CrudForm<Permission>
                key={selectedData?.id ?? 'new'}
                open={open}
                setOpen={(isOpen) => {
                    setOpen(isOpen);
                    if (!isOpen) setSelectedData(null);
                }}
                title="Permission"
                initialData={{
                    id: selectedData?.id || "",
                    name: selectedData?.name || "",
                }}
                isEdit={!!selectedData?.id}
                routeName="permissions"
                onSuccess={() => setSelectedData(null)}
            >
                {({ data, setData, errors }) => (
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

                    </>
                )}
            </CrudForm>

        </AppLayout>
    );
}

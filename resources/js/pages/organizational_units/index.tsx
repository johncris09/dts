import { Head, router } from "@inertiajs/react";
import { BreadcrumbItem, Meta } from "@/types";
import { Button } from "@/components/ui/button";

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from "@/layouts/app-layout";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { getColumns } from "./columns";
import { CrudForm } from "@/components/crud-form";
import { useState } from "react";
import InputError from "@/components/input-error";
import type { OrganizationalUnit } from './columns';
import { can } from "@/lib/utils";



interface OrganizationalUnitsProps {
    organizationalUnits: {
        data: OrganizationalUnit[];
        meta?: Meta;
    };
}

export default function OrganizationalUnits({ organizationalUnits }: OrganizationalUnitsProps) {

    const [open, setOpen] = useState(false);
    const [selectedData, setSelectedData] = useState<OrganizationalUnit | null>(null);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Organizational Units',
            href: '/organizational_units',
        },
    ];


    const handleOpenModal = (data: OrganizationalUnit | null = null) => {
        setSelectedData(data);
        setOpen(true);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Offices" />
            <div className="container mx-auto space-y-6 px-5 py-6">
                <div className="flex items-center justify-between">
                    <h6 className="text-2x font-bold">Organizational Units</h6>
                    {/* {can('create organizational units') && <Button className="cursor-pointer" size={'sm'} onClick={() => handleOpenModal()}>
                        <Plus />
                        Add New
                    </Button>} */}
                    {can('create organizational units') && <Button className="cursor-pointer" size={'sm'} onClick={() => router.visit(route('organizational_units.create'))}>
                        <Plus />
                        Add New
                    </Button>}


                </div>
                <DataTable columns={getColumns(handleOpenModal)} data={organizationalUnits.data} meta={organizationalUnits.meta} />
            </div>
            <CrudForm<OrganizationalUnit>
                key={selectedData?.id ?? 'new'} // <-- Add this line
                open={open}
                setOpen={(isOpen) => {
                    setOpen(isOpen);
                    if (!isOpen) setSelectedData(null);
                }}
                title="Office"
                initialData={{
                    id: selectedData?.id || "",
                    name: selectedData?.name || "",
                    parent_id: selectedData?.parent_id || "",
                    description: selectedData?.description || "",
                }}
                isEdit={!!selectedData?.id}
                routeName="organizational_units"
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
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                type="description"
                                tabIndex={2}
                                autoComplete="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Description"
                            />
                            <InputError message={errors.description} />
                        </div>
                    </>
                )}
            </CrudForm>

        </AppLayout>
    );
}

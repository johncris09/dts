import { Head } from "@inertiajs/react";
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
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from "@/components/ui/select";
import type { OrganizationalUnit } from './columns';
import { can } from "@/lib/utils";

interface OrganizationalUnitsProps {
    organizationalUnits: {
        data: OrganizationalUnit[];
        meta?: Meta;
    };
    parentUnits: OrganizationalUnit[]; 
}

export default function OrganizationalUnits({ organizationalUnits, parentUnits }: OrganizationalUnitsProps) {
    // console.log("🔍 parentUnits:", parentUnits);
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
            <Head title="Organizational Units" />

            <div className="container mx-auto space-y-6 px-5 py-6">
                <div className="flex items-center justify-between">
                    <h6 className="text-2xl font-bold">Organizational Units</h6>
                    {can('create organizational units') && (
                        <Button size={'sm'} onClick={() => handleOpenModal()}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add New
                        </Button>
                    )}
                </div>

                <DataTable
                    columns={getColumns(handleOpenModal)}
                    data={organizationalUnits.data}
                    meta={organizationalUnits.meta}
                />
            </div>

            <CrudForm<OrganizationalUnit>
                key={selectedData?.id ?? 'new'}
                open={open}
                setOpen={(isOpen) => {
                    setOpen(isOpen);
                    if (!isOpen) setSelectedData(null);
                }}
                title="Organizational Unit"
                initialData={{
                    id: selectedData?.id || "",
                    name: selectedData?.name || "",
                    parent_id: selectedData?.parent_id ?? null,
                    description: selectedData?.description || "",
                }}
                additionalData={{ parentUnits }}
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
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                placeholder="Name"
                                autoFocus
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="parent_id">Select Parent Unit</Label>
                            <Select
                                value={data.parent_id !== null ? String(data.parent_id) : "null"}
                                onValueChange={(value) => {
                                    setData("parent_id", value === "null" ? null : value);
                                }}
                            >
                                <SelectTrigger className="h-8 w-full">
                                    <SelectValue placeholder="Select parent unit" />
                                </SelectTrigger>
                                <SelectContent side="bottom">
                                    <SelectItem value="null">No Parent</SelectItem>
                                    {parentUnits.data.map((unit) => (
                                        <SelectItem
                                            key={unit.id}
                                            value={String(unit.id)}
                                        >
                                            {unit.hierarchy_path}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.parent_id} className="mt-2" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                type="text"
                                value={data.description}
                                onChange={(e) => setData("description", e.target.value)}
                                placeholder="Description"
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>
                    </>
                )}
            </CrudForm>
        </AppLayout>
    );
}

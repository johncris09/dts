import { Head } from "@inertiajs/react";
import { BreadcrumbItem } from "@/types";
import { Button } from "@/components/ui/button";

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from "@/layouts/app-layout";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { can } from "@/lib/can";
import { getColumns } from "./columns";
import { CrudForm } from "@/components/crud-form";
import { useState } from "react";
import InputError from "@/components/input-error";
import type { Office } from './columns';

type Meta = {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    path: string;
    links: { url: string | null; label: string; active: boolean; }[];
};

interface OfficesProps {
    offices: {
        data: Office[];
        meta?: Meta;
    };
}

export default function Offices({ offices }: OfficesProps) {
    const [open, setOpen] = useState(false);
    const [selectedData, setSelectedData] = useState<Office | null>(null);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Offices',
            href: '/offices',
        },
    ];


    const handleOpenModal = (data: Office | null = null) => {
        setSelectedData(data);
        setOpen(true);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Offices" />
            <div className="container mx-auto space-y-6 px-5 py-6">
                <div className="flex items-center justify-between">
                    <h6 className="text-2x font-bold">Offices</h6>
                    {can('create offices') && <Button className="cursor-pointer" size={'sm'} onClick={() => handleOpenModal()}>
                        <Plus />
                        Add New
                    </Button>}


                </div>
                <DataTable columns={getColumns(handleOpenModal)} data={offices.data} meta={offices.meta} />
            </div>
            <CrudForm<Office>
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
                    description: selectedData?.description || "",
                }}
                isEdit={!!selectedData?.id}
                routeName="offices"
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
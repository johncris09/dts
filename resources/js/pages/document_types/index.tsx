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
import { DocumentType, getColumns } from "./columns";
import InputError from "@/components/input-error";
import { can } from "@/lib/utils";


interface DocumentTypeProps {
    document_types: {
        data: DocumentType[];
        meta?: Meta;
    };
}

export default function Offices({ document_types }: DocumentTypeProps) {
    const [open, setOpen] = useState(false);
    const [selectedData, setSelectedData] = useState<DocumentType | null>(null);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Document Types",
            href: "/document_types",
        },
    ];

    const handleOpenModal = (data: DocumentType | null = null) => {
        setSelectedData(data);
        setOpen(true);
    };

    return (

        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Document Types" />
            <div className="container mx-auto space-y-6 px-5 py-6">
                <div className="flex items-center justify-between">
                    <h6 className="text-2x font-bold">Document Types</h6>
                    {can('create document types') && <Button className="cursor-pointer" size={'sm'} onClick={() => handleOpenModal()}>
                        <Plus />
                        Add New
                    </Button>}


                </div>
                <DataTable columns={getColumns(handleOpenModal)} data={document_types.data} meta={document_types.meta} />
            </div>
            <CrudForm<DocumentType>
                key={selectedData?.id ?? 'new'}
                open={open}
                setOpen={(isOpen) => {
                    setOpen(isOpen);
                    if (!isOpen) setSelectedData(null);
                }}
                title="Document Type"
                initialData={{
                    id: selectedData?.id || "",
                    name: selectedData?.name || "",
                }}
                isEdit={!!selectedData?.id}
                routeName="document_types"
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

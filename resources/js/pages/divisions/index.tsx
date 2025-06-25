import { Head, router } from "@inertiajs/react";
import { BreadcrumbItem, PageProps } from "@/types";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { can } from "@/lib/can";
import { getColumns } from "./columns";

export default function Divisions({ divisions }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Divisions',
            href: '/divisions',
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Divisions" />
            <div className="container mx-auto space-y-6 px-5 py-6">
                <div className="flex items-center justify-between">
                    <h6 className="text-2x font-bold">Divisions</h6>
                    {can('create divisions') && <Button className="cursor-pointer" size={'sm'} onClick={() => router.visit(route('divisions.create'))}>
                        <Plus />
                        Add New
                    </Button>}

                </div>
                <DataTable columns={getColumns()} data={divisions.data} meta={divisions.meta} />
            </div>


        </AppLayout>
    );
}
import { Head, router, usePage } from "@inertiajs/react";
import { BreadcrumbItem, PageProps } from "@/types";
import { Button } from "@/components/ui/button";

import AppLayout from "@/layouts/app-layout";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { can } from "@/lib/can";
import { getColumns } from "./columns";

export default function Offices({ offices }: PageProps) {

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Offices',
            href: '/offices',
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Offices" />
            <div className="container mx-auto space-y-6 px-5 py-6">
                <div className="flex items-center justify-between">
                    <h6 className="text-2x font-bold">Offices</h6>
                    {can('create offices') && <Button className="cursor-pointer" size={'sm'} onClick={() => router.visit(route('offices.create'))}>
                        <Plus />
                        Add New
                    </Button>}


                </div>
                <DataTable columns={getColumns()} data={offices.data} meta={offices.meta} />
            </div>


        </AppLayout>
    );
}
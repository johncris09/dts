import { Head, router } from "@inertiajs/react";
import { BreadcrumbItem, PageProps } from "@/types";
import { Button } from "@/components/ui/button";
import { columns } from "./columns";
import AppLayout from "@/layouts/app-layout";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { can } from "@/lib/can";

export default function Users({ roles }: PageProps) {

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Roles',
            href: '/roles',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <div className="container mx-auto space-y-6 px-5 py-6">
                <div className="flex items-center justify-between">
                    <h6 className="text-2x font-bold">Roles</h6>
                    {can('create roles') &&
                        <Button className="cursor-pointer" size={'sm'} onClick={() => router.visit(route('roles.create'))}>
                            <Plus />
                            Add New
                        </Button>}

                </div>
                <DataTable columns={columns} data={roles.data} meta={roles.meta} />
            </div>

        </AppLayout>
    );
}
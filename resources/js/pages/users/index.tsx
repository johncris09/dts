import { Head, router } from "@inertiajs/react";
import { BreadcrumbItem, PageProps } from "@/types";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { getColumns } from "./columns";
import { can } from "@/lib/utils";

export default function Users({ users }: PageProps) {

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Users',
            href: '/users',
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="container mx-auto space-y-6 px-5 py-6">
                <div className="flex items-center justify-between">
                    <h6 className="text-2x font-bold">Users</h6>
                    {can('create users') && <Button className="cursor-pointer" size={'sm'} onClick={() => router.visit(route('users.create'))}>
                        <Plus />
                        Add New
                    </Button>}


                </div>
                <DataTable columns={getColumns()} data={users.data} meta={users.meta} />
            </div>


        </AppLayout>
    );
}

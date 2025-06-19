import { Head } from "@inertiajs/react";
import { BreadcrumbItem, PageProps } from "@/types";
import { Button } from "@/components/ui/button";
import { columns } from "@/components/data-table/columns";
import AppLayout from "@/layouts/app-layout";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";

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

                    <Button size='sm' >
                        <Plus />
                        Add New
                    </Button>

                </div>
                <DataTable columns={columns} data={users.data} meta={users.meta} />
            </div>

            {/* <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Selected Users</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {selectedIds.length} users? This
                            action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleBulkDelete}>
                            Delete Users
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog> */}
        </AppLayout>
    );
}
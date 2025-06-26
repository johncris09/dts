import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { RowActions } from "@/components/DataTable/RowActions";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { can } from "@/lib/can";

export type Permission = {
    id: string | number | '';
    name: string;
};

type HandleOpenModal = (data: Permission) => void;

export const getColumns = (handleOpenModal: HandleOpenModal) => {

    const columns: ColumnDef<Permission>[] = [

        ...(can('edit permissions') || can('delete permissions') ? [
            {
                id: "actions",
                accessorKey: "Action",
                cell: ({ row }: { row: { original: Permission } }) => {
                    const permissions = row.original;

                    return (
                        <RowActions
                            item={permissions}
                            actions={[
                                ...(can('edit permissions') ? [{
                                    label: "Edit",
                                    onClick: () => {
                                        handleOpenModal(permissions)
                                    },
                                }] : []),

                                ...(can('delete permissions') ? [{
                                    label: "Delete",
                                    requiresConfirmation: true,
                                    onClick: () => {
                                        router.delete(route(`permissions.destroy`, permissions), {
                                            preserveScroll: true,
                                            onSuccess: (response) => {
                                                const flash = (response && typeof response === 'object' && 'props' in response && response.props && typeof response.props === 'object' && 'flash' in response.props) ? (response.props as { flash?: { error?: string; success?: string } }).flash : undefined;
                                                if (flash?.error) {
                                                    toast.error('Error', {
                                                        description: flash.error
                                                    });
                                                }
                                                if (flash?.success) {
                                                    toast.success('Success', {
                                                        description: flash.success
                                                    });
                                                }
                                            },
                                            onError: (errors) => {
                                                console.error(errors);
                                            },

                                        });
                                    },
                                },] : []),


                            ]}
                        />
                    );
                },
            },
        ] : []),
        {
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Name" />
            ),
            cell: ({ row }) => (
                <div className='break-words whitespace-normal capitalize'>
                    {row.getValue('name')}
                </div>
            ),
            enableSorting: true,
            enableHiding: true,
        },
    ];

    return columns;

}

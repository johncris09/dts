import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { RowActions } from "@/components/DataTable/RowActions";
import { can } from "@/lib/can";
import { router } from "@inertiajs/react";
import { toast } from "sonner";

export type Permission = {
    id: number;
    name: string;
};

export const getColumns = () => {


    const columns: ColumnDef<Permission>[] = [

        ...(can('edit permissions') || can('delete permissions') ? [
            {
                id: "actions",
                accessorKey: "Action",
                cell: ({ row }) => {
                    const permission = row.original;

                    return (
                        <RowActions
                            item={permission}
                            actions={[
                                ...(can('edit permissions') ? [{
                                    label: "Edit",
                                    href: route("permissions.edit", permission),
                                }] : []),

                                ...(can('delete permissions') ? [{
                                    label: "Delete",
                                    requiresConfirmation: true,
                                    onClick: () => {
                                        router.delete(route(`permissions.destroy`, permission), {
                                            preserveScroll: true,
                                            onSuccess: (response) => {
                                                const { flash } = response?.props
                                                if (flash.error) {
                                                    toast.error('Error', {
                                                        description: flash.error
                                                    });
                                                }
                                                if (flash.success) {
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

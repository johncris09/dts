import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { RowActions } from "@/components/DataTable/RowActions";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { can } from "@/lib/can";
export type Office = {
    id: number;
    name: string;
    description: string;
};

export const getColumns = () => {


    const columns: ColumnDef<Office>[] = [

        ...(can('edit offices') || can('delete offices') ? [
            {
                id: "actions",
                accessorKey: "Action",
                cell: ({ row }) => {
                    const office = row.original;

                    return (
                        <RowActions
                            item={office}
                            actions={[
                                ...(can('edit offices') ? [{
                                    label: "Edit",
                                    href: route("offices.edit", office),
                                }] : []),

                                ...(can('delete offices') ? [{
                                    label: "Delete",
                                    requiresConfirmation: true,
                                    onClick: () => {
                                        router.delete(route(`offices.destroy`, office), {
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
        {
            accessorKey: "description",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Description" />
            ),
            cell: ({ row }) => (
                <div className='break-words whitespace-normal capitalize'>
                    {row.getValue('description')}
                </div>
            ),
            enableSorting: true,
            enableHiding: true,
        },
    ];

    return columns;

}
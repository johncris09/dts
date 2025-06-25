import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { RowActions } from "@/components/DataTable/RowActions";
import { router } from "@inertiajs/react";
import { can } from "@/lib/can";
import { toast } from "sonner";

export type Division = {
    id: number;
    name: string;
    description: string;
    office: string;
};
export const getColumns = () => {


    const columns: ColumnDef<Division>[] = [

        ...(can('edit divisions') || can('delete divisions') ? [
            {
                id: "actions",
                accessorKey: "Action",
                cell: ({ row }) => {
                    const division = row.original;

                    return (
                        <RowActions
                            item={division}
                            actions={[
                                ...(can('edit divisions') ? [{
                                    label: "Edit",
                                    href: route("divisions.edit", division),
                                }] : []),

                                ...(can('delete divisions') ? [{
                                    label: "Delete",
                                    requiresConfirmation: true,
                                    onClick: () => {
                                        router.delete(route(`divisions.destroy`, division), {
                                            preserveScroll: true,
                                            onSuccess: () => {
                                                toast.success('Success', {
                                                    description: `Office deleted successfully`,
                                                });
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
        {
            accessorKey: "office.name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Office" />
            ),


            cell: ({ row }) => (
                <div className='break-words whitespace-normal capitalize'>
                    {row.original.office?.name}
                </div>
            ),
            enableSorting: true,
            enableHiding: true,
        },
    ];

    return columns;

}
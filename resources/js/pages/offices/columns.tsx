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

export const columns: ColumnDef<Office>[] = [

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
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
    },
    {
        accessorKey: "description",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Description" />
        ),
    },
];
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { RowActions } from "@/components/DataTable/RowActions";
import { router } from "@inertiajs/react";

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
                        {
                            label: "Edit",
                            href: route("offices.edit", office),
                        },
                        {
                            label: "Delete",
                            requiresConfirmation: true,
                            onClick: () => {
                                router.delete(route(`offices.destroy`, office), {
                                    preserveScroll: true,

                                });
                            },
                        },
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
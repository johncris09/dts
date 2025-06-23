import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { RowActions } from "@/components/DataTable/RowActions";
import { router } from "@inertiajs/react";

export type Division = {
    id: number;
    name: string;
    description: string;
    office: string;
};

export const columns: ColumnDef<Division>[] = [

    {
        id: "actions",
        accessorKey: "Action",
        cell: ({ row }) => {
            const division = row.original;
            return (
                <RowActions
                    item={division}
                    actions={[
                        {
                            label: "Edit",
                            href: route("divisions.edit", division),
                        },
                        {
                            label: "Delete",
                            requiresConfirmation: true,
                            onClick: () => {
                                router.delete(route(`divisions.destroy`, division), {
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
    {
        accessorKey: "office.name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Office" />
        ),

        // cell: ({ row }) => <pre className="text-xs whitespace-pre-wrap">{ JSON.stringify( row.original.office.name , null, 2)}</pre>,
        enableSorting: false,
        enableHiding: true,
    },
];
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { RowActions } from "@/components/DataTable/RowActions";

export type User = {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
    avatar: string | null;
    roles: string[];
};

export const columns: ColumnDef<User>[] = [

    {
        id: "actions",
        header: 'Action',
        cell: ({ row }) => {
            const permission = row.original;

            return (
                <RowActions
                    item={permission}
                    actions={[
                        {
                            label: "Edit",
                            href: route("permissions.edit", permission),
                        },
                        {
                            label: "Delete",
                            requiresConfirmation: true,

                            onClick: () => {
                                // Handle delete
                            },
                        },
                    ]}
                />
            );
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),

        cell: ({ row }) => {
            const data = row.original;
            return (
                <div className="flex gap-4 items-center">

                    <div>
                        <div className="font-medium capitalize">
                            {data.name}
                        </div>
                    </div>
                </div>
            );
        },
    },
];
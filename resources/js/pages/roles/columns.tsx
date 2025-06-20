import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { RowActions } from "@/components/DataTable/RowActions";
import { Badge } from "@/components/ui/badge";

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
            const role = row.original;

            return (
                <RowActions
                    item={role}
                    actions={[
                        {
                            label: "Edit",
                            href: route("roles.edit", role),
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
                        <div className="font-medium">
                            {data.name}
                        </div>
                    </div>
                </div>
            );
        },
    },

    {
        accessorKey: "permissions",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Permissions" />
        ),

        cell: ({ row }) => {
            const { permissions } = row.original;

            return (
                <div className="flex flex-wrap  gap-1">
                    {permissions.map((permission, index) => (
                        <div key={index} >
                            <Badge className="text-xs capitalize" variant="outline">
                                {permission?.name}
                            </Badge>
                        </div>
                    ))}
                </div>
            );


        },
    },
];
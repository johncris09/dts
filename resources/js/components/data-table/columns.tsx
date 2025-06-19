import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { RowActions } from "@/components/DataTable/RowActions";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/hooks/helpers";
import { Link } from "@inertiajs/react";

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
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row }) => {
            const user = row.original;
            console.info(user.avatar)
            return (
                <div className="flex gap-4 items-center">
                    <div className="flex overflow-hidden justify-center items-center font-semibold rounded-full size-10 bg-muted text-primary/80">
                        <Avatar className="w-14 h-14 cursor-pointer">
                            <AvatarImage src={user.avatar ? `${user.avatar}` : "/placeholder.svg?height=128&width=128"}
                                alt={`${user.name}`} />
                            <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div>
                        <div className="font-medium">
                            <Link className="hover:underline" href={`/users/${user.id}`}>
                                {user.name}
                            </Link>
                        </div>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                            {user.email}
                        </div>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "roles",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Role" />
        ),
        cell: ({ row }) => {
            const roles = row.original.roles;
            return (
                <div className="text-center">
                    <Badge className="text-xs" variant="outline">
                        {roles.join(", ")}
                    </Badge>
                </div>
            );
        },
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Created At" />
        ),
        cell: ({ row }) => {
            return (
                <div className="text-right">
                    {new Date(row.original.created_at).toLocaleDateString()}
                </div>
            );
        },
    },
    {
        accessorKey: "updated_at",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Updated At" />
        ),
        cell: ({ row }) => {
            return (
                <div className="text-right">
                    {new Date(row.original.updated_at).toLocaleDateString()}
                </div>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const user = row.original;

            return (
                <RowActions
                    item={user}
                    actions={[
                        // {
                        //     label: "Edit",
                        //     href: route("users.edit", user.id),
                        // },
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
    },
];
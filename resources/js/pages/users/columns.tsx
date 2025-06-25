import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { RowActions } from "@/components/DataTable/RowActions";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/hooks/helpers";
import { Link, router } from "@inertiajs/react";
import { can } from "@/lib/can";
import { toast } from "sonner";

export type User = {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
    avatar: string | null;
    roles: string[];
};

export const getColumns = () => {


    const columns: ColumnDef<User>[] = [

        ...(can('edit users') || can('delete users') ? [
            {
                id: "actions",
                accessorKey: "Action",
                cell: ({ row }) => {
                    const user = row.original;

                    return (
                        <RowActions
                            item={user}
                            actions={[
                                ...(can('edit users') ? [{
                                    label: "Edit",
                                    href: route("users.edit", user),
                                }] : []),

                                ...(can('delete users') ? [{
                                    label: "Delete",
                                    requiresConfirmation: true,
                                    onClick: () => {
                                        router.delete(route(`users.destroy`, user), {
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
            cell: ({ row }) => {
                const user = row.original;
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
                    <div className="flex flex-wrap  gap-1">
                        {roles.map((role, index) => (
                            <div key={index} >
                                <Badge className="text-xs capitalize" variant="outline">
                                    {role}
                                </Badge>
                            </div>
                        ))}
                    </div>
                );
            },
        },
        {
            accessorKey: "office",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Office" />
            ),
            cell: ({ row }) => {

                return (
                    <div className="capitalize break-words whitespace-normal">
                        {row.original.office?.name}
                    </div>
                );
            },
            enableSorting: true,
            enableHiding: true,
        },
        {
            accessorKey: "division",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Division" />
            ),
            cell: ({ row }) => {

                return (
                    <div className="capitalize break-words whitespace-normal">
                        {row.original.division?.name}
                    </div>
                );
            },
            enableSorting: true,
            enableHiding: true,
        },

        {
            accessorKey: "created_at",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Created At" />
            ),
            cell: ({ row }) => {
                return (
                    <div>
                        {new Date(row.original.created_at).toLocaleDateString()}
                    </div>
                );
            },
            enableSorting: true,
            enableHiding: true,
        },
        {
            accessorKey: "updated_at",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Updated At" />
            ),
            cell: ({ row }) => {
                return (
                    <div>
                        {new Date(row.original.updated_at).toLocaleDateString()}
                    </div>
                );
            },
        },
    ];

    return columns;

}
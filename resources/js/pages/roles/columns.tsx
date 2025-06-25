import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { RowActions } from "@/components/DataTable/RowActions";
import { Badge } from "@/components/ui/badge";
import { can } from "@/lib/can";

export type Role = {
    id: number;
    name: string;
};


export const getColumns = () => {


    const columns: ColumnDef<Role>[] = [

        ...(can('edit roles') || can('delete roles') ? [
            {
                id: "actions",
                accessorKey: "Action",
                cell: ({ row }) => {
                    const role = row.original;

                    return (
                        <RowActions
                            item={role}
                            actions={[
                                ...(can('edit roles') ? [{
                                    label: "Edit",
                                    href: route("roles.edit", role),
                                }] : []),

                                ...(can('delete roles') ? [{
                                    label: "Delete",
                                    requiresConfirmation: true,
                                    onClick: () => {
                                        router.delete(route(`roles.destroy`, role), {
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

    return columns;

}


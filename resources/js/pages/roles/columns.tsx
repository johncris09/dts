import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { RowActions } from "@/components/DataTable/RowActions";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { can } from "@/lib/utils";

export type Role = {
    id: string | number | '';
    name: string;
    permissions: { name: string }[] | string[];
};

type HandleOpenModal = (data: Role) => void;

export const getColumns = (handleOpenModal: HandleOpenModal) => {

    const columns: ColumnDef<Role>[] = [

        ...(can('edit roles') || can('delete roles') ? [
            {
                id: "actions",
                accessorKey: "Action",
                cell: ({ row }: { row: { original: Role } }) => {
                    const role = row.original;

                    return (
                        <RowActions
                            item={role}
                            actions={[
                                ...(can('edit roles') ? [{
                                    label: "Edit",
                                    onClick: () => {
                                        handleOpenModal(role)
                                    },
                                }] : []),

                                ...(can('delete roles') ? [{
                                    label: "Delete",
                                    requiresConfirmation: true,
                                    onClick: () => {
                                        router.delete(route(`roles.destroy`, role), {
                                            preserveScroll: true,
                                            onSuccess: (response) => {
                                                const flash = (response && typeof response === 'object' && 'props' in response && response.props && typeof response.props === 'object' && 'flash' in response.props) ? (response.props as { flash?: { error?: string; success?: string } }).flash : undefined;
                                                if (flash?.error) {
                                                    toast.error('Error', {
                                                        description: flash.error
                                                    });
                                                }
                                                if (flash?.success) {
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
                        <div className="font-medium">{data.name}</div>
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
                    <div className="flex flex-wrap gap-1">
                        {Array.isArray(permissions) && permissions.map((permission, index) => (
                            <Badge key={index} className="text-xs capitalize" variant="outline">
                                {typeof permission === "string" ? permission : permission.name}
                            </Badge>
                        ))}
                    </div>
                );
            },
        },
    ];

    return columns;

}

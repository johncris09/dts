import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { RowActions } from "@/components/DataTable/RowActions";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { can } from "@/lib/utils";

export type DocumentType = {
    id: string | number | '';
    name: string;
};

type HandleOpenModal = (data: DocumentType) => void;

export const getColumns = (handleOpenModal: HandleOpenModal) => {

    const columns: ColumnDef<DocumentType>[] = [

        ...(can('edit document types') || can('delete document types') ? [
            {
                id: "actions",
                accessorKey: "Action",
                cell: ({ row }: { row: { original: DocumentType } }) => {
                    const document_types = row.original;

                    return (
                        <RowActions
                            item={document_types}
                            actions={[
                                ...(can('edit document types') ? [{
                                    label: "Edit",
                                    onClick: () => {
                                        handleOpenModal(document_types)
                                    },
                                }] : []),

                                ...(can('delete document types') ? [{
                                    label: "Delete",
                                    requiresConfirmation: true,
                                    onClick: () => {
                                        router.delete(route(`document_types.destroy`, document_types), {
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
            cell: ({ row }) => (
                <div className='break-words whitespace-normal capitalize'>
                    {row.getValue('name')}
                </div>
            ),
            enableSorting: true,
            enableHiding: true,
        },
    ];

    return columns;

}

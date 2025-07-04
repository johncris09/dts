import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { RowActions } from "@/components/DataTable/RowActions";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { can } from "@/lib/utils";

export type OrganizationalUnit = {
  id: string | number | '';
  name: string;
  parent_id: string | number | '';
  description: string;
  hierarchy_path?: string;
};

type HandleOpenModal = (data: OrganizationalUnit) => void;

export const getColumns = (handleOpenModal: HandleOpenModal): ColumnDef<OrganizationalUnit>[] => {
  const columns: ColumnDef<OrganizationalUnit>[] = [

    ...(can('edit organizational units') || can('delete organizational units') ? [
      {
        id: "actions",
        accessorKey: "Action",
        cell: ({ row }) => {
          const organizationalUnit = row.original;

          return (
            <RowActions
              item={organizationalUnit}
              actions={[
                ...(can('edit organizational units') ? [{
                  label: "Edit",
                  onClick: () => handleOpenModal(organizationalUnit),
                }] : []),

                ...(can('delete organizational units') ? [{
                  label: "Delete",
                  requiresConfirmation: true,
                  onClick: () => {
                    router.delete(route("organizational_units.destroy", organizationalUnit), {
                      preserveScroll: true,
                      onSuccess: (response) => {
                        const { flash } = response?.props;
                        if (flash?.error) {
                          toast.error('Error', { description: flash.error });
                        }
                        if (flash?.success) {
                          toast.success('Success', { description: flash.success });
                        }
                      },
                      onError: (errors) => {
                        console.error(errors);
                      },
                    });
                  },
                }] : []),
              ]}
            />
          );
        },
      },
    ] : []),

    {
      accessorKey: "hierarchy_path",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Parent Unit" />
      ),
      cell: ({ row }) => (
        <div className="break-words whitespace-normal capitalize">
          {row.original?.hierarchy_path || '—'}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <div className="break-words whitespace-normal capitalize">
          {row.getValue('name')}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      cell: ({ row }) => (
        <div className="break-words whitespace-normal capitalize">
          {row.getValue('description')}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
  ];

  return columns;
};

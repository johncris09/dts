import { useState } from "react";
import { Head } from "@inertiajs/react";
import { BreadcrumbItem, PageProps } from "@/types";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { can } from "@/lib/can";
import { getColumns } from "./columns";
import CreatePermissionModal from "./create";
import EditPermissionModal from "./edit";
import { Permission } from "./columns";

export default function PermissionsPage({ permissions }: PageProps) {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Permissions",
      href: "/permissions",
    },
  ];

  const handleEditClick = (permission: Permission) => {
    setSelectedPermission(permission);
    setEditModalOpen(true);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Permissions" />
      <div className="container mx-auto space-y-6 px-5 py-6">
        <div className="flex items-center justify-between">
          <h6 className="text-2x font-bold">Permissions</h6>
          {can("create permissions") && (
            <Button size={"sm"} onClick={() => setCreateModalOpen(true)}>
              <Plus />
              Add New
            </Button>
          )}
        </div>

        <DataTable
          columns={getColumns({ onEdit: handleEditClick })}
          data={permissions.data}
          meta={permissions.meta}
        />

        {/* Modals */}
        <CreatePermissionModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
        />

        <EditPermissionModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          permission={selectedPermission}
        />
      </div>
    </AppLayout>
  );
}

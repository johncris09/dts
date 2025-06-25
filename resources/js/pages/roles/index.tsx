import { useState } from "react";
import { Head } from "@inertiajs/react";
import { BreadcrumbItem, PageProps } from "@/types";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { can } from "@/lib/can";
import { getColumns } from "./columns";
import CreateRoleModal from "./create";
import EditRoleModal from "./edit";

export default function RolesPage({ roles, permissions }: PageProps) {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Roles",
      href: "/roles",
    },
  ];

  const handleEditClick = (role) => {
    setSelectedRole(role);
    setEditModalOpen(true);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Roles" />
      <div className="container mx-auto space-y-6 px-5 py-6">
        <div className="flex items-center justify-between">
          <h6 className="text-2xl font-bold">Roles</h6>
          {can("create roles") && (
            <Button
              className="cursor-pointer"
              size="sm"
              onClick={() => setCreateModalOpen(true)}
            >
              <Plus />
              Add New
            </Button>
          )}
        </div>

        <DataTable
          columns={getColumns({ onEdit: handleEditClick })}
          data={roles.data}
          meta={roles.meta}
        />
      </div>

      <CreateRoleModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        permissions={permissions}
      />

      <EditRoleModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        role={selectedRole}
        permissions={permissions}
      />
    </AppLayout>
  );
}

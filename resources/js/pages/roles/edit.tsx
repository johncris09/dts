import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { chunk, groupByAction } from "@/lib/utils";

type Role = {
  id: number;
  name: string;
  permissions: string[] | { name: string }[];
};

type EditRoleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  permissions: string[];
  role: Role | null;
};

export default function EditRoleModal({
  isOpen,
  onClose,
  permissions,
  role,
}: EditRoleModalProps) {
  const grouped = groupByAction(permissions);

  const { data, setData, patch, errors, processing, reset } = useForm({
    name: "",
    permissions: [] as string[],
  });

  // Prefill form when role changes
  useEffect(() => {
    if (role) {
      setData({
        name: role.name,
        permissions: role.permissions.map((p) =>
          typeof p === "string" ? p : p.name
        ),
      });
    }
  }, [role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!role) return;

    patch(route("roles.update", role.id), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Success", { description: "Role updated successfully" });
        reset();
        onClose();
      },
    });
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    if (checked) {
      setData("permissions", [...data.permissions, permission]);
    } else {
      setData(
        "permissions",
        data.permissions.filter((p) => p !== permission)
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
              placeholder="Role name"
              disabled={processing}
            />
            <InputError message={errors.name} className="mt-2" />
          </div>

          <div>
            <Label>Permissions</Label>
            {Object.entries(grouped).map(([action, perms]) => (
              <div key={action} className="mb-4">
                <div className="font-semibold capitalize mb-1">{action}</div>
                <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                  {perms.map((permission) => (
                    <label
                      key={permission}
                      className="flex items-start gap-2 text-sm capitalize"
                    >
                      <input
                        type="checkbox"
                        checked={data.permissions.includes(permission)}
                        onChange={(e) =>
                          handlePermissionChange(permission, e.target.checked)
                        }
                        className="mt-1"
                      />
                      {permission.replace(`${action} `, "")}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <InputError message={errors.permissions} className="mt-2" />
          </div>

          <Button type="submit" disabled={processing}>
            {processing && (
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { chunk, groupByAction } from "@/lib/utils";

export default function CreateRoleModal({
  isOpen,
  onClose,
  permissions,
}: {
  isOpen: boolean;
  onClose: () => void;
  permissions: string[];
}) {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    permissions: [] as string[],
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("roles.store"), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Role created successfully");
        reset();
        onClose();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Role</DialogTitle>
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
            <InputError message={errors.name} />
          </div>

          <div>
            <Label>Permissions</Label>
            {Object.entries(groupByAction(permissions)).map(([action, perms]) => (
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
            <InputError message={errors.permissions} />
          </div>

          <Button type="submit" disabled={processing}>
            {processing ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

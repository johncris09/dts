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
import InputError from "@/components/input-error";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  permission: {
    id: number;
    name: string;
  } | null;
};

export default function EditPermissionModal({ isOpen, onClose, permission }: Props) {
  const { data, setData, patch, processing, errors, reset } = useForm({
    name: "",
  });

  useEffect(() => {
    if (permission) {
      setData({ name: permission.name || "" });
    } else {
      reset();
    }
  }, [permission]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!permission) return;

    patch(route("permissions.update", permission.id), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Success", {
          description: "Permission updated successfully.",
        });
        onClose();
      },
      onError: (err) => {
        console.error("Update failed:", err);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Permission</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="text-sm font-medium">Permission Name</label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
              placeholder="e.g., edit users"
              disabled={processing}
            />
            <InputError message={errors.name} className="mt-1" />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={processing}>
              {processing && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
              Update
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

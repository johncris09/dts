import { Head, useForm } from "@inertiajs/react";
import { BreadcrumbItem } from "@/types";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InputError from "@/components/input-error";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

export default function CreatePermissionPage() {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Permissions / Create", href: "/permissions/create" },
  ];

  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post(route("permissions.store"), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Success", {
          description: "Permission created successfully",
        });
        reset();
      },
      onError: (errors) => {
        console.error(errors);
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Permission" />
      <div className="container mx-auto px-5 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h6 className="text-2xl font-bold">Create Permission</h6>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Permission Name</Label>
            <Input
              id="name"
              value={data.name}
              placeholder="e.g., create users"
              onChange={(e) => setData("name", e.target.value)}
              disabled={processing}
            />
            <InputError message={errors.name} className="mt-1" />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={processing}>
              {processing && (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}

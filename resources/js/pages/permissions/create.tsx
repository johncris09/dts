import { Head, useForm } from "@inertiajs/react";
import { BreadcrumbItem } from "@/types";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { Loader2Icon } from "lucide-react";
import InputError from "@/components/input-error";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";


type RoleForm = {
    name: string;
};

export default function Users() {

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Permissions / Create',
            href: '/permissions/create',
        },
    ];


    const { data, setData, post, errors, processing, reset } = useForm<RoleForm>({
        name: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route(`permissions.store`), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Success', {
                    description: `Permission updated successfully`,
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
            <Head title="Create Permissions" />
            <div className="container mx-auto space-y-6 px-5 py-6">
                <div className="flex items-center justify-between">
                    <h6 className="text-2x font-bold">Create Permissions</h6>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-3 py-4">

                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                placeholder="Name"
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>
                    </div>
                    <Button type="submit" disabled={processing}>
                        {processing ? <>
                            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> Saving...
                        </> : 'Save'}
                    </Button>
                </form>
            </div>

        </AppLayout>
    );
}
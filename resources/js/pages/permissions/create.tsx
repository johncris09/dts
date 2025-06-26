import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import InputError from "@/components/input-error";
import { Loader2Icon } from "lucide-react";

export default function CreatePermissionModal({ isOpen, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("permissions.store"), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Permission</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        placeholder="Permission Name"
                        disabled={processing}
                    />
                    <InputError message={errors.name} />

                    <div className="flex justify-end pt-2">
                        <Button type="submit" disabled={processing}>
                        {processing && (
                            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Create
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2Icon } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { useEffect, ReactNode } from 'react';
import { FormDataConvertible } from '@inertiajs/core';

export interface CrudFormProps<T extends Record<string, FormDataConvertible> = Record<string, FormDataConvertible>> {
    formWidth?: number;
    open: boolean;
    setOpen: (open: boolean) => void;
    title: string;
    initialData: T;
    children: (args: { data: T; setData: ((data: T) => void) & ((data: (previousData: T) => T) => void) & (<K extends keyof T>(key: K, value: T[K]) => void); errors: Partial<Record<keyof T, string>>; }) => ReactNode;
    isEdit: boolean;
    onSuccess?: () => void;
    onError?: (errors: Partial<Record<keyof T, string>>) => void;
    routeName: string;
}

export function CrudForm<T extends Record<string, FormDataConvertible> = Record<string, FormDataConvertible>>({
    formWidth = 500, // Default width if not provided
    open,
    setOpen,
    title,
    initialData,
    children,
    isEdit,
    onSuccess,
    onError,
    routeName,
}: CrudFormProps<T>) {
    const { data, setData, post, patch, reset, errors, processing } = useForm<T>(initialData);

    // Update form data when initialData changes
    useEffect(() => {
        if (isEdit && initialData) {
            setData(initialData);
        }
    }, [isEdit, initialData]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isEdit) {
            patch(route(`${routeName}.update`, data), {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    toast.success('Success', {
                        description: `${title} updated successfully`,
                    });
                    reset();
                    setOpen(false);
                    onSuccess?.();
                },
                onError: (errors) => {
                    console.error(errors);
                    onError?.(errors as Partial<Record<keyof T, string>>);
                },
            });
        } else {
            post(route(`${routeName}.store`), {
                preserveState: true,
                onSuccess: () => {
                    toast.success('Success', {
                        description: `${title} created successfully`,
                    });
                    reset();
                    setOpen(false);
                    onSuccess?.();
                },
                onError: (errors) => {
                    console.error(errors);
                    onError?.(errors as Partial<Record<keyof T, string>>);
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent style={{ maxWidth: `${formWidth}px` }}>
                <DialogHeader>
                    <DialogTitle>{isEdit ? `Edit ${title}` : `Add New ${title}`}</DialogTitle>
                    <DialogDescription>Enter the details below.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-3 py-4">
                        {children({ data, setData, errors: errors as Partial<Record<keyof T, string>> })}
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            {processing ? (
                                isEdit ? (
                                    <>
                                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> Updating...
                                    </>
                                ) : (
                                    <>
                                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> Saving...
                                    </>
                                )
                            ) : isEdit ? (
                                `Update`
                            ) : (
                                `Save`
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

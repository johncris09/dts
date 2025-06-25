import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Link } from "@inertiajs/react";

interface Action {
    label: string;
    href?: string;
    onClick?: () => void;
    variant?: "default" | "destructive";
    requiresConfirmation?: boolean;
    confirmationMessage?: string;
}

interface RowActionsProps {
    item: any;
    actions: Action[];
}

export function RowActions({ item, actions }: RowActionsProps) {
    const [open, setOpen] = useState(false);

    const requiresConfirmationAction = actions.find((a) => a.requiresConfirmation);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="w-4 h-4" />
                        <span className="sr-only">Actions</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    {actions.map((action) => (
                        <DropdownMenuItem key={action.label}>
                            {action.href ? (
                                <Link href={action.href} className="block w-full">
                                    {action.label}
                                </Link>
                            ) : action.requiresConfirmation ? (
                                <DialogTrigger
                                    className="block w-full text-left"
                                    onClick={() => setOpen(true)}
                                >
                                    {action.label}
                                </DialogTrigger>
                            ) : (
                                <button
                                    onClick={action.onClick}
                                    className="block w-full text-left"
                                >
                                    {action.label}
                                </button>
                            )}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {requiresConfirmationAction && (
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>Are you sure you want to delete the data? This action cannot be undone.</DialogDescription>

                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                        <Button
                            onClick={() => {
                                requiresConfirmationAction.onClick?.();
                                setOpen(false); // Close the dialog immediately or after success
                            }}
                            variant="destructive"
                            className="text-white hover:cursor-pointer"
                        >
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            )}
        </Dialog>
    );
}
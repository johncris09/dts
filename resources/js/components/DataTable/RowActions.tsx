import React from "react";
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
    return (
        <Dialog>
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
                                <DialogTrigger className="block w-full text-left">
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

            {actions.find((a) => a.requiresConfirmation) && (
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                            {actions.find((a) => a.requiresConfirmation)?.confirmationMessage}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose>
                            <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                        <Button
                            onClick={actions.find((a) => a.requiresConfirmation)?.onClick}
                            variant="destructive"
                        >
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            )}
        </Dialog>
    );
}
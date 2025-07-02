import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { usePage } from "@inertiajs/react"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function groupByAction(perms: string[]) {
    const actions = ['create', 'delete', 'edit', 'view'];
    return actions.reduce<Record<string, string[]>>((acc, act) => {
        acc[act] = perms.filter((p) => p.toLowerCase().startsWith(act)).sort();
        return acc;
    }, {});
}

export function chunk<T>(arr: T[], size = 2): T[][] {
    return arr.reduce<T[][]>((rows, cur, i) => {
        if (i % size === 0) rows.push([]);
        rows[rows.length - 1].push(cur);
        return rows;
    }, []);
}

export function can(permission: string): boolean {
    const { auth } = usePage().props as {
        auth: {
            permissions: String[];
        };
    };
    return auth.permissions.includes(permission);
}

import { usePage } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
            permissions: string[];
        };
    };
    return auth.permissions.includes(permission);
}

export function getRoleColor(role: string): string {
    switch (role) {
        case 'Super Admin':
            return 'bg-purple-100 text-purple-800';
        case 'Administrator':
            return 'bg-red-100 text-red-800';
        case 'Receiver':
            return 'bg-blue-100 text-blue-800';
        case 'Staff':
            return 'bg-green-100 text-green-800';
        case 'User':
            return 'bg-gray-100 text-gray-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

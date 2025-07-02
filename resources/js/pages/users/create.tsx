import { Head, useForm, usePage } from "@inertiajs/react";
import { BreadcrumbItem, PageProps, SharedData } from "@/types";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { Loader2Icon } from "lucide-react";
import InputError from "@/components/input-error";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormEventHandler, useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type RegisterForm = {
    name: string;
    email: string;
    organizational_unit_id: number | string,
    password: string;
    password_confirmation: string;
};
const restrictedRoles = ['Administrator', 'Receiver'];
export default function Users({ roles, organizationalUnits }: PageProps) {
    const { auth } = usePage<SharedData>().props
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [unitLevel, setUnitLevel] = useState(0);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Users / Create',
            href: '/users/create',
        },
    ];


    const { data, setData, post, errors, processing, reset } = useForm<Required<RegisterForm>>({
        name: "",
        email: '',
        organizational_unit_id: '',
        password: '',
        password_confirmation: '',
        roles: [],
    });
    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('users.store'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Success', {
                    description: `User created successfully`,
                });
                reset();
            },
            onError: (errors) => {
                console.error(errors);
            },
        });
    };

    const handleRoleChange = (roleName, checked) => {
        if (checked) {
            setData('roles', [...data.roles, roleName])
        } else {
            setData("roles", data.roles.filter(name => name !== roleName))
        }
    }

    const getUnitLevel = (unitId) => {
        const unit = organizationalUnits.find(u => String(u.id) === String(unitId));
        let level = 0;
        let current = unit;
        while (current?.parent_id) {
            current = organizationalUnits.find(u => String(u.id) === String(current.parent_id));
            level++;
        }
        return level;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User" />
            <div className="container mx-auto space-y-6 px-5 py-6">
                <div className="flex items-center justify-between">
                    <h6 className="text-2x font-bold">Create User</h6>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-3 py-4">

                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                type="text"

                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing}
                                placeholder="Full Name"
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                tabIndex={2}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                placeholder="email@example.com"
                            />
                            <InputError message={errors.email} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="organizational_unit_id">Organizational Unit</Label>
                            <Select
                                value={String(data.organizational_unit_id)} // Ensure it’s string
                                onValueChange={(value) => {
                                    setData('organizational_unit_id', value);
                                    setSelectedUnit(value);

                                    const level = getUnitLevel(value);
                                    setUnitLevel(level);

                                    if (level > 0) {
                                        setData('roles', data.roles.filter(role => !restrictedRoles.includes(role)));
                                    }
                                }}
                            >
                                <SelectTrigger tabIndex={3} className="h-8 w-full">
                                    <SelectValue placeholder="Select organizational unit" />
                                </SelectTrigger>
                                <SelectContent side="bottom">

                                    <SelectItem>
                                        Select
                                    </SelectItem>
                                    {organizationalUnits.map((organizationalUnit, index) => {
                                        return (
                                            <SelectItem key={index} value={String(organizationalUnit.id)}>
                                                {organizationalUnit.hierarchy_path}
                                            </SelectItem>
                                        )
                                    })}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                tabIndex={4}
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={processing}
                                placeholder="Password"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">Confirm password</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                tabIndex={5}
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                disabled={processing}
                                placeholder="Confirm password"
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <div className="grid">
                            <Label tabIndex={6} htmlFor="role">Roles</Label>
                            {roles.map((role) => {
                                const isDisabled = restrictedRoles.includes(role) && unitLevel > 0;

                                return (
                                    <div key={role} className={isDisabled ? "cursor-not-allowed" : ""}>
                                        <label className={`capitalize flex items-center ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`}>
                                            <input
                                                id="role"
                                                type="checkbox"
                                                name="roles[]"
                                                checked={data.roles.includes(role)}
                                                value={role}
                                                onChange={(e) => handleRoleChange(role, e.target.checked)}
                                                className="mr-2"
                                                disabled={isDisabled}
                                            />
                                            {role}
                                        </label>
                                    </div>
                                );
                            })}


                            <InputError message={errors.roles} />
                        </div>
                    </div>
                    <div className="flex justify-end ">
                        <Button type="submit" disabled={processing}>
                            {processing ? <>
                                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> Saving...
                            </> : 'Save'}
                        </Button>
                    </div>

                </form>
            </div>
        </AppLayout>
    );
}
import { Head, useForm } from "@inertiajs/react";
import { BreadcrumbItem, PageProps } from "@/types";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { Loader2Icon } from "lucide-react";
import InputError from "@/components/input-error";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"; import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";


type RegisterForm = {
    name: string;
    email: string;
    office_id: number | string,
    division_id: number | string,
    password: string;
    password_confirmation: string;
};

export default function Users({ user, roles, offices, divisions }: PageProps) {
    const [divisionsUnderOffice, setDivisionsUnderOffice] = useState([])

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Users / Edit',
            href: '/users/edit',
        },
    ];
    const { data, setData, patch, errors, processing } = useForm<Required<RegisterForm>>({
        name: user.name || "",
        email: user.email || "",
        office_id: user.office_id || "",
        division_id: user.division_id || "",
        roles: user?.roles
            ? user.roles.map((p) => p.name)
            : [],
    });
    const handleSubmit = (e) => {
        e.preventDefault();

        patch(route(`users.update`, user), {
            preserveScroll: true,
        });
    };

    useEffect(() => {

        setDivisionsUnderOffice(divisions.filter(
            (division) => division.office_id == data.office_id
        ));
    }, [])

    const handleRoleChange = (roleName, checked) => {
        if (checked) {
            setData('roles', [...data.roles, roleName])
        } else {
            setData("roles", data.roles.filter(name => name !== roleName))
        }
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit User" />
            <div className="container mx-auto space-y-6 px-5 py-6">
                <div className="flex items-center justify-between">
                    <h6 className="text-2x font-bold">Edit User</h6>
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
                            <Label htmlFor="office">Office</Label>
                            <Select
                                value={String(data.office_id)} // Ensure it’s string
                                onValueChange={(value) => {
                                    setData('office_id', value)
                                    setDivisionsUnderOffice(divisions.filter(
                                        (division) => division.office_id == value
                                    ));

                                    setData('division_id', '')
                                }}
                            >
                                <SelectTrigger className="h-8 w-full">
                                    <SelectValue placeholder="Select office" />
                                </SelectTrigger>
                                <SelectContent side="bottom">
                                    <SelectItem>
                                        Select
                                    </SelectItem>
                                    {offices.map((office, index) => {


                                        return (
                                            <SelectItem key={index} value={String(office.id)}>
                                                {office.name} - {office.description}
                                            </SelectItem>
                                        )
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="division">Division</Label>
                            <Select
                                value={String(data.division_id)} // Ensure it’s string
                                onValueChange={(value) => setData('division_id', value)} // Keep as string
                            >
                                <SelectTrigger className="h-8 w-full">
                                    <SelectValue placeholder="Select division" />
                                </SelectTrigger>
                                <SelectContent side="bottom">

                                    <SelectItem>
                                        Select
                                    </SelectItem>
                                    {divisionsUnderOffice.map((division, index) => {
                                        return (
                                            <SelectItem key={index} value={String(division.id)}>
                                                {division.name} - {division.description}
                                            </SelectItem>
                                        )
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid">
                            <Label htmlFor="role">Roles</Label>
                            {roles.map((role) => (
                                <div key={role}>
                                    <label className="capitalize">
                                        <input
                                            id="role"
                                            type="checkbox"
                                            name="roles[]"
                                            checked={data.roles.includes(role)}
                                            value={role}
                                            onChange={(e) => handleRoleChange(role, e.target.checked)}
                                            className="mr-2 "
                                        />
                                        {role}
                                    </label>
                                </div>
                            ))}

                            <InputError message={errors.roles} />
                        </div>
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing ? <>
                            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> Updating...
                        </> : 'Update'}
                    </Button>
                </form>
            </div>


        </AppLayout>
    );
}

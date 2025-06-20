import { Head, useForm } from "@inertiajs/react";
import { BreadcrumbItem, PageProps } from "@/types";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { Loader2Icon } from "lucide-react";
import InputError from "@/components/input-error";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormEventHandler } from "react";


type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Users({ roles }: PageProps) {

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Users / Create',
            href: '/users/create',
        },
    ];


    const { data, setData, post,  errors, processing } = useForm<Required<RegisterForm>>({
        name: "",
        email: '',
        password: '',
        password_confirmation: '',
        roles: [],
    });
    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('users.store'), {
            preserveScroll: true
        });
    };

    const handleRoleChange = (roleName, checked) => {
        if (checked) {
            setData('roles', [...data.roles, roleName])
        } else {
            setData("roles", data.roles.filter(name => name !== roleName))
        }
    }
    console.info(errors)
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
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                tabIndex={3}
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
                                tabIndex={4}
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                disabled={processing}
                                placeholder="Confirm password"
                            />
                            <InputError message={errors.password_confirmation} />
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
                            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> Saving...
                        </> : 'Save'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
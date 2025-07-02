import { type BreadcrumbItem, type SharedData } from '@/types';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { getInitials } from '@/hooks/helpers';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

type ProfileForm = {
    name: string;
    email: string;
    avatar: File | null
};

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);


    const { data, setData, patch, post, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        name: auth.user.name,
        email: auth.user.email,
        avatar: null,
    });

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
        if (!validTypes.includes(file.type)) {
            alert('Please select a JPG, PNG, GIF, or WebP image.')
            // toast.error('Invalid File Type', {
            //     description: "Please select a JPG, PNG, GIF, or WebP image.",
            // });
            return
        }

        // Validate file size (5MB limit)
        const maxSize = 5 * 1024 * 1024 // 5MB in bytes
        if (file.size > maxSize) {
            alert('Please select an image smaller than 5MB.')

            return
        }

        // Create preview
        const url = URL.createObjectURL(file)
        setPreview(url)
        setData("avatar", file)
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (data.avatar) {
            post(route("user.update_avatar", auth.user.id), {
            })
        } else {

            patch(route('profile.update'), {
                preserveScroll: true,
            });
        }

    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Profile information" description="Update your profile" />

                    <form onSubmit={submit} className="space-y-6" encType="multipart/form-data">
                        <div className="flex gap-4 items-center">
                            <Button
                                variant="ghost"
                                className="p-0 hover:bg-transparent"
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Avatar className="w-14 h-14 cursor-pointer">
                                    <AvatarImage src={preview || (auth.user.avatar ? `/storage/${auth.user.avatar}` : "")}
                                        alt={`${auth.user.name}`} />
                                    <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                                        {getInitials(auth.user.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleAvatarChange}
                            />
                            <div className="space-y-1">
                                <div className="text-sm text-muted-foreground">
                                    Accepted formats: .jpg, .jpeg, .png
                                    <br />
                                    Maximum file size: 2MB
                                </div>
                            </div>
                            <InputError className="mt-2" message={errors.avatar} />
                        </div>


                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>

                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="name"
                                placeholder="Full name"
                            />

                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>

                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="Email address"
                            />

                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="-mt-4 text-sm text-muted-foreground">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Click here to resend the verification email.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to your email address.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Save</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Saved</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}

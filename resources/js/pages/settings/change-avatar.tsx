import { User, type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ChangeEvent, FormEventHandler, useRef, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
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
    avatar: File | null;
};

export default function ChangeAvatar({ user }: { user: User }) {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset, progress } = useForm({
        avatar: null as File | null,
    });

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Preview the selected image
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setData("avatar", file);
        }
    };

    const submit = () => {
        // post(route("profile.avatar.update", { id: user.id }), {
        //     preserveScroll: true,
        //     onSuccess: () => {
        //         reset("avatar");
        //         setPreview(user.avatar ? `/storage/avatars/${user.avatar}` : null);
        //         console.log(preview);
        //         // Reset preview after successful upload
        //         // toast.success("Avatar updated successfully", {
        //         //     description: "Your profile picture has been updated",
        //         //     position: "top-center",
        //         // });
        //     },
        //     onError: () => {
        //         // toast.error("Failed to update avatar");
        //     },
        // });
    };

    return (

        <form onSubmit={submit} className="space-y-6">
            <div className="flex gap-4 items-center">
                <Button
                    variant="ghost"
                    className="p-0 hover:bg-transparent"
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Avatar className="w-14 h-14 cursor-pointer">
                        <AvatarImage
                            className="object-cover"
                            src={
                                preview ||
                                (user.avatar ? `/storage/${user.avatar}` : "")
                            }
                            alt={user.name}
                        />
                        <AvatarFallback className="text-lg">
                            {getInitials(user.name)}
                        </AvatarFallback>
                    </Avatar>
                </Button>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                />
                <div className="space-y-1 text-sm text-muted-foreground">
                    Accepted formats: .jpg, .jpeg, .png<br />
                    Maximum file size: 2MB
                </div>
                <InputError className="mt-2" message={errors.avatar} />
            </div>

            <div className="flex items-center gap-4">
                <Button disabled={processing}>Update Profile Photo</Button>

            </div>
        </form>

    );
}

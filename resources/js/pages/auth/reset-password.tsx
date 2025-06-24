import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import logo from './../../../image/logo.png';
import { BackgroundIcons } from '@/components/background-icon';
import SecureNotice from '@/components/secure-notice';
import AllRightsReserved from '@/components/all-rights-reserved';

interface ResetPasswordProps {
    token: string;
    email: string;
}

type ResetPasswordForm = {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<ResetPasswordForm>>({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
            <Head title="Reset password" />
            {/* Animated Background Icons */}
            <BackgroundIcons />

            {/* Animated Background Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 rounded-full animate-pulse-slow blur-xl"></div>
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-indigo-200/15 rounded-full animate-float-slow blur-2xl"></div>
                <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-slate-300/25 rounded-full animate-bounce-slow blur-lg"></div>
                <div className="absolute top-1/3 right-1/3 w-28 h-28 bg-purple-200/20 rounded-full animate-float-medium blur-xl"></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Header with Animation */}
                <div className="text-center mb-8 animate-fade-in-up">
                    <div className="flex items-center justify-center mb-4">
                        {/* <div className="bg-blue-600 p-0 rounded-xl shadow-lg animate-float-gentle hover:scale-110 transition-transform duration-300"> */}
                        <Avatar className="h-20 w-20  rounded-b-full shadow-lg animate-float-gentle hover:scale-110 transition-transform duration-300">
                            <AvatarImage src={logo} alt='Logo' />
                        </Avatar>
                        {/* </div> */}
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                        Document Tracking System
                    </h1>
                    <p className="text-slate-600 mt-2 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
                        Secure document management and tracking
                    </p>
                </div>

                {/* Login Card with Animation */}
                <Card
                    className="shadow-xl border-0 backdrop-blur-sm bg-white/95 animate-fade-in-up"
                    style={{ animationDelay: "0.6s" }}
                >
                    <CardHeader className="space-y-1 pb-1">
                        <CardTitle className="text-2xl font-semibold text-center">Reset password</CardTitle>
                        <CardDescription className="text-center">Please enter your new password below</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2 animate-slide-in-left" style={{ animationDelay: "0.8s" }}>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    readOnly
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>
                            <div className="space-y-2 animate-slide-in-left" style={{ animationDelay: "0.8s" }}>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    autoComplete="new-password"
                                    value={data.password}
                                    className="mt-1 block w-full"
                                    autoFocus
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>
                            <div className="space-y-2  animate-slide-in-left" style={{ animationDelay: "0.8s" }}>
                                <Label htmlFor="password_confirmation">Confirm password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    autoComplete="new-password"
                                    value={data.password_confirmation}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Confirm password"
                                />
                                <InputError message={errors.password_confirmation} className="mt-2" />
                            </div>


                            <Button
                                type="submit"
                                className="w-full h-11 mt-5 bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg animate-fade-in"
                                style={{ animationDelay: "1.4s" }}
                                disabled={processing}
                            >
                                {processing ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Resetting Password. . .</span>
                                    </div>
                                ) : (
                                    "Reset password"
                                )}
                            </Button>
                        </form>


                    </CardContent>
                </Card>


                <SecureNotice />
                <AllRightsReserved />
            </div>
        </div>

    );
}

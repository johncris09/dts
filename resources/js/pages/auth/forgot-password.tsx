// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Shield } from 'lucide-react';
import { FormEventHandler } from 'react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BackgroundIcons } from '@/components/background-icon';
import logo from './../../../image/logo.png';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm<Required<{ email: string }>>({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (

        <>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
                <Head title="Forgot password" />

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
                            <Avatar className="h-20 w-20  rounded-b-full shadow-lg animate-float-gentle hover:scale-110 transition-transform duration-300">
                                <AvatarImage src={logo} alt='Logo' />
                            </Avatar>
                        </div>
                    </div>

                    {/* Login Card with Animation */}
                    <Card
                        className="shadow-xl border-0 backdrop-blur-sm bg-white/95 animate-fade-in-up"
                        style={{ animationDelay: "0.6s" }}
                    >
                        <CardHeader className="space-y-1 pb-6">
                            <CardTitle className="text-2xl font-semibold text-center">Forgot Password</CardTitle>
                            <CardDescription className="text-center">Enter your email to receive a password reset link</CardDescription>
                        </CardHeader>
                        <CardContent>

                            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}

                            <form onSubmit={submit} className="space-y-4">

                                <div className="space-y-2 animate-slide-in-left" style={{ animationDelay: "0.8s" }}>

                                    <Label htmlFor="email">Email Address</Label>

                                    <Input
                                        id="email"
                                        type="email"
                                        autoFocus
                                        autoComplete="off"
                                        value={data.email}
                                        className="h-11 transition-all duration-300 focus:scale-[1.02] focus:shadow-md"

                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="email@example.com"
                                    />
                                    <InputError message={errors.email} />                            </div>




                                <div className="my-6 flex items-center justify-start">
                                    <Button className="w-full" disabled={processing}>
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                        Email password reset link
                                    </Button>
                                </div>

                            </form>
                            <div className="space-x-1 mt-5 text-center text-sm text-muted-foreground">
                                <span>Or, return to</span>
                                <TextLink href={route('login')}>log in</TextLink>
                            </div>

                        </CardContent>
                    </Card>

                    {/* Security Notice with Animation */}
                    <div
                        className="mt-6 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg p-4 animate-fade-in-up"
                        style={{ animationDelay: "1.8s" }}
                    >
                        <div className="flex items-start space-x-3">
                            <Shield className="h-5 w-5 text-slate-500 mt-0.5 flex-shrink-0 animate-pulse-gentle" />
                            <div className="text-sm text-slate-600">
                                <p className="font-medium mb-1">Security Notice</p>
                                <p>Your session is encrypted and secure. All document access is logged and monitored for compliance.</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer with Animation */}
                    <div className="text-center mt-8 text-sm text-slate-500 animate-fade-in" style={{ animationDelay: "2s" }}>
                        <p>&copy; 2024 Document Tracking System. All rights reserved.</p>
                    </div>
                </div>
            </div >


        </>
    );
}

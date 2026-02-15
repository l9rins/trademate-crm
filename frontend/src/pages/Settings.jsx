import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Shield, Bell, CreditCard, Save, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
    const { user } = useAuth();

    const handleSave = () => {
        toast.success("Changes saved", {
            description: "Your profile has been updated successfully."
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Manage your account preferences and configuration.</p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="bg-slate-100 dark:bg-slate-900 p-1 rounded-lg mb-8 border border-slate-200/50 dark:border-slate-800">
                    <TabsTrigger value="profile" className="rounded-md px-5 py-2 text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm data-[state=active]:text-slate-900 dark:data-[state=active]:text-white">
                        <User className="mr-2 h-4 w-4" /> Profile
                    </TabsTrigger>
                    <TabsTrigger value="security" className="rounded-md px-5 py-2 text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm data-[state=active]:text-slate-900 dark:data-[state=active]:text-white">
                        <Shield className="mr-2 h-4 w-4" /> Security
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="rounded-md px-5 py-2 text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm data-[state=active]:text-slate-900 dark:data-[state=active]:text-white">
                        <Bell className="mr-2 h-4 w-4" /> Notifications
                    </TabsTrigger>
                    <TabsTrigger value="billing" className="rounded-md px-5 py-2 text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm data-[state=active]:text-slate-900 dark:data-[state=active]:text-white">
                        <CreditCard className="mr-2 h-4 w-4" /> Billing
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-0 outline-none">
                    <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 shadow-sm">
                        <CardHeader className="border-b border-slate-100 dark:border-slate-800">
                            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Personal Information</CardTitle>
                            <CardDescription className="text-slate-500 dark:text-slate-400">Update your profile details.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="space-y-6 max-w-2xl">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="space-y-2 flex-1">
                                        <Label htmlFor="username" className="text-sm font-medium text-slate-700 dark:text-slate-300">Username</Label>
                                        <Input id="username" defaultValue={user?.username} className="border-slate-200 dark:border-slate-800 h-11 bg-white dark:bg-slate-900/50 rounded-lg" />
                                    </div>
                                    <div className="space-y-2 flex-1">
                                        <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</Label>
                                        <Input id="email" type="email" defaultValue={user?.email} className="border-slate-200 dark:border-slate-800 h-11 bg-white dark:bg-slate-900/50 rounded-lg" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bio" className="text-sm font-medium text-slate-700 dark:text-slate-300">Bio</Label>
                                    <Input id="bio" placeholder="e.g. Master Plumber at TradeMate Solutions" className="border-slate-200 dark:border-slate-800 h-11 bg-white dark:bg-slate-900/50 rounded-lg" />
                                </div>
                                <Button onClick={handleSave} className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 rounded-lg px-6 h-10 font-semibold text-sm shadow-sm text-white">
                                    <Save className="mr-2 h-4 w-4" /> Save Changes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="mt-0 outline-none">
                    <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 shadow-sm">
                        <CardHeader className="border-b border-slate-100 dark:border-slate-800">
                            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Security</CardTitle>
                            <CardDescription className="text-slate-500 dark:text-slate-400">Manage your password and security settings.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="space-y-6 max-w-md">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Current Password</Label>
                                    <Input type="password" placeholder="••••••••" className="border-slate-200 dark:border-slate-800 h-11 bg-white dark:bg-slate-900/50 rounded-lg" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">New Password</Label>
                                    <Input type="password" placeholder="Enter new password" className="border-slate-200 dark:border-slate-800 h-11 bg-white dark:bg-slate-900/50 rounded-lg" />
                                </div>
                                <Button className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 rounded-lg px-6 h-10 font-semibold text-sm text-white">
                                    Update Password
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="mt-0 outline-none">
                    <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 shadow-sm">
                        <CardHeader className="border-b border-slate-100 dark:border-slate-800">
                            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Notifications</CardTitle>
                            <CardDescription className="text-slate-500 dark:text-slate-400">Choose how you receive updates and alerts.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Notification preferences coming soon.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="billing" className="mt-0 outline-none">
                    <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 shadow-sm">
                        <CardHeader className="border-b border-slate-100 dark:border-slate-800">
                            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Plan & Billing</CardTitle>
                            <CardDescription className="text-slate-500 dark:text-slate-400">Manage your subscription.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-full bg-emerald-50 dark:bg-emerald-500/10 p-2">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900 dark:text-white">Professional Plan</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Unlimited clients, jobs, and analytics.</p>
                                    </div>
                                </div>
                                <Button variant="outline" className="border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg font-medium">
                                    Manage Plan
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Shield, Bell, CreditCard, Save } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
    const { user } = useAuth();

    const handleSave = () => {
        toast.success("Profile Updated", {
            description: "Your workspace preferences have been synchronized."
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit">Workspace Settings</h1>
                <p className="text-slate-500 font-medium">Configure your personal profile and application preferences.</p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="bg-slate-100/80 p-1 rounded-xl mb-8">
                    <TabsTrigger value="profile" className="rounded-lg px-6 py-2 text-sm font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <User className="mr-2 h-4 w-4" /> Profile
                    </TabsTrigger>
                    <TabsTrigger value="security" className="rounded-lg px-6 py-2 text-sm font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Shield className="mr-2 h-4 w-4" /> Security
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="rounded-lg px-6 py-2 text-sm font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Bell className="mr-2 h-4 w-4" /> Notifications
                    </TabsTrigger>
                    <TabsTrigger value="billing" className="rounded-lg px-6 py-2 text-sm font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <CreditCard className="mr-2 h-4 w-4" /> Billing
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-0 outline-none">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="border-slate-200/60 shadow-sm overflow-hidden md:col-span-2">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                                <CardTitle>Personal Information</CardTitle>
                                <CardDescription>Update your avatar and identity across the TradeMate network.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="space-y-6 max-w-2xl">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="space-y-2 flex-1">
                                            <Label htmlFor="username" className="text-sm font-bold text-slate-700">Username</Label>
                                            <Input id="username" defaultValue={user?.username} className="border-slate-200 h-11" />
                                        </div>
                                        <div className="space-y-2 flex-1">
                                            <Label htmlFor="email" className="text-sm font-bold text-slate-700">Email Address</Label>
                                            <Input id="email" type="email" defaultValue={user?.email} className="border-slate-200 h-11" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="bio" className="text-sm font-bold text-slate-700">Professional Bio</Label>
                                        <Input id="bio" placeholder="e.g. Master Plumber at TradeMate Solutions" className="border-slate-200 h-11" />
                                    </div>
                                    <Button onClick={handleSave} className="bg-gradient-to-r from-primary to-indigo-600 rounded-xl px-8 h-11 font-bold shadow-lg shadow-primary/20 hover:opacity-90 border-0">
                                        <Save className="mr-2 h-4 w-4" /> Save Changes
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="security" className="mt-0 outline-none">
                    <Card className="border-slate-200/60 shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                            <CardTitle>Security Preferences</CardTitle>
                            <CardDescription>Manage your password and active session protocols.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="space-y-6 max-w-md">
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-slate-700">Current Password</Label>
                                    <Input type="password" placeholder="••••••••" className="border-slate-200 h-11" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-slate-700">New Password</Label>
                                    <Input type="password" placeholder="Enter new password" className="border-slate-200 h-11" />
                                </div>
                                <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-8 h-11 font-bold">
                                    Update Credentials
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="mt-0 outline-none">
                    <Card className="border-slate-200/60 shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                            <CardTitle>Notification Center</CardTitle>
                            <CardDescription>Choose how you receive updates and job alerts.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="space-y-4">
                                <p className="text-sm text-slate-500 italic">Advanced notification settings coming soon in the Enterprise expansion.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="billing" className="mt-0 outline-none">
                    <Card className="border-slate-200/60 shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                            <CardTitle>Plan & Billing</CardTitle>
                            <CardDescription>Manage your subscription and vault usage.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="rounded-2xl bg-indigo-50/50 border border-indigo-100 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <h4 className="font-bold text-indigo-900">Premium Professional</h4>
                                    <p className="text-sm text-indigo-700">Unlimited clients, jobs, and AI analytics.</p>
                                </div>
                                <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-xl font-bold">
                                    Manage Subscription
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

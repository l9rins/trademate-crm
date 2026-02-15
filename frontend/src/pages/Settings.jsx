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
                <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase">Workspace <span className="text-primary italic">Settings</span></h1>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs opacity-70">Configure your personal profile and application preferences.</p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="bg-muted/30 p-1 rounded-xl mb-8 border border-white/5">
                    <TabsTrigger value="profile" className="rounded-lg px-6 py-2 text-sm font-bold data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground">
                        <User className="mr-2 h-4 w-4" /> Profile
                    </TabsTrigger>
                    <TabsTrigger value="security" className="rounded-lg px-6 py-2 text-sm font-bold data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground">
                        <Shield className="mr-2 h-4 w-4" /> Security
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="rounded-lg px-6 py-2 text-sm font-bold data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground">
                        <Bell className="mr-2 h-4 w-4" /> Notifications
                    </TabsTrigger>
                    <TabsTrigger value="billing" className="rounded-lg px-6 py-2 text-sm font-bold data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground">
                        <CreditCard className="mr-2 h-4 w-4" /> Billing
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-0 outline-none">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="glass-card overflow-hidden md:col-span-2 border-white/5">
                            <CardHeader className="bg-muted/10 border-b border-white/5">
                                <CardTitle className="text-foreground">Personal Information</CardTitle>
                                <CardDescription>Update your avatar and identity across the TradeMate network.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="space-y-6 max-w-2xl">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="space-y-2 flex-1">
                                            <Label htmlFor="username" className="text-sm font-bold text-foreground/80">Username</Label>
                                            <Input id="username" defaultValue={user?.username} className="border-border h-11 bg-background/50" />
                                        </div>
                                        <div className="space-y-2 flex-1">
                                            <Label htmlFor="email" className="text-sm font-bold text-foreground/80">Email Address</Label>
                                            <Input id="email" type="email" defaultValue={user?.email} className="border-border h-11 bg-background/50" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="bio" className="text-sm font-bold text-foreground/80">Professional Bio</Label>
                                        <Input id="bio" placeholder="e.g. Master Plumber at TradeMate Solutions" className="border-border h-11 bg-background/50" />
                                    </div>
                                    <Button onClick={handleSave} className="bg-cryshield-gradient hover:opacity-90 rounded-xl px-8 h-11 font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20 border-0 text-white">
                                        <Save className="mr-2 h-4 w-4" /> Save Changes
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="security" className="mt-0 outline-none">
                    <Card className="glass-card overflow-hidden border-white/5">
                        <CardHeader className="bg-muted/10 border-b border-white/5">
                            <CardTitle className="text-foreground">Security Preferences</CardTitle>
                            <CardDescription>Manage your password and active session protocols.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="space-y-6 max-w-md">
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-foreground/80">Current Password</Label>
                                    <Input type="password" placeholder="••••••••" className="border-border h-11 bg-background/50" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-foreground/80">New Password</Label>
                                    <Input type="password" placeholder="Enter new password" className="border-border h-11 bg-background/50" />
                                </div>
                                <Button className="bg-foreground hover:bg-foreground/90 text-background rounded-xl px-8 h-11 font-bold">
                                    Update Credentials
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="mt-0 outline-none">
                    <Card className="glass-card overflow-hidden border-white/5">
                        <CardHeader className="bg-muted/10 border-b border-white/5">
                            <CardTitle className="text-foreground">Notification Center</CardTitle>
                            <CardDescription>Choose how you receive updates and job alerts.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground italic">Advanced notification settings coming soon in the Enterprise expansion.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="billing" className="mt-0 outline-none">
                    <Card className="glass-card overflow-hidden border-white/5">
                        <CardHeader className="bg-muted/10 border-b border-white/5">
                            <CardTitle className="text-foreground">Plan & Billing</CardTitle>
                            <CardDescription>Manage your subscription and vault usage.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="rounded-2xl bg-primary/5 border border-primary/10 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <h4 className="font-bold text-foreground">Premium Professional</h4>
                                    <p className="text-sm text-muted-foreground">Unlimited clients, jobs, and AI analytics.</p>
                                </div>
                                <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/10 rounded-xl font-bold">
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

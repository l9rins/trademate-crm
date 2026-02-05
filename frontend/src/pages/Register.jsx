import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { AlertCircle, User, Mail, Lock, UserPlus } from 'lucide-react';
import { toast } from "sonner"

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const onSubmit = async (values) => {
        try {
            await register(values.username, values.email, values.password);
            toast.success("Account created!", {
                description: "Welcome to the premium TradeMate workspace.",
            });
            navigate('/');
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Registration failed. Username or Email may be taken.';
            setError(errorMessage);
            toast.error("Registration failed", {
                description: errorMessage,
            });
        }
    };

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email').required('Required'),
            password: Yup.string().min(6, 'Too short').required('Required'),
        }),
        onSubmit,
    });

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-background overflow-hidden text-foreground transition-colors duration-500">
            {/* Mesh Gradient Background */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_50%,rgba(99,102,241,0.08)_0%,rgba(255,255,255,0)_100%)] opacity-50 dark:opacity-20" />
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(35%_30%_at_20%_80%,rgba(168,85,247,0.05)_0%,rgba(255,255,255,0)_100%)] opacity-50 dark:opacity-10" />

            <Card className="w-[450px] border-border shadow-2xl shadow-indigo-100/50 dark:shadow-indigo-900/50 rounded-3xl overflow-hidden backdrop-blur-sm bg-card/90">
                <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                <CardHeader className="space-y-1 pb-8 px-8 pt-8 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-primary mb-4 shadow-inner">
                        <UserPlus className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-3xl font-black tracking-tight text-foreground">Access Request</CardTitle>
                    <CardDescription className="text-slate-500 font-medium pt-1">
                        Initialize your <span className="text-indigo-600 font-bold">TradeMate</span> Enterprise account
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-8">
                    <form onSubmit={formik.handleSubmit} className="space-y-5">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-xs font-bold uppercase tracking-widest text-slate-400 pl-1">Preferred Username</Label>
                                <div className="relative group">
                                    <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-primary" />
                                    <Input
                                        id="username"
                                        placeholder="lorenz_admin"
                                        className="pl-11 h-11 bg-slate-50/50 border-slate-200 rounded-xl focus:bg-white transition-all focus:ring-2 focus:ring-primary/10"
                                        {...formik.getFieldProps('username')}
                                    />
                                </div>
                                {formik.touched.username && formik.errors.username && (
                                    <p className="text-[10px] font-bold text-rose-500 uppercase tracking-tighter pl-1">{formik.errors.username}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-400 pl-1">Professional Email</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-primary" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="lorenz@trade.mate"
                                        className="pl-11 h-11 bg-slate-50/50 border-slate-200 rounded-xl focus:bg-white transition-all focus:ring-2 focus:ring-primary/10"
                                        {...formik.getFieldProps('email')}
                                    />
                                </div>
                                {formik.touched.email && formik.errors.email && (
                                    <p className="text-[10px] font-bold text-rose-500 uppercase tracking-tighter pl-1">{formik.errors.email}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-slate-400 pl-1">Secure Password</Label>
                                <div className="relative group">
                                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-primary" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-11 h-11 bg-slate-50/50 border-slate-200 rounded-xl focus:bg-white transition-all focus:ring-2 focus:ring-primary/10"
                                        {...formik.getFieldProps('password')}
                                    />
                                </div>
                                {formik.touched.password && formik.errors.password && (
                                    <p className="text-[10px] font-bold text-rose-500 uppercase tracking-tighter pl-1">{formik.errors.password}</p>
                                )}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 rounded-xl text-md font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 shadow-lg shadow-indigo-200 transition-all border-0 mt-2"
                            disabled={formik.isSubmitting}
                        >
                            {formik.isSubmitting ? "Provisioning Account..." : "Initiate Onboarding"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 pb-8 pt-4">
                    <div className="flex items-center gap-2 w-full px-8">
                        <div className="h-[1px] bg-slate-100 flex-1" />
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Registered?</span>
                        <div className="h-[1px] bg-slate-100 flex-1" />
                    </div>
                    <Link to="/login" className="w-full px-8">
                        <Button variant="ghost" className="w-full h-11 rounded-xl text-xs font-bold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors">
                            Return to Secure Sign In
                        </Button>
                    </Link>
                </CardFooter>
            </Card>

            <div className="absolute bottom-8 left-0 right-0 text-center">
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.3em]">
                    &copy; 2026 TradeMate CRM &bull; Ultra Premium Division
                </p>
            </div>
        </div>
    );
}

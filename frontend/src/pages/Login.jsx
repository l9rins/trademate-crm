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
import { AlertCircle, Lock, User, ArrowRight } from 'lucide-react';
import { toast } from "sonner"


export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const onSubmit = async (values) => {
        try {
            await login(values.username, values.password);
            toast.success("Welcome back!", {
                description: "You've successfully signed in to TradeMate CRM.",
            });
            navigate('/');
        } catch (err) {
            setError('Invalid username or password');
            toast.error("Authentication failed", {
                description: "The credentials you provided do not match our records.",
            });
        }
    };

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Username is required'),
            password: Yup.string().required('Password is required'),
        }),
        onSubmit,
    });

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-[#020202] overflow-hidden selection:bg-primary/30">
            {/* High-Performance Decorative Gradients */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
                <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[120px] rounded-full" />
            </div>

            <Card className="w-[440px] border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] glass-card rounded-[2.5rem] overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-cryshield-gradient" />

                <CardHeader className="space-y-4 pb-10 px-10 pt-12 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary shadow-[0_0_30px_rgba(6,182,212,0.4)] mb-2 group transition-transform hover:scale-105 duration-500">
                        <span className="text-5xl font-black italic tracking-tighter text-white">T</span>
                    </div>
                    <div className="space-y-1">
                        <CardTitle className="text-4xl font-black tracking-tighter text-white uppercase flex items-center justify-center gap-2">
                            VAULT <span className="text-primary italic">ACCESS</span>
                        </CardTitle>
                        <CardDescription className="text-primary/70 font-black uppercase tracking-[0.3em] text-[9px] mt-2">
                            SECURE SESSION INITIALIZATION
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="px-10">
                    <form onSubmit={formik.handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Label htmlFor="username" className="text-[10px] font-black uppercase tracking-[0.25em] text-white/70 pl-1">Identity Vector</Label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                        <User className="h-4.5 w-4.5 text-primary transition-all group-focus-within:scale-110" />
                                    </div>
                                    <Input
                                        id="username"
                                        placeholder="Enter Identity"
                                        className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl focus:bg-white/10 transition-all focus:ring-1 focus:ring-primary/40 font-bold text-white placeholder:text-white/20 text-md"
                                        {...formik.getFieldProps('username')}
                                    />
                                </div>
                                {formik.touched.username && formik.errors.username && (
                                    <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest pl-2 animate-in slide-in-from-left-2">{formik.errors.username}</p>
                                )}
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.25em] text-white/70 pl-1">Auth Token</Label>
                                    <a href="#" className="text-[10px] font-black text-primary hover:text-emerald-400 uppercase tracking-widest transition-colors animate-pulse">RECOVER?</a>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                        <Lock className="h-4.5 w-4.5 text-primary transition-all group-focus-within:scale-110" />
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl focus:bg-white/10 transition-all focus:ring-1 focus:ring-primary/40 font-bold text-white placeholder:text-white/20 text-md"
                                        {...formik.getFieldProps('password')}
                                    />
                                </div>
                                {formik.touched.password && formik.errors.password && (
                                    <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest pl-2 animate-in slide-in-from-left-2">{formik.errors.password}</p>
                                )}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 rounded-2xl text-[12px] font-black uppercase tracking-[0.3em] bg-cryshield-gradient hover:opacity-90 shadow-[0_0_40px_rgba(6,182,212,0.2)] transition-all border-0 group relative overflow-hidden"
                            disabled={formik.isSubmitting}
                        >
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            {formik.isSubmitting ? "SYNCHRONIZING..." : (
                                <span className="flex items-center justify-center gap-3 relative z-10 text-white">
                                    ESTABLISH LINK <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                                </span>
                            )}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex flex-col gap-6 pb-12 pt-6 px-10">
                    <div className="flex items-center gap-4 w-full px-4">
                        <div className="h-[1px] bg-white/10 flex-1" />
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">NEW NODE?</span>
                        <div className="h-[1px] bg-white/10 flex-1" />
                    </div>
                    <Link to="/register" className="w-full">
                        <Button variant="outline" className="w-full h-14 rounded-2xl text-[11px] font-black text-white/70 hover:text-white hover:bg-white/5 transition-all uppercase tracking-[0.3em] border-white/10 bg-transparent">
                            PROVISION NEW ENTRY
                        </Button>
                    </Link>
                </CardFooter>
            </Card>

            <div className="absolute bottom-8 left-0 right-0 text-center">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.6em]">
                    &copy; 2026 CRYSHIELD PROTOCOL &bull; SECURE WORKSPACE DIVISION
                </p>
            </div>
        </div>
    );
}

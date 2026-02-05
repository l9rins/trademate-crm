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
        <div className="relative flex items-center justify-center min-h-screen bg-[#050505] overflow-hidden transition-colors duration-500">
            {/* Mesh Gradient Background */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_50%,rgba(6,182,212,0.1)_0%,rgba(0,0,0,0)_100%)] opacity-70" />
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(35%_30%_at_20%_80%,rgba(34,197,94,0.05)_0%,rgba(0,0,0,0)_100%)] opacity-50" />

            <Card className="w-[480px] border-white/5 shadow-2xl glass-card rounded-[2rem] overflow-hidden">
                <div className="h-1.5 bg-cryshield-gradient shadow-[0_0_20px_rgba(6,182,212,0.3)]" />
                <CardHeader className="space-y-2 pb-10 px-10 pt-10 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6 shadow-inner shadow-primary/20 scale-110">
                        <UserPlus className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-4xl font-black tracking-tighter text-foreground uppercase">Access <span className="text-primary italic">Request</span></CardTitle>
                    <CardDescription className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] opacity-60 mt-2">
                        Initialize Profile: <span className="text-primary">Cryshield Protocol</span>
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-10">
                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 pl-1">Preferred Alias</Label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-3.5 h-4 w-4 text-primary opacity-50 transition-all group-focus-within:opacity-100 group-focus-within:scale-110" />
                                    <Input
                                        id="username"
                                        placeholder="lorenz_admin"
                                        className="pl-12 h-12 bg-white/5 border-white/5 rounded-xl focus:bg-white/10 transition-all focus:ring-2 focus:ring-primary/20 font-bold"
                                        {...formik.getFieldProps('username')}
                                    />
                                </div>
                                {formik.touched.username && formik.errors.username && (
                                    <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest pl-2">{formik.errors.username}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 pl-1">Secure Channel</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-3.5 h-4 w-4 text-primary opacity-50 transition-all group-focus-within:opacity-100 group-focus-within:scale-110" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="lorenz@secure.vault"
                                        className="pl-12 h-12 bg-white/5 border-white/5 rounded-xl focus:bg-white/10 transition-all focus:ring-2 focus:ring-primary/20 font-bold"
                                        {...formik.getFieldProps('email')}
                                    />
                                </div>
                                {formik.touched.email && formik.errors.email && (
                                    <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest pl-2">{formik.errors.email}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 pl-1">Unique Keyphrase</Label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-3.5 h-4 w-4 text-primary opacity-50 transition-all group-focus-within:opacity-100 group-focus-within:scale-110" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-12 h-12 bg-white/5 border-white/5 rounded-xl focus:bg-white/10 transition-all focus:ring-2 focus:ring-primary/20 font-bold"
                                        {...formik.getFieldProps('password')}
                                    />
                                </div>
                                {formik.touched.password && formik.errors.password && (
                                    <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest pl-2">{formik.errors.password}</p>
                                )}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] bg-cryshield-gradient hover:opacity-90 shadow-2xl shadow-primary/20 transition-all border-0 mt-4"
                            disabled={formik.isSubmitting}
                        >
                            {formik.isSubmitting ? "Provisioning..." : "Initialize Onboarding"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-6 pb-10 pt-6 px-10">
                    <div className="flex items-center gap-3 w-full px-4">
                        <div className="h-[1px] bg-white/5 flex-1" />
                        <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">Established?</span>
                        <div className="h-[1px] bg-white/5 flex-1" />
                    </div>
                    <Link to="/login" className="w-full">
                        <Button variant="ghost" className="w-full h-12 rounded-xl text-[10px] font-black text-muted-foreground/60 hover:text-primary hover:bg-white/5 transition-all uppercase tracking-widest border border-white/5">
                            Return to Secure Vault
                        </Button>
                    </Link>
                </CardFooter>
            </Card>

            <div className="absolute bottom-8 left-0 right-0 text-center">
                <p className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.5em]">
                    &copy; 2026 Cryshield Protocol &bull; Secure Workspace Division
                </p>
            </div>
        </div>
    );
}

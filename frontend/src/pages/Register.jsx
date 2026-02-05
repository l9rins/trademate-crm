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
                description: "Welcome to the TradeMate workspace.",
            });
            navigate('/');
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Registration failed. Username or Email may be taken.';
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
        <div className="relative flex items-center justify-center min-h-screen bg-slate-50/50 overflow-hidden text-slate-900">
            <Card className="w-[460px] border-slate-100 shadow-xl rounded-2xl overflow-hidden bg-white">
                <CardHeader className="space-y-6 pb-8 px-8 pt-10">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-teal-400 to-emerald-500 text-white font-black italic shadow-lg shadow-teal-500/20">
                            T
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-800">TradeMate</span>
                    </div>
                    <div className="space-y-1.5">
                        <CardTitle className="text-3xl font-black tracking-tighter text-slate-900 uppercase">
                            Create <span className="text-teal-500 italic">Account</span>
                        </CardTitle>
                        <CardDescription className="text-slate-500 text-sm">
                            Join the workspace and start managing your business.
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="px-8">
                    <form onSubmit={formik.handleSubmit} className="space-y-5">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-xs font-semibold text-slate-600 pl-0.5">Username</Label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-teal-500 transition-colors pointer-events-none">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <Input
                                        id="username"
                                        placeholder="lorenz_admin"
                                        className="h-11 bg-white border-slate-200 rounded-lg pl-10 focus:ring-teal-500 focus:border-teal-500 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                                        {...formik.getFieldProps('username')}
                                    />
                                </div>
                                {formik.touched.username && formik.errors.username && (
                                    <p className="text-xs font-medium text-rose-500 pl-0.5">{formik.errors.username}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-semibold text-slate-600 pl-0.5">Email Address</Label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-teal-500 transition-colors pointer-events-none">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@company.com"
                                        className="h-11 bg-white border-slate-200 rounded-lg pl-10 focus:ring-teal-500 focus:border-teal-500 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                                        {...formik.getFieldProps('email')}
                                    />
                                </div>
                                {formik.touched.email && formik.errors.email && (
                                    <p className="text-xs font-medium text-rose-500 pl-0.5">{formik.errors.email}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-xs font-semibold text-slate-600 pl-0.5">Password</Label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-teal-500 transition-colors pointer-events-none">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="h-11 bg-white border-slate-200 rounded-lg pl-10 focus:ring-teal-500 focus:border-teal-500 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                                        {...formik.getFieldProps('password')}
                                    />
                                </div>
                                {formik.touched.password && formik.errors.password && (
                                    <p className="text-xs font-medium text-rose-500 pl-0.5">{formik.errors.password}</p>
                                )}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 shadow-lg shadow-teal-500/20 transition-all duration-200 hover:scale-[1.02] border-0 text-white mt-4"
                            disabled={formik.isSubmitting}
                        >
                            {formik.isSubmitting ? "Creating Account..." : "Create Account"}
                        </Button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-muted-foreground font-medium">Or continue with</span>
                            </div>
                        </div>

                        <Button variant="outline" type="button" className="w-full h-11 rounded-xl font-semibold border-slate-200 hover:bg-slate-50 transition-all">
                            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                <path fill="#4285F4" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                            </svg>
                            Google
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex flex-col gap-4 pb-10 pt-8 px-8">
                    <div className="text-center w-full">
                        <p className="text-sm text-slate-500">
                            Already have an account? <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-700 transition-colors">Sign in</Link>
                        </p>
                    </div>
                </CardFooter>
            </Card>

            <div className="absolute bottom-8 left-0 right-0 text-center">
                <p className="text-xs font-medium text-slate-400">
                    &copy; 2026 TradeMate CRM &bull; Clean SaaS Division
                </p>
            </div>
        </div>
    );
}

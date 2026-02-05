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
                        <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Create Account</CardTitle>
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
                                <Input
                                    id="username"
                                    placeholder="lorenz_admin"
                                    className="h-11 bg-white border-slate-200 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                                    {...formik.getFieldProps('username')}
                                />
                                {formik.touched.username && formik.errors.username && (
                                    <p className="text-xs font-medium text-rose-500 pl-0.5">{formik.errors.username}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-semibold text-slate-600 pl-0.5">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    className="h-11 bg-white border-slate-200 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                                    {...formik.getFieldProps('email')}
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <p className="text-xs font-medium text-rose-500 pl-0.5">{formik.errors.email}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-xs font-semibold text-slate-600 pl-0.5">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="h-11 bg-white border-slate-200 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                                    {...formik.getFieldProps('password')}
                                />
                                {formik.touched.password && formik.errors.password && (
                                    <p className="text-xs font-medium text-rose-500 pl-0.5">{formik.errors.password}</p>
                                )}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 rounded-xl text-sm font-bold bg-gradient-to-r from-teal-400 to-emerald-500 hover:opacity-90 shadow-lg shadow-teal-500/20 transition-all border-0 text-white mt-4"
                            disabled={formik.isSubmitting}
                        >
                            {formik.isSubmitting ? "Creating Account..." : "Create Account"}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex flex-col gap-4 pb-10 pt-8 px-8">
                    <div className="flex items-center gap-3 w-full">
                        <div className="h-[1px] bg-slate-100 flex-1" />
                        <span className="text-xs font-medium text-slate-400">or</span>
                        <div className="h-[1px] bg-slate-100 flex-1" />
                    </div>
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

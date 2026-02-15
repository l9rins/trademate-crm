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
import { Lock, Mail } from 'lucide-react';
import { toast } from "sonner"
import { motion } from "framer-motion";


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
            toast.error("Sign in failed", {
                description: "Please check your credentials and try again.",
            });
        }
    };

    const formik = useFormik({
        initialValues: { username: '', password: '' },
        validationSchema: Yup.object({
            username: Yup.string().required('Required'),
            password: Yup.string().required('Required'),
        }),
        onSubmit,
    });

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
            {/* Subtle grid pattern */}
            <div
                className="fixed inset-0 opacity-[0.02] dark:opacity-[0.04]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full max-w-[400px] relative z-10"
            >
                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xl">
                        T
                    </div>
                    <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">TradeMate</span>
                </div>

                <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 shadow-lg">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back</CardTitle>
                        <CardDescription className="text-slate-500 dark:text-slate-400">Sign in to your account to continue</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={formik.handleSubmit}>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username" className="text-sm font-medium text-slate-700 dark:text-slate-300">Username</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <Input
                                            id="username"
                                            placeholder="Enter your username"
                                            className="pl-10 h-11 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 focus:ring-2 focus:ring-slate-950/10 dark:focus:ring-white/10 rounded-lg"
                                            {...formik.getFieldProps('username')}
                                        />
                                    </div>
                                    {formik.touched.username && formik.errors.username && (
                                        <p className="text-xs text-rose-500 font-medium">{formik.errors.username}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</Label>
                                        <a href="#" className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors font-medium">Forgot password?</a>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Enter your password"
                                            className="pl-10 h-11 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 focus:ring-2 focus:ring-slate-950/10 dark:focus:ring-white/10 rounded-lg"
                                            {...formik.getFieldProps('password')}
                                        />
                                    </div>
                                    {formik.touched.password && formik.errors.password && (
                                        <p className="text-xs text-rose-500 font-medium">{formik.errors.password}</p>
                                    )}
                                </div>
                                <Button type="submit" disabled={formik.isSubmitting} className="w-full h-11 rounded-lg font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-sm text-white transition-all text-sm">
                                    {formik.isSubmitting ? 'Signing in...' : 'Sign in'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="justify-center border-t border-slate-100 dark:border-slate-800 pt-6">
                        <p className="text-sm text-slate-500">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-slate-900 dark:text-white font-semibold hover:underline transition-all">
                                Sign up
                            </Link>
                        </p>
                    </CardFooter>
                </Card>

                <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-6">
                    © 2025 TradeMate. All rights reserved.
                </p>
            </motion.div>
        </div>
    );
}

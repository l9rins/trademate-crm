import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Link } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    PlusIcon,
    TrendingUp,
    TrendingDown,
    Users,
    Briefcase,
    CheckCircle2,
    Clock,
    ArrowUpRight,
    Search,
    AlertCircle,
    Download
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar
} from 'recharts';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

// Sample chart data
const chartData = [
    { name: 'Mon', revenue: 4000, jobs: 24 },
    { name: 'Tue', revenue: 3000, jobs: 18 },
    { name: 'Wed', revenue: 5000, jobs: 29 },
    { name: 'Thu', revenue: 2780, jobs: 15 },
    { name: 'Fri', revenue: 1890, jobs: 10 },
    { name: 'Sat', revenue: 2390, jobs: 12 },
    { name: 'Sun', revenue: 3490, jobs: 20 },
];

function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

// Clean, financial-grade tooltip
const CleanTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-xl dark:border-slate-800 dark:bg-slate-950">
                <p className="mb-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                        ${payload[0].value.toLocaleString()}
                    </span>
                </div>
            </div>
        );
    }
    return null;
};

const VolumeTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-xl dark:border-slate-800 dark:bg-slate-950">
                <p className="mb-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                        {payload[0].value} jobs
                    </span>
                </div>
            </div>
        );
    }
    return null;
};

// Swiss-style metric card — micro-contrast, precision borders
const MetricCard = ({ title, value, subtext, icon: Icon, trend, trendValue, index = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.06, type: "spring", stiffness: 300, damping: 30 }}
    >
        <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-slate-700">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                    <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        <motion.span
                            key={value}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            {value}
                        </motion.span>
                    </h3>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 text-slate-900 ring-1 ring-slate-900/5 dark:bg-slate-900 dark:text-white dark:ring-white/10">
                    <Icon className="h-6 w-6 stroke-[1.5px]" />
                </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
                {trend && (
                    <>
                        <span className={cn(
                            "flex items-center gap-1 font-medium",
                            trend === "up" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                        )}>
                            {trend === 'up' ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                            {trendValue}
                        </span>
                        <span className="ml-2 text-slate-400 dark:text-slate-500">vs last month</span>
                    </>
                )}
                {!trend && subtext && (
                    <span className="text-slate-400 dark:text-slate-500">{subtext}</span>
                )}
            </div>
        </div>
    </motion.div>
);

// Skeleton
const DashboardSkeleton = () => (
    <div className="space-y-8 animate-in fade-in duration-300">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
                <div className="h-9 w-64 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
                <div className="h-4 w-40 rounded-lg bg-slate-50 dark:bg-slate-800/50 animate-pulse mt-2" />
            </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 p-6 space-y-4">
                    <div className="flex justify-between">
                        <div className="space-y-2">
                            <div className="h-4 w-20 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
                            <div className="h-8 w-16 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
                        </div>
                        <div className="h-12 w-12 rounded-lg bg-slate-50 dark:bg-slate-900 animate-pulse" />
                    </div>
                    <div className="h-3 w-32 rounded bg-slate-50 dark:bg-slate-800/50 animate-pulse" />
                </div>
            ))}
        </div>
    </div>
);

export default function Dashboard() {
    const { data: apiData, isLoading, isFetching, isError } = useQuery({
        queryKey: ['dashboardStats'],
        queryFn: () => api.get('/dashboard').then(res => res.data),
        staleTime: 60_000,
        retry: 1,
    });

    const stats = apiData || {
        totalJobs: 0,
        pendingJobs: 0,
        completedJobs: 0,
        todayJobs: [],
    };

    if (isLoading && !apiData) return <DashboardSkeleton />;

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 m-8">
                <div className="rounded-full bg-rose-50 dark:bg-rose-500/10 p-4 mb-4">
                    <AlertCircle className="h-8 w-8 text-rose-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Unable to load dashboard</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-2 max-w-sm">
                    We're having trouble connecting to the server. Please check your connection and try again.
                </p>
                <Button
                    onClick={() => window.location.reload()}
                    className="mt-6 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 px-8 py-2 font-semibold text-sm rounded-lg"
                >
                    Retry
                </Button>
            </div>
        );
    }

    const metrics = [
        { title: "Active Jobs", value: stats.totalJobs || 0, subtext: "Jobs in pipeline", icon: Briefcase, trend: "up", trendValue: "+12.5%" },
        { title: "Pending Review", value: stats.pendingJobs || 0, subtext: "Awaiting approval", icon: Clock, trend: "down", trendValue: "-2%" },
        { title: "Completed", value: stats.completedJobs || 0, subtext: "Finished this month", icon: CheckCircle2, trend: "up", trendValue: "+5.2%" },
        { title: "Retention Rate", value: "98.2%", subtext: "Customer satisfaction", icon: Users },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Dashboard
                    </h1>
                    <div className="flex items-center gap-3 mt-1">
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Overview of your business performance</p>
                        <AnimatePresence>
                            {isFetching && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"
                                    title="Syncing..."
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="hidden sm:flex rounded-lg font-medium text-sm border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 h-10 px-4">
                        <Download className="mr-2 h-4 w-4" /> Export
                    </Button>
                    <Link to="/jobs">
                        <Button className="rounded-lg px-6 h-10 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-sm text-white font-semibold text-sm transition-all">
                            <PlusIcon className="mr-2 h-4 w-4" /> New Job
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {metrics.map((metric, i) => (
                    <MetricCard key={metric.title} {...metric} index={i} />
                ))}
            </div>

            {/* Charts + Activity */}
            <div className="grid gap-6 lg:grid-cols-7">
                <Card className="lg:col-span-4 overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 shadow-sm">
                    <Tabs defaultValue="revenue" className="w-full">
                        <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
                            <div className="space-y-1">
                                <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Performance</CardTitle>
                                <CardDescription className="text-sm text-slate-500 dark:text-slate-400">Weekly revenue and job volume</CardDescription>
                            </div>
                            <TabsList className="bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200/50 dark:border-slate-800">
                                <TabsTrigger value="revenue" className="rounded-md px-4 py-1.5 text-xs font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm transition-all">Revenue</TabsTrigger>
                                <TabsTrigger value="volume" className="rounded-md px-4 py-1.5 text-xs font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm transition-all">Volume</TabsTrigger>
                            </TabsList>
                        </CardHeader>
                        <CardContent className="h-[350px] pt-4">
                            <TabsContent value="revenue" className="h-full mt-0 outline-none">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#0f172a" stopOpacity={0.08} />
                                                <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:opacity-20" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                                            tickFormatter={(value) => `$${value}`}
                                        />
                                        <RechartsTooltip content={<CleanTooltip />} cursor={{ stroke: '#94a3b8', strokeWidth: 1 }} />
                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#0f172a"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorRevenue)"
                                            animationDuration={1500}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </TabsContent>
                            <TabsContent value="volume" className="h-full mt-0 outline-none">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:opacity-20" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                                        />
                                        <RechartsTooltip content={<VolumeTooltip />} cursor={{ fill: 'rgba(15, 23, 42, 0.03)' }} />
                                        <Bar
                                            dataKey="jobs"
                                            fill="#0f172a"
                                            radius={[4, 4, 0, 0]}
                                            barSize={28}
                                            animationDuration={1200}
                                            className="dark:[&>path]:fill-slate-200"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </TabsContent>
                        </CardContent>
                    </Tabs>
                </Card>

                <Card className="lg:col-span-3 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 shadow-sm">
                    <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</CardTitle>
                        <CardDescription className="text-sm text-slate-500 dark:text-slate-400">Latest updates from your pipeline</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {(() => {
                            const activities = [...(stats.todayJobs || [])];
                            const mockData = [
                                { id: 'm1', title: 'System Maintenance', status: 'COMPLETED', clientName: 'Admin', scheduledDate: new Date(Date.now() - 3600000 * 2), isMock: true },
                                { id: 'm2', title: 'Invoice Generated', status: 'PENDING', clientName: 'Finance', scheduledDate: new Date(Date.now() - 3600000 * 5), isMock: true },
                                { id: 'm3', title: 'New Client Onboarded', status: 'COMPLETED', clientName: 'Sales', scheduledDate: new Date(Date.now() - 3600000 * 12), isMock: true },
                                { id: 'm4', title: 'Welcome Email Sent', status: 'COMPLETED', clientName: 'System', scheduledDate: new Date(Date.now() - 3600000 * 24), isMock: true },
                            ];
                            while (activities.length < 5 && mockData.length > 0) {
                                activities.push(mockData.shift());
                            }

                            return (
                                <ScrollArea className="h-[350px] px-6">
                                    <div className="space-y-1 py-2">
                                        {activities.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                                <div className="rounded-full bg-slate-50 dark:bg-slate-900 p-4 mb-4">
                                                    <Search className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                                                </div>
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white">No recent activity</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[180px] mt-1">Events will appear here automatically.</p>
                                            </div>
                                        ) : (
                                            <AnimatePresence mode="popLayout">
                                                {activities.slice(0, 6).map((job, idx) => (
                                                    <motion.div
                                                        key={job.id}
                                                        layout
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: 10 }}
                                                        transition={{ delay: idx * 0.04, type: "spring", stiffness: 300 }}
                                                        className={cn(
                                                            "flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors",
                                                            job.isMock && "opacity-60"
                                                        )}
                                                    >
                                                        <Avatar className="h-8 w-8 shrink-0">
                                                            <AvatarFallback className={cn(
                                                                "text-[10px] font-semibold",
                                                                job.status === 'COMPLETED' ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" :
                                                                    job.status === 'IN_PROGRESS' ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" :
                                                                        "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                                                            )}>
                                                                {job.clientName?.substring(0, 2).toUpperCase() || "JD"}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{job.title}</p>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                                                {job.isMock ? "System activity" : `Updated to ${job.status}`}
                                                            </p>
                                                        </div>
                                                        <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                                                            {job.scheduledDate ? new Date(job.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                                        </span>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        )}
                                    </div>
                                </ScrollArea>
                            );
                        })()}
                        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                            <Button variant="ghost" className="w-full text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors font-medium rounded-lg h-10">
                                View all activity
                                <ArrowUpRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

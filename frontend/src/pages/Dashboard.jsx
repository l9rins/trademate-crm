import React, { useEffect, useState } from 'react';
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
    AlertCircle
} from "lucide-react"
import { motion } from "framer-motion";
import {
    LineChart,
    Line,
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

// Sample chart data - in a real app this would come from the API
const chartData = [
    { name: 'Mon', revenue: 4000, jobs: 24 },
    { name: 'Tue', revenue: 3000, jobs: 18 },
    { name: 'Wed', revenue: 5000, jobs: 29 },
    { name: 'Thu', revenue: 2780, jobs: 15 },
    { name: 'Fri', revenue: 1890, jobs: 10 },
    { name: 'Sat', revenue: 2390, jobs: 12 },
    { name: 'Sun', revenue: 3490, jobs: 20 },
];

const MetricCard = ({ title, value, subtext, icon: Icon, trend, trendValue }) => (
    <Card className="overflow-hidden glass-card shadow-2xl hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-500 group">
        <CardContent className="p-7">
            <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner shadow-primary/30 group-hover:scale-110 transition-transform">
                    <Icon className="h-7 w-7" />
                </div>
                {trend && (
                    <Badge variant="outline" className={cn(
                        "rounded-full px-3 py-1 text-[10px] font-black border-none shadow-lg",
                        trend === 'up' ? "bg-emerald-500/10 text-emerald-400 shadow-emerald-500/10" : "bg-rose-500/10 text-rose-400 shadow-rose-500/10"
                    )}>
                        {trend === 'up' ? <TrendingUp className="mr-1.5 h-3.5 w-3.5" /> : <TrendingDown className="mr-1.5 h-3.5 w-3.5" />}
                        {trendValue}
                    </Badge>
                )}
            </div>
            <div className="mt-6">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/50">{title}</p>
                <div className="flex items-baseline gap-2 mt-1">
                    <h3 className="text-4xl font-black tracking-tighter text-foreground">{value}</h3>
                </div>
                {subtext && <p className="mt-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{subtext}</p>}
            </div>
            <div className="absolute bottom-0 left-0 h-1 w-0 bg-cryshield-gradient group-hover:w-full transition-all duration-500" />
        </CardContent>
    </Card>
);

// Helper for class names
function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalJobs: 0,
        pendingJobs: 0,
        completedJobs: 0,
        todayJobs: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard');
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="flex h-[400px] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-sm font-medium text-slate-500 italic">Preparing your workspace...</p>
            </div>
        </div>
    );

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase">
                        Welcome, <span className="text-cryshield-gradient">Lorenz</span>
                    </h1>
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs opacity-70">Workspace Vitality: <span className="text-primary">Optimized</span></p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="hidden sm:flex rounded-xl font-black uppercase text-xs border-white/5 glass hover:bg-white/5 tracking-tight px-6 h-11">
                        <ArrowUpRight className="mr-2 h-4 w-4 text-primary" /> Export Pulse
                    </Button>
                    <Link to="/jobs">
                        <Button className="rounded-xl px-8 h-11 bg-cryshield-gradient hover:opacity-90 shadow-2xl shadow-primary/20 text-white font-black uppercase text-xs tracking-widest transition-all">
                            <PlusIcon className="mr-2 h-4 w-4" /> Initialize Job
                        </Button>
                    </Link>
                </div>
            </div>

            <motion.div
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
                variants={container}
                initial="hidden"
                animate="show"
            >
                <motion.div variants={item}>
                    <MetricCard
                        title="Total Active Jobs"
                        value={stats.totalJobs}
                        subtext="Jobs currently in pipeline"
                        icon={Briefcase}
                        trend="up"
                        trendValue="+12.5%"
                    />
                </motion.div>
                <motion.div variants={item}>
                    <MetricCard
                        title="Pending Review"
                        value={stats.pendingJobs}
                        subtext="Awaiting client approval"
                        icon={Clock}
                        trend="down"
                        trendValue="-2%"
                    />
                </motion.div>
                <motion.div variants={item}>
                    <MetricCard
                        title="Completed Jobs"
                        value={stats.completedJobs}
                        subtext="Total finished this month"
                        icon={CheckCircle2}
                        trend="up"
                        trendValue="+5.2%"
                    />
                </motion.div>
                <motion.div variants={item}>
                    <MetricCard
                        title="Retention Rate"
                        value="98.2%"
                        subtext="Customer satisfaction score"
                        icon={Users}
                    />
                </motion.div>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-7">
                <Card className="lg:col-span-4 glass-card shadow-2xl overflow-hidden border-white/5">
                    <Tabs defaultValue="revenue" className="w-full">
                        <CardHeader className="flex flex-row items-center justify-between p-8 pb-4">
                            <div className="space-y-1">
                                <CardTitle className="text-2xl font-black uppercase tracking-tighter">Analytics <span className="text-primary italic">Engine</span></CardTitle>
                                <CardDescription className="font-bold opacity-60">Deep dive into your professional performance.</CardDescription>
                            </div>
                            <TabsList className="bg-muted/50 p-1.5 rounded-2xl glass border border-white/5">
                                <TabsTrigger value="revenue" className="rounded-xl px-6 py-2 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-xl transition-all">Revenue</TabsTrigger>
                                <TabsTrigger value="volume" className="rounded-xl px-6 py-2 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-xl transition-all">Volume</TabsTrigger>
                            </TabsList>
                        </CardHeader>
                        <CardContent className="h-[350px] pt-4">
                            <TabsContent value="revenue" className="h-full mt-0 outline-none">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                                            tickFormatter={(value) => `$${value}`}
                                        />
                                        <RechartsTooltip
                                            cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }}
                                            contentStyle={{
                                                borderRadius: '16px',
                                                border: '1px solid #f1f5f9',
                                                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05)',
                                                padding: '12px',
                                                fontSize: '12px',
                                                fontWeight: 'bold'
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="hsl(187, 100%, 42%)"
                                            strokeWidth={5}
                                            fillOpacity={1}
                                            fill="url(#colorRevenue)"
                                            animationDuration={2000}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </TabsContent>
                            <TabsContent value="volume" className="h-full mt-0 outline-none">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                                        />
                                        <RechartsTooltip
                                            cursor={{ fill: 'rgba(99, 102, 241, 0.04)' }}
                                            contentStyle={{
                                                borderRadius: '16px',
                                                border: '1px solid #f1f5f9',
                                                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05)',
                                                padding: '12px',
                                                fontSize: '12px',
                                                fontWeight: 'bold'
                                            }}
                                        />
                                        <Bar
                                            dataKey="jobs"
                                            fill="hsl(var(--primary))"
                                            radius={[6, 6, 0, 0]}
                                            barSize={32}
                                            animationDuration={1500}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </TabsContent>
                        </CardContent>
                    </Tabs>
                </Card>

                <Card className="lg:col-span-3 glass-card shadow-2xl border-white/5">
                    <CardHeader className="p-8 border-b border-white/5">
                        <CardTitle className="text-xl font-black uppercase tracking-tighter">Recent <span className="text-accent italic">Activity</span></CardTitle>
                        <CardDescription className="font-bold opacity-60">Latest updates from your team and clients.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {/* Define a list of activity items including mock data if necessary */}
                        {(() => {
                            const activities = [...stats.todayJobs];

                            // Mock data to fill space if real data is sparse
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
                                    <div className="space-y-6 py-4">
                                        {activities.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                                <div className="rounded-full bg-slate-50 p-4 mb-4">
                                                    <Search className="h-8 w-8 text-slate-300" />
                                                </div>
                                                <p className="text-sm font-semibold text-slate-900">No recent activity</p>
                                                <p className="text-xs text-slate-500 max-w-[180px] mt-1 italic">When events occur, they'll appear here automatically.</p>
                                            </div>
                                        ) : (
                                            activities.slice(0, 6).map((job) => (
                                                <div key={job.id} className={cn("flex items-start gap-4", job.isMock && "opacity-60")}>
                                                    <div className="relative shrink-0">
                                                        <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                                                            <AvatarFallback className={cn(
                                                                "text-[10px] font-bold",
                                                                job.status === 'COMPLETED' ? "bg-emerald-50 text-emerald-600" :
                                                                    job.status === 'IN_PROGRESS' ? "bg-indigo-50 text-indigo-600" : "bg-amber-50 text-amber-600"
                                                            )}>
                                                                {job.clientName?.substring(0, 2).toUpperCase() || "JD"}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className={cn(
                                                            "absolute -bottom-1 -right-1 rounded-full p-0.5 border-2 border-white",
                                                            job.status === 'COMPLETED' ? "bg-emerald-500" :
                                                                job.status === 'IN_PROGRESS' ? "bg-indigo-500" : "bg-amber-500"
                                                        )}>
                                                            {job.status === 'COMPLETED' ? <CheckCircle2 className="h-2.5 w-2.5 text-white" /> :
                                                                job.status === 'IN_PROGRESS' ? <Clock className="h-2.5 w-2.5 text-white" /> :
                                                                    <AlertCircle className="h-2.5 w-2.5 text-white" />
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <p className="text-sm font-bold text-slate-900 truncate">
                                                                {job.title}
                                                            </p>
                                                            <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap uppercase tracking-tighter">
                                                                {job.scheduledDate ? new Date(job.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-slate-500 truncate mt-0.5">
                                                            {job.isMock ? "Activity recorded by system" : `Status updated to `}
                                                            {!job.isMock && <span className="font-semibold text-slate-700">{job.status}</span>}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </ScrollArea>
                            );
                        })()}
                        <div className="px-8 pb-8">
                            <Button variant="ghost" className="w-full mt-6 text-[10px] text-muted-foreground/60 hover:text-primary transition-all font-black uppercase tracking-[0.2em] border border-white/5 rounded-2xl py-8 hover:bg-white/5 group relative overflow-hidden">
                                <span className="relative z-10 transition-transform group-hover:scale-110">View Full Activity Log</span>
                                <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

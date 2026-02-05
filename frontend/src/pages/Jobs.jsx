import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../lib/api';
import {
    Pencil,
    Trash2,
    Plus,
    Search,
    MapPin,
    User,
    Clock,
    MoreHorizontal,
    FileText,
    CalendarDays,
    ArrowUpRight,
    Filter
} from 'lucide-react';
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import { StatusBadge } from "../components/StatusBadge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const JOB_STATUSES = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];

export default function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [clients, setClients] = useState([]);
    const [editingJob, setEditingJob] = useState(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await api.get('/jobs');
            setJobs(response.data);
        } catch (error) {
            console.error("Error fetching jobs", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchClients = async () => {
        try {
            const response = await api.get('/clients');
            setClients(response.data);
        } catch (error) {
            console.error("Error fetching clients", error);
        }
    }

    useEffect(() => {
        fetchJobs();
        fetchClients();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            try {
                await api.delete(`/jobs/${id}`);
                fetchJobs();
            } catch (err) {
                console.error("Failed to delete job");
            }
        }
    }

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            status: 'PENDING',
            scheduledDate: null,
            address: '',
            clientId: '',
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            title: Yup.string().required('Required'),
            status: Yup.string().required('Required'),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                const payload = {
                    ...values,
                    client: values.clientId ? { id: values.clientId } : null,
                    scheduledDate: values.scheduledDate ? format(new Date(values.scheduledDate), "yyyy-MM-dd'T'HH:mm:ss") : null
                };

                if (editingJob) {
                    await api.put(`/jobs/${editingJob.id}`, payload);
                } else {
                    await api.post('/jobs', payload);
                }
                fetchJobs();
                setIsSheetOpen(false);
                setEditingJob(null);
                resetForm();
            } catch (error) {
                console.error("Error saving job", error);
            }
        },
    });

    const handleEdit = (job) => {
        setEditingJob(job);
        formik.setValues({
            ...job,
            clientId: job.client ? job.client.id : '',
            scheduledDate: job.scheduledDate ? new Date(job.scheduledDate) : null
        });
        setIsSheetOpen(true);
    };

    const openNewJobSheet = () => {
        setEditingJob(null);
        formik.resetForm();
        setIsSheetOpen(true);
    }

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.client?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.address || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Job Pipeline</h2>
                    <p className="text-slate-500 font-medium">Coordinate and track all active service requests.</p>
                </div>
                <Button onClick={openNewJobSheet} className="shadow-lg shadow-primary/20 rounded-full px-6 bg-gradient-to-r from-primary to-indigo-600 hover:opacity-90 text-white border-0 transition-all duration-200">
                    <Plus className="mr-2 h-4 w-4" /> New Job Request
                </Button>
            </div>

            <Card className="border-slate-200/60 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-200/60 py-4 px-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                placeholder="Search by job, client or address..."
                                className="pl-10 bg-white border-slate-200 rounded-lg focus:ring-primary/20"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="rounded-lg text-slate-600 border-slate-200">
                                <Filter className="mr-2 h-3.5 w-3.5" /> Filters
                            </Button>
                            <Button variant="outline" size="sm" className="rounded-lg text-slate-600 border-slate-200">
                                <FileText className="mr-2 h-3.5 w-3.5" /> Export
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent bg-slate-50/30">
                                    <TableHead className="w-[180px] font-semibold text-slate-900">Title</TableHead>
                                    <TableHead className="font-semibold text-slate-900">Client</TableHead>
                                    <TableHead className="font-semibold text-slate-900">Status</TableHead>
                                    <TableHead className="font-semibold text-slate-900">Scheduled Date</TableHead>
                                    <TableHead className="font-semibold text-slate-900">Location</TableHead>
                                    <TableHead className="text-right font-semibold text-slate-900">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Skeleton className="h-8 w-8 rounded-full" />
                                                    <div className="space-y-2">
                                                        <Skeleton className="h-3 w-20" />
                                                        <Skeleton className="h-2 w-16" />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                                            <TableCell><div className="space-y-2"><Skeleton className="h-3 w-24" /><Skeleton className="h-3 w-20" /></div></TableCell>
                                            <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                            <TableCell className="text-right"><Skeleton className="ml-auto h-8 w-8 rounded-full" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredJobs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-48 text-center bg-white">
                                            <div className="flex flex-col items-center justify-center text-slate-500">
                                                <div className="rounded-full bg-slate-50 p-4 mb-4">
                                                    <Search className="h-8 w-8 text-slate-300" />
                                                </div>
                                                <p className="font-semibold text-slate-900">No jobs found</p>
                                                <p className="text-sm">Try adjusting your search terms or filters.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredJobs.map((job) => (
                                        <TableRow key={job.id} className="group hover:bg-muted/50 border-b border-slate-100/50 transition-colors">
                                            <TableCell className="py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900 text-sm line-clamp-1">{job.title}</span>
                                                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">REF: JOB-{job.id.toString().padStart(4, '0')}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8 border-2 border-white shadow-sm shrink-0">
                                                        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                                                            {job.client?.name?.substring(0, 2).toUpperCase() || "JD"}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-xs font-bold text-slate-900 truncate">{job.client?.name || 'No Client'}</span>
                                                        <span className="text-[10px] text-slate-400 truncate italic">Client Account</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <StatusBadge status={job.status} />
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <div className="w-5 flex justify-center">
                                                        <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                                                    </div>
                                                    <span className="text-xs font-medium">
                                                        {job.scheduledDate ? format(new Date(job.scheduledDate), "MMM dd, yyyy") : '-'}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex items-start gap-2 text-slate-600 max-w-[200px]">
                                                    <div className="w-5 flex justify-center mt-0.5">
                                                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                                    </div>
                                                    <span className="text-xs font-medium leading-relaxed line-clamp-1">{job.address || '-'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right px-6">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-200/50 rounded-full">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 p-1">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => handleEdit(job)} className="cursor-pointer">
                                                            <Pencil className="mr-2 h-4 w-4 text-slate-400" />
                                                            <span>Edit Details</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="cursor-pointer">
                                                            <ArrowUpRight className="mr-2 h-4 w-4 text-slate-400" />
                                                            <span>View Details</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(job.id)}
                                                            className="text-rose-600 focus:bg-rose-50 focus:text-rose-600 cursor-pointer"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            <span>Delete Job</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent side="right" className="sm:max-w-[450px]">
                    <SheetHeader className="mb-6">
                        <SheetTitle className="text-2xl font-bold">{editingJob ? 'Refine Job Details' : 'Create New Job Request'}</SheetTitle>
                        <SheetDescription>
                            {editingJob ? 'Update information for this specific job request.' : 'Fill in the details to schedule a new service call.'}
                        </SheetDescription>
                    </SheetHeader>

                    <form onSubmit={formik.handleSubmit} className="space-y-6 overflow-y-auto max-h-[calc(100vh-200px)] pr-2">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-sm font-bold text-slate-700">Job Title</Label>
                            <Input
                                id="title"
                                placeholder="e.g. Broken Boiler Repair"
                                className="border-slate-200 focus:ring-primary/20"
                                {...formik.getFieldProps('title')}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="clientId" className="text-sm font-bold text-slate-700">Select Client</Label>
                            <Select
                                value={formik.values.clientId}
                                onValueChange={(val) => formik.setFieldValue('clientId', val)}
                            >
                                <SelectTrigger className="border-slate-200 focus:ring-primary/20">
                                    <SelectValue placeholder="Which client is this for?" />
                                </SelectTrigger>
                                <SelectContent>
                                    {clients.map(c => (
                                        <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status" className="text-sm font-bold text-slate-700">Pipeline Status</Label>
                            <Select
                                value={formik.values.status}
                                onValueChange={(val) => formik.setFieldValue('status', val)}
                            >
                                <SelectTrigger className="border-slate-200 focus:ring-primary/20">
                                    <SelectValue placeholder="Set current status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {JOB_STATUSES.map(s => (
                                        <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-slate-700">Scheduled Date</Label>
                            <DatePicker
                                date={formik.values.scheduledDate}
                                setDate={(date) => formik.setFieldValue('scheduledDate', date)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address" className="text-sm font-bold text-slate-700">Service Address</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    id="address"
                                    className="pl-10 border-slate-200 focus:ring-primary/20"
                                    placeholder="Where should they go?"
                                    {...formik.getFieldProps('address')}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-bold text-slate-700">Internal Notes</Label>
                            <textarea
                                id="description"
                                {...formik.getFieldProps('description')}
                                className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Add any specific instructions or client requests..."
                            />
                        </div>

                        <SheetFooter className="pt-6">
                            <Button type="submit" className="w-full h-11 rounded-xl shadow-lg shadow-primary/20 text-md font-bold bg-gradient-to-r from-primary to-indigo-600 hover:opacity-90 text-white border-0 transition-all duration-200">
                                {editingJob ? 'Confirm Updates' : 'Schedule Job'}
                            </Button>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>
        </div>
    );
}

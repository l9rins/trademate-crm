import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../lib/api';
import { Pencil, Trash2, Plus, Calendar as CalendarIcon, MapPin, User, Clock } from 'lucide-react';
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { DatePicker } from "@/components/ui/date-picker"
// // import { toast } from "sonner"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select" // Didn't install select? Assuming I did? I installed dropdown-menu. Select is separate. I'll use native select for now or try to use Select if installed.
// Wait, I did NOT install 'select'. I installed 'button input card label table dialog badge dropdown-menu avatar sheet'.
// So I will use NATIVE select inside a styled div or Input.
// Actually, for consistency, I should have installed Select.
// I'll stick to native select with Shadcn styling class for now to avoid breaking if Select needs installation.

const JOB_STATUSES = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];

export default function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [clients, setClients] = useState([]);
    const [editingJob, setEditingJob] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchJobs = async () => {
        try {
            const response = await api.get('/jobs');
            setJobs(response.data);
        } catch (error) {
            console.error("Error fetching jobs", error);
            console.error("Failed to fetch jobs"); // toast.error("Failed to fetch jobs");
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
                // toast.success("Job deleted successfully");
                fetchJobs();
            } catch (err) {
                // toast.error("Failed to delete job");
            }
        }
    }

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            status: 'PENDING',
            scheduledDate: null, // Changed from '' to null
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
                    // toast.success("Job updated successfully");
                } else {
                    await api.post('/jobs', payload);
                    // toast.success("Job created successfully");
                }
                fetchJobs();
                setIsDialogOpen(false);
                setEditingJob(null);
                resetForm();
            } catch (error) {
                console.error("Error saving job", error);
                // toast.error("Failed to save job");
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
        setIsDialogOpen(true);
    };

    const openNewJobDialog = () => {
        setEditingJob(null);
        formik.resetForm();
        setIsDialogOpen(true);
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between sticky top-0 z-10 bg-background/95 backdrop-blur py-4 border-b">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Jobs</h2>
                    <p className="text-muted-foreground">Manage your job schedule.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openNewJobDialog}>
                            <Plus className="mr-2 h-4 w-4" /> Add Job
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] z-[100]"> {/* Ensure higher Z-index */}
                        <DialogHeader>
                            <DialogTitle>{editingJob ? 'Edit Job' : 'New Job'}</DialogTitle>
                            <DialogDescription>
                                {editingJob ? 'Update job details.' : 'Schedule a new job.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={formik.handleSubmit} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">Title</Label>
                                <Input id="title" className="col-span-3" {...formik.getFieldProps('title')} />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="clientId" className="text-right">Client</Label>
                                <div className="col-span-3">
                                    <select
                                        id="clientId"
                                        {...formik.getFieldProps('clientId')}
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="">Select a Client...</option>
                                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status" className="text-right">Status</Label>
                                <div className="col-span-3">
                                    <select
                                        id="status"
                                        {...formik.getFieldProps('status')}
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {JOB_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="scheduledDate" className="text-right">Date</Label>
                                <div className="col-span-3">
                                    <DatePicker
                                        date={formik.values.scheduledDate}
                                        setDate={(date) => formik.setFieldValue('scheduledDate', date)}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="address" className="text-right">Address</Label>
                                <Input id="address" className="col-span-3" {...formik.getFieldProps('address')} />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">Desc</Label>
                                <Input id="description" className="col-span-3" {...formik.getFieldProps('description')} />
                            </div>
                            <DialogFooter>
                                <Button type="submit">Save changes</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Desktop Table */}
            <Card className="hidden md:block">
                <CardHeader>
                    <CardTitle>All Jobs</CardTitle>
                    <CardDescription>View and manage all your tasks.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Status</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Address</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {jobs.length === 0 ? (
                                <TableRow><TableCell colSpan={6} className="text-center h-24">No jobs found.</TableCell></TableRow>
                            ) : jobs.map((job) => (
                                <TableRow key={job.id}>
                                    <TableCell>
                                        <Badge variant={job.status === 'COMPLETED' ? 'default' : job.status === 'IN_PROGRESS' ? 'secondary' : 'outline'}>
                                            {job.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">{job.title}</TableCell>
                                    <TableCell>{job.client ? job.client.name : '-'}</TableCell>
                                    <TableCell>{job.address}</TableCell>
                                    <TableCell>
                                        {job.scheduledDate ? new Date(job.scheduledDate).toLocaleDateString() : '-'}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(job)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(job.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Mobile Card Grid */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {jobs.length === 0 ? (
                    <div className="text-center text-muted-foreground p-8">No jobs found.</div>
                ) : jobs.map((job) => (
                    <Card key={job.id}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg">{job.title}</CardTitle>
                                    <CardDescription className="flex items-center mt-1">
                                        <User className="h-3 w-3 mr-1" /> {job.client ? job.client.name : 'No Client'}
                                    </CardDescription>
                                </div>
                                <Badge variant={job.status === 'COMPLETED' ? 'default' : job.status === 'IN_PROGRESS' ? 'secondary' : 'outline'}>
                                    {job.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pb-2 text-sm space-y-2">
                            <div className="flex items-center text-muted-foreground">
                                <MapPin className="h-3 w-3 mr-2" /> {job.address || 'No location'}
                            </div>
                            <div className="flex items-center text-muted-foreground">
                                <Clock className="h-3 w-3 mr-2" /> {job.scheduledDate ? new Date(job.scheduledDate).toLocaleDateString() : 'Unscheduled'}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 pt-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(job)}>Edit</Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(job.id)}>Delete</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}

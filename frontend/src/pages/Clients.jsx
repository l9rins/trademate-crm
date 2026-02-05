import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../lib/api';
import {
    Pencil,
    Trash2,
    Plus,
    Search,
    Mail,
    Phone,
    MapPin,
    MoreHorizontal,
    UserPlus,
    Filter,
    FileText,
    ArrowUpRight
} from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Clients() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingClient, setEditingClient] = useState(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchClients = async () => {
        setLoading(true);
        try {
            const response = await api.get('/clients');
            setClients(response.data);
        } catch (error) {
            console.error("Error fetching clients", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this client?')) {
            try {
                await api.delete(`/clients/${id}`);
                fetchClients();
            } catch (err) {
                console.error("Failed to delete client");
            }
        }
    }

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            address: '',
            notes: '',
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email'),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                if (editingClient) {
                    await api.put(`/clients/${editingClient.id}`, values);
                } else {
                    await api.post('/clients', values);
                }
                fetchClients();
                setIsSheetOpen(false);
                setEditingClient(null);
                resetForm();
            } catch (error) {
                console.error("Error saving client", error);
            }
        },
    });

    const handleEdit = (client) => {
        setEditingClient(client);
        formik.setValues(client);
        setIsSheetOpen(true);
    };

    const openNewClientSheet = () => {
        setEditingClient(null);
        formik.resetForm();
        setIsSheetOpen(true);
    }

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.phone || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getInitials = (name) => {
        return name ? name.substring(0, 2).toUpperCase() : '??';
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Client Directory</h2>
                    <p className="text-slate-500 font-medium">Manage and monitor your customer relationships.</p>
                </div>
                <Button onClick={openNewClientSheet} className="shadow-lg shadow-primary/20 rounded-full px-6">
                    <UserPlus className="mr-2 h-4 w-4" /> Add New Client
                </Button>
            </div>

            <Card className="border-slate-200/60 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-200/60 py-4 px-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                placeholder="Search by name, email or phone..."
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
                                    <TableHead className="w-[280px] font-semibold text-slate-900">Client Info</TableHead>
                                    <TableHead className="font-semibold text-slate-900">Contact Details</TableHead>
                                    <TableHead className="font-semibold text-slate-900">Address</TableHead>
                                    <TableHead className="font-semibold text-slate-900">Status</TableHead>
                                    <TableHead className="text-right font-semibold text-slate-900">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-slate-100 animate-pulse" /><div className="space-y-2"><div className="h-4 w-24 bg-slate-100 animate-pulse" /><div className="h-3 w-16 bg-slate-50 animate-pulse" /></div></div></TableCell>
                                            <TableCell><div className="space-y-2"><div className="h-4 w-32 bg-slate-100 animate-pulse" /><div className="h-3 w-20 bg-slate-50 animate-pulse" /></div></TableCell>
                                            <TableCell><div className="h-4 w-40 bg-slate-100 animate-pulse" /></TableCell>
                                            <TableCell><div className="h-5 w-16 rounded-full bg-slate-100 animate-pulse" /></TableCell>
                                            <TableCell className="text-right"><div className="ml-auto h-8 w-8 bg-slate-100 rounded-full animate-pulse" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredClients.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-48 text-center bg-white">
                                            <div className="flex flex-col items-center justify-center text-slate-500">
                                                <div className="rounded-full bg-slate-50 p-4 mb-4">
                                                    <Search className="h-8 w-8 text-slate-300" />
                                                </div>
                                                <p className="font-semibold text-slate-900">No clients found</p>
                                                <p className="text-sm">Try adding a new client to get started.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredClients.map((client) => (
                                        <TableRow key={client.id} className="group hover:bg-slate-50/80 transition-colors">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm shrink-0">
                                                        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                                                            {getInitials(client.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-sm font-bold text-slate-900 truncate">{client.name}</span>
                                                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">ID: CL-{client.id.toString().padStart(4, '0')}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                                                        <span className="text-xs font-medium">{client.email || 'N/A'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                                                        <span className="text-xs font-medium">{client.phone || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-slate-600 max-w-[200px]">
                                                    <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                                                    <span className="text-sm font-medium truncate">{client.address || 'No address'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                                                    ACTIVE
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right px-6">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-200/50 rounded-full">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 p-1">
                                                        <DropdownMenuLabel>Client Management</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => handleEdit(client)} className="cursor-pointer">
                                                            <Pencil className="mr-2 h-4 w-4 text-slate-400" />
                                                            <span>Edit Profile</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="cursor-pointer">
                                                            <ArrowUpRight className="mr-2 h-4 w-4 text-slate-400" />
                                                            <span>View Jobs</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(client.id)}
                                                            className="text-rose-600 focus:bg-rose-50 focus:text-rose-600 cursor-pointer"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            <span>Remove Client</span>
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
                        <SheetTitle className="text-2xl font-bold">{editingClient ? 'Update Profile' : 'Register New Client'}</SheetTitle>
                        <SheetDescription>
                            {editingClient ? 'Refine the contact information and preferences for this client.' : 'Onboard a new client into your TradeMate pipeline.'}
                        </SheetDescription>
                    </SheetHeader>

                    <form onSubmit={formik.handleSubmit} className="space-y-6 overflow-y-auto max-h-[calc(100vh-200px)] pr-2">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-bold text-slate-700">Client Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g. John Doe Plumbing"
                                className="border-slate-200 focus:ring-primary/20"
                                {...formik.getFieldProps('name')}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-bold text-slate-700">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="john@example.com"
                                className="border-slate-200 focus:ring-primary/20"
                                {...formik.getFieldProps('email')}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-bold text-slate-700">Phone Number</Label>
                            <Input
                                id="phone"
                                placeholder="+1 (555) 000-0000"
                                className="border-slate-200 focus:ring-primary/20"
                                {...formik.getFieldProps('phone')}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address" className="text-sm font-bold text-slate-700">Primary Address</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <textarea
                                    id="address"
                                    className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Enter physical location..."
                                    {...formik.getFieldProps('address')}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes" className="text-sm font-bold text-slate-700">Internal Background Notes</Label>
                            <textarea
                                id="notes"
                                {...formik.getFieldProps('notes')}
                                className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Important details about this client..."
                            />
                        </div>

                        <SheetFooter className="pt-6">
                            <Button type="submit" className="w-full h-11 rounded-xl shadow-lg shadow-primary/20 text-md font-bold">
                                {editingClient ? 'Update Profile' : 'Onboard Client'}
                            </Button>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>
        </div>
    );
}

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
import { Skeleton } from "@/components/ui/skeleton"
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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function Clients() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingClient, setEditingClient] = useState(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [clientToDelete, setClientToDelete] = useState(null);

    const fetchClients = async () => {
        setLoading(true);
        try {
            const response = await api.get('/clients');
            setClients(response.data);
        } catch (error) {
            toast.error("Network Error", {
                description: "Failed to synchronize client directory with the vault."
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleDelete = async () => {
        if (!clientToDelete) return;
        try {
            await api.delete(`/clients/${clientToDelete.id}`);
            fetchClients();
            toast.success("Client Vault Updated", {
                description: `Successfully removed "${clientToDelete.name}" from the database.`
            });
        } catch (err) {
            toast.error("Operation Denied", {
                description: "Unable to delete client record. Internal protection active."
            });
        } finally {
            setClientToDelete(null);
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
                    toast.success("Identity Updated", {
                        description: `Profile for "${values.name}" has been successfully refined.`
                    });
                } else {
                    await api.post('/clients', values);
                    toast.success("Entry Established", {
                        description: `"${values.name}" has been officially onboarded.`
                    });
                }
                fetchClients();
                setIsSheetOpen(false);
                setEditingClient(null);
                resetForm();
            } catch (error) {
                toast.error("Validation Error", {
                    description: "Client profiling failed. Please audit input fields."
                });
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
                    <h2 className="text-4xl font-black tracking-tighter text-foreground uppercase">Client <span className="text-primary italic">Directory</span></h2>
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs opacity-70">Manage and monitor your customer relationships.</p>
                </div>
                <Button onClick={openNewClientSheet} className="shadow-2xl shadow-primary/20 rounded-xl px-8 h-12 bg-cryshield-gradient hover:opacity-90 text-white border-0 font-black uppercase text-xs tracking-widest transition-all">
                    <UserPlus className="mr-2 h-4 w-4" /> Initialize Client Profile
                </Button>
            </div>

            <Card className="glass-card shadow-2xl overflow-hidden border-white/5">
                <CardHeader className="bg-white/5 border-b border-white/5 py-6 px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                            <Input
                                placeholder="Search by name, email or phone..."
                                className="pl-12 bg-background/50 border-white/10 rounded-xl focus:ring-primary/20 font-bold h-11"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" size="sm" className="rounded-xl font-black uppercase text-[10px] tracking-widest border-white/10 glass hover:bg-white/5 px-4 h-11">
                                <Filter className="mr-2 h-4 w-4 text-primary" /> Filters
                            </Button>
                            <Button variant="outline" size="sm" className="rounded-xl font-black uppercase text-[10px] tracking-widest border-white/10 glass hover:bg-white/5 px-4 h-11">
                                <FileText className="mr-2 h-4 w-4 text-accent" /> Export Data
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent bg-white/5 border-b border-white/5">
                                    <TableHead className="w-[280px] font-black uppercase tracking-widest text-[10px] text-muted-foreground/60 px-8 py-5">Profile Alias</TableHead>
                                    <TableHead className="font-black uppercase tracking-widest text-[10px] text-muted-foreground/60 py-5">Communication Channels</TableHead>
                                    <TableHead className="font-black uppercase tracking-widest text-[10px] text-muted-foreground/60 py-5">Base Zone</TableHead>
                                    <TableHead className="font-black uppercase tracking-widest text-[10px] text-muted-foreground/60 py-5">Activity State</TableHead>
                                    <TableHead className="text-right font-black uppercase tracking-widest text-[10px] text-muted-foreground/60 px-8 py-5">Operations</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell className="py-4 text-left">
                                                <div className="flex items-center gap-3">
                                                    <Skeleton className="h-10 w-10 rounded-full" />
                                                    <div className="space-y-2 text-left">
                                                        <Skeleton className="h-4 w-24" />
                                                        <Skeleton className="h-3 w-16" />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 text-left">
                                                <div className="space-y-2 text-left">
                                                    <Skeleton className="h-3 w-32" />
                                                    <Skeleton className="h-3 w-24" />
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 text-left">
                                                <Skeleton className="h-4 w-40" />
                                            </TableCell>
                                            <TableCell className="py-4 text-left">
                                                <Skeleton className="h-6 w-16 rounded-full" />
                                            </TableCell>
                                            <TableCell className="text-right px-6">
                                                <Skeleton className="ml-auto h-8 w-8 rounded-full" />
                                            </TableCell>
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
                                        <TableRow key={client.id} className="group hover:bg-muted/50 border-b border-slate-100/50 transition-colors">
                                            <TableCell className="py-4">
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
                                            <TableCell className="py-4">
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <div className="w-5 flex justify-center">
                                                            <Mail className="h-3.5 w-3.5 text-slate-400" />
                                                        </div>
                                                        <span className="text-xs font-medium truncate">{client.email || 'N/A'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <div className="w-5 flex justify-center">
                                                            <Phone className="h-3.5 w-3.5 text-slate-400" />
                                                        </div>
                                                        <span className="text-xs font-medium text-nowrap">{client.phone || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex items-start gap-2 text-slate-600 max-w-[200px]">
                                                    <div className="w-5 flex justify-center mt-0.5">
                                                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                                    </div>
                                                    <span className="text-xs font-medium leading-relaxed line-clamp-2">{client.address || 'No address'}</span>
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
                                                            onClick={() => setClientToDelete(client)}
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
                                <Textarea
                                    id="address"
                                    className="pl-10 min-h-[80px] border-slate-200 focus:ring-primary/20"
                                    placeholder="Enter physical location..."
                                    {...formik.getFieldProps('address')}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes" className="text-sm font-bold text-slate-700">Internal Background Notes</Label>
                            <Textarea
                                id="notes"
                                {...formik.getFieldProps('notes')}
                                className="min-h-[100px] border-slate-200 focus:ring-primary/20"
                                placeholder="Important details about this client..."
                            />
                        </div>

                        <SheetFooter className="pt-8">
                            <Button type="submit" className="w-full h-12 rounded-xl shadow-2xl shadow-primary/20 font-black uppercase text-xs tracking-[0.2em] bg-cryshield-gradient hover:opacity-90 text-white border-0 transition-all">
                                {editingClient ? 'Sync Identity' : 'Onboard Profile'}
                            </Button>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>

            <AlertDialog open={!!clientToDelete} onOpenChange={() => setClientToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently remove <span className="font-bold text-slate-900">"{clientToDelete?.name}"</span> and all associated data from the CRM. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-rose-600 hover:bg-rose-700 rounded-xl"
                        >
                            Delete Client
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

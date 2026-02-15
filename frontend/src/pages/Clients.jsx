import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../lib/api';
import {
    Pencil,
    Trash2,
    Search,
    Mail,
    Phone,
    MapPin,
    MoreHorizontal,
    UserPlus,
    Filter,
    Download,
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
import { motion, AnimatePresence } from "framer-motion";

export default function Clients() {
    const queryClient = useQueryClient();
    const [editingClient, setEditingClient] = useState(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [clientToDelete, setClientToDelete] = useState(null);

    const { data: clients = [], isLoading } = useQuery({
        queryKey: ['clients'],
        queryFn: () => api.get('/clients').then(res => res.data),
        staleTime: 60_000,
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/clients/${id}`),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['clients'] });
            const previous = queryClient.getQueryData(['clients']);
            queryClient.setQueryData(['clients'], old => old?.filter(c => c.id !== id) || []);
            return { previous };
        },
        onError: (err, id, context) => {
            queryClient.setQueryData(['clients'], context.previous);
            toast.error("Failed to delete client.");
        },
        onSuccess: () => {
            toast.success("Client removed successfully.");
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['clients'] }),
    });

    const saveMutation = useMutation({
        mutationFn: (values) => editingClient
            ? api.put(`/clients/${editingClient.id}`, values)
            : api.post('/clients', values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
            toast.success(editingClient ? "Client updated." : "Client created.");
            setIsSheetOpen(false);
            setEditingClient(null);
            formik.resetForm();
        },
        onError: () => {
            toast.error("Failed to save client. Please check your inputs.");
        }
    });

    const handleDelete = () => {
        if (!clientToDelete) return;
        deleteMutation.mutate(clientToDelete.id);
        setClientToDelete(null);
    };

    const formik = useFormik({
        initialValues: { name: '', email: '', phone: '', address: '', notes: '' },
        enableReinitialize: true,
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email'),
        }),
        onSubmit: (values) => saveMutation.mutate(values),
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
    };

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.phone || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : '??';

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Clients</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Manage your customer relationships and contacts.</p>
                </div>
                <Button onClick={openNewClientSheet} className="rounded-lg px-6 h-10 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-sm text-white font-semibold text-sm transition-all">
                    <UserPlus className="mr-2 h-4 w-4" /> Add Client
                </Button>
            </div>

            <Card className="overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 shadow-sm">
                <CardHeader className="bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-200 dark:border-slate-800 py-4 px-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                placeholder="Search by name, email, or phone..."
                                className="pl-10 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-lg h-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="rounded-lg font-medium text-sm border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 h-10 px-4">
                                <Filter className="mr-2 h-4 w-4" /> Filters
                            </Button>
                            <Button variant="outline" size="sm" className="rounded-lg font-medium text-sm border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 h-10 px-4">
                                <Download className="mr-2 h-4 w-4" /> Export
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent bg-slate-50/50 dark:bg-slate-900/20 border-b border-slate-200 dark:border-slate-800">
                                    <TableHead className="w-[280px] font-semibold text-xs text-slate-500 dark:text-slate-400 px-6 py-3">Client</TableHead>
                                    <TableHead className="font-semibold text-xs text-slate-500 dark:text-slate-400 py-3">Contact</TableHead>
                                    <TableHead className="font-semibold text-xs text-slate-500 dark:text-slate-400 py-3">Address</TableHead>
                                    <TableHead className="font-semibold text-xs text-slate-500 dark:text-slate-400 py-3">Status</TableHead>
                                    <TableHead className="text-right font-semibold text-xs text-slate-500 dark:text-slate-400 px-6 py-3">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i} className="border-b border-slate-100 dark:border-slate-800">
                                            <TableCell className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <Skeleton className="h-9 w-9 rounded-full" />
                                                    <div className="space-y-1.5"><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-16" /></div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4"><Skeleton className="h-3 w-32" /></TableCell>
                                            <TableCell className="py-4"><Skeleton className="h-3 w-40" /></TableCell>
                                            <TableCell className="py-4"><Skeleton className="h-5 w-14 rounded-full" /></TableCell>
                                            <TableCell className="py-4 text-right px-6"><Skeleton className="ml-auto h-8 w-8 rounded" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredClients.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-48 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="rounded-full bg-slate-50 dark:bg-slate-900 p-4 mb-4">
                                                    <Search className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                                                </div>
                                                <p className="font-semibold text-slate-900 dark:text-white">No clients found</p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Add a new client to get started.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <AnimatePresence mode="popLayout">
                                        {filteredClients.map((client, index) => (
                                            <motion.tr
                                                key={client.id}
                                                layout
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, x: -30, transition: { duration: 0.15 } }}
                                                transition={{ delay: index * 0.02, type: "spring", stiffness: 300, damping: 30 }}
                                                className="group hover:bg-slate-50 dark:hover:bg-slate-900/30 border-b border-slate-100 dark:border-slate-800 transition-colors"
                                            >
                                                <TableCell className="py-3.5 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-9 w-9 shrink-0">
                                                            <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold">
                                                                {getInitials(client.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col min-w-0">
                                                            <span className="text-sm font-medium text-slate-900 dark:text-white truncate">{client.name}</span>
                                                            <span className="text-xs text-slate-400 dark:text-slate-500">ID: {String(client.id).padStart(4, '0')}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-3.5">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                                                            <Mail className="h-3.5 w-3.5 shrink-0" />
                                                            <span className="text-xs truncate">{client.email || '—'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                                                            <Phone className="h-3.5 w-3.5 shrink-0" />
                                                            <span className="text-xs">{client.phone || '—'}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-3.5">
                                                    <div className="flex items-start gap-1.5 text-slate-600 dark:text-slate-400 max-w-[200px]">
                                                        <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                                                        <span className="text-xs leading-relaxed line-clamp-2">{client.address || '—'}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                                        Active
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right px-6">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-44">
                                                            <DropdownMenuLabel className="text-xs font-semibold text-slate-500">Manage</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => handleEdit(client)} className="cursor-pointer">
                                                                <Pencil className="mr-2 h-4 w-4" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="cursor-pointer">
                                                                <ArrowUpRight className="mr-2 h-4 w-4" /> View Jobs
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => setClientToDelete(client)} className="text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-500/10 focus:text-rose-600 cursor-pointer">
                                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent side="right" className="sm:max-w-[420px]">
                    <SheetHeader className="mb-6">
                        <SheetTitle className="text-xl font-bold text-slate-900 dark:text-white">{editingClient ? 'Edit Client' : 'New Client'}</SheetTitle>
                        <SheetDescription className="text-slate-500 dark:text-slate-400">
                            {editingClient ? 'Update the contact details for this client.' : 'Add a new client to your CRM.'}
                        </SheetDescription>
                    </SheetHeader>

                    <form onSubmit={formik.handleSubmit} className="space-y-5 overflow-y-auto max-h-[calc(100vh-200px)] pr-2">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">Name</Label>
                            <Input id="name" placeholder="e.g. John Doe Plumbing" className="border-slate-200 dark:border-slate-800 rounded-lg h-10" {...formik.getFieldProps('name')} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</Label>
                            <Input id="email" type="email" placeholder="john@example.com" className="border-slate-200 dark:border-slate-800 rounded-lg h-10" {...formik.getFieldProps('email')} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone</Label>
                            <Input id="phone" placeholder="+1 (555) 000-0000" className="border-slate-200 dark:border-slate-800 rounded-lg h-10" {...formik.getFieldProps('phone')} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address" className="text-sm font-medium text-slate-700 dark:text-slate-300">Address</Label>
                            <Textarea id="address" className="min-h-[80px] border-slate-200 dark:border-slate-800 rounded-lg" placeholder="Enter address..." {...formik.getFieldProps('address')} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes" className="text-sm font-medium text-slate-700 dark:text-slate-300">Notes</Label>
                            <Textarea id="notes" {...formik.getFieldProps('notes')} className="min-h-[80px] border-slate-200 dark:border-slate-800 rounded-lg" placeholder="Internal notes..." />
                        </div>

                        <SheetFooter className="pt-6">
                            <Button type="submit" disabled={saveMutation.isPending} className="w-full h-10 rounded-lg font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-sm text-white text-sm">
                                {saveMutation.isPending ? 'Saving...' : editingClient ? 'Save Changes' : 'Create Client'}
                            </Button>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>

            <AlertDialog open={!!clientToDelete} onOpenChange={() => setClientToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete client?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently remove <span className="font-semibold text-slate-900 dark:text-white">"{clientToDelete?.name}"</span> and all associated data. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-rose-600 hover:bg-rose-700 rounded-lg">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

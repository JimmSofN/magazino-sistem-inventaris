import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { CheckCircle2, XCircle, Plus, CalendarIcon, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, parse } from 'date-fns';
import { id } from 'date-fns/locale';
import { Link } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';

interface Item {
    name: string;
}

interface TransactionDetail {
    item: Item;
    quantity: number;
}

interface User {
    name: string;
}

interface Transaction {
    id: number;
    transaction_code: string;
    type: 'in' | 'out';
    transaction_date: string;
    transaction_time: string;
    user: User;
    details: TransactionDetail[];
}

interface Props {
    transactions: {
        data: Transaction[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    flash?: { success?: string; error?: string };
    filters?: { date?: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Transaksi',
        href: '/transaksi',
    },
];

export default function Transactions({ transactions, flash, filters }: Props) {
    // Initialize date from query parameter or default to today
    const initialDate = filters?.date
        ? parse(filters.date, 'yyyy-MM-dd', new Date())
        : new Date();
    const [date, setDate] = useState<Date | undefined>(initialDate);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            setToastMessage(flash.success);
            setToastType('success');
            setShowToast(true);
        } else if (flash?.error) {
            setToastMessage(flash.error);
            setToastType('error');
            setShowToast(true);
        }
    }, [flash]);

    // Toast auto-dismiss
    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    // Handle date filtering and initial load
    useEffect(() => {
        const formattedDate = format(date || new Date(), 'yyyy-MM-dd');
        router.get(
            route('transaksi.index'),
            { date: formattedDate },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    }, [date]);

    // Handle pagination with date filter
    const handlePagination = (url: string | null) => {
        if (url) {
            const formattedDate = format(date || new Date(), 'yyyy-MM-dd');
            const urlWithDate = new URL(url, window.location.origin);
            urlWithDate.searchParams.set('date', formattedDate);
            router.get(urlWithDate.toString(), {}, { preserveState: true, preserveScroll: true });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transaksi" />
            <div className="container mx-auto py-8 px-4">
                <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center mb-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-[240px] justify-start text-left font-normal"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, 'PPP', { locale: id }) : <span>Pilih tanggal</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                    locale={id}
                                />
                            </PopoverContent>
                        </Popover>
                        <h1 className="text-2xl font-bold">Daftar Transaksi</h1>
                    </div>
                    <Link href={route('transaksi.create')}>
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Tambahkan Transaksi
                        </Button>
                    </Link>
                </div>

                {/* Toast notification - already correct and integrated */}
                {showToast && (
                    <div
                        className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg p-4 shadow-lg ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white animate-in fade-in slide-in-from-top-5`}
                    >
                        {toastType === 'success' ? (
                            <CheckCircle2 className="h-5 w-5" />
                        ) : (
                            <XCircle className="h-5 w-5" />
                        )}
                        <span>{toastMessage}</span>
                    </div>
                )}

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Kode</TableHead>
                            <TableHead>Tipe</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Waktu</TableHead>
                            <TableHead>Pengguna</TableHead>
                            <TableHead>Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                    Belum ada transaksi.
                                </TableCell>
                            </TableRow>
                        ) : (
                            transactions.data.map((transaction, index) => (
                                <TableRow
                                    key={transaction.id}
                                    className={index % 2 === 0 ? '' : ''}
                                >
                                    <TableCell>{transaction.transaction_code}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs font-medium ${transaction.type === 'in'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                }`}
                                        >
                                            {transaction.type === 'in' ? 'Masuk' : 'Keluar'}
                                        </span>
                                    </TableCell>
                                    <TableCell>{transaction.transaction_date}</TableCell>
                                    <TableCell>{transaction.transaction_time}</TableCell>
                                    <TableCell>{transaction.user.name}</TableCell>
                                    <TableCell>
                                        <Link href={route('transaksi.show', transaction.id)}>
                                            <Button
                                                variant="outline"
                                                className="flex items-center gap-2"
                                            >
                                                <Eye className="h-4 w-4" />
                                                Detail
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex justify-end gap-2 mt-4">
                    {transactions.links.map((link, index) => (
                        <Button
                            key={index}
                            variant={link.active ? 'default' : 'outline'}
                            disabled={!link.url}
                            onClick={() => handlePagination(link.url)}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
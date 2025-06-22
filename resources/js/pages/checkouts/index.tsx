import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parse } from 'date-fns';
import { id } from 'date-fns/locale';
import { CalendarIcon, CheckCircle2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Item {
    id: number;
    name: string;
    stock: number;
    price: number;
    unit: string;
}

interface TransactionDetail {
    id: number;
    item_id: number;
    price: number;
    quantity: number;
    subtotal: number;
    item: Item;
}

interface User {
    id: number;
    name: string;
}

interface Transaction {
    id: number;
    transaction_code: string;
    type: 'in' | 'out';
    transaction_date: string;
    transaction_time: string;
    user_id: number;
    notes: string | null;
    total: number;
    details: TransactionDetail[];
    user: User;
}

interface Pagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    transactions: {
        data: Transaction[];
    } & Pagination;
    flash: {
        success?: string;
        error?: string;
    };
    filters: {
        date: string; // YYYY-MM-DD
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Checkout', href: '/checkout' },
];

// Formatter for total (Rp. 200.000)
const numberFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

export default function CheckoutIndex({ transactions, flash, filters }: Props) {
    const [date, setDate] = useState<Date | undefined>(
        filters.date ? parse(filters.date, 'yyyy-MM-dd', new Date()) : new Date(),
    );
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [toastMessage, setToastMessage] = useState('');

    // Handle flash messages with toast
    useEffect(() => {
        if (flash.success) {
            setToastType('success');
            setToastMessage(flash.success);
            setShowToast(true);
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        } else if (flash.error) {
            setToastType('error');
            setToastMessage(flash.error);
            setShowToast(true);
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash.success, flash.error]);

    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            setDate(selectedDate);
            const formattedDate = format(selectedDate, 'yyyy-MM-dd');
            window.location.href = `/checkout?date=${formattedDate}`;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Checkout" />
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-2xl font-bold mb-6 dark:text-white">Riwayat Checkout</h1>

                {showToast && (
                    <div
                        className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg p-4 shadow-lg ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'
                            } text-white animate-in fade-in slide-in-from-top-5`}
                    >
                        {toastType === 'success' ? (
                            <CheckCircle2 className="h-5 w-5" />
                        ) : (
                            <XCircle className="h-5 w-5" />
                        )}
                        <span>{toastMessage}</span>
                    </div>
                )}

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-[280px] justify-start text-left font-normal"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, 'PPP', { locale: id }) : <span>Pilih tanggal</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={handleDateSelect}
                                    initialFocus
                                    locale={id}
                                    formatters={{
                                        formatCaption: (date, options) =>
                                            format(date, 'MMMM yyyy', { locale: options?.locale }),
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Checkout</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Kode Transaksi</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Waktu</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-6">
                                            Tidak ada checkout ditemukan untuk tanggal ini.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    transactions.data.map((transaction) => (
                                        <TableRow key={transaction.id}>
                                            <TableCell>{transaction.transaction_code}</TableCell>
                                            <TableCell>{transaction.transaction_date}</TableCell>
                                            <TableCell>{transaction.transaction_time}</TableCell>
                                            <TableCell>
                                                {numberFormatter.format(transaction.total).replace('Rp ', 'Rp. ')}
                                            </TableCell>
                                            <TableCell>
                                                <Link href={`/checkout/${transaction.id}`}>
                                                    <Button variant="outline">Lihat Detail</Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {transactions.last_page > 1 && (
                            <div className="flex justify-center mt-6">
                                <div className="flex space-x-2">
                                    {transactions.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            preserveState
                                            preserveScroll
                                            className={`px-4 py-2 border rounded ${link.active
                                                ? 'bg-blue-500 text-white'
                                                : link.url
                                                    ? 'bg-white text-blue-500'
                                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                }`}
                                        >
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
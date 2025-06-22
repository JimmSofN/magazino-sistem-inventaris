import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { BreadcrumbItem } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';

// Reusable formatter for Rupiah
const rupiahFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
});

interface Item {
    name: string;
    unit: string;
}

interface TransactionDetail {
    id?: number;
    item?: Item;
    item_name: string;
    item_unit?: string; // Added, nullable
    price: number;
    quantity: number;
    subtotal: number;
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
    notes: string | null;
    total: number;
    details: TransactionDetail[];
}

interface Props {
    transaction: Transaction;
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
    {
        title: 'Detail Transaksi',
        href: '#',
    },
];

export default function TransactionShow({ transaction }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Transaksi" />
            <div className="container mx-auto py-8 px-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Detail Transaksi</h1>
                    <Link href={route('transaksi.index')}>
                        <Button className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>
                </div>

                <div className="p-6 rounded-lg shadow">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm">Kode Transaksi</p>
                            <p className="text-lg font-semibold">{transaction.transaction_code}</p>
                        </div>
                        <div>
                            <p className="text-sm">Tipe</p>
                            <span
                                className={`rounded-full px-2 py-1 text-xs font-medium ${transaction.type === 'in'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                    }`}
                            >
                                {transaction.type === 'in' ? 'Masuk' : 'Keluar'}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm">Tanggal</p>
                            <p className="text-lg font-semibold">{transaction.transaction_date}</p>
                        </div>
                        <div>
                            <p className="text-sm">Waktu</p>
                            <p className="text-lg font-semibold">{transaction.transaction_time}</p>
                        </div>
                        <div>
                            <p className="text-sm">Pengguna</p>
                            <p className="text-lg font-semibold">{transaction.user.name}</p>
                        </div>
                        <div>
                            <p className="text-sm">Catatan</p>
                            <p className="text-lg font-semibold">{transaction.notes || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm">Total</p>
                            <p className="text-lg font-semibold">{rupiahFormatter.format(transaction.total)}</p>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold mt-6 mb-4">Detail Barang</h2>
                    {transaction.details.length === 0 ? (
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                                        Tidak ada barang ditemukan.
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="p-4 text-sm font-semibold">Barang</TableHead>
                                        <TableHead className="p-4 text-sm font-semibold">Harga Barang</TableHead>
                                        <TableHead className="p-4 text-sm font-semibold">Jumlah</TableHead>
                                        <TableHead className="p-4 text-sm font-semibold">Subtotal</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transaction.details.map((detail, index) => (
                                        <TableRow
                                            key={detail.id || `${transaction.id}-${index}`}
                                            className={index % 2 === 0 ? '' : ''}
                                        >
                                            <TableCell className="p-4">{detail.item_name || detail.item?.name || 'Unknown'}</TableCell>
                                            <TableCell className="p-4">{rupiahFormatter.format(detail.price)}</TableCell>
                                            <TableCell className="p-4">{detail.quantity} {detail.item_unit || detail.item?.unit || '-'}</TableCell>
                                            <TableCell className="p-4">{rupiahFormatter.format(detail.subtotal)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow className="border-t border-gray-200 dark:border-gray-700">
                                        <TableCell colSpan={3} className="p-4 text-right font-semibold">Total</TableCell>
                                        <TableCell className="p-4 font-semibold">{rupiahFormatter.format(transaction.total)}</TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
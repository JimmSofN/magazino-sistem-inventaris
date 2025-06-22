import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
    item_name: string; // Added
    item_unit?: string; // Added, nullable
    price: number;
    quantity: number;
    subtotal: number;
    item?: Item; // Made optional
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

interface Props {
    transaction: Transaction;
    flash?: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Detail', href: '#' },
];

const numberFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

export default function TransactionShow({ transaction, flash }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Transaksi ${transaction.transaction_code}`} />
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-2xl font-bold mb-6 dark:text-white">
                    Detail Transaksi {transaction.transaction_code}
                </h1>

                {flash?.success && (
                    <Alert className="mb-6">
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}
                {flash?.error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertDescription>{flash.error}</AlertDescription>
                    </Alert>
                )}

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Informasi Transaksi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <div>
                                    <strong className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Kode Transaksi
                                    </strong>
                                    <p className="text-gray-900 dark:text-gray-100">{transaction.transaction_code}</p>
                                </div>
                                <div>
                                    <strong className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Tanggal
                                    </strong>
                                    <p className="text-gray-900 dark:text-gray-100">{transaction.transaction_date}</p>
                                </div>
                                <div>
                                    <strong className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Waktu
                                    </strong>
                                    <p className="text-gray-900 dark:text-gray-100">{transaction.transaction_time}</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <strong className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Pengguna
                                    </strong>
                                    <p className="text-gray-900 dark:text-gray-100">{transaction.user.name}</p>
                                </div>
                                <div>
                                    <strong className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Catatan
                                    </strong>
                                    <p className="text-gray-900 dark:text-gray-100">{transaction.notes || '-'}</p>
                                </div>
                                <div>
                                    <strong className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Total
                                    </strong>
                                    <p className="text-gray-900 dark:text-gray-100">
                                        {numberFormatter.format(transaction.total).replace('Rp ', 'Rp. ')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Detail Barang</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama Barang</TableHead>
                                    <TableHead>Jumlah</TableHead>
                                    <TableHead>Harga Satuan</TableHead>
                                    <TableHead>Subtotal</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transaction.details.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-6">
                                            Tidak ada barang ditemukan.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <>
                                        {transaction.details.map((detail) => (
                                            <TableRow key={detail.id}>
                                                <TableCell>{detail.item_name || detail.item?.name || 'Unknown'}</TableCell>
                                                <TableCell>{detail.quantity} {detail.item_unit || detail.item?.unit || '-'}</TableCell>
                                                <TableCell>{numberFormatter.format(detail.price).replace('Rp ', 'Rp. ')}</TableCell>
                                                <TableCell>{numberFormatter.format(detail.subtotal).replace('Rp ', 'Rp. ')}</TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow className="font-bold">
                                            <TableCell colSpan={3} className="text-right">
                                                Total
                                            </TableCell>
                                            <TableCell>
                                                {numberFormatter.format(transaction.total).replace('Rp ', 'Rp. ')}
                                            </TableCell>
                                        </TableRow>
                                    </>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="mt-6">
                    <Link href="/checkout">
                        <Button variant="outline">Kembali</Button>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
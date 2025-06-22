/* eslint-disable @typescript-eslint/no-explicit-any */
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, Plus } from 'lucide-react';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState, useRef } from 'react';

interface Item {
    id: number;
    name: string;
    stock: number;
    price: number;
    unit: string;
    category: string;
}

interface Category {
    id: number;
    name: string;
}

interface SelectedItem {
    id: string;
    quantity: number;
    name: string;
    price: number;
    stock: number;
    unit: string;
    error?: string;
}

interface QuerySelectedItem {
    id: string;
    quantity: number;
}

interface FormData {
    notes: string;
    items: QuerySelectedItem[];
    [key: string]: any; // Index signature to satisfy FormDataType
}

interface Props {
    items: Item[];
    categories: Category[];
    selectedItems: QuerySelectedItem[];
    filters: {
        search: string;
        category: string;
    };
    flash: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Checkout', href: '/checkout/create' },
];

// Formatter for total (Rp. 65.000)
const numberFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

export default function CheckoutCreate({ items, categories, selectedItems, filters, flash }: Props) {
    const [selected, setSelected] = useState<SelectedItem[]>([]);
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [toastMessage, setToastMessage] = useState('');
    const isInitialLoad = useRef(true); // Track initial load

    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        notes: '',
        items: [],
    });

    // Calculate total
    const total = selected.reduce((sum, item) => sum + item.quantity * item.price, 0);

    // Initialize selected from localStorage or selectedItems on first load
    useEffect(() => {
        if (isInitialLoad.current) {
            // Try to restore from localStorage
            const savedSelected = localStorage.getItem('checkoutSelected');
            if (savedSelected) {
                setSelected(JSON.parse(savedSelected));
            } else if (selectedItems?.length > 0) {
                // Fallback to selectedItems from props (e.g., old input)
                const updatedSelected = selectedItems.map(item => {
                    const fullItem = items.find(i => i.id.toString() === item.id) || {
                        id: parseInt(item.id),
                        name: 'Unknown',
                        price: 0,
                        stock: 0,
                        unit: '',
                        category: '',
                    };
                    return {
                        id: item.id,
                        quantity: item.quantity,
                        name: fullItem.name,
                        price: fullItem.price,
                        stock: fullItem.stock,
                        unit: fullItem.unit,
                        error: undefined,
                    };
                });
                setSelected(updatedSelected);
                localStorage.setItem('checkoutSelected', JSON.stringify(updatedSelected));
            }
            isInitialLoad.current = false;
        }
    }, [selectedItems, items]);

    // Save selected to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('checkoutSelected', JSON.stringify(selected));
    }, [selected]);

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

    // Update form data when selected changes
    useEffect(() => {
        setData('items', selected.map(({ id, quantity }) => ({ id, quantity })));
    }, [selected, setData]);

    const addItem = (itemId: string) => {
        const item = items.find(i => i.id.toString() === itemId);
        if (!item || selected.some(i => i.id === itemId)) return;
        const newItem = {
            id: itemId,
            quantity: 1,
            name: item.name,
            price: item.price,
            stock: item.stock,
            unit: item.unit,
        };
        setSelected([...selected, newItem]);
    };

    const updateItemQuantity = (itemId: string, quantity: number) => {
        setSelected(selected.map(i => {
            if (i.id !== itemId) return i;
            if (quantity < 1) {
                return { ...i, quantity: 1, error: 'Jumlah minimal 1' };
            }
            if (quantity > i.stock) {
                return { ...i, quantity: i.stock, error: `Maksimum ${i.stock} ${i.unit}` };
            }
            return { ...i, quantity, error: undefined };
        }));
    };

    const removeItem = (itemId: string) => {
        setSelected(selected.filter(i => i.id !== itemId));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selected.length === 0 || selected.some(i => i.error)) return;

        post(route('checkout.store'), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                localStorage.removeItem('checkoutSelected');
                isInitialLoad.current = true;
                setSelected([]);
                reset();
            },
        });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleSearchChange = useCallback(
        debounce((value: string) => {
            const newFilters = {
                ...filters,
                search: value,
            };
            window.location.href = route('checkout.create', newFilters);
        }, 300),
        [filters],
    );

    const handleCategoryChange = (value: string) => {
        const newFilters = {
            ...filters,
            category: value,
        };
        window.location.href = route('checkout.create', newFilters);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Checkout Barang" />
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-2xl font-bold mb-6 dark:text-white">Checkout Barang</h1>

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

                <div className="flex space-x-4 mb-6">
                    <div className="w-1/2">
                        <Label>Pencarian</Label>
                        <Input
                            type="text"
                            defaultValue={filters.search}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            placeholder="Cari nama atau deskripsi barang..."
                        />
                    </div>
                    <div className="w-1/4">
                        <Label>Kategori</Label>
                        <Select value={filters.category} onValueChange={handleCategoryChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Kategori</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Daftar Barang</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="max-h-[400px] overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead>Stok</TableHead>
                                        <TableHead>Harga</TableHead>
                                        <TableHead>Satuan</TableHead>
                                        <TableHead>Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-6">
                                                Tidak ada barang ditemukan.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        items.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>{item.category}</TableCell>
                                                <TableCell>{item.stock}</TableCell>
                                                <TableCell>Rp {item.price.toLocaleString('id-ID')}</TableCell>
                                                <TableCell>{item.unit}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => addItem(item.id.toString())}
                                                        disabled={selected.some((i) => i.id === item.id.toString())}
                                                    >
                                                        <Plus />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Barang yang Dipilih</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Jumlah</TableHead>
                                        <TableHead>Harga</TableHead>
                                        <TableHead>Subtotal</TableHead>
                                        <TableHead>Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {selected.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-6">
                                                Belum ada barang dipilih.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        selected.map((selected) => (
                                            <TableRow key={selected.id}>
                                                <TableCell>{selected.name}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Input
                                                            type="number"
                                                            value={selected.quantity}
                                                            onChange={(e) =>
                                                                updateItemQuantity(selected.id, parseInt(e.target.value) || 1)
                                                            }
                                                            min="1"
                                                            max={selected.stock}
                                                            className="w-20"
                                                        />
                                                        <span>{selected.unit}</span>
                                                    </div>
                                                    {selected.error && (
                                                        <p className="text-red-500 text-sm mt-1">{selected.error}</p>
                                                    )}
                                                </TableCell>
                                                <TableCell>Rp {selected.price.toLocaleString('id-ID')}</TableCell>
                                                <TableCell>
                                                    Rp {(selected.quantity * selected.price).toLocaleString('id-ID')}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="destructive"
                                                        onClick={() => removeItem(selected.id)}
                                                    >
                                                        Hapus
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>

                            <div className="flex justify-end mt-4">
                                <div className="text-right">
                                    <p className="text-sm font-semibold">Total</p>
                                    <p className="text-lg font-semibold">
                                        {numberFormatter.format(total).replace('Rp ', 'Rp. ')}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <Label>Catatan</Label>
                                <Input
                                    type="text"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Masukkan catatan (opsional)"
                                />
                                {errors.notes && <p className="text-red-500 text-sm mt-1">{errors.notes}</p>}
                            </div>

                            <Button
                                type="submit"
                                disabled={processing || selected.length === 0 || selected.some((i) => i.error)}
                            >
                                Checkout
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
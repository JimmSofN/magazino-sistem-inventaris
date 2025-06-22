import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Plus, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

// Interface untuk breadcrumb
interface BreadcrumbItem {
    title: string;
    href: string;
}

// Interface untuk barang
interface Item {
    id: number;
    name: string;
    stock: number;
    price: number;
    unit: string;
}

// Interface untuk item di tabel sementara
interface TableItem {
    id: number;
    item_id: number;
    name: string;
    quantity: number;
    price: number;
    unit: string; // Added for display
    subtotal: number;
    stock: number;
    error?: string;
}

// Interface untuk flash message
interface Flash {
    success?: string;
    error?: string;
}

// Interface untuk props
interface TransactionCreateProps {
    items: Item[];
    flash?: Flash;
}

// Tipe kustom untuk errors
interface FormErrors {
    type?: string;
    notes?: string;
    details?: string;
    [key: `details.${number}.quantity`]: string | undefined;
    [key: `details.${number}.item_id`]: string | undefined;
    [key: string]: string | undefined;
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
        title: 'Buat',
        href: '/transaksi/create',
    },
];

export default function TransactionCreate({ items: backendItems, flash }: TransactionCreateProps) {
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        type: 'in' as 'in' | 'out',
        notes: '',
        details: [] as { item_id: number; quantity: number }[],
    });

    const typedErrors: FormErrors = errors;

    const [items, setItems] = useState<TableItem[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Item | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [dialogError, setDialogError] = useState<string | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [searchTerm, setSearchTerm] = useState('');
    const [, setOpenCombobox] = useState(false);

    // Log backendItems untuk debugging
    useEffect(() => {
        console.log('backendItems:', backendItems);
    }, [backendItems]);

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

    // Toggle direction
    const handleToggleChange = () => {
        const newDirection = data.type === 'in' ? 'out' : 'in';
        if (items.length > 0) {
            setData({ type: newDirection, notes: data.notes, details: [] });
            setItems([]);
            clearErrors();
            setToastMessage('Tabel barang direset karena perubahan jenis transaksi');
            setToastType('error');
            setShowToast(true);
        } else {
            setData({ ...data, type: newDirection });
        }
    };

    // Tambah item ke tabel
    const handleAddItem = () => {
        if (selectedProduct && quantity > 0) {
            // Validasi stok untuk transaksi out
            if (data.type === 'out' && quantity > selectedProduct.stock) {
                setDialogError(`Stok ${selectedProduct.name} hanya ${selectedProduct.stock}`);
                return;
            }

            const existingItemIndex = items.findIndex((item) => item.item_id === selectedProduct.id);
            if (existingItemIndex !== -1) {
                const newItems = [...items];
                newItems[existingItemIndex].quantity += quantity;
                newItems[existingItemIndex].subtotal = newItems[existingItemIndex].quantity * newItems[existingItemIndex].price;

                if (data.type === 'out' && newItems[existingItemIndex].quantity > newItems[existingItemIndex].stock) {
                    newItems[existingItemIndex].error = `Stok ${newItems[existingItemIndex].name} hanya ${newItems[existingItemIndex].stock}`;
                } else {
                    newItems[existingItemIndex].error = undefined;
                    clearErrors('details');
                }
                setItems(newItems);

                const newDetails = [...data.details];
                newDetails[existingItemIndex].quantity += quantity;
                setData('details', newDetails);
            } else {
                const newItem: TableItem = {
                    id: Date.now(),
                    item_id: selectedProduct.id,
                    name: selectedProduct.name,
                    quantity,
                    price: selectedProduct.price,
                    unit: selectedProduct.unit, // Added
                    subtotal: quantity * selectedProduct.price,
                    stock: selectedProduct.stock,
                    error: undefined,
                };
                setItems([...items, newItem]);
                setData('details', [...data.details, { item_id: selectedProduct.id, quantity }]);
            }
            setOpen(false);
            setSelectedProduct(null);
            setQuantity(1);
            setDialogError(null);
            setSearchTerm('');
            setOpenCombobox(false);
        }
    };

    // Hapus item dari tabel
    const handleRemoveItem = (id: number) => {
        const index = items.findIndex((item) => item.id === id);
        if (index !== -1) {
            setItems(items.filter((item) => item.id !== id));
            setData('details', data.details.filter((_, i) => i !== index));
            clearErrors('details');
        }
    };

    // Redirect ke /transaksi
    const handleCancel = () => {
        router.get(route('transaksi.index'));
    };

    // Submit form with redirect
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (items.some((item) => item.error)) {
            setToastMessage('Perbaiki error stok sebelum menyimpan');
            setToastType('error');
            setShowToast(true);
            return;
        }
        if (items.length === 0) {
            setToastMessage('Tambahkan setidaknya satu barang');
            setToastType('error');
            setShowToast(true);
            return;
        }
        post(route('transaksi.store'), {
            onSuccess: () => {
                router.get(route('transaksi.index'));
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Transaksi" />
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-2xl font-bold mb-6 dark:text-white">Buat Transaksi</h1>

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

                {backendItems.length === 0 && (
                    <div className="mb-6 p-4 bg-yellow-100 text-yellow-800">
                        Tidak ada barang tersedia. Tambahkan barang terlebih dahulu di menu Barang.
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Toggle Switch */}
                    <div className="flex items-center space-x-4 mb-8">
                        <Label htmlFor="mode-toggle" className="text-lg font-medium">
                            Jenis Transaksi:
                        </Label>
                        <div className="relative inline-flex h-10 items-center">
                            <button
                                type="button"
                                className={cn(
                                    'relative inline-flex h-10 w-20 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                                    data.type === 'in' ? 'bg-green-500' : 'bg-red-500'
                                )}
                                role="switch"
                                aria-checked={data.type === 'in'}
                                onClick={handleToggleChange}
                            >
                                <span
                                    aria-hidden="true"
                                    className={cn(
                                        'pointer-events-none inline-block h-9 w-9 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
                                        data.type === 'in' ? 'translate-x-10' : 'translate-x-0'
                                    )}
                                />
                                <span
                                    className={cn(
                                        'absolute inset-0 flex items-center justify-center text-xs font-medium text-white',
                                        data.type === 'in' ? 'pl-1 pr-10' : 'pl-10 pr-1'
                                    )}
                                >
                                    {data.type === 'in' ? 'IN' : 'OUT'}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="mb-6">
                        <Label htmlFor="notes">Catatan</Label>
                        <Input
                            id="notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Catatan (opsional)"
                            className=""
                        />
                        {typedErrors.notes && <span className="text-red-500 text-sm">{typedErrors.notes}</span>}
                    </div>

                    {/* Table with Add Button */}
                    <div className="hover:bg-accent/50 transition-colors rounded-lg shadow-md p-4 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold dark:text-white">{data.type === 'in' ? 'Barang Masuk' : 'Barang Keluar'}</h2>
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" disabled={backendItems.length === 0}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Tambah Barang
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Tambah Barang</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="item">Nama Barang</Label>
                                            <div className="relative">
                                                <Command className="">
                                                    <CommandInput
                                                        placeholder="Cari dan pilih barang..."
                                                        value={searchTerm}
                                                        onValueChange={setSearchTerm}
                                                        className=""
                                                        autoFocus
                                                    />
                                                    <CommandList className="max-h-[200px] overflow-y-auto">
                                                        <CommandEmpty className="p-2 text-center text-sm">
                                                            Tidak ada barang ditemukan.
                                                        </CommandEmpty>
                                                        <CommandGroup>
                                                            {backendItems
                                                                .filter((item) => item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                                                .map((product) => (
                                                                    <CommandItem
                                                                        key={product.id}
                                                                        value={product.name}
                                                                        onSelect={() => {
                                                                            console.log('Selected:', product);
                                                                            setSelectedProduct(product);
                                                                            setSearchTerm(product.name);
                                                                            setOpenCombobox(false);
                                                                        }}
                                                                        className=""
                                                                    >
                                                                        <Check
                                                                            className={cn(
                                                                                'mr-2 h-4 w-4',
                                                                                selectedProduct?.id === product.id ? 'opacity-100' : 'opacity-0',
                                                                            )}
                                                                        />
                                                                        {product.name} ({product.unit}, Stok: {product.stock}) - Rp {product.price.toLocaleString()}
                                                                    </CommandItem>
                                                                ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </div>
                                            {selectedProduct && (
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Terpilih: {selectedProduct.name} ({selectedProduct.unit})
                                                </p>
                                            )}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="quantity" className="">Jumlah</Label>
                                            <Input
                                                id="quantity"
                                                type="number"
                                                min="1"
                                                value={quantity}
                                                onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                                                className=""
                                            />
                                            {dialogError && (
                                                <span className="text-red-500 text-sm">{dialogError}</span>
                                            )}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="subtotal" className="">Subtotal</Label>
                                            <Input
                                                id="subtotal"
                                                type="text"
                                                value={`Rp ${selectedProduct ? (selectedProduct.price * quantity).toLocaleString() : 0}`}
                                                disabled
                                                className=""
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => setOpen(false)}
                                            className=""
                                        >
                                            Batal
                                        </Button>
                                        <Button
                                            onClick={handleAddItem}
                                            disabled={!selectedProduct || quantity <= 0}
                                            className=""
                                        >
                                            Tambah
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <Table className="">
                            <TableHeader>
                                <TableRow className="">
                                    <TableHead className="">Nama Barang</TableHead>
                                    <TableHead className="">Jumlah</TableHead>
                                    <TableHead className="">Harga</TableHead>
                                    <TableHead className="">Subtotal</TableHead>
                                    <TableHead className="w-[80px]">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.length === 0 ? (
                                    <TableRow className="">
                                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                            Belum ada barang ditambahkan. Klik tombol Tambah Barang untuk memulai.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    items.map((item, index) => (
                                        <React.Fragment key={item.id}>
                                            <TableRow className={index % 2 === 0 ? '' : ''}>
                                                <TableCell className="">{item.name}</TableCell>
                                                <TableCell className="">{item.quantity} {item.unit}</TableCell>
                                                <TableCell className="">Rp {item.price.toLocaleString()}</TableCell>
                                                <TableCell className="">Rp {item.subtotal.toLocaleString()}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                            {(item.error ||
                                                typedErrors[`details.${index}.quantity`] ||
                                                typedErrors[`details.${index}.item_id`]) && (
                                                    <TableRow className="">
                                                        <TableCell colSpan={5} className="text-red-500 text-sm">
                                                            {item.error ||
                                                                typedErrors[`details.${index}.quantity`] ||
                                                                typedErrors[`details.${index}.item_id`]}
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                        </React.Fragment>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                        {typedErrors.details && (
                            <span className="text-red-500 text-sm block mt-2">{typedErrors.details}</span>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            className=""
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing || items.length === 0}
                            className=""
                        >
                            {data.type === 'in' ? 'Buat Penerimaan' : 'Buat Pengeluaran'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
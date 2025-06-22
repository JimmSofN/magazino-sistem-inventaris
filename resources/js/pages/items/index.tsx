import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Eye, CheckCircle2, XCircle, Search, ChevronRight, ChevronLeft } from 'lucide-react';
import { Link, Head, router } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import AppLayout from '@/layouts/app-layout';

interface Item {
    id: number;
    name: string;
    description: string | null;
    item_code: string;
    stock: number;
    min_stock: number;
    price: number;
    unit: string;
    category_id: number;
    category: {
        id: number;
        name: string;
    };
}

interface Category {
    id: number;
    name: string;
}

interface Props {
    items: {
        data: Item[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
    };
    categories: Category[];
    filters: {
        search: string;
        filter: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Barang',
        href: '/barang',
    },
];

export default function Items({ items, categories, filters, flash }: Props) {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [searchTerm, setSearchTerm] = useState(filters.search);
    const [categoryFilter, setCategoryFilter] = useState(filters.filter || 'all');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

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

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const debouncedSearch = debounce((term: string, filter: string) => {
        router.get(
            route('barang.index'),
            { search: term, filter: filter || 'all' },
            { preserveState: true, preserveScroll: true }
        );
    }, 300);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        debouncedSearch(searchTerm, categoryFilter);
    };

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        debouncedSearch(e.target.value, categoryFilter);
    };

    const handleFilterChange = (categoryId: string) => {
        setCategoryFilter(categoryId);
        debouncedSearch(searchTerm, categoryId);
    };

    const handlePageChange = (page: number) => {
        if (page < 1 || page > items.last_page) return;
        router.get(
            route('barang.index'),
            { page, search: searchTerm, filter: categoryFilter || 'all' },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleEdit = (id: number) => {
        router.get(route('barang.edit', id));
    };

    const handleView = (id: number) => {
        router.get(route('barang.show', id));
    };

    const handleDelete = (item: Item) => {
        setItemToDelete(item);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            router.delete(route('barang.destroy', itemToDelete.id), {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setItemToDelete(null);
                },
                onError: () => {
                    setIsDeleteDialogOpen(false);
                    setItemToDelete(null);
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Barang" />

            <div className="container mx-auto py-6 px-4">
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

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Daftar Barang</h1>
                        <p className="text-muted-foreground">Kelola data barang Anda</p>
                    </div>
                    <Link href={route('barang.create')}>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Tambah Barang
                        </Button>
                    </Link>
                </div>

                {/* Search and Filter Section */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <form onSubmit={handleSearch} className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari barang..."
                            value={searchTerm}
                            onChange={handleSearchInputChange}
                            className="pl-10"
                            aria-label="Cari barang berdasarkan nama atau deskripsi"
                        />
                    </form>
                    <Select value={categoryFilter} onValueChange={handleFilterChange}>
                        <SelectTrigger className="w-full md:w-[200px]" aria-label="Filter berdasarkan kategori">
                            <SelectValue placeholder="Filter kategori" />
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

                {/* Items Table */}
                <div className="border rounded-lg overflow-hidden">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium">Kode Barang</th>
                                    <th className="px-4 py-3 text-left font-medium">Nama Barang</th>
                                    <th className="px-4 py-3 text-left font-medium">Kategori</th>
                                    <th className="px-4 py-3 text-left font-medium">Stok</th>
                                    <th className="px-4 py-3 text-left font-medium">Unit</th>
                                    <th className="px-4 py-3 text-left font-medium">Harga</th>
                                    <th className="px-4 py-3 text-right font-medium">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {items.data.length > 0 ? (
                                    items.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-muted/50">
                                            <td className="px-4 py-3 font-bold">{item.item_code}</td>
                                            <td className="px-4 py-3 font-medium">{item.name}</td>
                                            <td className="px-4 py-3">{item.category.name}</td>
                                            <td className="px-4 py-3">{item.stock}</td>
                                            <td className="px-4 py-3">{item.unit}</td>
                                            <td className="px-4 py-3">
                                                {new Intl.NumberFormat('id-ID', {
                                                    style: 'currency',
                                                    currency: 'IDR',
                                                    minimumFractionDigits: 0,
                                                }).format(item.price)}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleView(item.id)}
                                                        title="Lihat"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleEdit(item.id)}
                                                        title="Edit"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(item)}
                                                        title="Hapus"
                                                        className="text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                                            {searchTerm || categoryFilter !== 'all'
                                                ? 'Tidak ada barang yang cocok dengan pencarian atau filter'
                                                : 'Tidak ada data barang'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Delete Confirmation Dialog */}
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Konfirmasi Hapus Barang</DialogTitle>
                            <DialogDescription>
                                Apakah Anda yakin ingin menghapus barang "{itemToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Batal</Button>
                            </DialogClose>
                            <Button
                                variant="destructive"
                                onClick={confirmDelete}
                            >
                                Hapus
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Pagination */}
                {items.total > items.per_page && (
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
                        <div className="text-sm text-muted-foreground">
                            Menampilkan {items.from || 0} sampai {items.to || 0} dari {items.total} data
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(items.current_page - 1)}
                                disabled={items.current_page === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: items.last_page }, (_, i) => i + 1).map((page) => (
                                    <Button
                                        key={page}
                                        variant={page === items.current_page ? 'default' : 'outline'}
                                        size="icon"
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </Button>
                                ))}
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(items.current_page + 1)}
                                disabled={items.current_page === items.last_page}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
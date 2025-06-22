import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { type BreadcrumbItem } from '@/types';
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { Head, useForm } from '@inertiajs/react';
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
    categories: Category[];
    item: Item;
}

const units: { value: string; label: string }[] = [
    { value: "piece", label: "Piece" },
    { value: "kg", label: "Kilogram (kg)" },
    { value: "g", label: "Gram (g)" },
    { value: "l", label: "Liter (l)" },
    { value: "ml", label: "Milliliter (ml)" },
    { value: "box", label: "Box" },
    { value: "pack", label: "Pack" },
    { value: "cup", label: "Cup" },
];

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Barang',
        href: '/barang',
    },
    {
        title: 'Edit',
        href: '/edit',
    },
];

export default function EditItems({ categories, item }: Props) {
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [unitOpen, setUnitOpen] = useState(false);

    const { data, setData, put, processing, errors, setError, clearErrors } = useForm({
        name: item.name,
        item_code: item.item_code,
        description: item.description ?? '',
        stock: item.stock,
        min_stock: item.min_stock,
        price: item.price,
        unit: item.unit,
        category_id: item.category.id,
    });

    const validateForm = () => {
        clearErrors();
        let isValid = true;

        if (!data.name) {
            setError('name', 'Nama barang harus diisi');
            isValid = false;
        } else if (data.name.length > 100) {
            setError('name', 'Nama barang tidak boleh lebih dari 100 karakter');
            isValid = false;
        }

        if (!data.category_id) {
            setError('category_id', 'Kategori harus dipilih');
            isValid = false;
        }

        if (!data.unit) {
            setError('unit', 'Unit harus dipilih');
            isValid = false;
        }

        if (data.price <= 0) {
            setError('price', 'Harga harus lebih dari 0');
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validateForm()) {
            put(route('barang.update', item.id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${item.name}`} />

            <form onSubmit={handleSubmit} className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid gap-6">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight">Edit Barang</h2>
                        <p className="text-muted-foreground">Edit Keterangan Barang</p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="item_code">Kode Barang</Label>
                        <Input
                            id="item_code"
                            value={data.item_code}
                            readOnly
                            className="bg-muted"
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nama Barang</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                maxLength={100}
                            />
                            {errors.name && (
                                <div className="text-red-500 text-sm">{errors.name}</div>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="stock">Stok Tersedia</Label>
                            <Input
                                id="stock"
                                type="number"
                                min="0"
                                value={data.stock}
                                onChange={(e) => setData('stock', Number(e.target.value))}
                            />
                            {errors.stock && (
                                <div className="text-red-500 text-sm">{errors.stock}</div>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="category_id">Kategori</Label>
                        <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" role="combobox" aria-expanded={categoryOpen} className="justify-between w-full">
                                    {data.category_id
                                        ? categories.find((c) => c.id === data.category_id)?.name
                                        : "Pilih Kategori"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput placeholder="Cari Kategori..." />
                                    <CommandList>
                                        <CommandEmpty>Kategori Tidak Ditemukan</CommandEmpty>
                                        <CommandGroup>
                                            {categories.map((category) => (
                                                <CommandItem
                                                    key={category.id}
                                                    value={category.name}
                                                    onSelect={() => {
                                                        setData('category_id', category.id);
                                                        setCategoryOpen(false);
                                                    }}
                                                >
                                                    <Check className={cn("mr-2 h-4 w-4", data.category_id === category.id ? "opacity-100" : "opacity-0")} />
                                                    {category.name}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        {errors.category_id && (
                            <div className="text-red-500 text-sm">{errors.category_id}</div>
                        )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="min_stock">Stok Minimum</Label>
                            <Input
                                id="min_stock"
                                type="number"
                                min="0"
                                value={data.min_stock}
                                onChange={(e) => setData('min_stock', Number(e.target.value))}
                                placeholder="Masukkan Stok Minimum"
                            />
                            {errors.min_stock && (
                                <div className="text-red-500 text-sm">{errors.min_stock}</div>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="price">Harga</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2">Rp</span>
                                <Input
                                    id="price"
                                    type="number"
                                    min="0"
                                    value={data.price}
                                    onChange={(e) => setData('price', Number(e.target.value))}
                                    placeholder="0"
                                    className="pl-8"
                                />
                            </div>
                            {errors.price && (
                                <div className="text-red-500 text-sm">{errors.price}</div>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="unit">Unit</Label>
                        <Popover open={unitOpen} onOpenChange={setUnitOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" role="combobox" aria-expanded={unitOpen} className="justify-between w-full">
                                    {data.unit
                                        ? units.find((u) => u.value === data.unit)?.label
                                        : "Pilih Unit..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput placeholder="Cari Unit..." />
                                    <CommandList>
                                        <CommandEmpty>Unit Tidak Ditemukan.</CommandEmpty>
                                        <CommandGroup>
                                            {units.map((unit) => (
                                                <CommandItem
                                                    key={unit.value}
                                                    value={unit.value}
                                                    onSelect={() => {
                                                        setData('unit', unit.value);
                                                        setUnitOpen(false);
                                                    }}
                                                >
                                                    <Check className={cn("mr-2 h-4 w-4", data.unit === unit.value ? "opacity-100" : "opacity-0")} />
                                                    {unit.label}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        {errors.unit && (
                            <div className="text-red-500 text-sm">{errors.unit}</div>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Deskripsi</Label>
                        <Textarea
                            id="description"
                            placeholder="Tulis deskripsi barang di sini (Jika di perlukan)..."
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="min-h ,[120px] resize-none"
                        />
                        {errors.description && (
                            <div className="text-red-500 text-sm">{errors.description}</div>
                        )}
                    </div>

                    <Button type="submit" className="w-full sm:w-auto" disabled={processing}>
                        {processing ? "Menyimpan..." : "Simpan Perubahan"}
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
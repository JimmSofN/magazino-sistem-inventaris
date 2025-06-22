import { useState } from 'react';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { type BreadcrumbItem } from '@/types';
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react"
import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface Category {
    id: number;
    name: string;
}

interface Props {
    categories: Category[];
}

const units = [
    { value: "piece", label: "Piece" },
    { value: "kg", label: "Kilogram (kg)" },
    { value: "g", label: "Gram (g)" },
    { value: "l", label: "Liter (l)" },
    { value: "ml", label: "Milliliter (ml)" },
    { value: "box", label: "Box" },
    { value: "pack", label: "Pack" },
    { value: "cup", label: "Cup" },
]

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
        title: 'Buat',
        href: '/buat',
    },
];

export default function CreateItems({ categories }: Props) {
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [unitOpen, setUnitOpen] = useState(false);
    const [errors, setErrors] = useState({
        category: '',
        unit: '',
        price: '',
    });

    const { data, setData, post, processing, reset } = useForm({
        name: '',
        item_code: '',
        description: '',
        stock: 0,
        min_stock: 0,
        price: 0,
        unit: '',
        category_id: 0,
    });

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            category: '',
            unit: '',
            price: '',
        };

        if (data.category_id === 0) {
            newErrors.category = 'Kategori harus dipilih';
            isValid = false;
        }

        if (!data.unit) {
            newErrors.unit = 'Unit harus dipilih';
            isValid = false;
        }

        if (data.price <= 0) {
            newErrors.price = 'Harga harus tersedia';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validateForm()) {
            post(route('barang.store'), {
                onSuccess: () => {
                    reset();
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat" />

            <form onSubmit={handleSubmit} className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid gap-6">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight">Tambahkan Barang</h2>
                        <p className="text-muted-foreground">Tambahkan Barang Di Sini Dengan Lengkap</p>
                    </div>


                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nama Barang</Label>
                            <Input
                                id="name"
                                placeholder="Masukkan Nama Barang"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="stock">Stok Tersedia</Label>
                            <Input
                                id="stock"
                                type="number"
                                min="0"
                                value={data.stock}
                                onChange={(e) => setData('stock', Number(e.target.value))}
                                placeholder="Masukkan Stok Saat Ini"
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="category_id">Kategori</Label>
                        <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={categoryOpen}
                                    className="justify-between w-full"
                                    aria-required="true"
                                >
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
                                                        setErrors(prev => ({ ...prev, category: '' }));
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
                        {errors.category && (
                            <div className="text-red-500 text-sm">{errors.category}</div>
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
                                placeholder="Masukkan stok minimum"
                                required
                            />
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
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        if (value >= 0) {
                                            setData('price', value);
                                        }
                                    }}

                                    placeholder="0"
                                    className="pl-8"
                                    required
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
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={unitOpen}
                                    className="justify-between w-full"
                                    aria-required="true"
                                >
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
                                                        setErrors(prev => ({ ...prev, unit: '' }));
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
                            className="min-h-[120px] resize-none"
                        />
                    </div>

                    <Button type="submit" className="w-full sm:w-auto" disabled={processing}>
                        {processing ? "Menyimpan..." : "Buat Barang"}
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
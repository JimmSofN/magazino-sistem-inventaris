import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";

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
        title: 'Detail Barang',
        href: '#'
    },
];

interface Item {
    id: number;
    item_code: string;
    name: string;
    description: string | null;
    stock: number;
    min_stock: number;
    price: number;
    unit: string;
    category: {
        id: number;
        name: string;
    };
}

interface Props {
    item: Item;
}

export default function ItemsDetailsCard({ item }: Props) {
    const formattedPrice = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(item.price);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid gap-6">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight">Detail Barang</h2>
                        <p className="text-muted-foreground">Informasi lengkap barang</p>
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle>Detail Barang</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="item_code">Kode Barang</Label>
                                    <p id="item_code" className="rounded-md border bg-muted px-3 py-2 text-sm">
                                        {item.item_code}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Barang</Label>
                                    <p id="name" className="rounded-md border bg-muted px-3 py-2 text-sm">
                                        {item.name}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Kategori</Label>
                                    <p id="category" className="rounded-md border bg-muted px-3 py-2 text-sm">
                                        {item.category.name}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="unit">Unit</Label>
                                    <p id="unit" className="rounded-md border bg-muted px-3 py-2 text-sm">
                                        {item.unit}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="stock">Stok</Label>
                                    <p id="stock" className="rounded-md border bg-muted px-3 py-2 text-sm">
                                        {item.stock}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="min_stock">Stok Minimum</Label>
                                    <p id="min_stock" className="rounded-md border bg-muted px-3 py-2 text-sm">
                                        {item.min_stock}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="price">Harga</Label>
                                    <p id="price" className="rounded-md border bg-muted px-3 py-2 text-sm">
                                        {formattedPrice}
                                    </p>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="description">Deskripsi</Label>
                                    <div
                                        id="description"
                                        className="rounded-md border bg-muted px-3 py-2 text-sm min-h-[80px] whitespace-pre-wrap"
                                    >
                                        {item.description}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>

    );
}
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Props {
    itemsCount: number;
    username: string;
}

export default function Dashboard({ itemsCount, username }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Welcome message - spans full width on mobile, first column on larger screens */}
                <div className="col-span-full md:col-span-3">
                    <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                        Selamat datang kembali <span className="text-primary">{username}</span>
                    </h1>
                </div>

                {/* Card with yellow badge - spans full width on mobile, first column on larger screens */}
                <div className="col-span-full md:col-span-1">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Barang Tersedia</CardTitle>
                            <Badge className="bg-yellow-500 hover:bg-yellow-600">{itemsCount}</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{itemsCount} Barang</div>
                            <p className="text-xs text-muted-foreground">Di Inventori Gudang</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
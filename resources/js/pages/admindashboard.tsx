import { Head } from "@inertiajs/react";
import { ArrowDownIcon, ArrowUpIcon, Package2Icon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";

interface TransactionData {
    totalIn: number;
    totalOut: number;
    totalItems: number;
}

interface Props {
    transactionData: TransactionData;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Dashboard",
        href: "/admindashboard",
    },
];

export default function Admindashboard({ transactionData }: Props) {
    console.log('Admindashboard Props:', { transactionData });

    const formatCurrency = (amount: number) => {
        return `Rp. ${amount.toLocaleString("id-ID")}`;
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Transaksi Masuk</CardTitle>
                            <ArrowDownIcon className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(transactionData.totalIn)}</div>
                            <div className="flex items-center space-x-2">
                                <Badge
                                    variant="outline"
                                    className="bg-green-50 text-green-700 hover:bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/20"
                                >
                                    Masuk
                                </Badge>
                            </div>
                        </CardContent>
                        <CardDescription className="p-2">Total keseluruhan</CardDescription>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Transaksi Keluar</CardTitle>
                            <ArrowUpIcon className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(transactionData.totalOut)}</div>
                            <div className="flex items-center space-x-2">
                                <Badge
                                    variant="outline"
                                    className="bg-red-50 text-red-700 hover:bg-red-50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/20"
                                >
                                    Keluar
                                </Badge>
                            </div>
                        </CardContent>
                        <CardDescription className="p-2">Total keseluruhan</CardDescription>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Barang</CardTitle>
                            <Package2Icon className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{transactionData.totalItems}</div>
                            <div className="flex items-center space-x-2">
                                <Badge
                                    variant="outline"
                                    className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400 dark:hover:bg-yellow-900/20"
                                >
                                    Jumlah Barang Saat Ini
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
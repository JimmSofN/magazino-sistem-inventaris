import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface Props {
    users: User[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Dashboard",
        href: "/admindashboard",
    },
    {
        title: "Pengguna",
        href: "/pengguna",
    },
];

export default function UserList({ users }: Props) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengguna" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h2 className="text-2xl font-bold tracking-tight">Daftar Pengguna</h2>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex-1 overflow-hidden rounded-xl border">
                    <div className="p-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.length > 0 ? (
                                    users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        user.role === "admin"
                                                            ? "bg-blue-50 text-blue-700 hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400"
                                                            : "bg-gray-50 text-gray-700 hover:bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400"
                                                    }
                                                >
                                                    {user.role}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                                            Tidak ada pengguna terdaftar
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
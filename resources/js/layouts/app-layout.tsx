import { usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import UserLayout from '@/layouts/user-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({ children, breadcrumbs = [], ...props }: AppLayoutProps) {
    const { auth } = usePage().props as unknown as { auth: { user: { is_admin: boolean } | null } };
    const Layout = auth.user?.is_admin ? AdminLayout : UserLayout;

    return (
        <Layout breadcrumbs={breadcrumbs} {...props}>
            {children}
        </Layout>
    );
}
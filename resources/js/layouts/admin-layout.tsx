import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AdminLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AdminLayout({ children, breadcrumbs = [], ...props }: AdminLayoutProps) {
    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs} {...props}>
            {children}
        </AppSidebarLayout>
    );
}
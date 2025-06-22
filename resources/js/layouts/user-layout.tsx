import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface UserLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function UserLayout({ children, breadcrumbs = [], ...props }: UserLayoutProps) {
    return (
        <AppHeaderLayout breadcrumbs={breadcrumbs} {...props}>
            {children}
        </AppHeaderLayout>
    );
}
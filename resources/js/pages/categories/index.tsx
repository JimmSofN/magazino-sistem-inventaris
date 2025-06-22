import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useForm } from "@inertiajs/react";
import AppLayout from '@/layouts/app-layout';

interface Category {
    id: number;
    name: string;
}

interface Props {
    categories: Category[];
    flash?: {
        'success'?: string;
        'error'?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Kategori',
        href: '/kategori',
    },
];

export default function Categories({ categories, flash }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

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

    const { data, setData, post, put, processing, reset, delete: destroy } = useForm({
        name: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editingCategory) {
            put(route('kategori.update', editingCategory.id), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                    setEditingCategory(null);
                }
            });
        } else {
            post(route('kategori.store'), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                }
            });
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setData({
            name: category.name
        });
        setIsOpen(true);
    }

    const handleDelete = (categoryId: number) => (
        destroy(route('kategori.destroy', categoryId))
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kategori" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
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

                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Kategori</h1>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Kategori Baru
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    {editingCategory ? 'Edit Kategori' : 'Buat Kategori Baru'}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" disabled={processing}>
                                    {editingCategory ? 'Perbaharui' : 'Buat'}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                        <Card key={category.id} className="hover:bg-accent/50 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg font-medium">{category.name}</CardTitle>
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEdit(category)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(category.id)}
                                        className="text-destructive hover:text-destructive/90"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>

                        </Card>
                    ))}
                </div>
            </div>

        </AppLayout>
    );
}

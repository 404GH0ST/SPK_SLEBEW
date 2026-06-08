import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Plus, Pencil, Trash2, ShieldAlert, Check, X } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';

interface Criterion {
    id: number;
    code: string;
    name: string;
    type: 'benefit' | 'cost';
    unit: string | null;
    description: string | null;
    is_active: boolean;
}

interface IndexProps {
    criteria: Criterion[];
}

export default function Index({ criteria }: IndexProps) {
    const user = usePage().props.auth.user as any;
    const isAdmin = user.role === 'admin';

    const [isOpen, setIsOpen] = useState(false);
    const [editingCriterion, setEditingCriterion] = useState<Criterion | null>(null);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        code: '',
        name: '',
        type: 'benefit' as 'benefit' | 'cost',
        unit: '',
        description: '',
        is_active: true,
    });

    const handleOpenAdd = () => {
        reset();
        clearErrors();
        setEditingCriterion(null);
        setIsOpen(true);
    };

    const handleOpenEdit = (criterion: Criterion) => {
        clearErrors();
        setEditingCriterion(criterion);
        setData({
            code: criterion.code,
            name: criterion.name,
            type: criterion.type,
            unit: criterion.unit || '',
            description: criterion.description || '',
            is_active: criterion.is_active,
        });
        setIsOpen(true);
    };

    const handleOpenDelete = (id: number) => {
        setDeletingId(id);
        setIsConfirmDeleteOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCriterion) {
            put(route('criteria.update', editingCriterion.id), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        } else {
            post(route('criteria.store'), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (deletingId) {
            destroy(route('criteria.destroy', deletingId), {
                onSuccess: () => {
                    setIsConfirmDeleteOpen(false);
                    setDeletingId(null);
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight text-coop-text font-sans">
                        Data Kriteria Penilaian
                    </h2>
                    {isAdmin && (
                        <Button 
                            onClick={handleOpenAdd}
                            className="bg-coop-gold hover:bg-coop-gold-hover text-coop-bg gap-2 rounded-md transition duration-300 font-semibold border border-[#aa7f31] "
                        >
                            <Plus className="h-4 w-4" /> Tambah Kriteria
                        </Button>
                    )}
                </div>
            }
        >
            <Head title="Kriteria Penilaian" />

            <div className="space-y-6 pb-6">
                {/* Intro Card */}
                <div className="rounded bg-coop-card border border-coop-border p-5 ">
                    <h3 className="text-base font-bold text-coop-text flex items-center gap-2">
                        <span className="p-1 rounded bg-coop-teal/10 text-coop-teal border border-coop-teal/30">
                            <ShieldAlert className="h-4 w-4" />
                        </span>
                        Panduan Penggunaan Kriteria
                    </h3>
                    <p className="text-coop-muted-light text-sm mt-2.5 leading-relaxed">
                        Kriteria di bawah ini merupakan acuan penilaian nasabah.
                        Tipe <strong className="text-coop-teal font-semibold">Benefit</strong> berarti semakin besar nilainya semakin baik (misalnya Penghasilan). 
                        Tipe <strong className="text-coop-blue font-semibold">Cost</strong> berarti semakin kecil nilainya semakin baik (misalnya Jumlah Pinjaman).
                    </p>
                </div>

                {/* Criteria Table Card */}
                <div className="rounded bg-coop-card border border-coop-border ">
                    <div className="p-5">
                        <div className="overflow-x-auto rounded border border-coop-border bg-coop-bg">
                            <Table>
                                <TableHeader className="bg-coop-card">
                                    <TableRow className="border-coop-border hover:bg-transparent">
                                        <TableHead className="w-24 text-xs font-bold uppercase tracking-wider text-coop-muted-light py-3">Kode</TableHead>
                                        <TableHead className="text-xs font-bold uppercase tracking-wider text-coop-muted-light py-3">Nama Kriteria</TableHead>
                                        <TableHead className="text-xs font-bold uppercase tracking-wider text-coop-muted-light py-3">Tipe</TableHead>
                                        <TableHead className="text-xs font-bold uppercase tracking-wider text-coop-muted-light py-3">Satuan</TableHead>
                                        <TableHead className="text-xs font-bold uppercase tracking-wider text-coop-muted-light py-3">Keterangan</TableHead>
                                        <TableHead className="text-center text-xs font-bold uppercase tracking-wider text-coop-muted-light py-3">Status</TableHead>
                                        {isAdmin && <TableHead className="text-right text-xs font-bold uppercase tracking-wider text-coop-muted-light py-3 pr-6">Aksi</TableHead>}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {criteria.length === 0 ? (
                                        <TableRow className="border-coop-border">
                                            <TableCell colSpan={isAdmin ? 7 : 6} className="text-center py-12 text-coop-muted-dark text-sm">
                                                Belum ada data kriteria.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        criteria.map((item) => (
                                            <TableRow key={item.id} className="border-coop-border hover:bg-coop-highlight/40 transition-colors">
                                                <TableCell className="font-bold font-mono text-coop-teal py-2.5">{item.code}</TableCell>
                                                <TableCell className="text-coop-text font-semibold text-sm py-2.5">{item.name}</TableCell>
                                                <TableCell className="py-2.5">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border ${
                                                        item.type === 'benefit' 
                                                            ? 'bg-coop-teal/10 text-coop-teal border-coop-teal/35' 
                                                            : 'bg-coop-highlight text-coop-blue border-coop-blue/30'
                                                    }`}>
                                                        {item.type.toUpperCase()}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-coop-muted-light text-sm py-2.5">{item.unit || '-'}</TableCell>
                                                <TableCell className="text-coop-muted-light text-xs max-w-xs truncate py-2.5" title={item.description || ''}>
                                                    {item.description || '-'}
                                                </TableCell>
                                                <TableCell className="text-center py-2.5">
                                                    {item.is_active ? (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border bg-coop-teal/10 text-coop-teal border-coop-teal/35">Aktif</span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border bg-coop-bg/40 text-coop-muted-light border-coop-border">Nonaktif</span>
                                                    )}
                                                </TableCell>
                                                {isAdmin && (
                                                    <TableCell className="text-right py-2.5 pr-6 space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => handleOpenEdit(item)}
                                                            className="h-10 w-10 border-coop-border bg-coop-card hover:bg-coop-highlight text-coop-muted-light hover:text-coop-text rounded-md transition inline-flex items-center justify-center"
                                                            aria-label={`Ubah kriteria ${item.name}`}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => handleOpenDelete(item.id)}
                                                            className="h-10 w-10 border-coop-border bg-coop-card hover:bg-rose-950/30 hover:border-rose-900/50 text-rose-400 rounded-md transition inline-flex items-center justify-center"
                                                            aria-label={`Hapus kriteria ${item.name}`}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add / Edit Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="bg-coop-card border border-coop-border text-coop-text max-w-md rounded  p-6">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-coop-text">
                            {editingCriterion ? 'Ubah Kriteria' : 'Tambah Kriteria Baru'}
                        </DialogTitle>
                        <DialogDescription className="text-coop-muted-light text-xs">
                            Silakan isi form di bawah ini untuk menyimpan data kriteria.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="code" className="text-coop-muted-light text-[10px] font-bold uppercase tracking-wider">Kode Kriteria</Label>
                            <Input
                                id="code"
                                value={data.code}
                                onChange={e => setData('code', e.target.value)}
                                placeholder="Contoh: K1"
                                className="bg-coop-bg border-coop-border text-coop-text placeholder-[#8294aa] focus-visible:ring-coop-gold/15 focus-visible:ring-2 focus-visible:border-coop-gold rounded-md transition duration-200"
                                required
                            />
                            {errors.code && <p className="text-rose-500 text-[10px] mt-1">{errors.code}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-coop-muted-light text-[10px] font-bold uppercase tracking-wider">Nama Kriteria</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="Contoh: Jumlah Pinjaman"
                                className="bg-coop-bg border-coop-border text-coop-text placeholder-[#8294aa] focus-visible:ring-coop-gold/15 focus-visible:ring-2 focus-visible:border-coop-gold rounded-md transition duration-200"
                                required
                            />
                            {errors.name && <p className="text-rose-500 text-[10px] mt-1">{errors.name}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="type" className="text-coop-muted-light text-[10px] font-bold uppercase tracking-wider">Tipe</Label>
                                <select
                                    id="type"
                                    value={data.type}
                                    onChange={e => setData('type', e.target.value as 'benefit' | 'cost')}
                                    className="w-full h-10 px-3 rounded-md border border-coop-border bg-coop-bg text-coop-text text-sm focus:outline-none focus:ring-2 focus:ring-coop-gold/10 focus:border-coop-gold transition duration-200"
                                >
                                    <option value="benefit" className="bg-coop-bg">Benefit</option>
                                    <option value="cost" className="bg-coop-bg">Cost</option>
                                </select>
                                {errors.type && <p className="text-rose-500 text-[10px] mt-1">{errors.type}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="unit" className="text-coop-muted-light text-[10px] font-bold uppercase tracking-wider">Satuan</Label>
                                <Input
                                    id="unit"
                                    value={data.unit}
                                    onChange={e => setData('unit', e.target.value)}
                                    placeholder="Contoh: Rupiah, Bulan"
                                    className="bg-coop-bg border-coop-border text-coop-text placeholder-[#8294aa] focus-visible:ring-coop-gold/15 focus-visible:ring-2 focus-visible:border-coop-gold rounded-md transition duration-200"
                                />
                                {errors.unit && <p className="text-rose-500 text-[10px] mt-1">{errors.unit}</p>}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="description" className="text-coop-muted-light text-[10px] font-bold uppercase tracking-wider">Deskripsi</Label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                placeholder="Penjelasan mengenai kriteria..."
                                className="w-full min-h-16 p-3 rounded-md border border-coop-border bg-coop-bg text-coop-text text-sm placeholder-[#8294aa] focus:outline-none focus:ring-2 focus:ring-coop-gold/10 focus:border-coop-gold transition duration-200"
                            />
                            {errors.description && <p className="text-rose-500 text-[10px] mt-1">{errors.description}</p>}
                        </div>

                        <div className="flex items-center gap-3 pt-1">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={data.is_active}
                                onChange={e => setData('is_active', e.target.checked)}
                                className="h-4 w-4 rounded border-coop-border bg-coop-bg text-coop-gold focus:ring-coop-gold focus:ring-offset-coop-bg"
                            />
                            <Label htmlFor="is_active" className="text-coop-muted-light text-xs font-semibold select-none cursor-pointer">
                                Aktifkan kriteria ini untuk perhitungan SPK
                            </Label>
                            {errors.is_active && <p className="text-rose-500 text-[10px] mt-1">{errors.is_active}</p>}
                        </div>

                        <DialogFooter className="pt-3 gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                                className="border-coop-border bg-coop-card hover:bg-coop-highlight text-coop-muted-light rounded-md"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-coop-gold hover:bg-coop-gold-hover text-coop-bg rounded-md font-semibold transition  border border-[#aa7f31]"
                            >
                                Simpan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Confirm Delete Dialog */}
            <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
                <DialogContent className="bg-coop-card border border-coop-border text-coop-text max-w-sm rounded  p-6">
                    <DialogHeader>
                        <DialogTitle className="text-coop-text flex items-center gap-2 text-base font-bold">
                            <ShieldAlert className="h-4 w-4 text-rose-500" /> Hapus Kriteria?
                        </DialogTitle>
                        <DialogDescription className="text-coop-muted-light text-xs pt-1 leading-relaxed">
                            Tindakan ini tidak dapat dibatalkan. Menghapus kriteria akan menghapus semua data bobot SWARA dan nilai penilaian nasabah terkait!
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="pt-3 gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsConfirmDeleteOpen(false)}
                            className="border-coop-border bg-coop-card hover:bg-coop-highlight text-coop-muted-light rounded-md"
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            onClick={handleDelete}
                            disabled={processing}
                            className="bg-rose-600 hover:bg-rose-500 text-white rounded-md  border border-rose-700"
                        >
                            Ya, Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}

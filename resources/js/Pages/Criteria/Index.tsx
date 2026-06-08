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
                    <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
                        Data Kriteria Penilaian
                    </h2>
                    {isAdmin && (
                        <Button 
                            onClick={handleOpenAdd}
                            className="bg-[#d6b45f] hover:bg-[#f2d98a] text-[#0b1020] gap-2 rounded-md transition duration-300 font-semibold border border-[#aa7f31] "
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
                <div className="rounded-lg bg-[#111827] border border-[#4f657a] p-5 ">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <span className="p-1 rounded-md bg-[#123b38] text-[#64d8c1] border border-[#64d8c1]/30">
                            <ShieldAlert className="h-4 w-4" />
                        </span>
                        Panduan Penggunaan Kriteria
                    </h3>
                    <p className="text-[#b2bfca] text-sm mt-2.5 leading-relaxed">
                        Kriteria di bawah ini merupakan acuan penilaian nasabah.
                        Tipe <strong className="text-[#64d8c1] font-semibold">Benefit</strong> berarti semakin besar nilainya semakin baik (misalnya Penghasilan). 
                        Tipe <strong className="text-rose-400 font-semibold">Cost</strong> berarti semakin kecil nilainya semakin baik (misalnya Jumlah Pinjaman).
                    </p>
                </div>

                {/* Criteria Table Card */}
                <div className="rounded-lg bg-[#111827] border border-[#4f657a] ">
                    <div className="p-5">
                        <div className="overflow-x-auto rounded-md border border-[#4f657a] bg-[#0b1020]">
                            <Table>
                                <TableHeader className="bg-[#111827]">
                                    <TableRow className="border-[#4f657a] hover:bg-transparent">
                                        <TableHead className="w-24 text-xs font-bold uppercase tracking-wider text-[#b2bfca] py-3">Kode</TableHead>
                                        <TableHead className="text-xs font-bold uppercase tracking-wider text-[#b2bfca] py-3">Nama Kriteria</TableHead>
                                        <TableHead className="text-xs font-bold uppercase tracking-wider text-[#b2bfca] py-3">Tipe</TableHead>
                                        <TableHead className="text-xs font-bold uppercase tracking-wider text-[#b2bfca] py-3">Satuan</TableHead>
                                        <TableHead className="text-xs font-bold uppercase tracking-wider text-[#b2bfca] py-3">Keterangan</TableHead>
                                        <TableHead className="text-center text-xs font-bold uppercase tracking-wider text-[#b2bfca] py-3">Status</TableHead>
                                        {isAdmin && <TableHead className="text-right text-xs font-bold uppercase tracking-wider text-[#b2bfca] py-3 pr-6">Aksi</TableHead>}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {criteria.length === 0 ? (
                                        <TableRow className="border-[#4f657a]">
                                            <TableCell colSpan={isAdmin ? 7 : 6} className="text-center py-12 text-[#8294aa] text-sm">
                                                Belum ada data kriteria.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        criteria.map((item) => (
                                            <TableRow key={item.id} className="border-[#4f657a] hover:bg-[#152133]/40 transition-colors">
                                                <TableCell className="font-bold font-mono text-[#64d8c1] py-2.5">{item.code}</TableCell>
                                                <TableCell className="text-slate-100 font-semibold text-sm py-2.5">{item.name}</TableCell>
                                                <TableCell className="py-2.5">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border ${
                                                        item.type === 'benefit' 
                                                            ? 'bg-[#123b38] text-[#64d8c1] border-[#64d8c1]/35' 
                                                            : 'bg-rose-950/20 text-rose-400 border-rose-900/50'
                                                    }`}>
                                                        {item.type.toUpperCase()}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-[#b2bfca] text-sm py-2.5">{item.unit || '-'}</TableCell>
                                                <TableCell className="text-[#b2bfca] text-xs max-w-xs truncate py-2.5" title={item.description || ''}>
                                                    {item.description || '-'}
                                                </TableCell>
                                                <TableCell className="text-center py-2.5">
                                                    {item.is_active ? (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border bg-[#123b38] text-[#64d8c1] border-[#64d8c1]/35">Aktif</span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border bg-[#0b1020]/40 text-[#b2bfca] border-[#4f657a]">Nonaktif</span>
                                                    )}
                                                </TableCell>
                                                {isAdmin && (
                                                    <TableCell className="text-right py-2.5 pr-6 space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => handleOpenEdit(item)}
                                                            className="h-8 w-8 border-[#4f657a] bg-[#111827] hover:bg-[#152133] text-[#b2bfca] hover:text-white rounded-md transition"
                                                        >
                                                            <Pencil className="h-3.5 w-3.5" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => handleOpenDelete(item.id)}
                                                            className="h-8 w-8 border-[#4f657a] bg-[#111827] hover:bg-rose-950/30 hover:border-rose-900/50 text-rose-400 rounded-md transition"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
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
                <DialogContent className="bg-[#111827] border border-[#4f657a] text-slate-100 max-w-md rounded-lg  p-6">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-white">
                            {editingCriterion ? 'Ubah Kriteria' : 'Tambah Kriteria Baru'}
                        </DialogTitle>
                        <DialogDescription className="text-[#b2bfca] text-xs">
                            Silakan isi form di bawah ini untuk menyimpan data kriteria.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="code" className="text-[#b2bfca] text-[10px] font-bold uppercase tracking-wider">Kode Kriteria</Label>
                            <Input
                                id="code"
                                value={data.code}
                                onChange={e => setData('code', e.target.value)}
                                placeholder="Contoh: K1"
                                className="bg-[#0b1020] border-[#4f657a] text-slate-100 placeholder-[#8294aa] focus-visible:ring-[#d6b45f]/15 focus-visible:ring-2 focus-visible:border-[#d6b45f] rounded-md transition duration-200"
                                required
                            />
                            {errors.code && <p className="text-rose-500 text-[10px] mt-1">{errors.code}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-[#b2bfca] text-[10px] font-bold uppercase tracking-wider">Nama Kriteria</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="Contoh: Jumlah Pinjaman"
                                className="bg-[#0b1020] border-[#4f657a] text-slate-100 placeholder-[#8294aa] focus-visible:ring-[#d6b45f]/15 focus-visible:ring-2 focus-visible:border-[#d6b45f] rounded-md transition duration-200"
                                required
                            />
                            {errors.name && <p className="text-rose-500 text-[10px] mt-1">{errors.name}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="type" className="text-[#b2bfca] text-[10px] font-bold uppercase tracking-wider">Tipe</Label>
                                <select
                                    id="type"
                                    value={data.type}
                                    onChange={e => setData('type', e.target.value as 'benefit' | 'cost')}
                                    className="w-full h-10 px-3 rounded-md border border-[#4f657a] bg-[#0b1020] text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#d6b45f]/10 focus:border-[#d6b45f] transition duration-200"
                                >
                                    <option value="benefit" className="bg-[#0b1020]">Benefit</option>
                                    <option value="cost" className="bg-[#0b1020]">Cost</option>
                                </select>
                                {errors.type && <p className="text-rose-500 text-[10px] mt-1">{errors.type}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="unit" className="text-[#b2bfca] text-[10px] font-bold uppercase tracking-wider">Satuan</Label>
                                <Input
                                    id="unit"
                                    value={data.unit}
                                    onChange={e => setData('unit', e.target.value)}
                                    placeholder="Contoh: Rupiah, Bulan"
                                    className="bg-[#0b1020] border-[#4f657a] text-slate-100 placeholder-[#8294aa] focus-visible:ring-[#d6b45f]/15 focus-visible:ring-2 focus-visible:border-[#d6b45f] rounded-md transition duration-200"
                                />
                                {errors.unit && <p className="text-rose-500 text-[10px] mt-1">{errors.unit}</p>}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="description" className="text-[#b2bfca] text-[10px] font-bold uppercase tracking-wider">Deskripsi</Label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                placeholder="Penjelasan mengenai kriteria..."
                                className="w-full min-h-16 p-3 rounded-md border border-[#4f657a] bg-[#0b1020] text-slate-100 text-sm placeholder-[#8294aa] focus:outline-none focus:ring-2 focus:ring-[#d6b45f]/10 focus:border-[#d6b45f] transition duration-200"
                            />
                            {errors.description && <p className="text-rose-500 text-[10px] mt-1">{errors.description}</p>}
                        </div>

                        <div className="flex items-center gap-3 pt-1">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={data.is_active}
                                onChange={e => setData('is_active', e.target.checked)}
                                className="h-4 w-4 rounded border-[#4f657a] bg-[#0b1020] text-[#d6b45f] focus:ring-[#d6b45f] focus:ring-offset-[#0b1020]"
                            />
                            <Label htmlFor="is_active" className="text-[#b2bfca] text-xs font-semibold select-none cursor-pointer">
                                Aktifkan kriteria ini untuk perhitungan SPK
                            </Label>
                            {errors.is_active && <p className="text-rose-500 text-[10px] mt-1">{errors.is_active}</p>}
                        </div>

                        <DialogFooter className="pt-3 gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                                className="border-[#4f657a] bg-[#111827] hover:bg-[#152133] text-[#b2bfca] rounded-md"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-[#d6b45f] hover:bg-[#f2d98a] text-[#0b1020] rounded-md font-semibold transition  border border-[#aa7f31]"
                            >
                                Simpan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Confirm Delete Dialog */}
            <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
                <DialogContent className="bg-[#111827] border border-[#4f657a] text-slate-100 max-w-sm rounded-lg  p-6">
                    <DialogHeader>
                        <DialogTitle className="text-white flex items-center gap-2 text-base font-bold">
                            <ShieldAlert className="h-4 w-4 text-rose-500" /> Hapus Kriteria?
                        </DialogTitle>
                        <DialogDescription className="text-[#b2bfca] text-xs pt-1 leading-relaxed">
                            Tindakan ini tidak dapat dibatalkan. Menghapus kriteria akan menghapus semua data bobot SWARA dan nilai penilaian nasabah terkait!
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="pt-3 gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsConfirmDeleteOpen(false)}
                            className="border-[#4f657a] bg-[#111827] hover:bg-[#152133] text-[#b2bfca] rounded-md"
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

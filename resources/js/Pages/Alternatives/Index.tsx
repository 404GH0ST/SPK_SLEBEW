import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Plus, Pencil, Trash2, ShieldAlert, Users, Phone, MapPin, Search } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';

interface Alternative {
    id: number;
    code: string;
    name: string;
    nik: string | null;
    address: string | null;
    phone: string | null;
    description: string | null;
}

interface IndexProps {
    alternatives: Alternative[];
}

export default function Index({ alternatives }: IndexProps) {
    const user = usePage().props.auth.user as any;
    const canEdit = ['admin', 'petugas'].includes(user.role);

    const [isOpen, setIsOpen] = useState(false);
    const [editingAlternative, setEditingAlternative] = useState<Alternative | null>(null);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        code: '',
        name: '',
        nik: '',
        address: '',
        phone: '',
        description: '',
    });

    const handleOpenAdd = () => {
        reset();
        clearErrors();
        setEditingAlternative(null);
        setIsOpen(true);
    };

    const handleOpenEdit = (alt: Alternative) => {
        clearErrors();
        setEditingAlternative(alt);
        setData({
            code: alt.code,
            name: alt.name,
            nik: alt.nik || '',
            address: alt.address || '',
            phone: alt.phone || '',
            description: alt.description || '',
        });
        setIsOpen(true);
    };

    const handleOpenDelete = (id: number) => {
        setDeletingId(id);
        setIsConfirmDeleteOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingAlternative) {
            put(route('alternatives.update', editingAlternative.id), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        } else {
            post(route('alternatives.store'), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (deletingId) {
            destroy(route('alternatives.destroy', deletingId), {
                onSuccess: () => {
                    setIsConfirmDeleteOpen(false);
                    setDeletingId(null);
                },
            });
        }
    };

    // Filter alternatives based on search input
    const filteredAlternatives = alternatives.filter(alt => 
        alt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alt.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (alt.nik && alt.nik.includes(searchTerm))
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight text-coop-text font-sans">
                        Data Nasabah (Alternatif)
                    </h2>
                    {canEdit && (
                        <Button 
                            onClick={handleOpenAdd}
                            className="bg-coop-gold hover:bg-coop-gold-hover text-coop-bg gap-2 rounded-md transition duration-300 font-semibold border border-[#aa7f31] "
                        >
                            <Plus className="h-4 w-4" /> Tambah Nasabah
                        </Button>
                    )}
                </div>
            }
        >
            <Head title="Nasabah (Alternatif)" />

            <div className="space-y-6 pb-6">
                {/* Search & Stats Banner */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    {/* Search Bar */}
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-coop-muted-dark" />
                        <Input
                            type="text"
                            placeholder="Cari nasabah (nama, kode, NIK)..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-10 bg-coop-bg border border-coop-border text-coop-text placeholder-[#8294aa] rounded-md focus-visible:ring-coop-gold/15 focus-visible:ring-2 focus-visible:border-coop-gold transition duration-200"
                        />
                    </div>
                    
                    <div className="text-coop-muted-light text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-md bg-coop-card border border-coop-border ">
                        Menampilkan <span className="text-coop-teal font-bold">{filteredAlternatives.length}</span> dari <span className="text-coop-text font-bold">{alternatives.length}</span> nasabah
                    </div>
                </div>

                {/* Alternatives Table Card */}
                <div className="rounded bg-coop-card border border-coop-border ">
                    <div className="p-5">
                        <div className="overflow-x-auto rounded border border-coop-border bg-coop-bg">
                            <Table>
                                <TableHeader className="bg-coop-card">
                                    <TableRow className="border-coop-border hover:bg-transparent">
                                        <TableHead className="w-24 text-xs font-bold uppercase tracking-wider text-coop-muted-light py-3">Kode</TableHead>
                                        <TableHead className="text-xs font-bold uppercase tracking-wider text-coop-muted-light py-3">Nama Lengkap</TableHead>
                                        <TableHead className="text-xs font-bold uppercase tracking-wider text-coop-muted-light py-3">NIK</TableHead>
                                        <TableHead className="text-xs font-bold uppercase tracking-wider text-coop-muted-light py-3">Telepon</TableHead>
                                        <TableHead className="text-xs font-bold uppercase tracking-wider text-coop-muted-light py-3">Alamat</TableHead>
                                        <TableHead className="text-xs font-bold uppercase tracking-wider text-coop-muted-light py-3">Keterangan Pengajuan</TableHead>
                                        {canEdit && <TableHead className="text-right text-xs font-bold uppercase tracking-wider text-coop-muted-light py-3 pr-6">Aksi</TableHead>}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredAlternatives.length === 0 ? (
                                        <TableRow className="border-coop-border">
                                            <TableCell colSpan={canEdit ? 7 : 6} className="text-center py-12 text-coop-muted-dark text-sm">
                                                Tidak ditemukan data nasabah.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredAlternatives.map((alt) => (
                                            <TableRow key={alt.id} className="border-coop-border hover:bg-coop-highlight/40 transition-colors">
                                                <TableCell className="font-bold font-mono text-coop-teal py-2.5">{alt.code}</TableCell>
                                                <TableCell className="text-coop-text font-semibold text-sm py-2.5">{alt.name}</TableCell>
                                                <TableCell className="text-coop-muted-light font-mono text-xs py-2.5">{alt.nik || '-'}</TableCell>
                                                <TableCell className="text-coop-muted-light py-2.5 font-mono text-xs">
                                                    {alt.phone ? (
                                                        <span className="flex items-center gap-1.5">
                                                            <Phone className="h-3 w-3 text-coop-muted-dark shrink-0" /> {alt.phone}
                                                        </span>
                                                    ) : '-'}
                                                </TableCell>
                                                <TableCell className="text-coop-muted-light max-w-xs truncate py-2.5 text-xs" title={alt.address || ''}>
                                                    {alt.address ? (
                                                        <span className="flex items-start gap-1.5">
                                                            <MapPin className="h-3 w-3 text-coop-muted-dark mt-0.5 shrink-0" />
                                                            <span className="truncate">{alt.address}</span>
                                                        </span>
                                                    ) : '-'}
                                                </TableCell>
                                                <TableCell className="text-coop-muted-light text-xs max-w-xs truncate py-2.5" title={alt.description || ''}>
                                                    {alt.description || '-'}
                                                </TableCell>
                                                {canEdit && (
                                                    <TableCell className="text-right py-2.5 pr-6 space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => handleOpenEdit(alt)}
                                                            className="h-10 w-10 border-coop-border bg-coop-card hover:bg-coop-highlight text-coop-muted-light hover:text-coop-text rounded-md transition inline-flex items-center justify-center"
                                                            aria-label={`Ubah data nasabah ${alt.name}`}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => handleOpenDelete(alt.id)}
                                                            className="h-10 w-10 border-coop-border bg-coop-card hover:bg-rose-950/30 hover:border-rose-900/50 text-rose-400 rounded-md transition inline-flex items-center justify-center"
                                                            aria-label={`Hapus data nasabah ${alt.name}`}
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
                            {editingAlternative ? 'Ubah Data Nasabah' : 'Tambah Nasabah Baru'}
                        </DialogTitle>
                        <DialogDescription className="text-coop-muted-light text-xs">
                            Silakan isi form di bawah ini untuk menyimpan profil nasabah.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-3">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="code" className="text-coop-muted-light text-[10px] font-bold uppercase tracking-wider">Kode Nasabah</Label>
                                <Input
                                    id="code"
                                    value={data.code}
                                    onChange={e => setData('code', e.target.value)}
                                    placeholder="Contoh: A1"
                                    className="bg-coop-bg border-coop-border text-coop-text placeholder-[#8294aa] focus-visible:ring-coop-gold/15 focus-visible:ring-2 focus-visible:border-coop-gold rounded-md transition duration-200"
                                    required
                                />
                                {errors.code && <p className="text-rose-500 text-[10px] mt-1">{errors.code}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="nik" className="text-coop-muted-light text-[10px] font-bold uppercase tracking-wider">NIK (No KTP)</Label>
                                <Input
                                    id="nik"
                                    value={data.nik}
                                    onChange={e => setData('nik', e.target.value)}
                                    placeholder="16 Digit NIK"
                                    className="bg-coop-bg border-coop-border text-coop-text placeholder-[#8294aa] focus-visible:ring-coop-gold/15 focus-visible:ring-2 focus-visible:border-coop-gold rounded-md transition duration-200"
                                />
                                {errors.nik && <p className="text-rose-500 text-[10px] mt-1">{errors.nik}</p>}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-coop-muted-light text-[10px] font-bold uppercase tracking-wider">Nama Lengkap</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="Nama lengkap sesuai KTP"
                                className="bg-coop-bg border-coop-border text-coop-text placeholder-[#8294aa] focus-visible:ring-coop-gold/15 focus-visible:ring-2 focus-visible:border-coop-gold rounded-md transition duration-200"
                                required
                            />
                            {errors.name && <p className="text-rose-500 text-[10px] mt-1">{errors.name}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="phone" className="text-coop-muted-light text-[10px] font-bold uppercase tracking-wider">Nomor Telepon</Label>
                            <Input
                                id="phone"
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)}
                                placeholder="Contoh: 081234567xxx"
                                className="bg-coop-bg border-coop-border text-coop-text placeholder-[#8294aa] focus-visible:ring-coop-gold/15 focus-visible:ring-2 focus-visible:border-coop-gold rounded-md transition duration-200"
                            />
                            {errors.phone && <p className="text-rose-500 text-[10px] mt-1">{errors.phone}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="address" className="text-coop-muted-light text-[10px] font-bold uppercase tracking-wider">Alamat Rumah</Label>
                            <textarea
                                id="address"
                                value={data.address}
                                onChange={e => setData('address', e.target.value)}
                                placeholder="Alamat tinggal lengkap..."
                                className="w-full min-h-16 p-3 rounded-md border border-coop-border bg-coop-bg text-coop-text text-sm placeholder-[#8294aa] focus:outline-none focus:ring-2 focus:ring-coop-gold/10 focus:border-coop-gold transition duration-200"
                            />
                            {errors.address && <p className="text-rose-500 text-[10px] mt-1">{errors.address}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="description" className="text-coop-muted-light text-[10px] font-bold uppercase tracking-wider">Keterangan / Tujuan Pinjaman</Label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                placeholder="Tujuan peminjaman uang, misal: Modal Toko..."
                                className="w-full min-h-16 p-3 rounded-md border border-coop-border bg-coop-bg text-coop-text text-sm placeholder-[#8294aa] focus:outline-none focus:ring-2 focus:ring-coop-gold/10 focus:border-coop-gold transition duration-200"
                            />
                            {errors.description && <p className="text-rose-500 text-[10px] mt-1">{errors.description}</p>}
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
                                className="bg-coop-gold hover:bg-coop-gold-hover text-coop-bg rounded-md font-semibold transition border border-[#aa7f31] "
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
                            <ShieldAlert className="h-4 w-4 text-rose-500" /> Hapus Nasabah?
                        </DialogTitle>
                        <DialogDescription className="text-coop-muted-light text-xs pt-1 leading-relaxed">
                            Tindakan ini tidak dapat dibatalkan. Menghapus data nasabah akan menghapus nilai penilaian nasabah dan data ranking MARCOS terkait!
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
                            className="bg-rose-600 hover:bg-rose-500 text-white rounded-md border border-rose-700 "
                        >
                            Ya, Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}

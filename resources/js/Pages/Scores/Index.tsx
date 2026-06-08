import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Edit3, CheckCircle, AlertTriangle, HelpCircle, Sparkles } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/Components/ui/alert';

interface Score {
    criteria_id: number;
    value: number;
}

interface Criteria {
    id: number;
    code: string;
    name: string;
    type: 'benefit' | 'cost';
    unit: string | null;
    description: string | null;
}

interface Alternative {
    id: number;
    code: string;
    name: string;
    scores: Score[];
}

interface ScoresProps {
    alternatives: Alternative[];
    active_criteria: Criteria[];
}

export default function Index({ alternatives, active_criteria }: ScoresProps) {
    const user = usePage().props.auth.user as any;
    const canInput = ['admin', 'petugas'].includes(user.role);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedAlt, setSelectedAlt] = useState<Alternative | null>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        alternative_id: 0,
        scores: [] as { criteria_id: number; value: string }[],
    });

    const handleOpenInput = (alt: Alternative) => {
        clearErrors();
        setSelectedAlt(alt);
        
        // Map existing scores or set empty
        const initialScores = active_criteria.map(c => {
            const existing = alt.scores.find(s => s.criteria_id === c.id);
            return {
                criteria_id: c.id,
                value: existing ? existing.value.toString() : '',
            };
        });

        setData({
            alternative_id: alt.id,
            scores: initialScores,
        });
        
        setIsOpen(true);
    };

    const handleScoreValueChange = (critId: number, value: string) => {
        setData('scores', data.scores.map(s => {
            if (s.criteria_id === critId) {
                return { ...s, value };
            }
            return s;
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Convert string values to floats for submittal
        const payload = {
            alternative_id: data.alternative_id,
            scores: data.scores.map(s => ({
                criteria_id: s.criteria_id,
                value: parseFloat(s.value),
            })),
        };

        // We bypass the direct Inertia post with hook so we can pass data programmatically, 
        // or we use useForm's default post after setting data.
        // Inertia's post is easier:
        post(route('scores.store'), {
            onSuccess: () => {
                setIsOpen(false);
                reset();
            },
        });
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    };

    const displayValue = (val: number, unit: string | null) => {
        if (unit?.toLowerCase() === 'rp' || unit?.toLowerCase() === 'rupiah') {
            return formatCurrency(val);
        }
        return `${val} ${unit || ''}`;
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
                    Input Nilai Kriteria Nasabah
                </h2>
            }
        >
            <Head title="Nilai Nasabah" />

            <div className="space-y-6 pb-6">
                {/* Status Alert */}
                <div className="rounded bg-[#111827] border border-[#4f657a] p-5 md:p-6 ">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="p-1 rounded bg-[#123b38] text-[#64d8c1] border border-[#64d8c1]/30">
                            <Sparkles className="h-4 w-4" />
                        </span>
                        Kelayakan Perhitungan
                    </h3>
                    <p className="text-[#b2bfca] text-sm mt-3 leading-relaxed">
                        Untuk menjalankan proses perankingan MARCOS, <strong className="text-slate-100 font-semibold">setiap nasabah wajib dinilai lengkap untuk semua kriteria aktif</strong>. Nasabah dengan status <span className="text-rose-400 font-semibold bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-900/50">Belum Lengkap</span> tidak akan diikutsertakan dalam kalkulasi ranking akhir.
                    </p>
                </div>

                {/* Score Matrix Card */}
                <div className="rounded bg-[#111827] border border-[#4f657a] ">
                    <div className="p-5 md:p-6">
                        <div className="overflow-x-auto rounded border border-[#4f657a]">
                            <Table>
                                <TableHeader className="bg-[#111827] hover:bg-[#111827]">
                                    <TableRow className="border-[#4f657a] hover:bg-transparent">
                                        <TableHead className="w-16 text-center text-xs font-semibold uppercase tracking-wider text-[#b2bfca] py-2.5 font-sans">No</TableHead>
                                        <TableHead className="w-24 text-xs font-semibold uppercase tracking-wider text-[#b2bfca] py-2.5 font-sans">Kode</TableHead>
                                        <TableHead className="text-xs font-semibold uppercase tracking-wider text-[#b2bfca] py-2.5 font-sans">Nama Nasabah</TableHead>
                                        {active_criteria.map(c => (
                                            <TableHead key={c.id} className="text-center text-xs font-semibold uppercase tracking-wider text-[#b2bfca] py-2.5 font-mono">
                                                <span 
                                                    className="cursor-help underline decoration-[#4f657a] decoration-dotted hover:text-[#64d8c1] transition"
                                                    title={`${c.name} (${c.type === 'benefit' ? 'Benefit' : 'Cost'}${c.unit ? `, Satuan: ${c.unit}` : ''})`}
                                                >
                                                    {c.code}
                                                </span>
                                                <span className="block text-[10px] text-[#8294aa] font-sans font-normal lowercase mt-0.5">({c.type.charAt(0)})</span>
                                            </TableHead>
                                        ))}
                                        <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-[#b2bfca] py-2.5 font-sans">Kelengkapan</TableHead>
                                        {canInput && <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-[#b2bfca] py-2.5 pr-6 font-sans">Aksi</TableHead>}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {alternatives.length === 0 ? (
                                         <TableRow className="border-[#4f657a]">
                                            <TableCell colSpan={active_criteria.length + (canInput ? 5 : 4)} className="text-center py-12 text-[#8294aa] text-sm">
                                                Belum ada data nasabah. Harap masukkan nasabah terlebih dahulu.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        alternatives.map((alt, index) => {
                                            const isComplete = active_criteria.every(c => 
                                                alt.scores.some(s => s.criteria_id === c.id)
                                            );
                                            return (
                                                <TableRow key={alt.id} className="border-[#4f657a] hover:bg-[#152133]/40 transition-colors">
                                                    <TableCell className="text-center text-[#b2bfca] font-medium py-2.5">{index + 1}</TableCell>
                                                    <TableCell className="font-semibold font-mono text-[#b2bfca] py-2.5">{alt.code}</TableCell>
                                                    <TableCell className="text-slate-100 font-medium py-2.5">{alt.name}</TableCell>
                                                    {active_criteria.map(c => {
                                                        const score = alt.scores.find(s => s.criteria_id === c.id);
                                                        return (
                                                            <TableCell key={c.id} className="text-center text-sm py-2.5 font-mono">
                                                                {score ? (
                                                                    <span className="text-[#b2bfca] font-medium">{displayValue(score.value, c.unit)}</span>
                                                                ) : (
                                                                    <span className="text-rose-500 font-bold">-</span>
                                                                )}
                                                            </TableCell>
                                                        );
                                                    })}
                                                    <TableCell className="text-center py-2.5">
                                                        {isComplete ? (
                                                            <span className="inline-flex items-center gap-1 text-[11px] text-[#64d8c1] bg-[#123b38] px-2.5 py-0.5 rounded-md border border-[#64d8c1]/30 font-medium">
                                                                <CheckCircle className="h-3.5 w-3.5" /> Lengkap
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 text-[11px] text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-md border border-rose-500/25 font-medium">
                                                                <AlertTriangle className="h-3.5 w-3.5" /> Belum Lengkap
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    {canInput && (
                                                        <TableCell className="text-right py-2.5 pr-6">
                                                            <Button
                                                                onClick={() => handleOpenInput(alt)}
                                                                className="bg-[#0b1020] hover:bg-[#152133] text-[#b2bfca] hover:text-white text-[11px] h-7 px-3 rounded-md gap-1.5 transition-all font-medium border border-[#4f657a] "
                                                            >
                                                                <Edit3 className="h-3.5 w-3.5 text-[#64d8c1]" /> Nilai
                                                            </Button>
                                                        </TableCell>
                                                    )}
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Input / Edit Scores Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="bg-[#111827] border border-[#4f657a] text-slate-100 max-w-md rounded  p-6">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-white font-sans tracking-tight">
                            Input Nilai Nasabah: {selectedAlt?.name} ({selectedAlt?.code})
                        </DialogTitle>
                        <DialogDescription className="text-[#b2bfca] text-xs">
                            Silakan masukkan angka riil untuk masing-masing kriteria.
                        </DialogDescription>
                    </DialogHeader>
                    
                    {errors.scores && (
                        <div className="p-3.5 rounded-md bg-rose-900/20 border border-rose-900 text-rose-400 text-xs my-2">
                            {errors.scores}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                            {active_criteria.map((c, i) => {
                                const scoreItem = data.scores.find(s => s.criteria_id === c.id);
                                return (
                                    <div key={c.id} className="space-y-1.5 border-b border-[#4f657a] pb-3 last:border-0 last:pb-0">
                                        <div className="flex justify-between items-center">
                                            <Label htmlFor={`crit-${c.id}`} className="text-[#b2bfca] text-xs font-semibold tracking-wider uppercase font-sans">
                                                {c.name} ({c.code})
                                            </Label>
                                            <div className="flex items-center gap-1.5">
                                                <span className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold tracking-wider ${
                                                    c.type === 'benefit' 
                                                        ? 'bg-[#123b38] text-[#64d8c1] border-[#64d8c1]/30' 
                                                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                }`}>
                                                    {c.type.toUpperCase()}
                                                </span>
                                                {c.unit && (
                                                    <span className="text-[10px] text-[#b2bfca] font-medium px-2 py-0.5 rounded-md bg-[#0b1020] border border-[#4f657a]">
                                                        {c.unit}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <Input
                                            id={`crit-${c.id}`}
                                            type="number"
                                            step="any"
                                            value={scoreItem ? scoreItem.value : ''}
                                            onChange={e => handleScoreValueChange(c.id, e.target.value)}
                                            className="bg-[#0b1020] border-[#4f657a] text-slate-100 focus-visible:ring-[#d6b45f]/15 focus-visible:ring-2 focus-visible:border-[#d6b45f] rounded-md font-medium font-mono text-sm px-3.5 h-10"
                                            placeholder={`Masukkan nilai dalam ${c.unit || 'angka'}`}
                                            required
                                        />
                                        {c.type === 'cost' && (
                                            <p className="text-[10px] text-[#8294aa] italic">
                                                *Kriteria Cost: nilai harus berupa angka positif lebih besar dari nol.
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <DialogFooter className="pt-4 gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                                className="border-[#4f657a] bg-[#111827] hover:bg-[#152133] text-[#b2bfca] rounded-md px-4 py-2 text-xs font-medium"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-[#d6b45f] hover:bg-[#f2d98a] text-[#0b1020] rounded-md font-medium transition text-xs px-4 py-2 border border-[#aa7f31] "
                            >
                                Simpan Nilai
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}

import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Edit3, CheckCircle, AlertTriangle, Sparkles, Check, X } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Input } from '@/Components/ui/input';

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

    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        alternative_id: 0,
        scores: [] as { criteria_id: number; value: string }[],
    });

    const handleStartInlineEdit = (alt: Alternative) => {
        clearErrors();
        setEditingId(alt.id);
        
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
    };

    const handleScoreValueChange = (critId: number, value: string) => {
        setData('scores', data.scores.map(s => {
            if (s.criteria_id === critId) {
                return { ...s, value };
            }
            return s;
        }));
    };

    const handleInlineSubmit = (altId: number, altIndex: number) => {
        post(route('scores.store'), {
            onSuccess: () => {
                setEditingId(null);
                clearErrors();
                
                // Automatically move to the next row if it exists to enable seamless bulk data entry
                if (altIndex < alternatives.length - 1) {
                    const nextAlt = alternatives[altIndex + 1];
                    setTimeout(() => {
                        handleStartInlineEdit(nextAlt);
                    }, 100);
                }
            },
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent, alt: Alternative, altIndex: number, critId: number) => {
        const critIndex = active_criteria.findIndex(c => c.id === critId);
        
        if (e.key === 'Escape') {
            e.preventDefault();
            setEditingId(null);
            clearErrors();
            reset();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            handleInlineSubmit(alt.id, altIndex);
        } else if (e.key === 'ArrowRight' && critIndex < active_criteria.length - 1) {
            e.preventDefault();
            const nextCrit = active_criteria[critIndex + 1];
            document.getElementById(`inline-input-${alt.id}-${nextCrit.id}`)?.focus();
        } else if (e.key === 'ArrowLeft' && critIndex > 0) {
            e.preventDefault();
            const prevCrit = active_criteria[critIndex - 1];
            document.getElementById(`inline-input-${alt.id}-${prevCrit.id}`)?.focus();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            handleInlineSubmit(alt.id, altIndex);
        } else if (e.key === 'ArrowUp' && altIndex > 0) {
            e.preventDefault();
            const prevAlt = alternatives[altIndex - 1];
            post(route('scores.store'), {
                onSuccess: () => {
                    setEditingId(null);
                    clearErrors();
                    setTimeout(() => {
                        handleStartInlineEdit(prevAlt);
                    }, 100);
                },
            });
        }
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
                        {/* Display inline validation errors */}
                        {errors.scores && (
                            <div className="mb-4 p-3.5 rounded bg-rose-950/20 border border-rose-900/50 text-rose-400 text-xs font-semibold flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                                <span>{errors.scores}</span>
                            </div>
                        )}

                        <div className="overflow-x-auto rounded border border-[#4f657a] bg-[#0b1020]">
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
                                            const isEditing = editingId === alt.id;
                                            return (
                                                <TableRow key={alt.id} className={`border-[#4f657a] transition-colors ${isEditing ? 'bg-[#152133]/65' : 'hover:bg-[#152133]/40'}`}>
                                                    <TableCell className="text-center text-[#b2bfca] font-medium py-2.5">{index + 1}</TableCell>
                                                    <TableCell className="font-semibold font-mono text-[#b2bfca] py-2.5">{alt.code}</TableCell>
                                                    <TableCell className="text-slate-100 font-medium py-2.5">{alt.name}</TableCell>
                                                    {active_criteria.map(c => {
                                                        const score = alt.scores.find(s => s.criteria_id === c.id);
                                                        const scoreItem = data.scores.find(s => s.criteria_id === c.id);
                                                        return (
                                                            <TableCell key={c.id} className="text-center text-sm py-2 font-mono">
                                                                {isEditing ? (
                                                                    <Input
                                                                        id={`inline-input-${alt.id}-${c.id}`}
                                                                        type="number"
                                                                        step="any"
                                                                        value={scoreItem ? scoreItem.value : ''}
                                                                        onChange={e => handleScoreValueChange(c.id, e.target.value)}
                                                                        onKeyDown={e => handleKeyDown(e, alt, index, c.id)}
                                                                        className="w-24 mx-auto bg-[#0b1020] border-[#4f657a] text-slate-100 text-xs text-center focus-visible:ring-[#d6b45f]/15 focus-visible:ring-2 focus-visible:border-[#d6b45f] rounded h-8 font-mono px-2"
                                                                        placeholder={c.unit || ''}
                                                                        required
                                                                        autoFocus={active_criteria[0].id === c.id}
                                                                    />
                                                                ) : score ? (
                                                                    <span className="text-[#b2bfca] font-medium">{displayValue(score.value, c.unit)}</span>
                                                                ) : (
                                                                    <span className="text-rose-500 font-bold">-</span>
                                                                )}
                                                            </TableCell>
                                                        );
                                                    })}
                                                    <TableCell className="text-center py-2.5">
                                                        {isComplete ? (
                                                            <span className="inline-flex items-center gap-1 text-[11px] text-[#64d8c1] bg-[#123b38] px-2.5 py-0.5 rounded border border-[#64d8c1]/30 font-medium">
                                                                <CheckCircle className="h-3.5 w-3.5" /> Lengkap
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 text-[11px] text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded border border-rose-500/25 font-medium">
                                                                <AlertTriangle className="h-3.5 w-3.5" /> Belum Lengkap
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    {canInput && (
                                                        <TableCell className="text-right py-2.5 pr-6">
                                                            {isEditing ? (
                                                                <div className="flex justify-end gap-2">
                                                                    <Button
                                                                        type="button"
                                                                        onClick={() => handleInlineSubmit(alt.id, index)}
                                                                        disabled={processing}
                                                                        className="bg-[#123b38] hover:bg-[#184e49] text-[#64d8c1] border border-[#64d8c1]/35 text-[11px] h-7 px-2.5 rounded justify-center font-bold transition-all duration-200 active:scale-95 flex items-center gap-1"
                                                                    >
                                                                        <Check className="h-3.5 w-3.5" /> Simpan
                                                                    </Button>
                                                                    <Button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setEditingId(null);
                                                                            reset();
                                                                            clearErrors();
                                                                        }}
                                                                        className="bg-rose-950/20 hover:bg-rose-900/30 text-rose-400 border border-rose-900/50 text-[11px] h-7 px-2.5 rounded justify-center font-bold transition-all duration-200 active:scale-95 flex items-center gap-1"
                                                                    >
                                                                        <X className="h-3.5 w-3.5" /> Batal
                                                                    </Button>
                                                                </div>
                                                            ) : (
                                                                <Button
                                                                    onClick={() => handleStartInlineEdit(alt)}
                                                                    className="bg-[#0b1020] hover:bg-[#152133] text-[#b2bfca] hover:text-white text-[11px] h-7 px-3 rounded gap-1.5 transition-all font-medium border border-[#4f657a]"
                                                                >
                                                                    <Edit3 className="h-3.5 w-3.5 text-[#64d8c1]" /> Nilai
                                                                </Button>
                                                            )}
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
        </AuthenticatedLayout>
    );
}

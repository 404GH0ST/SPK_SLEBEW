import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { Scale, Info, CheckCircle2, ArrowDownAZ, HelpCircle } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/Components/ui/alert';

interface Criteria {
    id: number;
    code: string;
    name: string;
    type: string;
    is_active: boolean;
}

interface SwaraWeight {
    id: number;
    criteria_id: number;
    rank_order: number;
    sj: number;
    kj: number;
    qj: number;
    weight: number;
    criteria: Criteria;
}

interface SwaraProps {
    current_weights: SwaraWeight[];
    active_criteria: Criteria[];
    is_valid: boolean;
}

interface InputItem {
    criteria_id: number;
    code: string;
    name: string;
    rank_order: number;
    sj: number;
}

export default function Index({ current_weights, active_criteria, is_valid }: SwaraProps) {
    const user = usePage().props.auth.user as any;
    const canManage = ['admin', 'pakar'].includes(user.role);
    const errors = usePage().props.errors as any;

    // Initial input state
    const [inputItems, setInputItems] = useState<InputItem[]>([]);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        // If there are current weights, pre-populate from them
        if (current_weights.length > 0 && current_weights.length === active_criteria.length) {
            const items = current_weights.map(w => ({
                criteria_id: w.criteria_id,
                code: w.criteria.code,
                name: w.criteria.name,
                rank_order: w.rank_order,
                sj: w.sj,
            }));
            setInputItems(items.sort((a, b) => a.rank_order - b.rank_order));
        } else {
            // Otherwise, set sequential ranks
            const items = active_criteria.map((c, i) => ({
                criteria_id: c.id,
                code: c.code,
                name: c.name,
                rank_order: i + 1,
                sj: i === 0 ? 0.0 : 0.1, // Default small values
            }));
            setInputItems(items);
        }
    }, [current_weights, active_criteria]);

    const handleRankChange = (criteriaId: number, newRank: number) => {
        setInputItems(prev => {
            const updated = prev.map(item => {
                if (item.criteria_id === criteriaId) {
                    return { ...item, rank_order: newRank, sj: newRank === 1 ? 0.0 : item.sj };
                }
                return item;
            });
            return updated;
        });
    };

    const handleSjChange = (criteriaId: number, value: string) => {
        const numVal = parseFloat(value);
        setInputItems(prev => prev.map(item => {
            if (item.criteria_id === criteriaId) {
                return { ...item, sj: isNaN(numVal) ? 0 : numVal };
            }
            return item;
        }));
    };

    // Sort items by rank order for visual rendering and submission
    const sortedInputItems = [...inputItems].sort((a, b) => a.rank_order - b.rank_order);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        // Submit the sorted weights
        router.post(route('swara.store'), {
            weights: sortedInputItems.map(item => ({
                criteria_id: item.criteria_id,
                rank_order: item.rank_order,
                sj: item.rank_order === 1 ? 0.0 : item.sj,
            })),
        }, {
            onFinish: () => setProcessing(false),
        });
    };

    const totalWeight = current_weights.reduce((sum, w) => sum + w.weight, 0);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-bold tracking-tight text-coop-text font-sans">
                    Pembobotan Kriteria SWARA
                </h2>
            }
        >

            <Head title="Pembobotan SWARA" />

            <div className="space-y-6 pb-6">
                {/* Method Explanation */}
                <div className="rounded bg-coop-card border border-coop-border p-5 ">
                    <div className="space-y-3">
                        <h3 className="text-base font-bold text-coop-text flex items-center gap-2">
                            <span className="p-1 rounded bg-coop-teal/10 text-coop-teal border border-coop-teal/30">
                                <Info className="h-4 w-4" />
                            </span>
                            Mengenal Metode SWARA
                        </h3>
                        <div className="text-coop-muted-light text-sm space-y-2.5 leading-relaxed">
                            <p>
                                <strong>SWARA (Step-wise Weight Assessment Ratio Analysis)</strong> adalah metode penentuan bobot kriteria berdasarkan tingkat kepentingan yang dinilai langsung oleh pakar.
                            </p>
                            <p className="font-semibold text-coop-text text-xs uppercase tracking-wider">Langkah Pengisian:</p>
                            <ol className="list-decimal pl-5 space-y-1.5 text-xs text-coop-muted-light">
                                <li>Urutkan kriteria dari yang paling penting (Peringkat 1) hingga yang kurang penting (Peringkat N).</li>
                                <li>Isi nilai komparatif <strong className="text-coop-teal font-semibold">$S_j$</strong> mulai dari kriteria peringkat ke-2. Nilai ini menyatakan seberapa penting kriteria tersebut dibandingkan kriteria di atasnya (misal: 0.10 berarti 10% lebih kurang penting).</li>
                                <li>Kriteria pertama (terpenting) memiliki nilai <strong className="text-coop-teal font-semibold">$S_j = 0$</strong> secara otomatis.</li>
                                <li>Sistem menghitung Koefisien <strong className="text-coop-teal font-semibold">$K_j = S_j + 1$</strong>, Nilai Rekalkulasi <strong className="text-coop-teal font-semibold">$Q_j$</strong>, dan Bobot Akhir <strong className="text-coop-teal font-semibold">$W_j$</strong>.</li>
                            </ol>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Current Weights View */}
                    <div className="rounded bg-coop-card border border-coop-border  flex flex-col">
                        <div className="border-b border-coop-border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <h3 className="text-base font-bold text-coop-text">Bobot Hasil Perhitungan Saat Ini</h3>
                                <p className="text-xs text-coop-muted-light mt-0.5">
                                    Bobot akhir kriteria ($W_j$) di bawah ini yang akan otomatis digunakan oleh metode MARCOS.
                                </p>
                            </div>
                            <div className="shrink-0">
                                {is_valid ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold text-coop-teal bg-coop-teal/10 border border-coop-teal/30">
                                        <span className="h-1.5 w-1.5 rounded-full bg-coop-teal"></span> Valid (Total Wj = 1)
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/25">
                                        Belum Valid / Kosong
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="p-5 pt-3 flex-1">
                            {current_weights.length === 0 ? (
                                <div className="text-center py-12 text-coop-muted-dark text-sm">
                                    Belum ada bobot kriteria yang disimpan. Silakan lakukan pengisian di panel sebelah kanan.
                                </div>
                            ) : (
                                <div className="overflow-x-auto rounded-md border border-coop-border bg-coop-bg">
                                    <Table>
                                        <TableHeader className="bg-coop-card">
                                            <TableRow className="border-coop-border hover:bg-transparent">
                                                <TableHead className="w-16 text-center text-xs font-bold uppercase tracking-wider text-coop-muted-light py-3">Rank</TableHead>
                                                <TableHead className="text-xs font-bold uppercase tracking-wider text-coop-muted-light py-3">Kriteria</TableHead>
                                                <TableHead className="text-center text-xs font-bold uppercase tracking-wider text-coop-muted-light py-3">Sj</TableHead>
                                                <TableHead className="text-center text-xs font-bold uppercase tracking-wider text-coop-muted-light py-3">Kj</TableHead>
                                                <TableHead className="text-center text-xs font-bold uppercase tracking-wider text-coop-muted-light py-3">Qj</TableHead>
                                                <TableHead className="text-center bg-coop-teal/10 text-xs font-bold uppercase tracking-wider text-coop-teal py-3 border-l border-coop-teal/25">Wj (Bobot)</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {current_weights.map((w) => (
                                                <TableRow key={w.id} className="border-coop-border hover:bg-coop-highlight/40 transition-colors">
                                                    <TableCell className="text-center font-extrabold text-coop-muted-light bg-coop-card/30 py-2.5">{w.rank_order}</TableCell>
                                                    <TableCell className="py-2.5">
                                                        <div className="font-semibold text-coop-text text-sm">{w.criteria.name}</div>
                                                        <div className="text-[10px] text-coop-muted-dark font-mono mt-0.5">{w.criteria.code} | {w.criteria.type}</div>
                                                    </TableCell>
                                                    <TableCell className="text-center text-coop-muted-light font-mono text-xs py-2.5">{w.sj.toFixed(4)}</TableCell>
                                                    <TableCell className="text-center text-coop-muted-light font-mono text-xs py-2.5">{w.kj.toFixed(4)}</TableCell>
                                                    <TableCell className="text-center text-coop-muted-light font-mono text-xs py-2.5">{w.qj.toFixed(4)}</TableCell>
                                                    <TableCell className="text-center bg-coop-teal/10 text-coop-teal font-bold font-mono text-xs py-2.5 border-l border-coop-teal/25">{w.weight.toFixed(4)}</TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow className="bg-coop-bg border-coop-border font-bold text-coop-text hover:bg-coop-bg">
                                                <TableCell colSpan={5} className="text-right py-3 pr-4 text-xs font-bold uppercase tracking-wider text-coop-muted-light">Total Bobot (SUM Wj):</TableCell>
                                                <TableCell className="text-center text-coop-teal font-bold text-sm py-3 border-l border-coop-teal/25 font-mono">{totalWeight.toFixed(2)}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pakar Input Panel */}
                    <div className="rounded bg-coop-card border border-coop-border  flex flex-col">
                        <div className="border-b border-coop-border p-5">
                            <h3 className="text-base font-bold text-coop-text flex items-center gap-2">
                                <ArrowDownAZ className="h-4.5 w-4.5 text-coop-teal" /> Atur Tingkat Kepentingan (Pakar)
                            </h3>
                            <p className="text-xs text-coop-muted-light mt-0.5">
                                Hanya Pakar/Kepala Koperasi atau Admin yang dapat mengubah prioritas kriteria.
                            </p>
                        </div>
                        <div className="p-5 flex-1">
                            {!canManage ? (
                                <div className="p-4 rounded-md bg-rose-950/20 border border-rose-900/50 text-rose-300 space-y-2">
                                    <div className="flex items-center gap-2 font-bold text-sm">
                                        <Info className="h-4 w-4 text-rose-400" /> Akses Terbatas
                                    </div>
                                    <p className="text-xs text-rose-400 leading-relaxed">
                                        Peran Anda saat ini tidak memiliki otorisasi untuk mengubah pembobotan SWARA. Harap hubungi Kepala Koperasi / Pakar.
                                    </p>
                                </div>
                            ) : active_criteria.length === 0 ? (
                                <div className="text-center py-12 text-coop-muted-dark text-sm">
                                    Tidak ada kriteria aktif. Harap aktifkan kriteria di menu Data Kriteria terlebih dahulu.
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-coop-muted-light px-3.5 py-2 bg-coop-bg rounded-md border border-coop-border mb-1">
                                            <span>Kriteria (Diurutkan otomatis)</span>
                                            <div className="flex items-center gap-6">
                                                <span className="w-24 text-center">Prioritas</span>
                                                <span className="w-28 text-center flex items-center gap-1 justify-center">
                                                    Nilai Sj <span title="Bandingkan dengan kriteria setingkat di atasnya" className="cursor-help"><HelpCircle className="h-3 w-3 text-slate-600" /></span>
                                                </span>
                                            </div>
                                        </div>

                                        {sortedInputItems.map((item, idx) => (
                                            <div 
                                                key={item.criteria_id} 
                                                className={`flex items-center justify-between p-3 rounded-md border transition-all duration-300 ${
                                                    item.rank_order === 1 
                                                        ? 'bg-coop-teal/10 border-coop-teal/30' 
                                                        : 'bg-coop-bg border-coop-border hover:border-coop-border'
                                                }`}
                                            >
                                                <div className="flex-1 min-w-0 pr-4">
                                                    <span className="font-bold text-sm text-coop-text block truncate">{item.name}</span>
                                                    <span className="font-mono text-[10px] text-coop-teal uppercase mt-0.5 inline-block">{item.code}</span>
                                                </div>

                                                <div className="flex items-center gap-4 shrink-0">
                                                    {/* Rank Order Dropdown Selector */}
                                                    <div className="w-24">
                                                        <select
                                                            value={item.rank_order}
                                                            onChange={e => handleRankChange(item.criteria_id, parseInt(e.target.value))}
                                                            className="w-full h-9 px-2 rounded-md border border-coop-border bg-coop-bg text-coop-text text-xs font-bold focus:outline-none focus:ring-2 focus:ring-coop-gold/10 focus:border-coop-gold transition duration-200"
                                                            aria-label={`Prioritas peringkat untuk kriteria ${item.name}`}
                                                        >
                                                            {active_criteria.map((_, i) => (
                                                                <option key={i} value={i + 1} className="bg-coop-bg text-coop-text font-bold">
                                                                    Rank {i + 1}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    {/* Sj Value Input */}
                                                    <div className="w-28">
                                                        {item.rank_order === 1 ? (
                                                            <Input
                                                                type="text"
                                                                value="0.0 (Utama)"
                                                                disabled
                                                                className="h-9 bg-coop-card/20 border-coop-border text-coop-teal/50 text-[10px] text-center rounded-md font-bold"
                                                                aria-label={`Nilai Sj untuk kriteria utama ${item.name}`}
                                                            />
                                                        ) : (
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                min="0"
                                                                max="1"
                                                                value={item.sj}
                                                                onChange={e => handleSjChange(item.criteria_id, e.target.value)}
                                                                className="h-9 bg-coop-bg border-coop-border text-coop-text text-center text-xs rounded-md focus-visible:ring-coop-gold/15 focus-visible:ring-2 focus-visible:border-coop-gold font-bold font-mono transition duration-200"
                                                                placeholder="Misal: 0.10"
                                                                required
                                                                aria-label={`Nilai Sj untuk kriteria ${item.name}`}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {errors.weights && (
                                        <div className="p-3.5 rounded-md bg-rose-950/20 border border-rose-900/50 text-rose-400 text-xs">
                                            {errors.weights}
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-coop-gold hover:bg-coop-gold-hover text-coop-bg rounded-md py-3 font-bold transition duration-300 border border-[#aa7f31] "
                                    >
                                        {processing ? 'Menghitung...' : 'Hitung & Simpan Pembobotan'}
                                    </Button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

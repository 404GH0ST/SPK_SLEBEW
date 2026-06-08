import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Trophy, FileText, Download, AlertCircle, ArrowRight, Award, Medal, HelpCircle } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';

interface Criteria {
    id: number;
    code: string;
    name: string;
    type: 'benefit' | 'cost';
    unit: string | null;
}

interface RankingResult {
    id: number;
    si: number;
    k_minus: number;
    k_plus: number;
    f_k_minus: number;
    f_k_plus: number;
    utility_value: number;
    rank: number;
    status: string;
    alternative: {
        code: string;
        name: string;
        nik: string;
        phone: string | null;
        address: string | null;
        scores?: { criteria_id: number; value: number }[];
    };
}

interface ResultsProps {
    results: RankingResult[];
    is_calculated: boolean;
    active_criteria?: Criteria[];
}

export default function Results({ results, is_calculated, active_criteria = [] }: ResultsProps) {
    const user = usePage().props.auth.user as any;

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    };

    const displayValue = (val: number, unit: string | null) => {
        if (unit?.toLowerCase() === 'rp' || unit?.toLowerCase() === 'rupiah') {
            return formatCurrency(val);
        }
        return `${val} ${unit || ''}`;
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Sangat Layak':
                return <span className="inline-flex items-center text-[11px] font-medium bg-coop-teal/10 text-coop-teal border border-coop-teal/35 px-2.5 py-0.5 rounded-md">{status}</span>;
            case 'Layak':
                return <span className="inline-flex items-center text-[11px] font-medium bg-coop-blue/10 text-coop-blue border border-coop-blue/35 px-2.5 py-0.5 rounded-md">{status}</span>;
            case 'Dipertimbangkan':
                return <span className="inline-flex items-center text-[11px] font-medium bg-coop-gold/10 text-coop-gold border border-coop-gold/30 px-2.5 py-0.5 rounded-md">{status}</span>;
            default:
                return <span className="inline-flex items-center text-[11px] font-medium bg-red-50 dark:bg-rose-950/40 text-red-700 dark:text-rose-400 border border-red-200 dark:border-rose-900/50 px-2.5 py-0.5 rounded-md">{status}</span>;
        }
    };

    const getRankMedal = (rank: number) => {
        switch (rank) {
            case 1:
                return (
                    <div className="inline-flex items-center justify-center h-7 w-7 rounded-md bg-coop-gold text-coop-bg font-bold text-xs">
                        1
                    </div>
                );
            case 2:
                return (
                    <div className="inline-flex items-center justify-center h-7 w-7 rounded-md bg-[#6f8295] text-coop-bg font-bold text-xs">
                        2
                    </div>
                );
            case 3:
                return (
                    <div className="inline-flex items-center justify-center h-7 w-7 rounded-md bg-amber-700 text-amber-50 font-bold text-xs">
                        3
                    </div>
                );
            default:
                return <span className="font-semibold text-coop-muted-light text-xs">{rank}</span>;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight text-coop-text font-sans">
                        Hasil Perangkingan Kelayakan
                    </h2>
                    {is_calculated && (
                        <div className="flex gap-3">
                            <a
                                href={route('reports.pdf')}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded text-xs font-semibold bg-coop-teal/10 hover:bg-[#184e49] text-coop-teal transition-all border border-coop-teal/35 duration-150 "
                            >
                                <FileText className="h-4 w-4" /> Cetak PDF
                            </a>
                            <a
                                href={route('reports.excel')}
                                className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md text-xs font-semibold bg-coop-gold hover:bg-coop-gold-hover text-coop-bg transition-all border border-[#aa7f31] duration-150 "
                            >
                                <Download className="h-4 w-4" /> Export Excel
                            </a>
                        </div>
                    )}
                </div>
            }
        >
            <Head title="Hasil Ranking" />

            <div className="space-y-6 pb-6">
                {!is_calculated ? (
                    <div className="overflow-hidden rounded bg-coop-card border border-coop-border p-12 text-center max-w-lg mx-auto mt-12 shadow-lg">
                        <div className="flex flex-col items-center pb-2">
                            <div className="h-14 w-14 rounded bg-coop-highlight flex items-center justify-center mb-4 border border-coop-border">
                                <Trophy className="h-7 w-7 text-coop-teal" />
                            </div>
                            <h3 className="text-xl font-bold text-coop-text tracking-tight">Belum Ada Hasil Perhitungan</h3>
                            <p className="text-coop-muted-light text-sm mt-2 leading-relaxed">
                                Perhitungan kelayakan nasabah menggunakan MARCOS belum pernah dijalankan, atau data kriteria/bobot baru saja diperbarui.
                            </p>
                        </div>
                        <div className="pt-6">
                            {['admin', 'pakar', 'petugas'].includes(user.role) ? (
                                <Link
                                    href={route('marcos.details')}
                                    className="inline-flex items-center justify-center gap-2 bg-coop-gold hover:bg-coop-gold-hover text-coop-bg font-medium px-5 py-2.5 rounded-md transition duration-150 border border-[#aa7f31] "
                                    title="Halaman Perhitungan"
                                >
                                    Pergi ke Halaman Perhitungan <ArrowRight className="h-4 w-4" />
                                </Link>
                            ) : (
                                <p className="text-xs text-coop-muted-dark">
                                    Silakan hubungi Administrator atau Petugas untuk menjalankan kalkulasi data kelayakan.
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Recommendation Banner */}
                        <div className="overflow-hidden rounded bg-coop-card border border-coop-border p-5 md:p-6 ">
                            <div className="flex items-start gap-4">
                                <div className="h-12 w-12 rounded bg-coop-highlight flex items-center justify-center shrink-0 border border-coop-border">
                                    <Award className="h-6 w-6 text-coop-teal" />
                                </div>
                                <div className="space-y-2">
                                    <span className="inline-flex items-center text-[10px] font-semibold uppercase tracking-wider text-coop-teal px-2.5 py-0.5 rounded bg-coop-teal/10 border border-coop-teal/35">Rekomendasi Utama</span>
                                    <h3 className="text-lg font-bold text-coop-text tracking-tight">
                                        Nasabah Terbaik: {results[0].alternative.name} ({results[0].alternative.code})
                                    </h3>
                                    <p className="text-sm text-coop-muted-light leading-relaxed">
                                        Berdasarkan perhitungan matematis SWARA-MARCOS, nasabah di atas menempati peringkat pertama dengan nilai utilitas akhir (Kᵢ) tertinggi yaitu <strong className="text-coop-teal font-semibold">{results[0].utility_value.toFixed(4)}</strong> dan diklasifikasikan sebagai <strong className="text-coop-teal font-semibold">{results[0].status}</strong> menerima bantuan pinjaman koperasi.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Results Table Card */}
                        <div className="overflow-hidden rounded bg-coop-card border border-coop-border ">
                            <div className="border-b border-coop-border p-5 md:p-6">
                                <h3 className="text-lg font-bold text-coop-text flex items-center gap-2 font-sans tracking-tight">
                                    <Trophy className="h-5 w-5 text-amber-500" /> Peringkat Kelayakan Penerima Pinjaman
                                </h3>
                                <p className="text-xs text-coop-muted-light mt-1">
                                    Urutan prioritas nasabah yang paling layak menerima pinjaman koperasi (diurutkan berdasarkan nilai utilitas akhir Kᵢ tertinggi).
                                </p>
                            </div>
                            <div className="p-5 md:p-6">
                                <div className="overflow-x-auto rounded-md border border-coop-border">
                                    <Table>
                                        <TableHeader className="bg-coop-bg/40 hover:bg-coop-bg/40">
                                            <TableRow className="border-coop-border hover:bg-transparent">
                                                <TableHead className="w-16 text-center text-xs font-semibold uppercase tracking-wider text-coop-muted-light py-2.5 font-sans">Rank</TableHead>
                                                <TableHead className="text-xs font-semibold uppercase tracking-wider text-coop-muted-light py-2.5 font-sans">Nasabah</TableHead>
                                                {active_criteria.map(c => (
                                                    <TableHead key={c.id} className="text-center text-xs font-semibold uppercase tracking-wider text-coop-muted-light py-2.5 font-mono">
                                                        <span 
                                                            className="cursor-help underline decoration-coop-border decoration-dotted hover:text-coop-teal transition" 
                                                            title={`${c.name} (${c.type === 'benefit' ? 'Benefit' : 'Cost'}${c.unit ? `, Satuan: ${c.unit}` : ''})`}
                                                        >
                                                            {c.code}
                                                        </span>
                                                    </TableHead>
                                                ))}
                                                <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-coop-muted-light py-2.5 font-mono">
                                                    <span className="cursor-help underline decoration-coop-border decoration-dotted" title="Si (Sum of Weighted Values): Total nilai tertimbang alternatif. Semakin besar semakin baik." role="tooltip" aria-label="Si (Sum of Weighted Values): Total nilai tertimbang alternatif. Semakin besar semakin baik." tabIndex={0}>Nilai Sᵢ</span>
                                                </TableHead>
                                                <TableHead className="text-center bg-coop-teal/10 text-xs font-bold uppercase tracking-wider text-coop-teal py-2.5 border-l border-coop-border">
                                                    <span className="cursor-help underline decoration-coop-teal/40 decoration-dotted" title="Nilai Utilitas Akhir (Kᵢ): Berada di rentang 0 hingga 1. Semakin mendekati 1 semakin direkomendasikan." role="tooltip" aria-label="Nilai Utilitas Akhir (Kᵢ): Berada di rentang 0 hingga 1. Semakin mendekati 1 semakin direkomendasikan." tabIndex={0}>Nilai Utilitas (Kᵢ)</span>
                                                </TableHead>
                                                <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-coop-muted-light py-2.5 pr-4 font-sans">Status Kelayakan</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {results.map((res) => (
                                                <TableRow key={res.id} className="border-coop-border hover:bg-coop-highlight/20 transition-colors">
                                                    <TableCell className="text-center py-2.5">{getRankMedal(res.rank)}</TableCell>
                                                    <TableCell className="py-2.5 min-w-[200px] max-w-[260px]">
                                                        <div className="font-semibold text-coop-text whitespace-normal leading-snug">{res.alternative.name}</div>
                                                        <div className="text-[10px] text-coop-muted-dark font-mono mt-0.5 tracking-wide">{res.alternative.code} • NIK: {res.alternative.nik}</div>
                                                    </TableCell>
                                                    {active_criteria.map(c => {
                                                        const score = res.alternative.scores?.find(s => s.criteria_id === c.id);
                                                        return (
                                                            <TableCell key={c.id} className="text-center text-xs text-coop-muted-light py-2.5 font-mono">
                                                                {score ? displayValue(score.value, c.unit) : '-'}
                                                            </TableCell>
                                                        );
                                                    })}
                                                    <TableCell className="text-center font-mono text-coop-muted-light text-sm py-2.5">{res.si.toFixed(4)}</TableCell>
                                                    <TableCell className="text-center font-mono bg-coop-teal/10 text-coop-teal font-bold text-sm py-2.5 border-l border-coop-border">{res.utility_value.toFixed(4)}</TableCell>
                                                    <TableCell className="text-center py-2.5 pr-4">{getStatusBadge(res.status)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>

                        {/* Status Classification Reference */}
                        <div className="grid gap-4 sm:grid-cols-4">
                            <div className="overflow-hidden rounded bg-coop-card border border-coop-border p-5 transition hover:border-coop-teal/45 shadow-sm">
                                <div className="flex justify-between items-center border-b border-coop-border/50 pb-2.5 mb-2.5">
                                    <span className="text-xs font-semibold text-coop-muted-light tracking-wider font-mono">SANGAT LAYAK</span>
                                    <span className="h-2 w-2 rounded-full bg-coop-teal"></span>
                                </div>
                                <div className="mt-1 text-xl font-bold text-coop-text font-mono">Kᵢ &ge; 0.75</div>
                                <p className="text-xs text-coop-muted-dark mt-1.5 leading-relaxed">Sangat diprioritaskan mendapat pinjaman</p>
                            </div>

                            <div className="overflow-hidden rounded bg-coop-card border border-coop-border p-5 transition hover:border-coop-blue/45 shadow-sm">
                                <div className="flex justify-between items-center border-b border-coop-border/50 pb-2.5 mb-2.5">
                                    <span className="text-xs font-semibold text-coop-muted-light tracking-wider font-mono">LAYAK</span>
                                    <span className="h-2 w-2 rounded-full bg-coop-blue"></span>
                                </div>
                                <div className="mt-1 text-xl font-bold text-coop-text font-mono">0.60 &le; Kᵢ &lt; 0.75</div>
                                <p className="text-xs text-coop-muted-dark mt-1.5 leading-relaxed">Memenuhi standar kelayakan koperasi</p>
                            </div>

                            <div className="overflow-hidden rounded bg-coop-card border border-coop-border p-5 transition hover:border-amber-500/30 shadow-sm">
                                <div className="flex justify-between items-center border-b border-coop-border/50 pb-2.5 mb-2.5">
                                    <span className="text-xs font-semibold text-coop-muted-light tracking-wider font-mono">DIPERTIMBANGKAN</span>
                                    <span className="h-2 w-2 rounded-full bg-coop-gold"></span>
                                </div>
                                <div className="mt-1 text-xl font-bold text-coop-text font-mono">0.45 &le; Kᵢ &lt; 0.60</div>
                                <p className="text-xs text-coop-muted-dark mt-1.5 leading-relaxed">Dapat disetujui dengan jaminan ketat</p>
                            </div>

                            <div className="overflow-hidden rounded bg-coop-card border border-coop-border p-5 transition hover:border-rose-500/30 shadow-sm">
                                <div className="flex justify-between items-center border-b border-coop-border/50 pb-2.5 mb-2.5">
                                    <span className="text-xs font-semibold text-coop-muted-light tracking-wider font-mono">TIDAK PRIORITAS</span>
                                    <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                                </div>
                                <div className="mt-1 text-xl font-bold text-coop-text font-mono">Kᵢ &lt; 0.45</div>
                                <p className="text-xs text-coop-muted-dark mt-1.5 leading-relaxed">Risiko tinggi, penundaan pinjaman</p>
                            </div>
                        </div>

                        {/* Parameter Explanations */}
                        <div className="mt-6 p-5 rounded bg-coop-card border border-coop-border space-y-4">
                            <h4 className="text-sm font-bold text-coop-text flex items-center gap-2">
                                <HelpCircle className="h-4 w-4 text-coop-gold" /> Legenda & Cara Membaca Parameter MARCOS
                            </h4>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs text-coop-muted-light">
                                <div className="p-3.5 rounded bg-coop-bg border border-coop-border/40 transition duration-300 hover:border-coop-teal/40 hover:bg-coop-highlight/25 shadow-sm">
                                    <strong className="text-coop-teal block mb-1">Sᵢ (Sum of Weighted Values)</strong>
                                    Total nilai tertimbang alternatif. Semakin besar nilainya, semakin baik kinerja nasabah tersebut secara keseluruhan terhadap kriteria.
                                </div>
                                <div className="p-3.5 rounded bg-coop-bg border border-coop-border/40 transition duration-300 hover:border-coop-blue/40 hover:bg-coop-highlight/25 shadow-sm">
                                    <strong className="text-coop-blue block mb-1">Nilai Utilitas Kᵢ (Hasil Akhir)</strong>
                                    Kombinasi akhir derajat utilitas dan fungsi utilitas substitusi (berkisar antara 0 hingga 1). **Nasabah dengan Nilai Utilitas Kᵢ tertinggi berada di ranking teratas dan paling layak diprioritaskan mendapat pinjaman.**
                                </div>
                                <div className="p-3.5 rounded bg-coop-bg border border-coop-border/40 transition duration-300 hover:border-amber-500/40 hover:bg-coop-highlight/25 shadow-sm sm:col-span-2 lg:col-span-1">
                                    <strong className="text-amber-400 block mb-1">Status Kelayakan</strong>
                                    Ditentukan berdasarkan nilai utilitas akhir (Kᵢ). **Sangat Layak** (Kᵢ &ge; 0.75), **Layak** (0.60 &le; Kᵢ &lt; 0.75), **Dipertimbangkan** (0.45 &le; Kᵢ &lt; 0.60), **Tidak Prioritas** (Kᵢ &lt; 0.45).
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

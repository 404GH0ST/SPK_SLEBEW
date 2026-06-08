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
                return <span className="inline-flex items-center text-[11px] font-medium bg-[#123b38] text-[#64d8c1] border border-[#64d8c1]/35 px-2.5 py-0.5 rounded-md">{status}</span>;
            case 'Layak':
                return <span className="inline-flex items-center text-[11px] font-medium bg-[#111827] text-[#88a4ff] border border-[#88a4ff]/35 px-2.5 py-0.5 rounded-md">{status}</span>;
            case 'Dipertimbangkan':
                return <span className="inline-flex items-center text-[11px] font-medium bg-amber-950/40 text-amber-400 border border-amber-900/50 px-2.5 py-0.5 rounded-md">{status}</span>;
            default:
                return <span className="inline-flex items-center text-[11px] font-medium bg-rose-950/40 text-rose-400 border border-rose-900/50 px-2.5 py-0.5 rounded-md">{status}</span>;
        }
    };

    const getRankMedal = (rank: number) => {
        switch (rank) {
            case 1:
                return (
                    <div className="inline-flex items-center justify-center h-7 w-7 rounded-md bg-[#d6b45f] text-[#0b1020] font-bold text-xs">
                        1
                    </div>
                );
            case 2:
                return (
                    <div className="inline-flex items-center justify-center h-7 w-7 rounded-md bg-[#6f8295] text-[#0b1020] font-bold text-xs">
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
                return <span className="font-semibold text-[#b2bfca] text-xs">{rank}</span>;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
                        Hasil Perangkingan Kelayakan
                    </h2>
                    {is_calculated && (
                        <div className="flex gap-3">
                            <a
                                href={route('reports.pdf')}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded text-xs font-semibold bg-[#123b38] hover:bg-[#184e49] text-[#64d8c1] transition-all border border-[#64d8c1]/35 duration-150 "
                            >
                                <FileText className="h-4 w-4" /> Cetak PDF
                            </a>
                            <a
                                href={route('reports.excel')}
                                className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md text-xs font-semibold bg-[#d6b45f] hover:bg-[#f2d98a] text-[#0b1020] transition-all border border-[#aa7f31] duration-150 "
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
                    <div className="overflow-hidden rounded bg-[#111827] border border-[#4f657a] p-12 text-center max-w-lg mx-auto mt-12 shadow-lg">
                        <div className="flex flex-col items-center pb-2">
                            <div className="h-14 w-14 rounded bg-[#152133] flex items-center justify-center mb-4 border border-[#6f8295]">
                                <Trophy className="h-7 w-7 text-[#64d8c1]" />
                            </div>
                            <h3 className="text-xl font-bold text-white tracking-tight">Belum Ada Hasil Perhitungan</h3>
                            <p className="text-[#b2bfca] text-sm mt-2 leading-relaxed">
                                Perhitungan kelayakan nasabah menggunakan MARCOS belum pernah dijalankan, atau data kriteria/bobot baru saja diperbarui.
                            </p>
                        </div>
                        <div className="pt-6">
                            {['admin', 'pakar', 'petugas'].includes(user.role) ? (
                                <Link
                                    href={route('marcos.details')}
                                    className="inline-flex items-center justify-center gap-2 bg-[#d6b45f] hover:bg-[#f2d98a] text-[#0b1020] font-medium px-5 py-2.5 rounded-md transition duration-150 border border-[#aa7f31] "
                                    title="Halaman Perhitungan"
                                >
                                    Pergi ke Halaman Perhitungan <ArrowRight className="h-4 w-4" />
                                </Link>
                            ) : (
                                <p className="text-xs text-[#8294aa]">
                                    Silakan hubungi Administrator atau Petugas untuk menjalankan kalkulasi data kelayakan.
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Recommendation Banner */}
                        <div className="overflow-hidden rounded bg-[#111827] border border-[#4f657a] p-5 md:p-6 ">
                            <div className="flex items-start gap-4">
                                <div className="h-12 w-12 rounded bg-[#152133] flex items-center justify-center shrink-0 border border-[#6f8295]">
                                    <Award className="h-6 w-6 text-[#64d8c1]" />
                                </div>
                                <div className="space-y-2">
                                    <span className="inline-flex items-center text-[10px] font-semibold uppercase tracking-wider text-[#64d8c1] px-2.5 py-0.5 rounded bg-[#123b38] border border-[#64d8c1]/35">Rekomendasi Utama</span>
                                    <h3 className="text-lg font-bold text-white tracking-tight">
                                        Nasabah Terbaik: {results[0].alternative.name} ({results[0].alternative.code})
                                    </h3>
                                    <p className="text-sm text-[#b2bfca] leading-relaxed">
                                        Berdasarkan perhitungan matematis SWARA-MARCOS, nasabah di atas menempati peringkat pertama dengan nilai utilitas tertinggi yaitu <strong className="text-[#64d8c1] font-semibold">{results[0].utility_value.toFixed(4)}</strong> dan diklasifikasikan sebagai <strong className="text-[#64d8c1] font-semibold">{results[0].status}</strong> menerima bantuan pinjaman koperasi.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Results Table Card */}
                        <div className="overflow-hidden rounded bg-[#111827] border border-[#4f657a] ">
                            <div className="border-b border-[#4f657a] p-5 md:p-6">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2 font-sans tracking-tight">
                                    <Trophy className="h-5 w-5 text-amber-500" /> Peringkat Kelayakan Penerima Pinjaman
                                </h3>
                                <p className="text-xs text-[#b2bfca] mt-1">
                                    Urutan prioritas nasabah yang paling layak menerima pinjaman koperasi (diurutkan berdasarkan nilai utilitas tertinggi).
                                </p>
                            </div>
                            <div className="p-5 md:p-6">
                                <div className="overflow-x-auto rounded-md border border-[#4f657a]">
                                    <Table>
                                        <TableHeader className="bg-[#0b1020]/40 hover:bg-[#0b1020]/40">
                                            <TableRow className="border-[#4f657a] hover:bg-transparent">
                                                <TableHead className="w-20 text-center text-xs font-semibold uppercase tracking-wider text-[#b2bfca] py-2.5 font-sans">Rank</TableHead>
                                                <TableHead className="w-24 text-xs font-semibold uppercase tracking-wider text-[#b2bfca] py-2.5 font-sans">Kode</TableHead>
                                                <TableHead className="text-xs font-semibold uppercase tracking-wider text-[#b2bfca] py-2.5 font-sans">Nama Nasabah</TableHead>
                                                <TableHead className="text-xs font-semibold uppercase tracking-wider text-[#b2bfca] py-2.5 font-sans">NIK</TableHead>
                                                {active_criteria.map(c => (
                                                    <TableHead key={c.id} className="text-center text-xs font-semibold uppercase tracking-wider text-[#b2bfca] py-2.5 font-mono">
                                                        <span 
                                                            className="cursor-help underline decoration-[#4f657a] decoration-dotted hover:text-[#64d8c1] transition" 
                                                            title={`${c.name} (${c.type === 'benefit' ? 'Benefit' : 'Cost'}${c.unit ? `, Satuan: ${c.unit}` : ''})`}
                                                        >
                                                            {c.code}
                                                        </span>
                                                    </TableHead>
                                                ))}
                                                <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-[#b2bfca] py-2.5 font-mono">
                                                    <span className="cursor-help underline decoration-[#4f657a] decoration-dotted" title="Si (Sum of Weighted Values): Total nilai tertimbang alternatif. Semakin besar semakin baik.">Nilai Si</span>
                                                </TableHead>
                                                <TableHead className="text-center bg-[#123b38] text-xs font-bold uppercase tracking-wider text-[#64d8c1] py-2.5 border-l border-[#4f657a]">
                                                    <span className="cursor-help underline decoration-[#64d8c1]/40 decoration-dotted" title="Nilai Utilitas Akhir (K): Berada di rentang 0 hingga 1. Semakin mendekati 1 semakin direkomendasikan.">Nilai Utilitas</span>
                                                </TableHead>
                                                <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-[#b2bfca] py-2.5 pr-6 font-sans">Status Kelayakan</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {results.map((res) => (
                                                <TableRow key={res.id} className="border-[#4f657a] hover:bg-[#152133]/20 transition-colors">
                                                    <TableCell className="text-center py-2.5">{getRankMedal(res.rank)}</TableCell>
                                                    <TableCell className="font-semibold font-mono text-[#b2bfca] py-2.5">{res.alternative.code}</TableCell>
                                                    <TableCell className="text-slate-100 font-medium py-2.5">{res.alternative.name}</TableCell>
                                                    <TableCell className="text-[#b2bfca] font-mono text-xs py-2.5">{res.alternative.nik}</TableCell>
                                                    {active_criteria.map(c => {
                                                        const score = res.alternative.scores?.find(s => s.criteria_id === c.id);
                                                        return (
                                                            <TableCell key={c.id} className="text-center text-xs text-[#b2bfca] py-2.5 font-mono">
                                                                {score ? displayValue(score.value, c.unit) : '-'}
                                                            </TableCell>
                                                        );
                                                    })}
                                                    <TableCell className="text-center font-mono text-[#b2bfca] text-sm py-2.5">{res.si.toFixed(4)}</TableCell>
                                                    <TableCell className="text-center font-mono bg-[#123b38] text-[#64d8c1] font-bold text-sm py-2.5 border-l border-[#4f657a]">{res.utility_value.toFixed(4)}</TableCell>
                                                    <TableCell className="text-center py-2.5 pr-6">{getStatusBadge(res.status)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>

                        {/* Status Classification Reference */}
                        <div className="grid gap-4 sm:grid-cols-4">
                            <div className="overflow-hidden rounded bg-[#111827] border border-[#4f657a] p-5 transition hover:border-[#64d8c1]/45 shadow-sm">
                                <div className="flex justify-between items-center border-b border-[#4f657a]/50 pb-2.5 mb-2.5">
                                    <span className="text-xs font-semibold text-[#b2bfca] tracking-wider font-mono">SANGAT LAYAK</span>
                                    <span className="h-2 w-2 rounded-full bg-[#64d8c1]"></span>
                                </div>
                                <div className="mt-1 text-xl font-bold text-white font-mono">Ki &ge; 0.75</div>
                                <p className="text-xs text-[#8294aa] mt-1.5 leading-relaxed">Sangat diprioritaskan mendapat pinjaman</p>
                            </div>

                            <div className="overflow-hidden rounded bg-[#111827] border border-[#4f657a] p-5 transition hover:border-[#88a4ff]/45 shadow-sm">
                                <div className="flex justify-between items-center border-b border-[#4f657a]/50 pb-2.5 mb-2.5">
                                    <span className="text-xs font-semibold text-[#b2bfca] tracking-wider font-mono">LAYAK</span>
                                    <span className="h-2 w-2 rounded-full bg-[#88a4ff]"></span>
                                </div>
                                <div className="mt-1 text-xl font-bold text-white font-mono">0.60 &le; Ki &lt; 0.75</div>
                                <p className="text-xs text-[#8294aa] mt-1.5 leading-relaxed">Memenuhi standar kelayakan koperasi</p>
                            </div>

                            <div className="overflow-hidden rounded bg-[#111827] border border-[#4f657a] p-5 transition hover:border-amber-500/30 shadow-sm">
                                <div className="flex justify-between items-center border-b border-[#4f657a]/50 pb-2.5 mb-2.5">
                                    <span className="text-xs font-semibold text-[#b2bfca] tracking-wider font-mono">DIPERTIMBANGKAN</span>
                                    <span className="h-2 w-2 rounded-full bg-[#d6b45f]"></span>
                                </div>
                                <div className="mt-1 text-xl font-bold text-white font-mono">0.45 &le; Ki &lt; 0.60</div>
                                <p className="text-xs text-[#8294aa] mt-1.5 leading-relaxed">Dapat disetujui dengan jaminan ketat</p>
                            </div>

                            <div className="overflow-hidden rounded bg-[#111827] border border-[#4f657a] p-5 transition hover:border-rose-500/30 shadow-sm">
                                <div className="flex justify-between items-center border-b border-[#4f657a]/50 pb-2.5 mb-2.5">
                                    <span className="text-xs font-semibold text-[#b2bfca] tracking-wider font-mono">TIDAK PRIORITAS</span>
                                    <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                                </div>
                                <div className="mt-1 text-xl font-bold text-white font-mono">Ki &lt; 0.45</div>
                                <p className="text-xs text-[#8294aa] mt-1.5 leading-relaxed">Risiko tinggi, penundaan pinjaman</p>
                            </div>
                        </div>

                        {/* Parameter Explanations */}
                        <div className="mt-6 p-5 rounded bg-[#111827] border border-[#4f657a] space-y-4">
                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                <HelpCircle className="h-4 w-4 text-[#d6b45f]" /> Legenda & Cara Membaca Parameter MARCOS
                            </h4>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs text-[#b2bfca]">
                                <div className="p-3.5 rounded bg-[#0b1020] border border-[#4f657a]/40">
                                    <strong className="text-[#64d8c1] block mb-1">Si (Sum of Weighted Values)</strong>
                                    Total nilai tertimbang alternatif. Semakin besar nilainya, semakin baik kinerja nasabah tersebut secara keseluruhan terhadap kriteria.
                                </div>
                                <div className="p-3.5 rounded bg-[#0b1020] border border-[#4f657a]/40">
                                    <strong className="text-[#88a4ff] block mb-1">Nilai Utilitas K (Hasil Akhir)</strong>
                                    Kombinasi akhir derajat dan fungsi utilitas (berkisar antara 0 hingga 1). **Nasabah dengan Nilai Utilitas tertinggi berada di ranking teratas dan paling layak diprioritaskan mendapat pinjaman.**
                                </div>
                                <div className="p-3.5 rounded bg-[#0b1020] border border-[#4f657a]/40 sm:col-span-2 lg:col-span-1">
                                    <strong className="text-amber-400 block mb-1">Status Kelayakan</strong>
                                    Ditentukan berdasarkan nilai utilitas (Ki). **Sangat Layak** (Ki &ge; 0.75), **Layak** (0.60 &le; Ki &lt; 0.75), **Dipertimbangkan** (0.45 &le; Ki &lt; 0.60), **Tidak Prioritas** (Ki &lt; 0.45).
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

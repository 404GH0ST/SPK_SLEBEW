import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { Calculator, Play, AlertCircle, Sparkles, AlertTriangle, ArrowRight, HelpCircle } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/Components/ui/alert';
import { Badge } from '@/Components/ui/badge';

interface Criteria {
    id: number;
    code: string;
    name: string;
    type: 'benefit' | 'cost';
}

interface Alternative {
    id: number;
    code: string;
    name: string;
}

interface SwaraWeight {
    criteria_id: number;
    weight: number;
}

interface IdealSolutions {
    AI: Record<number, number>;
    AAI: Record<number, number>;
}

interface DetailsData {
    criteria: Criteria[];
    alternatives: Alternative[];
    weights: Record<number, number>;
    swara_details: SwaraWeight[];
    decision_matrix: Record<number, Record<number, number>>;
    ideal_solutions: IdealSolutions;
    normalized_matrix: Record<number, Record<number, number>>;
    normalized_AI: Record<number, number>;
    normalized_AAI: Record<number, number>;
    weighted_matrix: Record<number, Record<number, number>>;
    weighted_AI: Record<number, number>;
    weighted_AAI: Record<number, number>;
    si_values: Record<number, number>;
    s_ai: number;
    s_aai: number;
    utility_degrees: Record<number, { k_minus: number; k_plus: number }>;
    utility_functions: Record<number, { f_k_minus: number; f_k_plus: number; utility_value: number }>;
    rankings: Record<number, { rank: number; status: string }>;
}

interface DetailsProps {
    details?: DetailsData;
    error?: string;
}

export default function Details({ details, error }: DetailsProps) {
    const user = usePage().props.auth.user as any;
    const canCalculate = ['admin', 'pakar', 'petugas'].includes(user.role);
    const [calculating, setCalculating] = useState(false);

    const handleRunCalculation = () => {
        setCalculating(true);
        router.post(route('marcos.calculate'), {}, {
            onFinish: () => setCalculating(false)
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Sangat Layak':
                return <span className="inline-flex items-center text-[11px] font-bold bg-[#123b38] text-[#64d8c1] border border-[#64d8c1]/35 px-2.5 py-0.5 rounded-md">{status}</span>;
            case 'Layak':
                return <span className="inline-flex items-center text-[11px] font-bold bg-[#111827] text-[#88a4ff] border border-[#88a4ff]/35 px-2.5 py-0.5 rounded-md">{status}</span>;
            case 'Dipertimbangkan':
                return <span className="inline-flex items-center text-[11px] font-bold bg-amber-950/40 text-amber-400 border border-amber-900/50 px-2.5 py-0.5 rounded-md">{status}</span>;
            default:
                return <span className="inline-flex items-center text-[11px] font-bold bg-rose-950/20 text-rose-400 border border-rose-900/50 px-2.5 py-0.5 rounded-md">{status}</span>;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
                        Detail Perhitungan MARCOS
                    </h2>
                    {canCalculate && !error && (
                        <Button
                            onClick={handleRunCalculation}
                            disabled={calculating}
                            className="bg-[#d6b45f] hover:bg-[#f2d98a] text-[#0b1020] gap-2 rounded-md transition duration-300 font-semibold border border-[#aa7f31] h-10 px-4 "
                        >
                            <Calculator className="h-4 w-4" /> {calculating ? 'Memproses...' : 'Hitung & Simpan'}
                        </Button>
                    )}
                </div>
            }
        >
            <Head title="Detail Perhitungan MARCOS" />

            <div className="space-y-6 pb-6">
                {/* Error Banner */}
                {error && (
                    <div className="p-5 md:p-6 rounded-lg bg-rose-900/20 border border-rose-900/50 text-rose-400 space-y-4 ">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
                            <h3 className="font-bold text-base text-white">Perhitungan Terhambat</h3>
                        </div>
                        <p className="text-sm text-rose-400 leading-relaxed">{error}</p>
                        <div className="pt-1 flex flex-col sm:flex-row gap-3">
                            {error.includes("bobot SWARA") && (
                                <Button
                                    onClick={() => router.get(route('swara.index'))}
                                    className="bg-rose-900/20 border border-rose-800 text-rose-300 hover:bg-rose-900/40 rounded-md text-xs gap-1.5 transition px-3.5 h-8 font-medium"
                                >
                                    Atur Bobot SWARA <ArrowRight className="h-3 w-3" />
                                </Button>
                            )}
                            {error.includes("Nilai alternatif") && (
                                <Button
                                    onClick={() => router.get(route('scores.index'))}
                                    className="bg-rose-900/20 border border-rose-800 text-rose-300 hover:bg-rose-900/40 rounded-md text-xs gap-1.5 transition px-3.5 h-8 font-medium"
                                >
                                    Lengkapi Nilai Nasabah <ArrowRight className="h-3 w-3" />
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {details && (
                    <>
                        {/* Summary Header */}
                        <div className="rounded bg-[#111827] border border-[#4f657a] p-5 md:p-6 ">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="p-1 rounded bg-[#123b38] text-[#64d8c1] border border-[#64d8c1]/30">
                                    <Sparkles className="h-4 w-4" />
                                </span>
                                Penjelasan Perhitungan
                            </h3>
                            <p className="text-[#b2bfca] text-sm mt-3 leading-relaxed">
                                Halaman ini memaparkan seluruh tahapan matematis metode <strong className="text-slate-100">MARCOS (Measurement of Alternatives and Ranking according to COmpromise Solution)</strong>.
                                Metode ini menentukan alternatif optimal dengan membandingkan nilai alternatif terhadap Solusi Ideal (AI) dan Solusi Anti-Ideal (AAI).
                                Bobot kriteria yang digunakan diambil dari hasil pembobotan metode <strong className="text-slate-100">SWARA</strong>.
                            </p>
                        </div>

                        {/* Interactive Steps Tabs */}
                        <Tabs defaultValue="matrix" className="w-full">
                            <TabsList className="bg-[#0b1020] border border-[#4f657a] p-1 rounded-md flex flex-wrap h-auto gap-1 w-full justify-start ">
                                <TabsTrigger value="matrix" className="rounded-md py-2 px-3.5 text-xs font-semibold text-[#b2bfca] data-[state=active]:bg-[#152133] data-[state=active]:border data-[state=active]:border-[#6f8295] data-[state=active]:text-[#64d8c1] transition duration-200">
                                    1. Matriks Awal (x_ij)
                                </TabsTrigger>
                                <TabsTrigger value="normalized" className="rounded-md py-2 px-3.5 text-xs font-semibold text-[#b2bfca] data-[state=active]:bg-[#152133] data-[state=active]:border data-[state=active]:border-[#6f8295] data-[state=active]:text-[#64d8c1] transition duration-200">
                                    2. Normalisasi (n_ij)
                                </TabsTrigger>
                                <TabsTrigger value="weighted" className="rounded-md py-2 px-3.5 text-xs font-semibold text-[#b2bfca] data-[state=active]:bg-[#152133] data-[state=active]:border data-[state=active]:border-[#6f8295] data-[state=active]:text-[#64d8c1] transition duration-200">
                                    3. Matriks Terbobot (v_ij)
                                </TabsTrigger>
                                <TabsTrigger value="utility" className="rounded-md py-2 px-3.5 text-xs font-semibold text-[#b2bfca] data-[state=active]:bg-[#152133] data-[state=active]:border data-[state=active]:border-[#6f8295] data-[state=active]:text-[#64d8c1] transition duration-200">
                                    4. Si, Utilitas & Ranking
                                </TabsTrigger>
                            </TabsList>

                            {/* Tab 1: Decision Matrix */}
                            <TabsContent value="matrix" className="mt-6 space-y-4">
                                <div className="rounded bg-[#111827] border border-[#4f657a] ">
                                    <div className="border-b border-[#4f657a] p-5 md:p-6">
                                        <h3 className="text-lg font-bold text-white font-sans">A. Matriks Keputusan Awal</h3>
                                        <p className="text-xs text-[#b2bfca] mt-1">
                                            Matriks awal dibentuk dari data nilai asli nasabah. Di bagian bawah ditambahkan baris Solusi Ideal (AI) dan Solusi Anti-Ideal (AAI).
                                        </p>
                                    </div>
                                    <div className="p-5 md:p-6">
                                        <div className="overflow-x-auto rounded-md border border-[#4f657a] bg-[#0b1020]">
                                            <Table>
                                                <TableHeader className="bg-[#111827]">
                                                    <TableRow className="border-[#4f657a] hover:bg-transparent">
                                                        <TableHead className="text-xs font-semibold uppercase tracking-wider text-[#b2bfca] py-2.5 font-sans">Alternatif / Kriteria</TableHead>
                                                        {details.criteria.map(c => (
                                                            <TableHead key={c.id} className="text-center text-xs font-semibold uppercase tracking-wider text-[#b2bfca] py-2.5 font-mono">
                                                                <span 
                                                                    className="cursor-help underline decoration-[#4f657a] decoration-dotted hover:text-[#64d8c1] transition" 
                                                                    title={`${c.name} (${c.type === 'benefit' ? 'Benefit' : 'Cost'})`}
                                                                >
                                                                    {c.code}
                                                                </span>
                                                                <span className="block text-[9px] font-sans font-normal text-[#8294aa] lowercase mt-0.5">({c.type === 'benefit' ? 'benefit' : 'cost'})</span>
                                                            </TableHead>
                                                        ))}
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {details.alternatives.map((alt) => (
                                                        <TableRow key={alt.id} className="border-[#4f657a] hover:bg-[#152133]/40 transition-colors">
                                                            <TableCell className="font-medium text-slate-100 py-2.5">{alt.name} ({alt.code})</TableCell>
                                                            {details.criteria.map(c => (
                                                                <TableCell key={c.id} className="text-center font-mono text-[#b2bfca] py-2.5 text-sm">
                                                                    {details.decision_matrix[alt.id][c.id]}
                                                                </TableCell>
                                                            ))}
                                                        </TableRow>
                                                    ))}
                                                    {/* AI Row */}
                                                    <TableRow className="bg-[#123b38] border-t border-[#64d8c1]/35 text-[#64d8c1] hover:bg-[#123b38] transition-colors">
                                                        <TableCell className="font-bold py-2.5">Solusi Ideal (AI)</TableCell>
                                                        {details.criteria.map(c => (
                                                            <TableCell key={c.id} className="text-center font-mono font-bold py-2.5 text-sm">
                                                                {details.ideal_solutions.AI[c.id]}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                    {/* AAI Row */}
                                                    <TableRow className="bg-rose-950/20 border-t border-rose-900/50 text-rose-400 hover:bg-rose-950/30 transition-colors">
                                                        <TableCell className="font-bold py-2.5">Solusi Anti-Ideal (AAI)</TableCell>
                                                        {details.criteria.map(c => (
                                                            <TableCell key={c.id} className="text-center font-mono font-bold py-2.5 text-sm">
                                                                {details.ideal_solutions.AAI[c.id]}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Tab 2: Normalized Matrix */}
                            <TabsContent value="normalized" className="mt-6 space-y-4">
                                <div className="rounded bg-[#111827] border border-[#4f657a] ">
                                    <div className="border-b border-[#4f657a] p-5 md:p-6">
                                        <h3 className="text-lg font-bold text-white font-sans">B. Matriks Normalisasi (n_ij)</h3>
                                        <p className="text-xs text-[#b2bfca] mt-1">
                                            Normalisasi menggunakan formula: Benefit = x_ij / AI_j | Cost = AI_j / x_ij. Ideal AI selalu memiliki nilai normalisasi 1.0000.
                                        </p>
                                    </div>
                                    <div className="p-5 md:p-6">
                                        <div className="overflow-x-auto rounded-md border border-[#4f657a] bg-[#0b1020]">
                                            <Table>
                                                <TableHeader className="bg-[#111827]">
                                                    <TableRow className="border-[#4f657a] hover:bg-transparent">
                                                        <TableHead className="text-xs font-semibold uppercase tracking-wider text-[#b2bfca] py-2.5 font-sans">Alternatif / Kriteria</TableHead>
                                                        {details.criteria.map(c => (
                                                            <TableHead key={c.id} className="text-center text-xs font-semibold uppercase tracking-wider text-[#b2bfca] py-2.5 font-mono">
                                                                <span 
                                                                    className="cursor-help underline decoration-[#4f657a] decoration-dotted hover:text-[#64d8c1] transition" 
                                                                    title={`${c.name} (${c.type === 'benefit' ? 'Benefit' : 'Cost'})`}
                                                                >
                                                                    {c.code}
                                                                </span>
                                                            </TableHead>
                                                        ))}
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {details.alternatives.map((alt) => (
                                                        <TableRow key={alt.id} className="border-[#4f657a] hover:bg-[#152133]/40 transition-colors">
                                                            <TableCell className="font-medium text-slate-100 py-2.5">{alt.name} ({alt.code})</TableCell>
                                                            {details.criteria.map(c => (
                                                                <TableCell key={c.id} className="text-center font-mono text-[#b2bfca] py-2.5 text-sm">
                                                                    {details.normalized_matrix[alt.id][c.id].toFixed(4)}
                                                                </TableCell>
                                                            ))}
                                                        </TableRow>
                                                    ))}
                                                    <TableRow className="bg-[#123b38] border-t border-[#64d8c1]/35 text-[#64d8c1] hover:bg-[#123b38] transition-colors">
                                                        <TableCell className="font-bold py-2.5">Solusi Ideal (AI)</TableCell>
                                                        {details.criteria.map(c => (
                                                            <TableCell key={c.id} className="text-center font-mono font-bold py-2.5 text-sm">
                                                                {details.normalized_AI[c.id].toFixed(4)}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                    <TableRow className="bg-rose-950/20 border-t border-rose-900/50 text-rose-400 hover:bg-rose-950/30 transition-colors">
                                                        <TableCell className="font-bold py-2.5">Solusi Anti-Ideal (AAI)</TableCell>
                                                        {details.criteria.map(c => (
                                                            <TableCell key={c.id} className="text-center font-mono font-bold py-2.5 text-sm">
                                                                {details.normalized_AAI[c.id].toFixed(4)}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Tab 3: Weighted Normalized Matrix */}
                            <TabsContent value="weighted" className="mt-6 space-y-4">
                                <div className="rounded bg-[#111827] border border-[#4f657a] ">
                                    <div className="border-b border-[#4f657a] p-5 md:p-6">
                                        <h3 className="text-lg font-bold text-white font-sans">C. Matriks Normalisasi Terbobot (v_ij)</h3>
                                        <p className="text-xs text-[#b2bfca] mt-1">
                                            Normalisasi terbobot didapatkan dengan mengalikan nilai normalisasi n_ij dengan bobot kriteria hasil SWARA (w_j).
                                        </p>
                                    </div>
                                    <div className="p-5 md:p-6">
                                        <div className="overflow-x-auto rounded-md border border-[#4f657a] bg-[#0b1020]">
                                            <Table>
                                                <TableHeader className="bg-[#111827]">
                                                    <TableRow className="border-[#4f657a] hover:bg-transparent">
                                                        <TableHead className="text-xs font-semibold uppercase tracking-wider text-[#b2bfca] py-2.5 font-sans">Alternatif / Kriteria</TableHead>
                                                        {details.criteria.map(c => (
                                                            <TableHead key={c.id} className="text-center text-xs font-semibold uppercase tracking-wider text-[#b2bfca] py-2.5 font-mono">
                                                                <span 
                                                                    className="cursor-help underline decoration-[#4f657a] decoration-dotted hover:text-[#64d8c1] transition" 
                                                                    title={`${c.name} (${c.type === 'benefit' ? 'Benefit' : 'Cost'})`}
                                                                >
                                                                    {c.code}
                                                                </span>
                                                                <span className="block text-[9px] font-sans font-medium text-[#64d8c1]/80 lowercase mt-0.5">
                                                                    (w: {details.weights[c.id].toFixed(4)})
                                                                </span>
                                                            </TableHead>
                                                        ))}
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {details.alternatives.map((alt) => (
                                                        <TableRow key={alt.id} className="border-[#4f657a] hover:bg-[#152133]/40 transition-colors">
                                                            <TableCell className="font-medium text-slate-100 py-2.5">{alt.name} ({alt.code})</TableCell>
                                                            {details.criteria.map(c => (
                                                                <TableCell key={c.id} className="text-center font-mono text-[#b2bfca] py-2.5 text-sm">
                                                                    {details.weighted_matrix[alt.id][c.id].toFixed(4)}
                                                                </TableCell>
                                                            ))}
                                                        </TableRow>
                                                    ))}
                                                    <TableRow className="bg-[#123b38] border-t border-[#64d8c1]/35 text-[#64d8c1] hover:bg-[#123b38] transition-colors">
                                                        <TableCell className="font-bold py-2.5">Solusi Ideal (AI)</TableCell>
                                                        {details.criteria.map(c => (
                                                            <TableCell key={c.id} className="text-center font-mono font-bold py-2.5 text-sm">
                                                                {details.weighted_AI[c.id].toFixed(4)}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                    <TableRow className="bg-rose-950/20 border-t border-rose-900/50 text-rose-400 hover:bg-rose-950/30 transition-colors">
                                                        <TableCell className="font-bold py-2.5">Solusi Anti-Ideal (AAI)</TableCell>
                                                        {details.criteria.map(c => (
                                                            <TableCell key={c.id} className="text-center font-mono font-bold py-2.5 text-sm">
                                                                {details.weighted_AAI[c.id].toFixed(4)}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Tab 4: Utility Values and Rankings */}
                            <TabsContent value="utility" className="mt-6 space-y-6">
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="group relative overflow-hidden rounded bg-[#111827] border border-[#4f657a] p-5 transition hover:border-[#64d8c1]/45 shadow-sm">
                                        <div className="border-b border-[#4f657a]/50 pb-2 mb-2">
                                            <h4 className="text-xs font-semibold tracking-wider text-[#b2bfca] uppercase font-mono">S_AI (Jumlah Terbobot Ideal)</h4>
                                        </div>
                                        <div className="mt-2 text-2xl font-bold text-[#64d8c1] font-mono">{details.s_ai.toFixed(6)}</div>
                                        <p className="text-xs text-[#8294aa] mt-1.5 leading-relaxed">S_AI = Total nilai pada baris Solusi Ideal (AI)</p>
                                    </div>

                                    <div className="group relative overflow-hidden rounded bg-[#111827] border border-[#4f657a] p-5 transition hover:border-rose-500/30 shadow-sm">
                                        <div className="border-b border-[#4f657a]/50 pb-2 mb-2">
                                            <h4 className="text-xs font-semibold tracking-wider text-[#b2bfca] uppercase font-mono">S_AAI (Jumlah Terbobot Anti-Ideal)</h4>
                                        </div>
                                        <div className="mt-2 text-2xl font-bold text-rose-400 font-mono">{details.s_aai.toFixed(6)}</div>
                                        <p className="text-xs text-[#8294aa] mt-1.5 leading-relaxed">S_AAI = Total nilai pada baris Solusi Anti-Ideal (AAI)</p>
                                    </div>
                                </div>

                                <div className="rounded bg-[#111827] border border-[#4f657a] ">
                                    <div className="border-b border-[#4f657a] p-5 md:p-6">
                                        <h3 className="text-lg font-bold text-white font-sans">D. Si, Derajat Utilitas (Ki), Fungsi Utilitas f(Ki), dan Ranking Akhir</h3>
                                        <p className="text-xs text-[#b2bfca] mt-1">
                                            Alternatif terbaik adalah yang memiliki nilai utilitas terbesar.
                                        </p>
                                    </div>
                                    <div className="p-5 md:p-6">
                                        <div className="overflow-x-auto rounded-md border border-[#4f657a] bg-[#0b1020]">
                                            <Table>
                                                <TableHeader className="bg-[#111827]">
                                                    <TableRow className="border-[#4f657a] hover:bg-transparent">
                                                        <TableHead className="text-xs font-semibold uppercase tracking-wider text-[#b2bfca] py-2.5 font-sans">Nasabah</TableHead>
                                                        <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-[#b2bfca] py-2.5 font-mono">Si (SUM Vij)</TableHead>
                                                        <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-[#b2bfca] py-2.5 font-mono">Ki-</TableHead>
                                                        <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-[#b2bfca] py-2.5 font-mono">Ki+</TableHead>
                                                        <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-[#b2bfca] py-2.5 font-mono">f(Ki-)</TableHead>
                                                        <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-[#b2bfca] py-2.5 font-mono">f(Ki+)</TableHead>
                                                        <TableHead className="text-center bg-[#123b38] text-xs font-bold uppercase tracking-wider text-[#64d8c1] py-2.5 border-l border-[#4f657a]">Nilai Utilitas</TableHead>
                                                        <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-[#b2bfca] py-2.5 font-sans">Status</TableHead>
                                                        <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-[#b2bfca] py-2.5 pr-6 font-sans">Rank</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {details.alternatives.map((alt) => {
                                                        const rankInfo = details.rankings[alt.id];
                                                        const kiMinus = details.utility_degrees[alt.id].k_minus;
                                                        const kiPlus = details.utility_degrees[alt.id].k_plus;
                                                        const fKiMinus = details.utility_functions[alt.id].f_k_minus;
                                                        const fKiPlus = details.utility_functions[alt.id].f_k_plus;
                                                        const utilVal = details.utility_functions[alt.id].utility_value;

                                                        return (
                                                            <TableRow key={alt.id} className="border-[#4f657a] hover:bg-[#152133]/40 transition-colors">
                                                                <TableCell className="font-semibold text-slate-100 py-2.5">{alt.name}</TableCell>
                                                                <TableCell className="text-center font-mono text-[#b2bfca] text-sm py-2.5">{details.si_values[alt.id].toFixed(4)}</TableCell>
                                                                <TableCell className="text-center font-mono text-[#b2bfca] text-sm py-2.5">{kiMinus.toFixed(4)}</TableCell>
                                                                <TableCell className="text-center font-mono text-[#b2bfca] text-sm py-2.5">{kiPlus.toFixed(4)}</TableCell>
                                                                <TableCell className="text-center font-mono text-[#b2bfca] text-sm py-2.5">{fKiMinus.toFixed(4)}</TableCell>
                                                                <TableCell className="text-center font-mono text-[#b2bfca] text-sm py-2.5">{fKiPlus.toFixed(4)}</TableCell>
                                                                <TableCell className="text-center font-mono bg-[#123b38] text-[#64d8c1] font-extrabold text-sm py-2.5 border-l border-[#4f657a]">{utilVal.toFixed(4)}</TableCell>
                                                                <TableCell className="text-center py-2.5">{getStatusBadge(rankInfo.status)}</TableCell>
                                                                <TableCell className="text-center font-bold text-white bg-[#0b1020]/10 py-2.5 pr-6">
                                                                    <span className={`inline-flex items-center justify-center h-6 w-6 rounded-md text-xs font-semibold ${
                                                                        rankInfo.rank === 1 ? 'bg-[#d6b45f]/10 text-amber-400 border border-amber-500/20' :
                                                                        rankInfo.rank === 2 ? 'bg-[#6f8295]/10 text-[#b2bfca] border border-[#6f8295]/25' :
                                                                        rankInfo.rank === 3 ? 'bg-amber-700/10 text-amber-600 border border-amber-700/20' :
                                                                        'text-[#b2bfca]/80 font-normal'
                                                                    }`}>
                                                                        {rankInfo.rank}
                                                                    </span>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

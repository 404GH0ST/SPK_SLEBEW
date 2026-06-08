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
                return <span className="inline-flex items-center text-[11px] font-bold bg-coop-teal/10 text-coop-teal border border-coop-teal/35 px-2.5 py-0.5 rounded-md">{status}</span>;
            case 'Layak':
                return <span className="inline-flex items-center text-[11px] font-bold bg-coop-blue/10 text-coop-blue border border-coop-blue/35 px-2.5 py-0.5 rounded-md">{status}</span>;
            case 'Dipertimbangkan':
                return <span className="inline-flex items-center text-[11px] font-bold bg-coop-gold/10 text-coop-gold border border-coop-gold/30 px-2.5 py-0.5 rounded-md">{status}</span>;
            default:
                return <span className="inline-flex items-center text-[11px] font-bold bg-red-50 dark:bg-rose-950/40 text-red-700 dark:text-rose-400 border border-red-200 dark:border-rose-900/50 px-2.5 py-0.5 rounded-md">{status}</span>;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight text-coop-text font-sans">
                        Detail Perhitungan MARCOS
                    </h2>
                    {canCalculate && !error && (
                        <Button
                            onClick={handleRunCalculation}
                            disabled={calculating}
                            className="bg-coop-gold hover:bg-coop-gold-hover text-coop-bg gap-2 rounded-md transition duration-300 font-semibold border border-[#aa7f31] h-10 px-4 "
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
                            <h3 className="font-bold text-base text-coop-text">Perhitungan Terhambat</h3>
                        </div>
                        <p className="text-sm text-rose-400 leading-relaxed">{error}</p>
                        <div className="pt-1 flex flex-col sm:flex-row gap-3">
                            {error.includes("bobot SWARA") && (
                                <Button
                                    onClick={() => router.get(route('swara.index'))}
                                    className="bg-coop-gold hover:bg-coop-gold-hover text-coop-bg rounded text-xs gap-1.5 transition px-3.5 h-8 font-semibold border border-[#aa7f31]"
                                >
                                    Atur Bobot SWARA <ArrowRight className="h-3 w-3" />
                                </Button>
                            )}
                            {error.includes("Nilai alternatif") && (
                                <Button
                                    onClick={() => router.get(route('scores.index'))}
                                    className="bg-coop-gold hover:bg-coop-gold-hover text-coop-bg rounded text-xs gap-1.5 transition px-3.5 h-8 font-semibold border border-[#aa7f31]"
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
                        <div className="rounded bg-coop-card border border-coop-border p-5 md:p-6 ">
                            <h3 className="text-lg font-bold text-coop-text flex items-center gap-2">
                                <span className="p-1 rounded bg-coop-teal/10 text-coop-teal border border-coop-teal/30">
                                    <Sparkles className="h-4 w-4" />
                                </span>
                                Penjelasan Perhitungan
                            </h3>
                            <p className="text-coop-muted-light text-sm mt-3 leading-relaxed">
                                Halaman ini memaparkan seluruh tahapan matematis metode <strong className="text-coop-text">MARCOS (Measurement of Alternatives and Ranking according to COmpromise Solution)</strong>.
                                Metode ini menentukan alternatif optimal dengan membandingkan nilai alternatif terhadap Solusi Ideal (AI) dan Solusi Anti-Ideal (AAI).
                                Bobot kriteria yang digunakan diambil dari hasil pembobotan metode <strong className="text-coop-text">SWARA</strong>.
                            </p>
                        </div>

                        {/* Interactive Steps Tabs */}
                        <Tabs defaultValue="matrix" className="w-full">
                            <TabsList className="bg-coop-bg border border-coop-border p-1 rounded-md flex flex-wrap h-auto gap-1 w-full justify-start ">
                                <TabsTrigger value="matrix" className="rounded-md py-2 px-3.5 text-xs font-semibold text-coop-muted-light data-[state=active]:bg-coop-highlight data-[state=active]:border data-[state=active]:border-coop-border data-[state=active]:text-coop-teal transition duration-200">
                                    1. Matriks Awal (x_ij)
                                </TabsTrigger>
                                <TabsTrigger value="normalized" className="rounded-md py-2 px-3.5 text-xs font-semibold text-coop-muted-light data-[state=active]:bg-coop-highlight data-[state=active]:border data-[state=active]:border-coop-border data-[state=active]:text-coop-teal transition duration-200">
                                    2. Normalisasi (n_ij)
                                </TabsTrigger>
                                <TabsTrigger value="weighted" className="rounded-md py-2 px-3.5 text-xs font-semibold text-coop-muted-light data-[state=active]:bg-coop-highlight data-[state=active]:border data-[state=active]:border-coop-border data-[state=active]:text-coop-teal transition duration-200">
                                    3. Matriks Terbobot (v_ij)
                                </TabsTrigger>
                                <TabsTrigger value="utility" className="rounded-md py-2 px-3.5 text-xs font-semibold text-coop-muted-light data-[state=active]:bg-coop-highlight data-[state=active]:border data-[state=active]:border-coop-border data-[state=active]:text-coop-teal transition duration-200">
                                    4. Si, Utilitas & Ranking
                                </TabsTrigger>
                            </TabsList>

                            {/* Tab 1: Decision Matrix */}
                            <TabsContent value="matrix" className="mt-6 space-y-4">
                                <div className="rounded bg-coop-card border border-coop-border ">
                                    <div className="border-b border-coop-border p-5 md:p-6">
                                        <h3 className="text-lg font-bold text-coop-text font-sans">A. Matriks Keputusan Awal</h3>
                                        <p className="text-xs text-coop-muted-light mt-1">
                                            Matriks awal dibentuk dari data nilai asli nasabah. Di bagian bawah ditambahkan baris Solusi Ideal (AI) dan Solusi Anti-Ideal (AAI).
                                        </p>
                                    </div>
                                    <div className="p-5 md:p-6">
                                        <div className="overflow-x-auto rounded-md border border-coop-border bg-coop-bg">
                                            <Table>
                                                <TableHeader className="bg-coop-card">
                                                    <TableRow className="border-coop-border hover:bg-transparent">
                                                        <TableHead className="text-xs font-semibold uppercase tracking-wider text-coop-muted-light py-2.5 font-sans">Alternatif / Kriteria</TableHead>
                                                        {details.criteria.map(c => (
                                                            <TableHead key={c.id} className="text-center text-xs font-semibold uppercase tracking-wider text-coop-muted-light py-2.5 font-mono">
                                                                <span 
                                                                    className="cursor-help underline decoration-coop-border decoration-dotted hover:text-coop-teal transition" 
                                                                    title={`${c.name} (${c.type === 'benefit' ? 'Benefit' : 'Cost'})`}
                                                                >
                                                                    {c.code}
                                                                </span>
                                                                <span className="block text-[9px] font-sans font-normal text-coop-muted-dark lowercase mt-0.5">({c.type === 'benefit' ? 'benefit' : 'cost'})</span>
                                                            </TableHead>
                                                        ))}
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {details.alternatives.map((alt) => (
                                                        <TableRow key={alt.id} className="border-coop-border hover:bg-coop-highlight/40 transition-colors">
                                                            <TableCell className="font-medium text-coop-text py-2.5">{alt.name} ({alt.code})</TableCell>
                                                            {details.criteria.map(c => (
                                                                <TableCell key={c.id} className="text-center font-mono text-coop-muted-light py-2.5 text-sm">
                                                                    {details.decision_matrix[alt.id][c.id]}
                                                                </TableCell>
                                                            ))}
                                                        </TableRow>
                                                    ))}
                                                    {/* AI Row */}
                                                    <TableRow className="bg-coop-teal/10 border-t border-coop-teal/35 text-coop-teal hover:bg-coop-teal/10 transition-colors">
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
                                <div className="rounded bg-coop-card border border-coop-border ">
                                    <div className="border-b border-coop-border p-5 md:p-6">
                                        <h3 className="text-lg font-bold text-coop-text font-sans">B. Matriks Normalisasi (n_ij)</h3>
                                        <p className="text-xs text-coop-muted-light mt-1">
                                            Normalisasi menggunakan formula: Benefit = x_ij / AI_j | Cost = AI_j / x_ij. Ideal AI selalu memiliki nilai normalisasi 1.0000.
                                        </p>
                                    </div>
                                    <div className="p-5 md:p-6">
                                        <div className="overflow-x-auto rounded-md border border-coop-border bg-coop-bg">
                                            <Table>
                                                <TableHeader className="bg-coop-card">
                                                    <TableRow className="border-coop-border hover:bg-transparent">
                                                        <TableHead className="text-xs font-semibold uppercase tracking-wider text-coop-muted-light py-2.5 font-sans">Alternatif / Kriteria</TableHead>
                                                        {details.criteria.map(c => (
                                                            <TableHead key={c.id} className="text-center text-xs font-semibold uppercase tracking-wider text-coop-muted-light py-2.5 font-mono">
                                                                <span 
                                                                    className="cursor-help underline decoration-coop-border decoration-dotted hover:text-coop-teal transition" 
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
                                                        <TableRow key={alt.id} className="border-coop-border hover:bg-coop-highlight/40 transition-colors">
                                                            <TableCell className="font-medium text-coop-text py-2.5">{alt.name} ({alt.code})</TableCell>
                                                            {details.criteria.map(c => (
                                                                <TableCell key={c.id} className="text-center font-mono text-coop-muted-light py-2.5 text-sm">
                                                                    {details.normalized_matrix[alt.id][c.id].toFixed(4)}
                                                                </TableCell>
                                                            ))}
                                                        </TableRow>
                                                    ))}
                                                    <TableRow className="bg-coop-teal/10 border-t border-coop-teal/35 text-coop-teal hover:bg-coop-teal/10 transition-colors">
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
                                <div className="rounded bg-coop-card border border-coop-border ">
                                    <div className="border-b border-coop-border p-5 md:p-6">
                                        <h3 className="text-lg font-bold text-coop-text font-sans">C. Matriks Normalisasi Terbobot (v_ij)</h3>
                                        <p className="text-xs text-coop-muted-light mt-1">
                                            Normalisasi terbobot didapatkan dengan mengalikan nilai normalisasi n_ij dengan bobot kriteria hasil SWARA (w_j).
                                        </p>
                                    </div>
                                    <div className="p-5 md:p-6">
                                        <div className="overflow-x-auto rounded-md border border-coop-border bg-coop-bg">
                                            <Table>
                                                <TableHeader className="bg-coop-card">
                                                    <TableRow className="border-coop-border hover:bg-transparent">
                                                        <TableHead className="text-xs font-semibold uppercase tracking-wider text-coop-muted-light py-2.5 font-sans">Alternatif / Kriteria</TableHead>
                                                        {details.criteria.map(c => (
                                                            <TableHead key={c.id} className="text-center text-xs font-semibold uppercase tracking-wider text-coop-muted-light py-2.5 font-mono">
                                                                <span 
                                                                    className="cursor-help underline decoration-coop-border decoration-dotted hover:text-coop-teal transition" 
                                                                    title={`${c.name} (${c.type === 'benefit' ? 'Benefit' : 'Cost'})`}
                                                                >
                                                                    {c.code}
                                                                </span>
                                                                <span className="block text-[9px] font-sans font-medium text-coop-teal/80 lowercase mt-0.5">
                                                                    (w: {details.weights[c.id].toFixed(4)})
                                                                </span>
                                                            </TableHead>
                                                        ))}
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {details.alternatives.map((alt) => (
                                                        <TableRow key={alt.id} className="border-coop-border hover:bg-coop-highlight/40 transition-colors">
                                                            <TableCell className="font-medium text-coop-text py-2.5">{alt.name} ({alt.code})</TableCell>
                                                            {details.criteria.map(c => (
                                                                <TableCell key={c.id} className="text-center font-mono text-coop-muted-light py-2.5 text-sm">
                                                                    {details.weighted_matrix[alt.id][c.id].toFixed(4)}
                                                                </TableCell>
                                                            ))}
                                                        </TableRow>
                                                    ))}
                                                    <TableRow className="bg-coop-teal/10 border-t border-coop-teal/35 text-coop-teal hover:bg-coop-teal/10 transition-colors">
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
                                    <div className="group relative overflow-hidden rounded bg-coop-card border border-coop-border p-5 transition hover:border-coop-teal/45 shadow-sm">
                                        <div className="border-b border-coop-border/50 pb-2 mb-2">
                                            <h4 className="text-xs font-semibold tracking-wider text-coop-muted-light uppercase font-mono">S_AI (Jumlah Terbobot Ideal)</h4>
                                        </div>
                                        <div className="mt-2 text-2xl font-bold text-coop-teal font-mono">{details.s_ai.toFixed(6)}</div>
                                        <p className="text-xs text-coop-muted-dark mt-1.5 leading-relaxed">S_AI = Total nilai pada baris Solusi Ideal (AI)</p>
                                    </div>

                                    <div className="group relative overflow-hidden rounded bg-coop-card border border-coop-border p-5 transition hover:border-rose-500/30 shadow-sm">
                                        <div className="border-b border-coop-border/50 pb-2 mb-2">
                                            <h4 className="text-xs font-semibold tracking-wider text-coop-muted-light uppercase font-mono">S_AAI (Jumlah Terbobot Anti-Ideal)</h4>
                                        </div>
                                        <div className="mt-2 text-2xl font-bold text-rose-400 font-mono">{details.s_aai.toFixed(6)}</div>
                                        <p className="text-xs text-coop-muted-dark mt-1.5 leading-relaxed">S_AAI = Total nilai pada baris Solusi Anti-Ideal (AAI)</p>
                                    </div>
                                </div>

                                <div className="rounded bg-coop-card border border-coop-border ">
                                    <div className="border-b border-coop-border p-5 md:p-6">
                                        <h3 className="text-lg font-bold text-coop-text font-sans">D. Nilai Sᵢ, Derajat Utilitas (Kᵢ), Fungsi Utilitas f(Kᵢ), dan Ranking Akhir</h3>
                                        <p className="text-xs text-coop-muted-light mt-1">
                                            Alternatif terbaik adalah yang memiliki nilai utilitas akhir (Kᵢ) terbesar.
                                        </p>
                                    </div>
                                    <div className="p-5 md:p-6">
                                        <div className="overflow-x-auto rounded-md border border-coop-border bg-coop-bg">
                                            <Table>
                                                <TableHeader className="bg-coop-card">
                                                    <TableRow className="border-coop-border/70 hover:bg-transparent">
                                                        <TableHead rowSpan={2} className="text-xs font-semibold uppercase tracking-wider text-coop-muted-light py-3.5 font-sans">Nasabah</TableHead>
                                                        <TableHead rowSpan={2} className="text-center text-xs font-semibold uppercase tracking-wider text-coop-muted-light py-3.5 font-mono border-l border-coop-border/30">
                                                            <span className="cursor-help underline decoration-coop-border decoration-dotted" title="Si (Sum of Weighted Values): Total nilai tertimbang alternatif. Semakin besar semakin baik." role="tooltip" aria-label="Si (Sum of Weighted Values): Total nilai tertimbang alternatif. Semakin besar semakin baik." tabIndex={0}>Sᵢ</span>
                                                        </TableHead>
                                                        <TableHead colSpan={2} className="text-center text-xs font-bold uppercase tracking-wider text-coop-blue py-2 border-l border-coop-border/30 bg-coop-blue/10">
                                                            Derajat Utilitas (Kᵢ)
                                                        </TableHead>
                                                        <TableHead colSpan={2} className="text-center text-xs font-bold uppercase tracking-wider text-amber-400 py-2 border-l border-coop-border/30 bg-coop-gold/10">
                                                            Fungsi Utilitas f(Kᵢ)
                                                        </TableHead>
                                                        <TableHead rowSpan={2} className="text-center bg-coop-teal/10 text-xs font-bold uppercase tracking-wider text-coop-teal py-3.5 border-l border-coop-border/70">
                                                            <span className="cursor-help underline decoration-coop-teal/40 decoration-dotted" title="Nilai Utilitas Akhir (K): Berada di rentang 0 hingga 1. Semakin mendekati 1 semakin direkomendasikan." role="tooltip" aria-label="Nilai Utilitas Akhir (K): Berada di rentang 0 hingga 1. Semakin mendekati 1 semakin direkomendasikan." tabIndex={0}>Nilai Utilitas (Kᵢ)</span>
                                                        </TableHead>
                                                        <TableHead rowSpan={2} className="text-center text-xs font-semibold uppercase tracking-wider text-coop-muted-light py-3.5 font-sans border-l border-coop-border/30">Status</TableHead>
                                                        <TableHead rowSpan={2} className="text-center text-xs font-semibold uppercase tracking-wider text-coop-muted-light py-3.5 pr-6 font-sans border-l border-coop-border/30">Rank</TableHead>
                                                    </TableRow>
                                                    <TableRow className="border-coop-border/70 hover:bg-transparent bg-coop-card">
                                                        <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-coop-muted-light/95 py-2 font-mono border-l border-coop-border/30 bg-coop-blue/5">
                                                            <span className="cursor-help underline decoration-coop-border decoration-dotted" title="Kᵢ⁻ (Derajat Utilitas terhadap Anti-Ideal): Jarak relatif dari solusi terburuk. Semakin besar semakin baik." role="tooltip" aria-label="Kᵢ⁻ (Derajat Utilitas terhadap Anti-Ideal): Jarak relatif dari solusi terburuk. Semakin besar semakin baik." tabIndex={0}>Kᵢ⁻</span>
                                                        </TableHead>
                                                        <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-coop-muted-light/95 py-2 font-mono border-l border-coop-border/20 bg-coop-blue/5">
                                                            <span className="cursor-help underline decoration-coop-border decoration-dotted" title="Kᵢ⁺ (Derajat Utilitas terhadap Ideal): Kedekatan relatif dengan solusi terbaik. Semakin besar semakin baik." role="tooltip" aria-label="Kᵢ⁺ (Derajat Utilitas terhadap Ideal): Kedekatan relatif dengan solusi terbaik. Semakin besar semakin baik." tabIndex={0}>Kᵢ⁺</span>
                                                        </TableHead>
                                                        <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-coop-muted-light/95 py-2 font-mono border-l border-coop-border/30 bg-coop-gold/5">
                                                            <span className="cursor-help underline decoration-coop-border decoration-dotted" title="f(Kᵢ⁻) (Fungsi Utilitas terhadap Anti-Ideal): Nilai akumulasi utilitas relatif batas terburuk." role="tooltip" aria-label="f(Kᵢ⁻) (Fungsi Utilitas terhadap Anti-Ideal): Nilai akumulasi utilitas relatif batas terburuk." tabIndex={0}>f(Kᵢ⁻)</span>
                                                        </TableHead>
                                                        <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-coop-muted-light/95 py-2 font-mono border-l border-coop-border/20 bg-coop-gold/5">
                                                            <span className="cursor-help underline decoration-coop-border decoration-dotted" title="f(Kᵢ⁺) (Fungsi Utilitas terhadap Ideal): Nilai akumulasi utilitas relatif batas terbaik." role="tooltip" aria-label="f(Kᵢ⁺) (Fungsi Utilitas terhadap Ideal): Nilai akumulasi utilitas relatif batas terbaik." tabIndex={0}>f(Kᵢ⁺)</span>
                                                        </TableHead>
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
                                                            <TableRow key={alt.id} className="border-coop-border/50 hover:bg-coop-highlight/40 transition-colors">
                                                                <TableCell className="font-semibold text-coop-text py-2.5 min-w-[150px] max-w-[220px] whitespace-normal leading-snug">{alt.name}</TableCell>
                                                                <TableCell className="text-center font-mono text-coop-muted-light text-sm py-2.5 border-l border-coop-border/30">{details.si_values[alt.id].toFixed(4)}</TableCell>
                                                                <TableCell className="text-center font-mono text-coop-muted-light text-sm py-2.5 border-l border-coop-border/30 bg-[#152547]/5">{kiMinus.toFixed(4)}</TableCell>
                                                                <TableCell className="text-center font-mono text-coop-muted-light text-sm py-2.5 border-l border-coop-border/20 bg-[#152547]/5">{kiPlus.toFixed(4)}</TableCell>
                                                                <TableCell className="text-center font-mono text-coop-muted-light text-sm py-2.5 border-l border-coop-border/30 bg-[#2b221a]/5">{fKiMinus.toFixed(4)}</TableCell>
                                                                <TableCell className="text-center font-mono text-coop-muted-light text-sm py-2.5 border-l border-coop-border/20 bg-[#2b221a]/5">{fKiPlus.toFixed(4)}</TableCell>
                                                                <TableCell className="text-center font-mono bg-coop-teal/10 text-coop-teal font-extrabold text-sm py-2.5 border-l border-coop-border/70">{utilVal.toFixed(4)}</TableCell>
                                                                <TableCell className="text-center py-2.5 border-l border-coop-border/30">{getStatusBadge(rankInfo.status)}</TableCell>
                                                                <TableCell className="text-center font-bold text-coop-text bg-coop-bg/10 py-2.5 pr-6 border-l border-coop-border/30">
                                                                    <span className={`inline-flex items-center justify-center h-6 w-6 rounded text-xs font-semibold ${
                                                                        rankInfo.rank === 1 ? 'bg-coop-gold/10 text-amber-400 border border-amber-500/20' :
                                                                        rankInfo.rank === 2 ? 'bg-[#6f8295]/10 text-coop-muted-light border border-coop-border/25' :
                                                                        rankInfo.rank === 3 ? 'bg-amber-700/10 text-amber-600 border border-amber-700/20' :
                                                                        'text-coop-muted-light/80 font-normal'
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

                                        {/* Parameter Explanations */}
                                        <div className="mt-6 p-5 rounded bg-coop-bg border border-coop-border space-y-4">
                                            <h4 className="text-sm font-bold text-coop-text flex items-center gap-2">
                                                <HelpCircle className="h-4 w-4 text-coop-gold" /> Legenda & Cara Membaca Parameter MARCOS
                                            </h4>
                                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs text-coop-muted-light">
                                                <div className="p-3.5 rounded bg-coop-card border border-coop-border/40 transition duration-300 hover:border-coop-teal/40 hover:bg-coop-highlight/25 shadow-sm">
                                                    <strong className="text-coop-teal block mb-1">Sᵢ (Sum of Weighted Values)</strong>
                                                    Total nilai tertimbang alternatif. Semakin besar nilainya, semakin baik kinerja nasabah tersebut secara keseluruhan terhadap kriteria.
                                                </div>
                                                <div className="p-3.5 rounded bg-coop-card border border-coop-border/40 transition duration-300 hover:border-coop-blue/40 hover:bg-coop-highlight/25 shadow-sm">
                                                    <strong className="text-coop-blue block mb-1">Kᵢ⁻ & Kᵢ⁺ (Derajat Utilitas)</strong>
                                                    Mengukur seberapa jauh alternatif dari Solusi Anti-Ideal (terburuk, Kᵢ⁻) dan seberapa dekat dengan Solusi Ideal (terbaik, Kᵢ⁺).
                                                </div>
                                                <div className="p-3.5 rounded bg-coop-card border border-coop-border/40 transition duration-300 hover:border-amber-500/40 hover:bg-coop-highlight/25 shadow-sm">
                                                    <strong className="text-amber-400 block mb-1">f(Kᵢ⁻) & f(Kᵢ⁺) (Fungsi Utilitas Substitusi)</strong>
                                                    Nilai pembanding utilitas relatif terhadap batas terburuk f(Kᵢ⁻) dan batas terbaik f(Kᵢ⁺) untuk diakumulasi menjadi nilai keputusan tunggal.
                                                </div>
                                                <div className="p-3.5 rounded bg-coop-card border border-coop-border/40 transition duration-300 hover:border-coop-gold/40 hover:bg-coop-highlight/25 shadow-sm sm:col-span-2 lg:col-span-3">
                                                    <strong className="text-coop-text block mb-1">Nilai Utilitas Kᵢ (Hasil Keputusan Akhir)</strong>
                                                    Kombinasi akhir dari derajat utilitas dan fungsi utilitas substitusi (berkisar antara 0 hingga 1). **Nasabah dengan Nilai Utilitas Kᵢ tertinggi berada di ranking teratas dan paling layak diprioritaskan mendapat pinjaman.**
                                                </div>
                                            </div>
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

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    Scale, 
    Users, 
    CheckSquare, 
    ArrowRight, 
    Trophy,
    Calculator,
    FileText,
    Shield
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';

interface Ranking {
    id: number;
    rank: number;
    utility_value: number;
    status: string;
    alternative: {
        code: string;
        name: string;
        nik: string;
    };
}

interface DashboardProps {
    stats: {
        criteria_count: number;
        alternative_count: number;
        scored_count: number;
    };
    top_rankings: Ranking[];
}

export default function Dashboard({ stats, top_rankings }: DashboardProps) {
    const user = usePage().props.auth.user as any;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Sangat Layak':
                return <span className="inline-flex items-center text-[11px] font-medium bg-[#123b38] text-[#64d8c1] border border-[#64d8c1]/30 px-2 py-0.5 rounded-md">{status}</span>;
            case 'Layak':
                return <span className="inline-flex items-center text-[11px] font-medium bg-[#111827] text-[#88a4ff] border border-[#88a4ff]/30 px-2 py-0.5 rounded-md">{status}</span>;
            case 'Dipertimbangkan':
                return <span className="inline-flex items-center text-[11px] font-medium bg-[#152133] text-[#f2d98a] border border-[#d6b45f]/35 px-2 py-0.5 rounded-md">{status}</span>;
            default:
                return <span className="inline-flex items-center text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-md">{status}</span>;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-bold tracking-tight text-white">
                    Dashboard Utama
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-6 pb-6">
                {/* Welcome Card */}
                <div className="relative overflow-hidden rounded bg-[#111827] border border-[#4f657a]/70 p-6 md:p-8">
                    <div className="relative z-10 space-y-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider text-[#f2d98a] bg-[#152133] border border-[#d6b45f]/45">
                            <Shield className="h-3 w-3" /> Sistem Pendukung Keputusan
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                            Selamat Datang, {user.name}!
                        </h1>
                        <p className="text-sm text-[#b2bfca] max-w-3xl leading-relaxed">
                            Anda masuk sebagai <strong className="text-[#f2d98a] font-semibold">{user.role.toUpperCase()}</strong>. Gunakan sistem pendukung keputusan kelayakan penerima pinjaman koperasi dengan kombinasi metode SWARA untuk pembobotan kriteria dan MARCOS untuk perangkingan nasabah.
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-5 sm:grid-cols-3">
                    <div className="group relative overflow-hidden rounded bg-[#111827] border border-[#4f657a]/70 p-5 transition-colors hover:border-[#d6b45f]/70">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-[#b2bfca] uppercase">Jumlah Kriteria</span>
                            <div className="p-2 rounded-md bg-[#152133] border border-[#d6b45f]/40 text-[#f2d98a] transition-all">
                                <Scale className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-3xl font-bold text-[#f2d98a] font-mono">{stats.criteria_count}</div>
                            <p className="text-[10px] text-[#8294aa] mt-0.5">Kriteria aktif dalam sistem</p>
                        </div>
                    </div>

                    <div className="group relative overflow-hidden rounded bg-[#111827] border border-[#4f657a]/70 p-5 transition-colors hover:border-[#64d8c1]/70">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-[#b2bfca] uppercase">Jumlah Nasabah</span>
                            <div className="p-2 rounded-md bg-[#123b38] border border-[#64d8c1]/35 text-[#64d8c1] transition-all">
                                <Users className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-3xl font-bold text-[#64d8c1] font-mono">{stats.alternative_count}</div>
                            <p className="text-[10px] text-[#8294aa] mt-0.5">Nasabah terdaftar dalam sistem</p>
                        </div>
                    </div>

                    <div className="group relative overflow-hidden rounded bg-[#111827] border border-[#4f657a]/70 p-5 transition-colors hover:border-[#88a4ff]/70">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-[#b2bfca] uppercase">Nasabah Dinilai Lengkap</span>
                            <div className="p-2 rounded-md bg-[#111827] border border-[#88a4ff]/35 text-[#88a4ff] transition-all">
                                <CheckSquare className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-3xl font-bold text-[#88a4ff] font-mono">{stats.scored_count}</div>
                            <p className="text-[10px] text-[#8294aa] mt-0.5">Siap untuk diproses MARCOS</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Top Rankings Table */}
                    <div className="lg:col-span-2 overflow-hidden rounded bg-[#111827] border border-[#4f657a]/70">
                        <div className="border-b border-[#4f657a]/50 p-5">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-md bg-[#152133] border border-[#d6b45f]/45 text-[#f2d98a]">
                                    <Trophy className="h-4 w-4" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-white">Ranking 5 Besar Terbaik</h3>
                                    <p className="text-xs text-[#b2bfca] mt-0.5">
                                        Nasabah dengan tingkat kelayakan penerima pinjaman tertinggi saat ini
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-5 pt-3">
                            {top_rankings.length === 0 ? (
                                <div className="text-center py-12 text-[#8294aa] text-sm">
                                    Belum ada data perhitungan. Harap lakukan perhitungan MARCOS terlebih dahulu.
                                </div>
                            ) : (
                                <div className="overflow-x-auto rounded-md border border-[#4f657a]/60 bg-[#0b1020]">
                                    <Table>
                                        <TableHeader className="bg-[#111827]">
                                            <TableRow className="border-[#4f657a]/50 hover:bg-transparent">
                                                <TableHead className="w-16 text-center text-xs font-semibold uppercase tracking-wider text-[#b2bfca] py-3">Rank</TableHead>
                                                <TableHead className="text-xs font-semibold uppercase tracking-wider text-[#b2bfca] py-3">Kode</TableHead>
                                                <TableHead className="text-xs font-semibold uppercase tracking-wider text-[#b2bfca] py-3">Nama Nasabah</TableHead>
                                                <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-[#b2bfca] py-3">Nilai Utility</TableHead>
                                                <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-[#b2bfca] py-3">Status Kelayakan</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {top_rankings.map((rank) => (
                                                <TableRow key={rank.id} className="border-[#4f657a]/50 hover:bg-[#152133] transition-colors">
                                                    <TableCell className="font-extrabold text-white text-center bg-[#111827] py-2.5">
                                                        <span className={`inline-flex items-center justify-center h-5 w-5 rounded-md text-[10px] font-bold ${
                                                            rank.rank === 1 ? 'bg-[#152133] text-[#f2d98a] border border-[#d6b45f]/40' :
                                                            rank.rank === 2 ? 'bg-[#111827] text-[#88a4ff] border border-[#88a4ff]/35' :
                                                            rank.rank === 3 ? 'bg-[#123b38] text-[#64d8c1] border border-[#64d8c1]/35' :
                                                            'text-[#8294aa]'
                                                        }`}>
                                                            {rank.rank}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-[#b2bfca] font-mono text-xs py-2.5">{rank.alternative.code}</TableCell>
                                                    <TableCell className="text-slate-100 font-semibold text-sm py-2.5">{rank.alternative.name}</TableCell>
                                                    <TableCell className="text-center text-[#64d8c1] font-bold font-mono text-sm py-2.5">{rank.utility_value.toFixed(4)}</TableCell>
                                                    <TableCell className="text-center py-2.5">{getStatusBadge(rank.status)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions Card */}
                    <div className="overflow-hidden rounded bg-[#111827] border border-[#4f657a]/70 flex flex-col">
                        <div className="border-b border-[#4f657a]/50 p-5">
                            <h3 className="text-base font-bold text-white">Aktivitas Cepat</h3>
                            <p className="text-xs text-[#b2bfca] mt-0.5">
                                Akses fitur utama berdasarkan hak akses Anda
                            </p>
                        </div>
                        <div className="p-5 space-y-2 flex-1 flex flex-col justify-start">
                            {user.role === 'admin' && (
                                <Link
                                    href={route('criteria.index')}
                                    className="flex items-center justify-between p-3 rounded-md border border-[#4f657a] bg-[#0b1020] hover:bg-[#152133] hover:border-[#d6b45f]/70 transition duration-150 group"
                                >
                                    <span className="text-xs font-semibold text-[#b2bfca] group-hover:text-white transition">Kelola Data Kriteria</span>
                                    <ArrowRight className="h-3.5 w-3.5 text-[#8294aa] group-hover:text-[#f2d98a] group-hover:translate-x-0.5 transition" />
                                </Link>
                            )}

                            {(user.role === 'admin' || user.role === 'pakar') && (
                                <Link
                                    href={route('swara.index')}
                                    className="flex items-center justify-between p-3 rounded-md border border-[#4f657a] bg-[#0b1020] hover:bg-[#152133] hover:border-[#d6b45f]/70 transition duration-150 group"
                                >
                                    <span className="text-xs font-semibold text-[#b2bfca] group-hover:text-white transition">Input Urutan Bobot SWARA</span>
                                    <ArrowRight className="h-3.5 w-3.5 text-[#8294aa] group-hover:text-[#f2d98a] group-hover:translate-x-0.5 transition" />
                                </Link>
                            )}

                            {(user.role === 'admin' || user.role === 'petugas') && (
                                <>
                                    <Link
                                        href={route('alternatives.index')}
                                        className="flex items-center justify-between p-3 rounded-md border border-[#4f657a] bg-[#0b1020] hover:bg-[#152133] hover:border-[#d6b45f]/70 transition duration-150 group"
                                    >
                                        <span className="text-xs font-semibold text-[#b2bfca] group-hover:text-white transition">Daftar Nasabah Baru</span>
                                        <ArrowRight className="h-3.5 w-3.5 text-[#8294aa] group-hover:text-[#f2d98a] group-hover:translate-x-0.5 transition" />
                                    </Link>
                                    <Link
                                        href={route('scores.index')}
                                        className="flex items-center justify-between p-3 rounded-md border border-[#4f657a] bg-[#0b1020] hover:bg-[#152133] hover:border-[#d6b45f]/70 transition duration-150 group"
                                    >
                                        <span className="text-xs font-semibold text-[#b2bfca] group-hover:text-white transition">Input Nilai Nasabah</span>
                                        <ArrowRight className="h-3.5 w-3.5 text-[#8294aa] group-hover:text-[#f2d98a] group-hover:translate-x-0.5 transition" />
                                    </Link>
                                </>
                            )}

                            {(user.role === 'admin' || user.role === 'pakar' || user.role === 'petugas') && (
                                <Link
                                    href={route('marcos.details')}
                                    className="flex items-center justify-between p-3 rounded-md border border-[#d6b45f]/50 bg-[#152133] hover:bg-[#1b2a3f] transition duration-150 group"
                                >
                                    <span className="text-xs font-bold text-[#f2d98a] flex items-center gap-2">
                                        <Calculator className="h-3.5 w-3.5 text-[#f2d98a] group-hover:scale-105 transition" /> Proses Hitung MARCOS
                                    </span>
                                    <ArrowRight className="h-3.5 w-3.5 text-[#f2d98a] group-hover:translate-x-0.5 transition" />
                                </Link>
                            )}

                            <Link
                                href={route('marcos.results')}
                                className="flex items-center justify-between p-3 rounded-md border border-[#4f657a] bg-[#0b1020] hover:bg-[#152133] hover:border-[#d6b45f]/70 transition duration-150 group"
                            >
                                <span className="text-xs font-semibold text-[#b2bfca] flex items-center gap-2 group-hover:text-white transition">
                                    <Trophy className="h-3.5 w-3.5 text-[#f2d98a]" /> Lihat Hasil Ranking
                                </span>
                                <ArrowRight className="h-3.5 w-3.5 text-[#8294aa] group-hover:text-[#f2d98a] group-hover:translate-x-0.5 transition" />
                            </Link>

                            <a
                                href={route('reports.pdf')}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between p-3 rounded-md border border-[#4f657a] bg-[#0b1020] hover:bg-[#152133] hover:border-[#d6b45f]/70 transition duration-150 group"
                            >
                                <span className="text-xs font-semibold text-[#b2bfca] flex items-center gap-2 group-hover:text-white transition">
                                    <FileText className="h-3.5 w-3.5 text-[#64d8c1]" /> Cetak Laporan PDF
                                </span>
                                <ArrowRight className="h-3.5 w-3.5 text-[#8294aa] group-hover:text-[#f2d98a] group-hover:translate-x-0.5 transition" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

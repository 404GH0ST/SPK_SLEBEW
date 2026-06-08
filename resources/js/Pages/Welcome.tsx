import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useEffect } from 'react';
import {
    ArrowRight,
    Calculator,
    CheckCircle2,
    ClipboardCheck,
    FileSpreadsheet,
    LockKeyhole,
    Scale,
    Shield,
    UserCheck,
} from 'lucide-react';

const criteriaNodes = [
    { code: 'K1', label: 'Pinjaman', kind: 'Cost' },
    { code: 'K2', label: 'Tenor', kind: 'Cost' },
    { code: 'K3', label: 'Penghasilan', kind: 'Benefit' },
    { code: 'K4', label: 'Jaminan', kind: 'Benefit' },
    { code: 'K5', label: 'Rumah', kind: 'Benefit' },
    { code: 'K6', label: 'Anggota', kind: 'Benefit' },
];

const weights = [
    { code: 'K3', weight: '0.2274', colorClass: 'bg-[var(--teal)]' },
    { code: 'K4', weight: '0.1849', colorClass: 'bg-[var(--champagne)]' },
    { code: 'K1', weight: '0.1682', colorClass: 'bg-[var(--blue)]' },
    { code: 'K2', weight: '0.1541', colorClass: 'bg-[var(--teal)]' },
    { code: 'K5', weight: '0.1452', colorClass: 'bg-[var(--champagne)]' },
    { code: 'K6', weight: '0.1202', colorClass: 'bg-[var(--blue)]' },
];

const rankingRows = [
    { rank: '#1', name: 'Citra Lestari', score: '0.8421', status: 'Sangat Layak' },
    { rank: '#2', name: 'Eka Saputra', score: '0.7148', status: 'Layak' },
    { rank: '#3', name: 'Ahmad Fauzi', score: '0.6385', status: 'Layak' },
];

const methodSteps = [
    {
        title: 'Data dasar',
        text: 'Admin mengunci kriteria, tipe benefit atau cost, dan data nasabah yang akan dinilai.',
        icon: Shield,
    },
    {
        title: 'Bobot SWARA',
        text: 'Pakar memberi urutan kepentingan, sistem menghitung bobot final tanpa menutup jejak rumus.',
        icon: Scale,
    },
    {
        title: 'Ranking MARCOS',
        text: 'Nilai utilitas diperingkat, diberi status kelayakan, lalu siap diekspor untuk rapat koperasi.',
        icon: FileSpreadsheet,
    },
];

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    useEffect(() => {
        if (!window.location.hash || window.location.hash === '#top') {
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
            window.setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }), 0);
        }
    }, []);

    return (
        <>
            <Head title="Sistem Pendukung Keputusan Koperasi" />
            <div id="top" className="landing-premium min-h-screen overflow-x-hidden text-coop-text font-sans antialiased selection:bg-coop-gold/30 selection:text-coop-text">
                <style>{`
                    .landing-premium {
                        --ink: var(--coop-bg);
                        --ink-2: var(--coop-card);
                        --panel: var(--coop-highlight);
                        --panel-teal: color-mix(in srgb, var(--coop-teal) 15%, transparent);
                        --line: var(--coop-border);
                        --line-strong: var(--coop-border);
                        --champagne: var(--coop-gold);
                        --champagne-edge: #aa7f31;
                        --champagne-bright: var(--coop-gold-hover);
                        --teal: var(--coop-teal);
                        --blue: var(--coop-blue);
                        --muted: var(--coop-muted-light);
                        --muted-strong: var(--coop-text);
                        --muted-soft: var(--coop-muted-dark);
                        --muted-blue: var(--coop-blue);
                        background: var(--ink);
                    }

                    .premium-primary {
                        background: var(--champagne);
                        border-color: var(--champagne-edge);
                        color: var(--ink);
                    }

                    .premium-primary:hover {
                        background: var(--champagne-bright);
                    }

                    .premium-secondary {
                        background: var(--ink-2);
                        border-color: var(--line-strong);
                        color: var(--muted-strong);
                    }

                    .premium-secondary:hover {
                        background: var(--panel);
                        border-color: var(--champagne);
                    }

                    .premium-badge {
                        background: var(--panel);
                        border-color: rgb(100 216 193 / .55);
                        color: var(--champagne-bright);
                    }

                    @keyframes node-breathe {
                        0%, 100% { border-color: rgb(89 199 177 / .58); transform: translateY(0); }
                        50% { border-color: rgb(215 181 109 / .92); transform: translateY(-2px); }
                    }

                    @keyframes verdict-lock {
                        0%, 58% { border-color: rgb(89 199 177 / .55); }
                        72%, 100% { border-color: rgb(215 181 109 / .9); }
                    }

                    .map-node-live {
                        animation: node-breathe 3.2s cubic-bezier(.16, 1, .3, 1) infinite;
                    }

                    .verdict-lock {
                        animation: verdict-lock 4s cubic-bezier(.16, 1, .3, 1) infinite;
                    }

                    @media (prefers-reduced-motion: reduce) {
                        .map-node-live,
                        .verdict-lock {
                            animation: none;
                        }
                    }
                `}</style>

                <header className="border-b border-[color:var(--line-strong)]/55 bg-[var(--ink)]">
                    <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between px-5 py-2 sm:px-8">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-md border border-[color:var(--champagne)]/60 bg-[var(--panel)] text-[var(--champagne-bright)]">
                                <Calculator className="h-4.5 w-4.5" />
                            </div>
                            <div>
                                <div className="text-sm font-bold tracking-tight text-coop-text">SPK Kelayakan</div>
                                <div className="text-[11px] font-medium text-[var(--teal)]">SWARA + MARCOS</div>
                            </div>
                        </div>

                        <nav className="flex items-center gap-2">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex min-h-11 items-center gap-2 rounded-md border border-[color:var(--champagne-edge)] bg-[var(--champagne)] px-4 text-xs font-bold text-[var(--ink)] transition hover:bg-[var(--champagne-bright)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--champagne-bright)]"
                                >
                                    Buka dashboard <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="inline-flex min-h-11 items-center rounded-md px-3 text-xs font-semibold text-[var(--muted-strong)] transition hover:bg-[var(--panel)] hover:text-coop-text focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--champagne-bright)]"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="hidden min-h-11 items-center rounded-md border border-[color:var(--line-strong)] bg-[var(--ink-2)] px-4 text-xs font-semibold text-coop-text transition hover:border-[var(--blue)] hover:bg-[var(--panel)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--champagne-bright)] sm:inline-flex"
                                    >
                                        Daftar akun
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <main>
                    <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col justify-center gap-8 px-5 py-10 sm:px-8 lg:py-8">
                        <div className="grid min-w-0 items-end gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
                            <div className="max-w-4xl space-y-5">
                                <div className="premium-badge inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-semibold">
                                    <LockKeyhole className="h-3.5 w-3.5" />
                                    Peta keputusan koperasi yang dapat ditelusuri
                                </div>

                                <div className="space-y-4">
                                    <h1 className="max-w-4xl text-balance text-4xl font-black leading-[1.04] tracking-tight text-coop-text sm:text-5xl lg:text-6xl">
                                        Dari kriteria nasabah ke verdict pinjaman.
                                    </h1>
                                    <p className="max-w-2xl text-pretty text-base leading-7 text-[var(--muted)]">
                                        SPK Kelayakan memetakan data koperasi menjadi bobot SWARA, ranking MARCOS, dan rekomendasi pinjaman yang bisa dijelaskan ulang di rapat pengurus.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                                <Link
                                    href={auth.user ? route('dashboard') : route('login')}
                                    className="premium-primary inline-flex h-11 items-center justify-center gap-2 rounded-md border px-5 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--champagne-bright)]"
                                >
                                    {auth.user ? 'Buka dashboard' : 'Masuk ke aplikasi'}
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                <a
                                    href="#method"
                                    className="premium-secondary inline-flex h-11 items-center justify-center rounded-md border px-5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--champagne-bright)]"
                                >
                                    Lihat alur metode
                                </a>
                            </div>
                        </div>

                        <div className="grid max-w-2xl grid-cols-3 gap-px overflow-hidden rounded-lg border border-[color:var(--line)] bg-[var(--line)]">
                            <div className="bg-[var(--ink-2)] p-4">
                                <div className="text-2xl font-black text-[var(--champagne-bright)]">6</div>
                                <div className="mt-1 text-xs font-medium text-[var(--muted)]">Kriteria aktif</div>
                            </div>
                            <div className="bg-[var(--panel-teal)] p-4">
                                <div className="text-2xl font-black text-[var(--teal)]">4</div>
                                <div className="mt-1 text-xs font-medium text-[var(--muted)]">Peran kerja</div>
                            </div>
                            <div className="bg-[var(--ink-2)] p-4">
                                <div className="text-2xl font-black text-[var(--blue)]">2</div>
                                <div className="mt-1 text-xs font-medium text-[var(--muted)]">Format laporan</div>
                            </div>
                        </div>

                        <div className="relative min-w-0 w-full">
                            <div className="relative overflow-hidden rounded-lg border border-[color:var(--line)] bg-[var(--panel)] p-4 sm:p-5 lg:p-6">
                                <div className="mb-5 flex flex-col gap-3 border-b border-[color:var(--line)] pb-5 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <div className="text-xs font-bold text-[var(--champagne-bright)]">Loan Decision Map</div>
                                        <div className="mt-1 text-xl font-black tracking-tight text-coop-text">Kriteria masuk, bobot bergerak, verdict terkunci</div>
                                    </div>
                                    <div className="inline-flex min-h-11 w-fit items-center gap-2 rounded-md border border-[color:var(--champagne)]/60 bg-[var(--panel)] px-3 py-1.5 text-[11px] font-bold text-[var(--champagne-bright)]">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--champagne-bright)]" />
                                        Siap hitung
                                    </div>
                                </div>

                                <div className="relative min-w-0">
                                    <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(17rem,1fr)_minmax(18rem,1.05fr)_minmax(22rem,1.25fr)]">
                                        <section className="relative z-10 min-w-0">
                                            <div className="mb-3 flex items-center gap-2 text-xs font-bold text-[var(--muted-strong)]">
                                                <ClipboardCheck className="h-4 w-4 text-[var(--teal)]" />
                                                Data kriteria
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
                                                {criteriaNodes.map((node, index) => (
                                                    <div
                                                        key={node.code}
                                                        className="map-node-live rounded-lg border bg-[var(--ink-2)] p-3"
                                                        style={{ animationDelay: `${index * 110}ms` }}
                                                    >
                                                        <div className="flex items-center justify-between gap-2">
                                                            <span className="font-mono text-xs font-black text-[var(--champagne-bright)]">{node.code}</span>
                                                            <span className="text-[10px] font-bold text-[var(--muted-soft)]">{node.kind}</span>
                                                        </div>
                                                        <div className="mt-2 truncate text-xs font-bold text-coop-text">{node.label}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>

                                        <section className="relative z-10 min-w-0 rounded-lg border border-[color:var(--teal)]/55 bg-[var(--panel-teal)] p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="text-xs font-bold text-[var(--champagne)]">SWARA core</div>
                                                    <div className="mt-1 text-sm font-black text-coop-text">Bobot final</div>
                                                </div>
                                                <Scale className="h-5 w-5 text-[var(--champagne-bright)]" />
                                            </div>

                                            <div className="mt-5 space-y-3">
                                                {weights.map((item, index) => (
                                                    <div key={item.code} className="grid grid-cols-[2.2rem_1fr_4.4rem] items-center gap-3">
                                                        <span className="font-mono text-xs font-black text-[var(--champagne-bright)]">{item.code}</span>
                                                        <div className="h-2 overflow-hidden rounded-full bg-[var(--ink)]">
                                                            <div
                                                                className={`h-full rounded-full ${item.colorClass}`}
                                                                style={{ width: `${92 - index * 13}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-right font-mono text-xs font-black text-coop-text">{item.weight}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-5 rounded-md border border-[color:var(--champagne)]/55 bg-[var(--panel)] p-3">
                                                <div className="flex items-center gap-2 text-xs font-bold text-[var(--champagne-bright)]">
                                                    <Calculator className="h-4 w-4" />
                                                    Total bobot = 1.0000
                                                </div>
                                                <p className="mt-1 text-[11px] leading-5 text-[var(--champagne)]">
                                                    Hasil ini menjadi dasar normalisasi MARCOS.
                                                </p>
                                            </div>
                                        </section>

                                        <section className="relative z-10 min-w-0 rounded-lg border border-[color:var(--line-strong)] bg-[var(--ink-2)] p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="text-xs font-bold text-[var(--muted-blue)]">MARCOS verdict</div>
                                                    <div className="mt-1 text-sm font-black text-coop-text">Ranking kelayakan</div>
                                                </div>
                                                <UserCheck className="h-5 w-5 text-[var(--blue)]" />
                                            </div>

                                            <div className="mt-4 space-y-2.5">
                                                {rankingRows.map((row) => (
                                                    <div key={row.rank} className="rounded-lg border border-[color:var(--line)] bg-[var(--ink-2)] p-3.5">
                                                        <div className="grid grid-cols-[2.75rem_minmax(0,1fr)] items-center gap-3">
                                                            <div className="flex items-center">
                                                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[color:var(--champagne)]/50 bg-[var(--panel)] font-mono text-sm font-black text-[var(--champagne-bright)]">
                                                                    {row.rank}
                                                                </span>
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="flex min-w-0 items-baseline justify-between gap-3">
                                                                    <div className="min-w-0 truncate text-sm font-bold text-coop-text">{row.name}</div>
                                                                    <div className="shrink-0 font-mono text-sm font-black text-[var(--teal)]">{row.score}</div>
                                                                </div>
                                                                <div className="mt-0.5 text-[11px] font-medium text-[var(--muted-soft)]">{row.status}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="verdict-lock mt-4 rounded-lg border border-[color:var(--champagne)]/60 bg-[var(--panel)] p-3">
                                                <div className="flex items-center gap-2 text-xs font-bold text-[var(--champagne-bright)]">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    Citra Lestari direkomendasikan
                                                </div>
                                                <p className="mt-1 text-[11px] leading-5 text-[var(--champagne)]">
                                                    Nilai utilitas tertinggi dan status sangat layak.
                                                </p>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="method" className="border-t border-[color:var(--line)] bg-[var(--ink-2)] px-5 py-10 sm:px-8">
                        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.78fr_1.22fr]">
                            <div>
                                <h2 className="text-balance text-2xl font-black tracking-tight text-coop-text sm:text-3xl">
                                    Metode terlihat sebagai alur keputusan.
                                </h2>
                                <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">
                                    Halaman publik boleh lebih ekspresif, tetapi tetap menunjukkan pekerjaan utama: data masuk, bobot dihitung, ranking dikunci.
                                </p>
                            </div>

                            <div className="grid gap-3 md:grid-cols-3">
                                {methodSteps.map((step) => {
                                    const Icon = step.icon;

                                    return (
                                        <article key={step.title} className="rounded-lg border border-[color:var(--line)] bg-[var(--ink)] p-4">
                                            <Icon className="h-5 w-5 text-[var(--champagne-bright)]" />
                                            <h3 className="mt-4 text-sm font-bold text-coop-text">{step.title}</h3>
                                            <p className="mt-2 text-xs leading-5 text-[var(--muted)]">{step.text}</p>
                                        </article>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="border-t border-[color:var(--line)] bg-[var(--ink)] px-5 py-6 sm:px-8">
                    <div className="mx-auto flex max-w-7xl flex-col gap-2 text-xs text-[var(--muted-soft)] sm:flex-row sm:items-center sm:justify-between">
                        <div>SPK Kelayakan Koperasi, SWARA + MARCOS.</div>
                    </div>
                </footer>
            </div>
        </>
    );
}

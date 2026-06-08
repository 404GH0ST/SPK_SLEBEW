import { useState, useEffect, PropsWithChildren, ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    ListChecks, 
    Scale, 
    Users, 
    FileSpreadsheet, 
    Calculator, 
    Trophy, 
    FileText, 
    LogOut, 
    Menu, 
    X,
    UserCheck,
    ChevronRight,
    AlertCircle,
    CheckCircle2,
    Sun,
    Moon
} from 'lucide-react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth, flash } = usePage().props as any;
    const user = auth.user;
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Theme switcher state
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'dark';
        }
        return 'dark';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    };

    // Helper for role badge color and text
    const getRoleInfo = (role: string) => {
        switch (role) {
            case 'admin':
                return { label: 'Administrator', bg: 'bg-coop-gold/10 text-coop-gold border-coop-gold/30' };
            case 'pakar':
                return { label: 'Pakar Koperasi', bg: 'bg-coop-blue/10 text-coop-blue border-coop-blue/30' };
            case 'petugas':
                return { label: 'Petugas Lapangan', bg: 'bg-coop-teal/10 text-coop-teal border-coop-teal/30' };
            case 'pimpinan':
                return { label: 'Pimpinan', bg: 'bg-coop-teal/10 text-coop-teal border-coop-teal/30' };
            default:
                return { label: 'Pengguna', bg: 'bg-coop-highlight text-coop-muted-light border-coop-border' };
        }
    };

    const roleInfo = getRoleInfo(user.role);

    const navItems = [
        {
            name: 'Dashboard',
            href: route('dashboard'),
            active: route().current('dashboard'),
            icon: LayoutDashboard,
        },
        {
            name: 'Data Kriteria',
            href: route('criteria.index'),
            active: route().current('criteria.*'),
            icon: ListChecks,
        },
        {
            name: 'Pembobotan SWARA',
            href: route('swara.index'),
            active: route().current('swara.*'),
            icon: Scale,
        },
        {
            name: 'Data Nasabah',
            href: route('alternatives.index'),
            active: route().current('alternatives.*'),
            icon: Users,
        },
        {
            name: 'Nilai Nasabah',
            href: route('scores.index'),
            active: route().current('scores.*'),
            icon: FileSpreadsheet,
        },
        {
            name: 'Perhitungan MARCOS',
            href: route('marcos.details'),
            active: route().current('marcos.details'),
            icon: Calculator,
        },
        {
            name: 'Hasil Ranking',
            href: route('marcos.results'),
            active: route().current('marcos.results'),
            icon: Trophy,
        },
    ];

    return (
        <div className="min-h-screen bg-coop-bg text-coop-text flex flex-col md:flex-row font-sans antialiased">
            
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex md:w-64 lg:w-72 bg-coop-card border-r border-coop-border flex-col shrink-0">
                {/* Brand Header */}
                <div className="h-16 px-6 flex items-center gap-2.5 border-b border-coop-border/60">
                    <div className="h-8 w-8 rounded-md bg-coop-teal/10 flex items-center justify-center border border-coop-teal/35">
                        <UserCheck className="h-4 w-4 text-coop-teal" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-coop-text">
                        SPK Kelayakan
                    </span>
                </div>

                {/* Profile Card */}
                <div className="p-5 border-b border-coop-border/60">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-coop-highlight border border-coop-border flex items-center justify-center font-bold text-coop-teal ">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold truncate text-coop-text">{user.name}</p>
                            <span className={`inline-block mt-1 px-2 py-0.5 text-[9px] font-semibold rounded-md border tracking-wide uppercase ${roleInfo.bg}`}>
                                {roleInfo.label}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-150 group relative ${
                                    item.active
                                        ? 'bg-coop-highlight text-coop-teal border border-coop-border'
                                        : 'text-coop-muted-light hover:bg-coop-highlight/40 hover:text-coop-text border border-transparent'
                                }`}
                            >
                                <Icon className={`h-4.5 w-4.5 shrink-0 ${item.active ? 'text-coop-teal' : 'text-coop-muted-light group-hover:text-coop-text'}`} />
                                <span className="flex-1">{item.name}</span>
                                {item.active && (
                                    <div className="absolute right-3 h-1.5 w-1.5 rounded-full bg-coop-teal"></div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Section */}
                <div className="p-4 border-t border-coop-border/60 bg-coop-bg/20">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-coop-muted-light hover:bg-rose-500/10 hover:text-rose-400 rounded-md transition-colors duration-150 border border-transparent hover:border-rose-500/10"
                    >
                        <LogOut className="h-4.5 w-4.5 shrink-0" />
                        <span>Keluar Aplikasi</span>
                    </Link>
                </div>
            </aside>

            {/* Mobile Navigation Bar */}
            <header className="md:hidden h-16 px-4 bg-coop-card border-b border-coop-border flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <UserCheck className="h-6 w-6 text-coop-teal" />
                    <span className="font-bold text-md tracking-tight text-coop-text">SPK Kelayakan</span>
                </div>
                
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleTheme}
                        className="h-9 w-9 rounded-md bg-coop-highlight hover:bg-coop-highlight/80 text-coop-muted-light hover:text-coop-text border border-coop-border flex items-center justify-center transition-all duration-200 active:scale-95"
                        title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
                        aria-label="Toggle Theme"
                    >
                        {theme === 'dark' ? (
                            <Sun className="h-4 w-4.5 text-coop-gold" />
                        ) : (
                            <Moon className="h-4 w-4.5 text-coop-blue" />
                        )}
                    </button>
                    <button 
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                        className="h-11 w-11 flex items-center justify-center text-coop-muted-light hover:text-coop-text hover:bg-coop-highlight rounded-md transition-colors"
                    >
                        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </header>

            {/* Mobile Navigation Drawer */}
            {isMobileOpen && (
                <div className="md:hidden fixed inset-0 z-30 bg-coop-bg/80" onClick={() => setIsMobileOpen(false)}>
                    <aside className="w-72 max-w-[80vw] h-full bg-coop-card border-r border-coop-border flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="h-16 px-6 flex items-center gap-2 border-b border-coop-border">
                            <UserCheck className="h-6 w-6 text-coop-teal" />
                            <span className="font-bold text-lg text-coop-text">SPK Kelayakan</span>
                        </div>

                        <div className="p-5 border-b border-coop-border">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-md bg-coop-highlight border border-coop-border flex items-center justify-center font-bold text-coop-teal ">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-coop-text">{user.name}</p>
                                    <span className={`inline-block mt-0.5 px-2 py-0.5 text-[9px] font-semibold rounded-md border ${roleInfo.bg}`}>
                                        {roleInfo.label}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsMobileOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md ${
                                            item.active
                                                ? 'bg-coop-gold text-coop-bg'
                                                : 'text-coop-muted-light hover:bg-coop-highlight hover:text-coop-text'
                                        }`}
                                    >
                                        <Icon className="h-5 w-5 shrink-0" />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="p-4 border-t border-coop-border">
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-coop-muted-light hover:bg-rose-500/10 hover:text-rose-400 rounded-md"
                            >
                                <LogOut className="h-5 w-5 shrink-0" />
                                <span>Keluar Aplikasi</span>
                            </Link>
                        </div>
                    </aside>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-transparent">
                {header && (
                    <header className="bg-coop-card border-b border-coop-border/60 h-16 flex items-center">
                        <div className="max-w-7xl w-full mx-auto px-5 md:px-6 flex items-center justify-between">
                            <div className="flex-1 mr-4">{header}</div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={toggleTheme}
                                    className="h-9 w-9 rounded-md bg-coop-highlight hover:bg-coop-highlight/80 text-coop-muted-light hover:text-coop-text border border-coop-border flex items-center justify-center transition-all duration-200 active:scale-95"
                                    title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
                                    aria-label="Toggle Theme"
                                >
                                    {theme === 'dark' ? (
                                        <Sun className="h-4 w-4.5 text-coop-gold" />
                                    ) : (
                                        <Moon className="h-4 w-4.5 text-coop-blue" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </header>
                )}

                <main className="flex-1 p-5 md:p-6 overflow-y-auto max-w-7xl w-full mx-auto space-y-6">
                    {/* Flash Notifications */}
                    {flash?.success && (
                        <div className="p-4 rounded-lg border border-coop-teal/30 bg-coop-teal/10 text-coop-teal flex items-start gap-3 ">
                            <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-coop-teal" />
                            <div>
                                <span className="font-semibold">Berhasil! </span>
                                <span>{flash.success}</span>
                            </div>
                        </div>
                    )}

                    {flash?.error && (
                        <div className="p-4 rounded-lg border border-rose-500/20 bg-rose-950/20 text-rose-300 flex items-start gap-3 ">
                            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-rose-400" />
                            <div>
                                <span className="font-semibold">Kesalahan! </span>
                                <span>{flash.error}</span>
                            </div>
                        </div>
                    )}

                    {children}
                </main>
            </div>
        </div>
    );
}

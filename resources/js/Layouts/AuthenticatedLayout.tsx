import { useState, PropsWithChildren, ReactNode } from 'react';
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
    CheckCircle2
} from 'lucide-react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth, flash } = usePage().props as any;
    const user = auth.user;
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Helper for role badge color and text
    const getRoleInfo = (role: string) => {
        switch (role) {
            case 'admin':
                return { label: 'Administrator', bg: 'bg-rose-950/40 text-rose-400 border-rose-900/50' };
            case 'pakar':
                return { label: 'Pakar Koperasi', bg: 'bg-[#111827] text-[#88a4ff] border-[#88a4ff]/35' };
            case 'petugas':
                return { label: 'Petugas Lapangan', bg: 'bg-[#123b38] text-[#64d8c1] border-[#64d8c1]/35' };
            case 'pimpinan':
                return { label: 'Pimpinan', bg: 'bg-[#123b38] text-[#64d8c1] border-[#64d8c1]/35' };
            default:
                return { label: 'Pengguna', bg: 'bg-[#0b1020]/40 text-[#b2bfca] border-[#233247]/50' };
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
        <div className="min-h-screen bg-[#0b1020] text-slate-100 flex flex-col md:flex-row font-sans antialiased">
            
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex md:w-64 lg:w-72 bg-[#111827] border-r border-[#4f657a] flex-col shrink-0">
                {/* Brand Header */}
                <div className="h-16 px-6 flex items-center gap-2.5 border-b border-[#4f657a]/60">
                    <div className="h-8 w-8 rounded-md bg-[#123b38] flex items-center justify-center border border-[#64d8c1]/35">
                        <UserCheck className="h-4 w-4 text-[#64d8c1]" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-white">
                        SPK Kelayakan
                    </span>
                </div>

                {/* Profile Card */}
                <div className="p-5 border-b border-[#4f657a]/60">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-[#152133] border border-[#6f8295] flex items-center justify-center font-bold text-[#64d8c1] ">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold truncate text-slate-100">{user.name}</p>
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
                                        ? 'bg-[#152133] text-[#64d8c1] border border-[#6f8295]'
                                        : 'text-[#b2bfca] hover:bg-[#152133]/40 hover:text-slate-100 border border-transparent'
                                }`}
                            >
                                <Icon className={`h-4.5 w-4.5 shrink-0 ${item.active ? 'text-[#64d8c1]' : 'text-[#b2bfca] group-hover:text-slate-100'}`} />
                                <span className="flex-1">{item.name}</span>
                                {item.active && (
                                    <div className="absolute right-3 h-1.5 w-1.5 rounded-full bg-[#64d8c1]"></div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Section */}
                <div className="p-4 border-t border-[#4f657a]/60 bg-[#0b1020]/20">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#b2bfca] hover:bg-rose-500/10 hover:text-rose-400 rounded-md transition-colors duration-150 border border-transparent hover:border-rose-500/10"
                    >
                        <LogOut className="h-4.5 w-4.5 shrink-0" />
                        <span>Keluar Aplikasi</span>
                    </Link>
                </div>
            </aside>

            {/* Mobile Navigation Bar */}
            <header className="md:hidden h-16 px-4 bg-[#111827] border-b border-[#4f657a] flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <UserCheck className="h-6 w-6 text-[#64d8c1]" />
                    <span className="font-bold text-md tracking-tight text-white">SPK Kelayakan</span>
                </div>
                
                <button 
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="p-2 text-[#b2bfca] hover:text-white hover:bg-[#152133] rounded-md transition-colors"
                >
                    {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </header>

            {/* Mobile Navigation Drawer */}
            {isMobileOpen && (
                <div className="md:hidden fixed inset-0 z-30 bg-[#0b1020]/80" onClick={() => setIsMobileOpen(false)}>
                    <aside className="w-72 max-w-[80vw] h-full bg-[#111827] border-r border-[#4f657a] flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="h-16 px-6 flex items-center gap-2 border-b border-[#4f657a]">
                            <UserCheck className="h-6 w-6 text-[#64d8c1]" />
                            <span className="font-bold text-lg text-white">SPK Kelayakan</span>
                        </div>

                        <div className="p-5 border-b border-[#4f657a]">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-md bg-[#152133] border border-[#6f8295] flex items-center justify-center font-bold text-[#64d8c1] ">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-100">{user.name}</p>
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
                                        className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-md ${
                                            item.active
                                                ? 'bg-[#d6b45f] text-[#0b1020]'
                                                : 'text-[#b2bfca] hover:bg-[#152133] hover:text-slate-100'
                                        }`}
                                    >
                                        <Icon className="h-5 w-5 shrink-0" />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="p-4 border-t border-[#4f657a]">
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#b2bfca] hover:bg-rose-500/10 hover:text-rose-400 rounded-md"
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
                    <header className="bg-[#111827] border-b border-[#4f657a]/60 py-4">
                        <div className="max-w-7xl w-full mx-auto px-5 md:px-6">
                            {header}
                        </div>
                    </header>
                )}

                <main className="flex-1 p-5 md:p-6 overflow-y-auto max-w-7xl w-full mx-auto space-y-6">
                    {/* Flash Notifications */}
                    {flash?.success && (
                        <div className="p-4 rounded-lg border border-[#64d8c1]/30 bg-[#123b38] text-[#64d8c1] flex items-start gap-3 ">
                            <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-[#64d8c1]" />
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

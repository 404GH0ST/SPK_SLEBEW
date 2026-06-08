import { Link } from '@inertiajs/react';
import { PropsWithChildren, useState, useEffect } from 'react';
import { UserCheck, Sun, Moon } from 'lucide-react';

export default function Guest({ children }: PropsWithChildren) {
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

    return (
        <div className="min-h-screen bg-coop-bg text-coop-text flex flex-col items-center justify-center p-4 sm:p-6 font-sans antialiased relative">
            {/* Absolute Top Right Theme Toggle */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                <button
                    onClick={toggleTheme}
                    className="h-9 w-9 rounded-md bg-coop-highlight hover:bg-coop-highlight/80 text-coop-muted-light hover:text-coop-text border border-coop-border flex items-center justify-center transition-all duration-200 active:scale-95"
                    title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
                    aria-label="Toggle Theme"
                >
                    {theme === 'dark' ? (
                        <Sun className="h-4.5 w-4.5 text-coop-gold" />
                    ) : (
                        <Moon className="h-4.5 w-4.5 text-coop-blue" />
                    )}
                </button>
            </div>

            <div className="w-full max-w-md space-y-6">
                {/* Logo & Header */}
                <div className="flex flex-col items-center text-center space-y-2">
                    <div className="h-11 w-11 rounded-lg bg-coop-highlight flex items-center justify-center border border-coop-gold/50">
                        <UserCheck className="h-5.5 w-5.5 text-coop-gold" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-coop-text">
                        SPK Kelayakan Pinjaman
                    </h1>
                    <p className="text-xs text-coop-muted-light max-w-xs">
                        Sistem Pendukung Keputusan Koperasi menggunakan kombinasi metode SWARA dan MARCOS.
                    </p>
                </div>

                {/* Card Container */}
                <div className="bg-coop-card border border-coop-border/70 rounded-lg p-6 sm:p-8">
                    {children}
                </div>

                {/* Footer info */}
                <p className="text-center text-[10px] text-coop-muted-dark tracking-wide">
                    &copy; {new Date().getFullYear()} Koperasi Kelayakan Pinjaman SPK. All rights reserved.
                </p>
            </div>
        </div>
    );
}

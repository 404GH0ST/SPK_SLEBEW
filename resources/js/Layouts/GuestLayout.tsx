import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { UserCheck } from 'lucide-react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-[#0b1020] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans antialiased">
            <div className="w-full max-w-md space-y-6">
                {/* Logo & Header */}
                <div className="flex flex-col items-center text-center space-y-2">
                    <div className="h-11 w-11 rounded-lg bg-[#152133] flex items-center justify-center border border-[#d6b45f]/50">
                        <UserCheck className="h-5.5 w-5.5 text-[#f2d98a]" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-white">
                        SPK Kelayakan Pinjaman
                    </h1>
                    <p className="text-xs text-[#b2bfca] max-w-xs">
                        Sistem Pendukung Keputusan Koperasi menggunakan kombinasi metode SWARA dan MARCOS.
                    </p>
                </div>

                {/* Card Container */}
                <div className="bg-[#111827] border border-[#4f657a]/70 rounded-lg p-6 sm:p-8">
                    {children}
                </div>

                {/* Footer info */}
                <p className="text-center text-[10px] text-[#8294aa] tracking-wide">
                    &copy; {new Date().getFullYear()} Koperasi Kelayakan Pinjaman SPK. All rights reserved.
                </p>
            </div>
        </div>
    );
}

import { ButtonHTMLAttributes } from 'react';

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-md border border-[#aa7f31] bg-[#d6b45f] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0b1020] transition duration-200 ease-in-out hover:bg-[#f2d98a] focus:outline-none focus:ring-2 focus:ring-[#f2d98a] focus:ring-offset-2 focus:ring-offset-[#0b1020] active:bg-[#c69d48] disabled:opacity-50 ` +
                className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}

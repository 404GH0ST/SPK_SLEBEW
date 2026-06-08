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
                `inline-flex items-center justify-center rounded-md border border-[#aa7f31] bg-coop-gold px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-coop-bg transition duration-200 ease-in-out hover:bg-coop-gold-hover focus:outline-none focus:ring-2 focus:ring-coop-gold focus:ring-offset-2 focus:ring-offset-coop-bg active:bg-[#c69d48] disabled:opacity-50 ` +
                className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}

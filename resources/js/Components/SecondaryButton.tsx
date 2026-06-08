import { ButtonHTMLAttributes } from 'react';

export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center rounded-md border border-[#4f657a] bg-[#111827] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#b2bfca]  transition duration-150 ease-in-out hover:bg-[#152133] focus:outline-none focus:ring-2 focus:ring-[#d6b45f] focus:ring-offset-2 disabled:opacity-25 dark:border-[#4f657a] bg-[#111827] text-[#b2bfca] hover:bg-[#152133] focus:ring-offset-[#0b1020] ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}

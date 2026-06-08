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
                `inline-flex items-center rounded-md border border-coop-border bg-coop-card px-4 py-2 text-xs font-semibold uppercase tracking-widest text-coop-muted-light  transition duration-150 ease-in-out hover:bg-coop-highlight focus:outline-none focus:ring-2 focus:ring-coop-gold focus:ring-offset-2 disabled:opacity-25 dark:border-coop-border bg-coop-card text-coop-muted-light hover:bg-coop-highlight focus:ring-offset-coop-bg ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}

import { InertiaLinkProps, Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}: InertiaLinkProps & { active?: boolean }) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
                active
                    ? 'border-coop-gold bg-coop-highlight text-coop-gold focus:border-coop-gold focus:bg-coop-highlight focus:text-coop-gold dark:border-coop-gold bg-coop-highlight dark:text-coop-gold dark:focus:border-indigo-300 dark:focus:bg-coop-highlight dark:focus:text-coop-gold'
                    : 'border-transparent text-coop-muted-light hover:border-coop-border hover:bg-coop-highlight hover:text-coop-muted-light focus:border-coop-border focus:bg-coop-highlight focus:text-coop-muted-light text-coop-muted-light dark:hover:border-coop-border hover:bg-coop-highlight hover:text-coop-text dark:focus:border-coop-border dark:focus:bg-coop-highlight dark:focus:text-coop-text'
            } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}

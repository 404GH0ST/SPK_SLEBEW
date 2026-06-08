import { InertiaLinkProps, Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}: InertiaLinkProps & { active: boolean }) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-coop-gold text-coop-text focus:border-coop-gold dark:border-coop-gold text-coop-text'
                    : 'border-transparent text-coop-muted-dark hover:border-coop-border hover:text-coop-muted-light focus:border-coop-border focus:text-coop-muted-light text-coop-muted-light dark:hover:border-coop-border dark:hover:text-coop-muted-light dark:focus:border-coop-border dark:focus:text-coop-muted-light') +
                className
            }
        >
            {children}
        </Link>
    );
}

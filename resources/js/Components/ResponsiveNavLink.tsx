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
                    ? 'border-[#d6b45f] bg-[#152133] text-[#f2d98a] focus:border-[#d6b45f] focus:bg-[#152133] focus:text-[#f2d98a] dark:border-[#d6b45f] bg-[#152133] dark:text-[#f2d98a] dark:focus:border-indigo-300 dark:focus:bg-[#152133] dark:focus:text-[#f2d98a]'
                    : 'border-transparent text-[#b2bfca] hover:border-[#4f657a] hover:bg-[#152133] hover:text-[#b2bfca] focus:border-[#4f657a] focus:bg-[#152133] focus:text-[#b2bfca] text-[#b2bfca] dark:hover:border-[#4f657a] hover:bg-[#152133] hover:text-slate-100 dark:focus:border-[#4f657a] dark:focus:bg-[#152133] dark:focus:text-slate-100'
            } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}

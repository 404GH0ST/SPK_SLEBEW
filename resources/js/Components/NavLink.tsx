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
                    ? 'border-[#d6b45f] text-white focus:border-[#d6b45f] dark:border-[#d6b45f] text-white'
                    : 'border-transparent text-[#8294aa] hover:border-[#4f657a] hover:text-[#b2bfca] focus:border-[#4f657a] focus:text-[#b2bfca] text-[#b2bfca] dark:hover:border-[#4f657a] dark:hover:text-[#b2bfca] dark:focus:border-[#4f657a] dark:focus:text-[#b2bfca]') +
                className
            }
        >
            {children}
        </Link>
    );
}

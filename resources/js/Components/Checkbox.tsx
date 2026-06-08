import { InputHTMLAttributes } from 'react';

export default function Checkbox({
    className = '',
    ...props
}: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-[#4f657a] bg-[#0b1020] text-[#d6b45f]  focus:ring-[#d6b45f] focus:ring-offset-[#0b1020] ' +
                className
            }
        />
    );
}

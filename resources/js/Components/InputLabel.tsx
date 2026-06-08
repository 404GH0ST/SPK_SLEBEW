import { LabelHTMLAttributes } from 'react';

export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}: LabelHTMLAttributes<HTMLLabelElement> & { value?: string }) {
    return (
        <label
            {...props}
            className={
                `block text-xs font-bold text-[#b2bfca] uppercase tracking-wider mb-1.5 ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}

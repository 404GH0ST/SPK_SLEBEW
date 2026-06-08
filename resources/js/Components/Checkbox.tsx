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
                'rounded border-coop-border bg-coop-bg text-coop-gold  focus:ring-coop-gold focus:ring-offset-coop-bg ' +
                className
            }
        />
    );
}

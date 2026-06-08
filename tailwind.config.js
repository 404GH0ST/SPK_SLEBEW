import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                coop: {
                    bg: 'var(--coop-bg)',
                    card: 'var(--coop-card)',
                    border: 'var(--coop-border)',
                    highlight: 'var(--coop-highlight)',
                    muted: {
                        light: 'var(--coop-muted-light)',
                        dark: 'var(--coop-muted-dark)',
                    },
                    teal: 'var(--coop-teal)',
                    gold: {
                        DEFAULT: 'var(--coop-gold)',
                        hover: 'var(--coop-gold-hover)',
                    },
                    blue: 'var(--coop-blue)',
                    text: 'var(--coop-text)',
                }
            },
        },
    },

    plugins: [forms],
};

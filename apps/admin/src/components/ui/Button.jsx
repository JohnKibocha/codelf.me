export function Button({ children, className = '', variant = 'default', loading, ...props }) {
    const base = 'inline-flex items-center justify-center rounded-md text-base font-medium transition';
    const variants = {
        default: 'bg-[var(--button-bg)] text-[var(--button-fg)] hover:bg-[var(--button-bg-hover)]',
        outline: 'border border-[var(--border)] text-[var(--fg)] bg-white hover:bg-[var(--card-muted)] dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700',
        ghost: 'text-[var(--accent)] hover:bg-[var(--input-bg)]',
        secondary: 'bg-[var(--accent)] text-white hover:bg-[var(--accent-dark)]',
        destructive: 'bg-red-500 text-white hover:bg-red-600',
    };
    return (
        <button
            {...props}
            className={`${base} ${variants[variant] || variants.default} px-4 py-2 ${className}`}
        >
            {children}
        </button>
    );
}

export default Button;

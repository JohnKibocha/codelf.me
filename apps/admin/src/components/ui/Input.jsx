export function Input({ label, id, className = '', ...props }) {
    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id || props.name} className="block mb-2 font-semibold text-sm text-gray-700 dark:text-gray-200">{label}</label>
            )}
            <input
                id={id || props.name}
                {...props}
                className={`w-full px-4 py-3 text-base rounded-lg border bg-[var(--input-bg)] text-[var(--input-fg)] outline-none focus:ring-2 focus:ring-[var(--accent)] transition-colors duration-200 border border-gray-200 dark:border-gray-600 shadow-sm placeholder-gray-400 dark:placeholder-gray-500 ${className}`}
            />
        </div>
    );
}

export default function Textarea({ className = '', ...props }) {
    return (
        <textarea
            {...props}
            rows={4}
            className={`w-full px-4 py-3 text-base rounded-lg border bg-[var(--input-bg)] text-[var(--input-fg)] outline-none focus:ring-2 focus:ring-[var(--accent)] transition-colors duration-200 border border-gray-200 dark:border-gray-600 shadow-sm placeholder-gray-400 dark:placeholder-gray-500 resize-none ${className}`}
        />
    );
}

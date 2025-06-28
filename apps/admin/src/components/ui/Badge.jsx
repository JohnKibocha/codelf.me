export function Badge({ children, variant = 'default', className = '' }) {
    const styles = {
        default: 'bg-[var(--accent)] text-white',
        outline: 'border border-[var(--border)] text-[var(--fg)] bg-transparent',
    };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[variant]} ${className}`}>
      {children}
    </span>
    );
}

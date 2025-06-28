export function Card({ children, className = '' }) {
    return (
        <div className={`rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-md ${className}`}>
            {children}
        </div>
    );
}

export function CardContent({ children, className = '' }) {
    return (
        <div className={`p-4 ${className}`}>
            {children}
        </div>
    );
}

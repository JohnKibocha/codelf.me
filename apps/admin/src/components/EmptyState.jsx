import { Inbox } from 'lucide-react'

export default function EmptyState({ message = "Nothing to show.", className = "" }) {
    return (
        <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
            <Inbox className="w-12 h-12 text-[var(--fg)] opacity-60 mb-4" />
            <p className="text-base text-[var(--fg)] opacity-70">{message}</p>
        </div>
    );
}

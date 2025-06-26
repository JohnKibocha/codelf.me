// src/components/LoadingSpinnerOverlay.jsx
import { Loader2 } from 'lucide-react';

/**
 * A full-screen overlay component displaying a loading spinner.
 * It covers the entire viewport to indicate a blocking loading state.
 */
export default function LoadingSpinnerOverlay() {
    return (
        <div
            // `fixed inset-0` ensures it covers the entire viewport
            // `w-screen h-screen` explicitly sets width/height to viewport dimensions
            // `z-[100]` places it on top of most other content
            // `bg-black bg-opacity-10` provides a subtle overlay
            className="fixed inset-0 w-screen h-screen z-[100] flex items-center justify-center bg-black bg-opacity-10"
            aria-live="polite" // Announce changes to screen readers
            aria-busy="true" // Indicate that content is being loaded
            role="status" // Inform assistive technologies about the status
        >
            <Loader2 className="animate-spin text-[var(--button-bg)]" size={48} />
            <span className="sr-only">Loading...</span> {/* Hidden text for screen readers */}
        </div>
    );
}

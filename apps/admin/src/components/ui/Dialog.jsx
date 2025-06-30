import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export function Dialog({ open, onClose, title, children }) {
  const dialogRef = useRef(null);

  // Trap focus inside modal
  useEffect(() => {
    if (!open) return;
    const focusableEls = dialogRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstEl = focusableEls?.[0];
    const lastEl = focusableEls?.[focusableEls.length - 1];
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose?.();
      if (e.key === 'Tab' && focusableEls.length) {
        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    // Remove auto-focus on firstEl to prevent focus jump on every render
    // firstEl?.focus();
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Dialog'}
        className="bg-[var(--card-bg)] rounded-2xl shadow-2xl p-6 relative min-w-[320px] max-w-lg w-full mx-4 sm:mx-0 animate-slide-up"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 dark:bg-gray-800/80 shadow-md border border-gray-200 dark:border-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900 text-gray-500 hover:text-blue-700 dark:text-gray-300 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-150"
          aria-label="Close dialog"
          type="button"
        >
          <span className="flex items-center justify-center w-6 h-6">
            <X size={22} />
          </span>
        </button>
        {title && (
          <h2 className="text-xl font-semibold mb-4 text-center text-gray-900 dark:text-gray-100">{title}</h2>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
}

export default Dialog;

// Animations (add to your global CSS or tailwind config):
// .animate-fade-in { animation: fadeIn 0.2s ease; }
// .animate-slide-up { animation: slideUp 0.25s cubic-bezier(.4,2,.6,1); }
// @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
// @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: none; opacity: 1; } }

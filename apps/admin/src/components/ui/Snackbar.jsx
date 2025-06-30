import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

const SnackbarContext = createContext();

export function useSnackbar() {
  return useContext(SnackbarContext);
}

export function SnackbarProvider({ children }) {
  const [snackbar, setSnackbar] = useState(null);
  const timerRef = useRef();

  const showSnackbar = useCallback(({ icon, message, actions = [], duration = 3500, variant = 'default' }) => {
    setSnackbar({ icon, message, actions, variant });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setSnackbar(null), duration);
  }, []);

  const closeSnackbar = useCallback(() => {
    setSnackbar(null);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar, closeSnackbar }}>
      {children}
      <Snackbar {...snackbar} onClose={closeSnackbar} />
    </SnackbarContext.Provider>
  );
}

function Snackbar({ icon, message, actions = [], variant = 'default', onClose }) {
  if (!message) return null;
  return (
    <div className={`fixed z-50 left-1/2 bottom-6 max-w-xs w-[90vw] sm:w-auto -translate-x-1/2 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 animate-snackbar-in ${variant === 'error' ? 'border-red-400 bg-red-50 dark:bg-red-900' : ''}`}
      role="alert">
      {icon && <span className="flex-shrink-0 text-blue-500 dark:text-blue-300">{icon}</span>}
      <span className="flex-1 text-gray-900 dark:text-gray-100 text-sm">{message}</span>
      {actions.map((action, i) => (
        <button key={i} onClick={() => { action.onClick(); onClose(); }} className="ml-2 px-2 py-1 rounded text-xs font-medium bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-800 dark:text-blue-100 dark:hover:bg-blue-700 transition">
          {action.label}
        </button>
      ))}
      <button onClick={onClose} className="ml-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition" aria-label="Close">
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
      <style>{`
        @keyframes snackbar-in { from { opacity: 0; transform: translateY(40px) scale(0.98) translateX(-50%); } to { opacity: 1; transform: translateY(0) scale(1) translateX(-50%); } }
        .animate-snackbar-in { animation: snackbar-in 0.25s cubic-bezier(.4,0,.2,1); }
      `}</style>
    </div>
  );
}


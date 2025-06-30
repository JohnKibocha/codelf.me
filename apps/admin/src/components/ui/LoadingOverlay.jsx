import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingOverlay({ text = 'Loading...' }) {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="flex flex-col items-center">
        <Loader2 className="animate-spin text-blue-500" size={48} />
        <span className="mt-4 text-lg font-medium text-white drop-shadow-lg animate-pulse">{text}</span>
      </div>
    </div>
  );
}

// Animations (add to your global CSS or tailwind config):
// .animate-fade-in { animation: fadeIn 0.2s ease; }
// @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

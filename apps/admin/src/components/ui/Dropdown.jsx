import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const options = ['Active', 'Archived', 'In_Progress'];

export default function Dropdown({ value, onChange }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative w-full">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-4 py-3 bg-[var(--input-bg)] text-[var(--input-fg)] border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--accent)] shadow-sm transition-colors duration-150 hover:border-[var(--accent)] hover:bg-[var(--card-bg)] placeholder-gray-400 dark:placeholder-gray-500"
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span>{value ? value.replace('_', ' ') : 'Select status'}</span>
                <ChevronDown size={18} className={`ml-2 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <ul className="absolute z-10 w-full mt-1 bg-[var(--card-bg)] border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-40 overflow-y-auto animate-fade-in">
                    {options.map(opt => (
                        <li
                            key={opt}
                            onClick={() => {
                                onChange(opt);
                                setOpen(false);
                            }}
                            className={`px-4 py-2 cursor-pointer text-sm transition-colors rounded-md ${value === opt ? 'bg-[var(--button-bg)] text-[var(--button-fg)] font-semibold' : 'hover:bg-[var(--accent-light)] hover:text-[var(--accent-fg)]'}`}
                            role="option"
                            aria-selected={value === opt}
                        >
                            {opt.replace('_', ' ')}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

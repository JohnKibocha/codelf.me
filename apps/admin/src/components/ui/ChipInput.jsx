import { useState } from 'react';
import { Loader2, CheckCircle2, XCircle, PlusCircle, Pencil } from 'lucide-react';

export default function ChipInput({ value = [], onChange, placeholder = 'Add item and press Enter' }) {
    const [input, setInput] = useState('');

    const addChip = () => {
        const trimmed = input.trim();
        if (trimmed && !value.includes(trimmed)) {
            onChange([...value, trimmed]);
            setInput('');
        }
    };

    const handleInput = (e) => {
        const val = e.target.value;
        if (val.endsWith(',') || val.endsWith('\n')) {
            setInput(val.slice(0, -1));
            setTimeout(addChip, 0);
        } else {
            setInput(val);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addChip();
        }
    };

    const removeChip = (chip) => {
        onChange(value.filter((c) => c !== chip));
    };

    return (
        <div className="w-full">
            <div className="flex flex-wrap gap-2 items-center p-2 rounded-lg bg-[var(--input-bg)] focus-within:ring-2 focus-within:ring-[var(--accent)] min-h-[44px] shadow-sm transition-colors duration-200">
                {value.map((chip, idx) => (
                    <span
                        key={idx}
                        className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full text-xs shadow-sm"
                    >
            {chip}
                        <button
                            type="button"
                            onClick={() => removeChip(chip)}
                            className="ml-1 w-4 h-4 flex items-center justify-center rounded-full bg-blue-300/40 dark:bg-blue-500/40 hover:bg-red-400/80 hover:text-white text-[10px] font-bold leading-none transition-colors"
                            aria-label={`Remove ${chip}`}
                        >
              ×
            </button>
          </span>
                ))}
                <input
                    type="text"
                    value={input}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent outline-none text-[var(--input-fg)] placeholder-gray-400 dark:placeholder-gray-500 min-w-[100px]"
                />
            </div>
        </div>
    );
}

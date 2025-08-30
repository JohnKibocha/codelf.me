

import { useState } from 'react';

// Moved Chip component here from Chip.jsx
const COLORS = {
    blue: {
        solid: 'bg-blue-600 text-white',
        outline: 'border border-blue-600 text-blue-700 bg-blue-50 dark:bg-blue-900',
        tag: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200',
    },
    green: {
        solid: 'bg-green-600 text-white',
        outline: 'border border-green-600 text-green-700 bg-green-50 dark:bg-green-900',
        tag: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200',
    },
    gray: {
        solid: 'bg-gray-600 text-white',
        outline: 'border border-gray-600 text-gray-700 bg-gray-50 dark:bg-gray-800',
        tag: 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200',
    },
    purple: {
        solid: 'bg-purple-600 text-white',
        outline: 'border border-purple-600 text-purple-700 bg-purple-50 dark:bg-purple-900',
        tag: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200',
    },
    red: {
        solid: 'bg-red-600 text-white',
        outline: 'border border-red-600 text-red-700 bg-red-50 dark:bg-red-900',
        tag: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200',
    },
    yellow: {
        solid: 'bg-yellow-500 text-white',
        outline: 'border border-yellow-500 text-yellow-700 bg-yellow-50 dark:bg-yellow-900',
        tag: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200',
    },
};

function Chip({
    children,
    color = 'blue',
    variant = 'solid',
    icon,
    removable = false,
    onRemove,
    className = '',
    size = 'md', // md | sm
    ...props
}) {
    const colorClass = COLORS[color]?.[variant] || COLORS.blue.solid;
    const sizeClass = size === 'sm'
        ? 'text-xs px-2 py-0.5 h-6 min-h-[1.5rem]'
        : 'text-sm px-3 py-1 h-8 min-h-[2rem]';
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full font-medium shadow-sm ${colorClass} ${sizeClass} ${className}`}
            {...props}
        >
            {icon && <span className="mr-1 flex items-center">{icon}</span>}
            <span>{children}</span>
            {removable && (
                <button
                    type="button"
                    onClick={onRemove}
                    className="ml-1 w-4 h-4 flex items-center justify-center rounded-full bg-black/10 dark:bg-white/10 hover:bg-red-500 hover:text-white text-[10px] font-bold leading-none transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                    aria-label="Remove"
                >
                    ×
                </button>
            )}
        </span>
    );
}

export default function ChipInput({ value = [], onChange, placeholder = 'Add item and press Enter', chipColor = 'blue', chipVariant = 'tag' }) {
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
                    <Chip
                        key={idx}
                        color={chipColor}
                        variant={chipVariant}
                        removable
                        onRemove={() => removeChip(chip)}
                        size="sm"
                    >
                        {chip}
                    </Chip>
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

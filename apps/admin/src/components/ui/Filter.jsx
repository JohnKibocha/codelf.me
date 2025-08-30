import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Universal Filter Component
 * 
 * A modern, accessible filter dropdown with excellent contrast in both light and dark modes.
 * Features:
 * - High contrast color schemes for better accessibility
 * - Smooth animations and transitions
 * - Responsive design
 * - Keyboard navigation support
 * - Clear visual hierarchy
 */
export default function Filter({
  value,
  onChange,
  options = [],
  icon: Icon,
  placeholder = 'Filter',
  className = '',
  width = 'w-auto',
  size = 'medium', // 'small', 'medium', 'large'
  variant = 'default', // 'default', 'outlined', 'filled'
  getLabel = opt => opt,
  getKey = opt => opt,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const ref = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (open && ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setFocusedIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!open) {
          setOpen(true);
          setFocusedIndex(0);
        } else if (focusedIndex >= 0) {
          onChange(getKey(options[focusedIndex]));
          setOpen(false);
          setFocusedIndex(-1);
        }
        break;
      case 'Escape':
        setOpen(false);
        setFocusedIndex(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!open) {
          setOpen(true);
          setFocusedIndex(0);
        } else {
          setFocusedIndex(prev => (prev + 1) % options.length);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (open) {
          setFocusedIndex(prev => prev <= 0 ? options.length - 1 : prev - 1);
        }
        break;
    }
  };

  // Size variants
  const sizeClasses = {
    small: {
      button: 'px-2.5 py-1.5 text-xs gap-1',
      icon: 14,
      chevron: 14
    },
    medium: {
      button: 'px-3 py-2 text-sm gap-2',
      icon: 16,
      chevron: 16
    },
    large: {
      button: 'px-4 py-2.5 text-base gap-2',
      icon: 18,
      chevron: 18
    }
  };

  // Variant styles
  const variantClasses = {
    default: {
      button: 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500',
      dropdown: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-xl'
    },
    outlined: {
      button: 'bg-transparent border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-500 dark:hover:border-gray-400',
      dropdown: 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-xl'
    },
    filled: {
      button: 'bg-gray-100 dark:bg-gray-700 border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600',
      dropdown: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-xl'
    }
  };

  const currentSize = sizeClasses[size];
  const currentVariant = variantClasses[variant];

  const buttonClasses = `
    inline-flex items-center justify-between rounded-lg font-medium
    border transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
    disabled:opacity-50 disabled:cursor-not-allowed
    min-w-0 max-w-full
    ${currentSize.button}
    ${currentVariant.button}
    ${width}
    ${className}
  `.trim();

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => !disabled && setOpen(o => !o)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={buttonClasses}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Filter by ${placeholder}`}
      >
        <div className="flex items-center min-w-0 flex-1">
          {Icon && (
            <Icon 
              size={currentSize.icon} 
              className="text-gray-500 dark:text-gray-400 flex-shrink-0" 
            />
          )}
          <span className="truncate font-medium">
            {value ? getLabel(value) : placeholder}
          </span>
        </div>
        <ChevronDown 
          size={currentSize.chevron} 
          className={`ml-2 text-gray-400 dark:text-gray-500 transition-transform duration-200 flex-shrink-0 ${
            open ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {open && (
        <ul 
          className={`
            absolute left-0 mt-2 min-w-full max-w-xs rounded-lg border
            py-1 z-50 max-h-60 overflow-y-auto
            animate-in fade-in slide-in-from-top-2 duration-200
            ${currentVariant.dropdown}
          `}
          role="listbox"
          aria-label={`${placeholder} options`}
        >
          {options.map((opt, index) => {
            const optionKey = getKey(opt);
            const selected = value === optionKey;
            const focused = focusedIndex === index;
            
            return (
              <li key={optionKey} role="none">
                <button
                  className={`
                    w-full flex items-center px-3 py-2 text-left font-medium
                    transition-all duration-150 ease-in-out
                    focus:outline-none
                    ${selected 
                      ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-white' 
                      : focused
                        ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-white'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }
                  `}
                  onClick={() => {
                    onChange(optionKey);
                    setOpen(false);
                    setFocusedIndex(-1);
                  }}
                  onMouseEnter={() => setFocusedIndex(index)}
                  type="button"
                  role="option"
                  aria-selected={selected}
                >
                  {Icon && (
                    <Icon 
                      size={currentSize.icon} 
                      className={`mr-2 flex-shrink-0 ${
                        selected || focused
                          ? 'text-white' 
                          : 'text-gray-400 dark:text-gray-500'
                      }`} 
                    />
                  )}
                  <span className="truncate">{getLabel(opt)}</span>
                  {selected && (
                    <svg 
                      className="ml-auto h-4 w-4 text-white flex-shrink-0" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

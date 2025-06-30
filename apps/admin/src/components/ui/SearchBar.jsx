import React, { useRef } from 'react';
import { Search, X as LucideX } from 'lucide-react';

export default function SearchBar({
                                      value,
                                      onChange,
                                      onSearch,
                                      searching = false,
                                      placeholder = 'Search...',
                                      inputClassName = 'rounded-full border border-gray-200 dark:border-gray-700 px-5 py-4 shadow-sm focus:ring-2 focus:ring-blue-400 bg-[var(--card-bg)] text-[var(--fg)] min-h-[56px] text-base',
                                      inputStyle = {},
                                      buttonClassName = 'bg-blue-500 hover:bg-blue-600 text-blue-100 dark:text-white',
                                      iconSize = 20,
                                      ...props
                                  }) {
  const timeoutRef = useRef();
  const lastValueRef = useRef(value);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      onSearch?.();
    } else if (e.key === ' ') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onSearch?.();
      }, 1500);
    }
  };

  const handleClear = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onChange({ target: { value: '' } });
    // Always call onSearch with an empty string to signal 'show all'
    onSearch?.('');
  };

  // Enhanced: clear effect on manual backspace to empty
  const handleChange = (e) => {
    onChange(e);
    if (e.target.value === '') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      onSearch?.('');
    }
  };

  return (
    <div className="relative w-full max-w-4xl min-w-[280px] sm:min-w-[360px] md:min-w-[420px] lg:min-w-[520px] mx-auto">
      <div className="flex items-center">
        {value.length > 40 ? (
          <textarea
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={
              inputClassName.replace('rounded-full', 'rounded-lg') +
              ' w-full min-h-[56px] pr-16 resize-y transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/90 dark:bg-gray-800/90 shadow-lg border-2 border-blue-400'
            }
            style={{...inputStyle, boxShadow: '0 2px 8px rgba(0, 123, 255, 0.15)', minWidth: '0'}} // minWidth:0 for flexbox shrink
            {...props}
          />
        ) : (
          <input
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={inputClassName + ' w-full border-2 border-blue-400 shadow-lg bg-white/90 dark:bg-gray-800/90 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200'}
            style={{ ...inputStyle, boxShadow: '0 2px 8px rgba(0, 123, 255, 0.15)', minWidth: '0' }}
            {...props}
          />
        )}
        <button
          type="button"
          onClick={onSearch}
          aria-label="Search"
          disabled={searching}
          className={
            'absolute right-7 top-1/2 -translate-y-1/2 p-2 rounded-full transition ' +
            'bg-blue-500 hover:bg-blue-600 text-white shadow border border-blue-400 ' +
            'disabled:opacity-60 flex items-center justify-center ' +
            buttonClassName
          }
          style={{ boxShadow: '0 1px 4px 0 rgba(0,0,0,0.08)' }}
        >
          {searching
            ? <span className="animate-spin flex items-center justify-center"><Search size={iconSize} /></span>
            : <span className="flex items-center justify-center"><Search size={iconSize + 2} className="text-white" /></span>
          }
        </button>
        {value && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-20 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center p-0 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow hover:bg-red-500 hover:text-white dark:hover:bg-red-600 text-gray-500 dark:text-gray-300 transition focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <LucideX size={22} className="mx-auto" />
          </button>
        )}
      </div>
    </div>
  );
}

import React, { useRef, useState, useEffect } from 'react';
import { Search, X as LucideX, Loader2 } from 'lucide-react';

export default function SearchBar({
  value,
  onChange,
  onSearch,
  searching = false,
  placeholder = 'Search...',
  className = '',
  size = 'large', // 'small', 'medium', 'large'
  variant = 'modern', // 'modern', 'minimal', 'premium'
  showClearButton = true,
  debounceMs = 300,
  autoSearch = false, // Disabled by default to prevent poor UX
  ...props
}) {
  const timeoutRef = useRef();
  const inputRef = useRef();
  const [isFocused, setIsFocused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Auto-search with debounce
  useEffect(() => {
    if (!autoSearch || !onSearch) return;
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    if (value.trim()) {
      timeoutRef.current = setTimeout(() => {
        onSearch(value);
      }, debounceMs);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, autoSearch, onSearch, debounceMs]);

  // Size configurations
  const sizeConfig = {
    small: {
      height: 'h-10',
      padding: 'px-4 py-2',
      text: 'text-sm',
      iconSize: 16,
      buttonSize: 'w-8 h-8',
      clearSize: 'w-7 h-7'
    },
    medium: {
      height: 'h-12',
      padding: 'px-5 py-3',
      text: 'text-base',
      iconSize: 18,
      buttonSize: 'w-10 h-10',
      clearSize: 'w-8 h-8'
    },
    large: {
      height: 'h-14',
      padding: 'px-6 py-4',
      text: 'text-lg',
      iconSize: 20,
      buttonSize: 'w-12 h-12',
      clearSize: 'w-9 h-9'
    }
  };

  // Variant styles
  const variantStyles = {
    modern: {
      container: 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg backdrop-blur-sm',
      containerFocused: 'border-blue-500 dark:border-blue-400 ring-4 ring-blue-500/20 dark:ring-blue-400/20',
      input: 'bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400',
      searchButton: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg',
      clearButton: 'bg-gray-100 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900/50 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
    },
    minimal: {
      container: 'bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl',
      containerFocused: 'border-blue-400 dark:border-blue-500 bg-white dark:bg-gray-800',
      input: 'bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500',
      searchButton: 'bg-blue-500 hover:bg-blue-600 text-white',
      clearButton: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'
    },
    premium: {
      container: 'bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl',
      containerFocused: 'border-blue-400 dark:border-blue-500 shadow-2xl ring-2 ring-blue-500/30 dark:ring-blue-400/30',
      input: 'bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 font-medium',
      searchButton: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl',
      clearButton: 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 border border-gray-200 dark:border-gray-600'
    }
  };

  const currentSize = sizeConfig[size];
  const currentVariant = variantStyles[variant];

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      onSearch?.(value);
    } else if (e.key === 'Escape') {
      inputRef.current?.blur();
      setIsFocused(false);
    }
  };

  const handleClear = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onChange({ target: { value: '' } });
    onSearch?.('');
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setIsFocused(true);
    setIsExpanded(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay collapse to allow button clicks
    setTimeout(() => setIsExpanded(false), 150);
  };

  const handleSearchClick = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onSearch?.(value);
  };

  return (
    <div className={`relative w-full max-w-2xl mx-auto transition-all duration-300 ${className}`}>
      <div 
        className={`
          relative flex items-center transition-all duration-300 ease-out
          ${currentSize.height}
          ${currentVariant.container}
          ${isFocused ? currentVariant.containerFocused : ''}
          ${isExpanded ? 'scale-[1.02]' : 'scale-100'}
        `}
      >
        {/* Search Icon */}
        <div className="absolute left-4 flex items-center justify-center pointer-events-none">
          <Search 
            size={currentSize.iconSize} 
            className={`text-gray-400 dark:text-gray-500 transition-colors duration-200 ${
              isFocused ? 'text-blue-500 dark:text-blue-400' : ''
            }`} 
          />
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={searching}
          className={`
            w-full outline-none transition-all duration-200
            ${currentSize.padding} ${currentSize.text}
            ${currentVariant.input}
            pl-12 pr-24
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          {...props}
        />

        {/* Action Buttons Container */}
        <div className="absolute right-2 flex items-center gap-1">
          {/* Clear Button */}
          {showClearButton && value && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className={`
                flex items-center justify-center rounded-full
                transition-all duration-200 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300
                hover:bg-gray-100 dark:hover:bg-gray-700
                ${currentSize.clearSize}
              `}
            >
              <LucideX size={currentSize.iconSize - 4} />
            </button>
          )}

          {/* Search Button */}
          <button
            type="button"
            onClick={handleSearchClick}
            disabled={searching}
            aria-label={searching ? 'Searching...' : 'Search'}
            className={`
              flex items-center justify-center rounded-full
              transition-all duration-200 ease-in-out transform
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
              disabled:opacity-70 disabled:cursor-not-allowed
              text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400
              hover:bg-blue-50 dark:hover:bg-blue-900/30
              ${currentSize.buttonSize}
            `}
          >
            {searching ? (
              <Loader2 
                size={currentSize.iconSize} 
                className="animate-spin text-blue-500" 
              />
            ) : (
              <Search size={currentSize.iconSize} />
            )}
          </button>
        </div>

        {/* Focus Ring Enhancement */}
        {isFocused && (
          <div className="absolute inset-0 rounded-2xl bg-blue-500/5 dark:bg-blue-400/5 pointer-events-none" />
        )}
      </div>
    </div>
  );
}

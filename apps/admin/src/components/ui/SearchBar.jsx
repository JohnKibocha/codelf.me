import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({
                                      value,
                                      onChange,
                                      onSearch,
                                      searching = false,
                                      placeholder = 'Search...',
                                      inputClassName = '',
                                      inputStyle = {},
                                      buttonClassName = '',
                                      iconSize = 20,
                                      ...props
                                  }) {
    return (
        <div className="relative w-full max-w-2xl mx-auto">
            <input
                type="text"
                value={value}
                onChange={onChange}
                onKeyDown={e => { if (e.key === 'Enter') onSearch?.(); }}
                placeholder={placeholder}
                className={inputClassName + ' w-full'}
                style={inputStyle}
                {...props}
            />
            <button
                type="button"
                onClick={onSearch}
                aria-label="Search"
                disabled={searching}
                className={buttonClassName + ' absolute'}
            >
                {searching
                    ? <span className="animate-spin flex items-center justify-center"><Search size={iconSize} /></span>
                    : <span className="flex items-center justify-center"><Search size={iconSize} /></span>
                }
            </button>
        </div>
    );
}

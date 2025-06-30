import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Dropdown({
  value,
  onChange,
  options = [],
  icon: Icon,
  placeholder = 'Select',
  className = '',
  optionClassName = '',
  selectedClassName = '',
  getLabel = opt => opt,
  getKey = opt => opt,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (open && ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className={`relative ${className}`} ref={ref} style={{ minWidth: 0, maxWidth: '100%' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-sm border border-gray-400 dark:border-gray-700 bg-[var(--card-bg)] text-[var(--fg)] shadow-sm focus:ring-2 focus:ring-blue-400 transition font-medium min-w-[0] max-w-full whitespace-nowrap"
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{ width: 'auto', maxWidth: '100%' }}
      >
        {Icon && <Icon size={16} className="mr-1" />}
        <span className="truncate">{value ? getLabel(value) : placeholder}</span>
        <ChevronDown size={16} className={`ml-2 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul className="absolute left-0 mt-2 min-w-[8rem] max-w-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-[var(--card-bg)] text-[var(--fg)] shadow-lg z-10 py-2 flex flex-col gap-1 animate-fade-in">
          {options.map(opt => {
            const selected = value === getKey(opt);
            return (
              <li key={getKey(opt)}>
                <button
                  className={`w-full flex items-center gap-2 px-4 py-2 rounded-full transition font-medium text-left
                    ${selected
                      ? 'bg-blue-200 dark:bg-blue-400 text-blue-900 dark:text-blue-100'
                      : 'hover:bg-blue-100 dark:hover:bg-blue-400 hover:text-blue-800 dark:hover:text-blue-200'}
                    ${optionClassName} ${selected ? selectedClassName : ''}`}
                  onClick={() => { onChange(getKey(opt)); setOpen(false); }}
                  type="button"
                  role="option"
                  aria-selected={selected}
                >
                  {Icon && <Icon size={16} className="text-blue-400" />}
                  <span className="truncate">{getLabel(opt)}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

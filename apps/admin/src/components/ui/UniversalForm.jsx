import React from 'react';
import { Input } from './Input';
import Textarea from './Textarea';

/**
 * UniversalForm - a reusable form generator
 * @param {Array} fields - [{ name, label, type, options, ... }]
 * @param {Object} values - form state
 * @param {Function} onChange - (name, value) => void
 * @param {Function} onSubmit - (event) => void
 * @param {Object} errors - { [name]: errorMsg }
 * @param {ReactNode} children - extra elements (e.g. submit button)
 */
export default function UniversalForm({ fields, values, onChange, onSubmit, errors = {}, children, renderBeforeFields }) {
  return (
    <div className="max-w-2xl mx-auto p-4 rounded-xl bg-[var(--card-bg)] shadow-xl">
      <form onSubmit={onSubmit} className="space-y-8 w-full">
        {/* Render custom content before fields */}
        {renderBeforeFields}
        {fields.map(field => {
          const { name, label, type, options, ...rest } = field;
          const value = values[name] ?? '';
          return (
            <div key={name} className="w-full mb-4">
              <label className="block mb-2 font-semibold text-sm text-gray-700 dark:text-gray-200" htmlFor={name}>{label}</label>
              {type === 'textarea' ? (
                <Textarea
                  id={name}
                  name={name}
                  value={value}
                  onChange={e => onChange(name, e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-[var(--input-bg)] text-[var(--input-fg)] p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[100px]"
                  {...rest}
                />
              ) : type === 'select' ? (
                <select
                  id={name}
                  name={name}
                  value={value}
                  onChange={e => onChange(name, e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-[var(--input-bg)] text-[var(--input-fg)] p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  {...rest}
                >
                  <option value="">Select {label}</option>
                  {options && options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                <Input
                  id={name}
                  name={name}
                  type={type}
                  value={value}
                  onChange={e => onChange(name, e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-[var(--input-bg)] text-[var(--input-fg)] p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  {...rest}
                />
              )}
              {errors[name] && <div className="text-red-500 text-xs mt-1">{errors[name]}</div>}
            </div>
          );
        })}
        {children}
      </form>
    </div>
  );
}

import React from 'react';

/**
 * Table - a reusable table component
 * @param {Array} columns - [{ key, label, render? }]
 * @param {Array} data - array of row objects
 * @param {string} [rowKey] - unique key in each row (default: 'id' or '$id')
 */
export default function Table({ columns, data, rowKey = '$id', onRowClick }) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full border-separate border-spacing-0 rounded-2xl bg-[var(--card-bg)] shadow-xl">
        <thead className="sticky top-0 z-10">
          <tr className="bg-gradient-to-r from-blue-100/80 to-purple-100/80 dark:from-blue-900/60 dark:to-purple-900/60">
            {columns.map(col => (
              <th key={col.key} className="px-6 py-4 text-left text-xs font-extrabold text-gray-700 dark:text-gray-100 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 first:rounded-tl-2xl last:rounded-tr-2xl shadow-sm">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-12 text-gray-400 text-base">
                <div className="flex flex-col items-center gap-2">
                  <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto text-blue-300 dark:text-blue-800"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2a4 4 0 018 0v2m-4-4a4 4 0 100-8 4 4 0 000 8zm-6 8a6 6 0 0112 0H3z" /></svg>
                  <span>No data found</span>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={row[rowKey] || row.id || idx}
                className={
                  `transition-all duration-200 group
                  ${idx % 2 === 0
                    ? 'bg-white dark:bg-gray-900'
                    : 'bg-gray-50 dark:bg-gray-800'}
                  hover:shadow-lg hover:scale-[1.01] hover:z-10 hover:bg-blue-50/60 dark:hover:bg-blue-900/40`
                }
                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map(col => (
                  <td key={col.key} className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 text-sm">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

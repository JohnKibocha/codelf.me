import React from 'react';

/**
 * Table - a reusable table component
 * @param {Array} columns - [{ key, label, render? }]
 * @param {Array} data - array of row objects
 * @param {string} [rowKey] - unique key in each row (default: 'id' or '$id')
 */
export default function Table({ columns, data, rowKey = '$id' }) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-xl bg-[var(--card-bg)] shadow-md">
        <thead>
          <tr className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
            {columns.map(col => (
              <th key={col.key} className="px-5 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-100 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 first:rounded-tl-xl last:rounded-tr-xl">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-8 text-gray-400 text-base">No data</td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={row[rowKey] || row.id || idx}
                className={
                  `border-b border-gray-100 dark:border-gray-800 transition-colors ${
                    idx % 2 === 0
                      ? 'bg-white dark:bg-gray-900'
                      : 'bg-gray-50 dark:bg-gray-800'
                  } hover:bg-blue-50 dark:hover:bg-gray-700`
                }
              >
                {columns.map(col => (
                  <td key={col.key} className="px-5 py-3 text-sm text-gray-800 dark:text-gray-100 align-middle">
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

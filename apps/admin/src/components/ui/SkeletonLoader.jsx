import React from 'react';

export default function SkeletonLoader({ rows = 5, height = 24, className = '' }) {
  return (
    <div className={className}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="w-full bg-gray-200 dark:bg-gray-700 rounded mb-3 last:mb-0 animate-pulse"
          style={{ height }}
        />
      ))}
    </div>
  );
}


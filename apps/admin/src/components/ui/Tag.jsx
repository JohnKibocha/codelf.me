import React from 'react';

/**
 * Tag component: modern, accessible, clean, with strong border/font contrast and spacing.
 * Usage: <Tag color="blue" icon={<Icon/>}>text</Tag>
 */
const COLORS = {
    blue: {
        border: 'border-blue-600',
        bg: 'bg-blue-50 dark:bg-blue-900',
        text: 'text-blue-700 dark:text-blue-200',
    },
    green: {
        border: 'border-green-600',
        bg: 'bg-green-50 dark:bg-green-900',
        text: 'text-green-700 dark:text-green-200',
    },
    gray: {
        border: 'border-gray-600',
        bg: 'bg-gray-50 dark:bg-gray-800',
        text: 'text-gray-700 dark:text-gray-200',
    },
    purple: {
        border: 'border-purple-600',
        bg: 'bg-purple-50 dark:bg-purple-900',
        text: 'text-purple-700 dark:text-purple-200',
    },
    red: {
        border: 'border-red-600',
        bg: 'bg-red-50 dark:bg-red-900',
        text: 'text-red-700 dark:text-red-200',
    },
    yellow: {
        border: 'border-yellow-500',
        bg: 'bg-yellow-50 dark:bg-yellow-900',
        text: 'text-yellow-700 dark:text-yellow-200',
    },
};

export default function Tag({
    children,
    color = 'blue',
    icon,
    className = '',
    size = 'md', // md | sm
    ...props
}) {
    const c = COLORS[color] || COLORS.blue;
    const sizeClass = size === 'sm'
        ? 'text-xs px-2 py-0.5 h-6 min-h-[1.5rem]'
        : 'text-sm px-3 py-1 h-8 min-h-[2rem]';
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full border font-semibold ${c.border} ${c.bg} ${c.text} ${sizeClass} ${className}`}
            style={{ letterSpacing: '0.01em', fontFamily: 'inherit', fontWeight: 600 }}
            {...props}
        >
            {icon && <span className="mr-1 flex items-center">{icon}</span>}
            <span>{children}</span>
        </span>
    );
}

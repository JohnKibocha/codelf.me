// src/components/RecentTable.jsx
import EmptyState from './EmptyState';
import clsx from 'clsx';
import Table from './ui/Table';

// Map Appwrite collection IDs or logical types to display names
const typeDisplayMap = {
    posts: 'Blog Post',
    blogs: 'Blog Post',
    drafts: 'Draft',
    projects: 'Project',
    reviews: 'Review',
    contacts: 'Contact Message',
    messages: 'Contact Message',
    views: 'Profile View',
    profile: 'Profile View'
};

// Map collection type to title key
const titleFieldMap = {
    posts: 'title',
    projects: 'title',
    reviews: 'name',
    contacts: 'name'
};

/**
 * Retrieve display value for each column
 */
function getDisplayValue(item, key) {
    if (key === 'title') {
        const field = titleFieldMap[item.type] || 'title';
        return item[field] || item.title || item.name || item.subject || '(Untitled)';
    }

    if (key === 'type') {
        const type = item.type || item.$collectionId || '-';
        return typeDisplayMap[type] || (type.charAt(0).toUpperCase() + type.slice(1));
    }

    if (key === 'status') {
        const status = item.status;
        let display = 'Unknown';
        let color = 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200';

        const type = item.type || item.$collectionId;

        if (type === 'posts') {
            switch (status) {
                case 'published':
                    display = 'Published';
                    color = 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200';
                    break;
                case 'draft':
                    display = 'Draft';
                    break;
            }
        } else if (type === 'projects') {
            switch (status) {
                case 'Active':
                    display = 'Active';
                    color = 'bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-200';
                    break;
                case 'Archived':
                    display = 'Archived';
                    color = 'bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-200';
                    break;
                case 'In_Progress':
                    display = 'In Progress';
                    color = 'bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200';
                    break;
            }
        } else if (type === 'reviews') {
            switch (status) {
                case 'approved':
                    display = 'Approved';
                    color = 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200';
                    break;
                case 'pending':
                    display = 'Pending';
                    color = 'bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200';
                    break;
                case 'rejected':
                    display = 'Rejected';
                    color = 'bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-200';
                    break;
            }
        } else if (type === 'contacts' || type === 'messages') {
            display = 'New';
            color = 'bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-200';
        }

        return (
            <span className={clsx('px-2 py-1 rounded-full text-xs font-semibold', color)}>
                {display}
            </span>
        );
    }

    if (key === 'date') {
        const date = item.publishedAt || item.submittedAt || item.$createdAt;
        return date ? new Date(date).toLocaleDateString() : '-';
    }

    if (key === 'avatar' && item.avatar) {
        return (
            <img
                src={item.avatar}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
            />
        );
    }

    return item[key] || '-';
}

export default function RecentTable({ rows = [] }) {
    if (!rows.length) {
        return <EmptyState message="No recent activity to display." className="empty-state" />;
    }

    const showAvatar = rows.some(row => row.avatar);

    const columns = [
        ...(showAvatar ? [{ key: 'avatar', label: 'Avatar', render: row => getDisplayValue(row, 'avatar') }] : []),
        { key: 'title', label: 'Title', render: row => getDisplayValue(row, 'title') },
        { key: 'type', label: 'Type', render: row => getDisplayValue(row, 'type') },
        { key: 'status', label: 'Status', render: row => getDisplayValue(row, 'status') },
        { key: 'date', label: 'Date', render: row => getDisplayValue(row, 'date') },
    ];

    return (
        <div className="overflow-x-auto mt-6 rounded-xl bg-[var(--card-bg)] shadow-md shadow-gray-300/50 dark:shadow-black/40">
            <Table columns={columns} data={rows} rowKey={"$id"} />
        </div>
    );
}

import { useNavigate } from 'react-router-dom'

/**
 * OverviewCard Component displays a single card with a title, count, icon,
 * and navigates to a specified path on click.
 * @param {string} title - The title of the card (e.g., "Total Projects")
 * @param {number} count - The count displayed on the card
 * @param {string} to - The path to navigate to when the card is clicked
 * @param {React.ComponentType} icon: Icon - The Lucide React icon component to display
 */
export default function OverviewCard({ title, count, to, icon: Icon }) {
    const navigate = useNavigate()

    // Handle click event: navigate to the 'to' path if count > 0,
    // otherwise navigate to a /create path (e.g., /create/projects)
    const handleClick = () => {
        if (count > 0) {
            navigate(to);
        } else {
            // Extracts the second word from the title (e.g., "Projects" from "Total Projects")
            // and converts it to lowercase for the create path.
            const createPathSegment = title.toLowerCase().split(' ')[1];
            navigate(`/create/${createPathSegment}`);
        }
    };

    return (
        <div
            onClick={handleClick}
            // `dashboard-card` provides base styling
            // `bg-[var(--card-bg)]` for improved contrast in light mode
            // `shadow-md shadow-gray-300/50 dark:shadow-black/40` for clearer shadow
            className="dashboard-card flex flex-col gap-2 items-start hover:shadow-lg focus:shadow-lg transition-shadow cursor-pointer min-h-[110px] bg-[var(--card-bg)] rounded-xl p-4 shadow-md shadow-gray-300/50 dark:shadow-black/40"
            tabIndex={0} // Makes the div focusable for keyboard navigation
            role="button" // Semantically marks the div as a button
            aria-label={`View ${title} details. Currently ${count}.`} // Accessible label
        >
            <div className="flex items-center gap-2 mb-1">
                {Icon && <Icon className="w-6 h-6 text-[var(--fg)] opacity-80" />}
                <span className="text-sm font-medium text-[var(--fg)]">{title}</span>
            </div>
            <span className="text-2xl font-bold text-[var(--fg)]">{count}</span>
        </div>
    )
}

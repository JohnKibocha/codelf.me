// src/components/Sidebar.jsx
import { NavLink, useNavigate } from 'react-router-dom'
import {
    Home,
    Folder,
    FileText,
    Star,
    Mail,
    User,
    LogOut,
    Sidebar as SidebarIcon,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext';

// Define the menu items for the sidebar
const menu = [
    { label: 'Overview', icon: Home, to: '/dashboard' },
    { label: 'Projects', icon: Folder, to: '/projects' },
    { label: 'Blogs', icon: FileText, to: '/blogs' },
    { label: 'Reviews', icon: Star, to: '/reviews' },
    { label: 'Messages', icon: Mail, to: '/messages' },
    { label: 'Profile', icon: User, to: '/profile' },
]

export default function Sidebar({ open, collapsed, onToggle, isMobile }) {
    const navigate = useNavigate();
    const { logout } = useAuth();

    // If the sidebar is not open on mobile, do not render it to avoid unnecessary DOM elements
    // This helps with performance and prevents interaction issues on smaller screens.
    if (!open && isMobile) return null;

    // Determine the sidebar's width based on its collapsed state and whether it's a mobile view.
    // 'w-24' (6rem) for collapsed desktop, 'w-64' (16rem) for expanded desktop/mobile.
    const sidebarWidthClass = collapsed && !isMobile ? 'w-24 min-w-[6rem] max-w-[6rem]' : 'w-64 min-w-[16rem] max-w-[16rem]';

    // Apply a transform for a smooth slide-in/out effect on mobile.
    const mobileTransformClass = isMobile ? `transform ${open ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200` : '';

    // Helper functions for conditional classes to improve readability and manage styling based on state.

    // Controls padding for the header section (logo)
    const getHeaderPaddingClass = (isCollapsed) => isCollapsed && !isMobile ? 'px-2' : 'pl-5'; // Changed to pl-5 for expanded

    // Controls padding for the navigation container (ul)
    const getNavContainerPaddingClass = (isCollapsed) => isCollapsed && !isMobile ? 'py-4' : 'py-4'; // Horizontal padding handled by NavLink itself

    // Controls padding for the footer section (logout button)
    const getFooterPaddingClass = (isCollapsed) => isCollapsed && !isMobile ? 'px-2 py-4' : 'pl-5 py-6'; // Changed to pl-5 for expanded

    // Controls justification for the toggle button container
    const getToggleJustifyClass = (isCollapsed) => isCollapsed && !isMobile ? 'justify-center' : 'justify-end';

    // Determines if text labels next to icons should be visible.
    // Text labels are visible if:
    // 1. It's desktop AND not collapsed
    // 2. It's mobile AND sidebar is open (mobile sidebar doesn't "collapse", it just opens/closes)
    const showTextLabels = (!isMobile && !collapsed) || (isMobile && open);

    // Consistent icon sizes for all icons.
    const iconSize = 24;

    // Base style for all icon buttons (NavLink and regular buttons)
    const iconButtonBaseClass = 'flex items-center rounded-lg transition-colors duration-150 hover:bg-[var(--input-bg)]';

    // Helper to generate NavLink specific classes based on active state and sidebar state
    const getNavLinkClasses = (isActive, isCollapsed, isMobile, showTextLabels) => {
        let classes = `${iconButtonBaseClass} w-full text-[var(--fg)] hover:bg-[var(--input-bg)]`;

        if (isActive) {
            classes += ' bg-[var(--input-bg)] font-semibold';
        }

        if (showTextLabels) { // Expanded state (or mobile open) - well left-aligned
            classes += ' gap-3 pl-5 py-3 justify-start'; // Increased left padding
        } else { // Collapsed desktop state - centered icon
            classes += ' gap-0 p-3 justify-center'; // Smaller padding, centered
        }

        return classes;
    };

    return (
        <aside
            className={`fixed top-0 left-0 h-full bg-[var(--card-bg)] shadow-lg z-40 flex flex-col items-start ${sidebarWidthClass} ${mobileTransformClass} transition-all duration-200`}
        >
            {/* Logo Section */}
            <div className={`flex items-center h-20 w-full ${getHeaderPaddingClass(collapsed)} ${(collapsed && !isMobile) ? 'justify-center' : ''}`}>
                <img
                    src="/logo.svg"
                    alt="Logo"
                    className={`transition-all duration-200 ${(collapsed && !isMobile) ? 'w-10' : 'w-16'}`}
                />
                {showTextLabels && (
                    <span className="ml-2 font-bold text-xl text-[var(--fg)]">Codelf</span>
                )}
            </div>

            {/* Collapse/Expand Button - positioned at the top of the menu */}
            <div className={`flex w-full ${getToggleJustifyClass(collapsed)} ${(collapsed && !isMobile) ? 'px-0' : 'pr-5'} mb-2`}>
                <button
                    className={`${iconButtonBaseClass} w-12 h-12 text-[var(--fg)] hover:bg-[var(--input-bg)] flex items-center justify-center`}
                    style={{ background: 'none' }}
                    onClick={onToggle}
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    tabIndex={0}
                >
                    <SidebarIcon size={24} style={{ width: 24, height: 24 }} />
                </button>
            </div>

            {/* Menu Section */}
            <nav className={`flex-1 overflow-y-auto w-full ${getNavContainerPaddingClass(collapsed)}`}>
                <ul className="space-y-2 w-full">
                    {menu.map(({ label, icon: Icon, to }, idx) => (
                        <li key={label} className={`w-full ${(collapsed && !isMobile) ? 'flex justify-center' : ''}`}>
                            <NavLink
                                to={to}
                                className={({ isActive }) =>
                                    getNavLinkClasses(isActive, collapsed, isMobile, showTextLabels)
                                }
                                // Add title for tooltip on collapsed icons
                                title={!showTextLabels ? label : undefined}
                            >
                                <Icon size={iconSize} />
                                {showTextLabels && <span>{label}</span>}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Footer Section (Logout) */}
            <div className={`flex flex-col gap-4 w-full ${getFooterPaddingClass(collapsed)} ${(collapsed && !isMobile) ? 'items-center' : ''}`}>
                <button
                    className={getNavLinkClasses(false, collapsed, isMobile, showTextLabels)}
                    style={{ background: 'none' }}
                    onClick={async () => {
                        await logout();
                        navigate('/login', { replace: true });
                    }}
                    aria-label="Logout"
                >
                    <LogOut size={iconSize} />
                    {showTextLabels && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
}

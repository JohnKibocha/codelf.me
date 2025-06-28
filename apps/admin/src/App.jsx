// src/App.jsx
import useAutoTheme from './hooks/useAutoTheme';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import LoadingOverlay from './components/ui/LoadingOverlay';
import { LoadingProvider, useLoading } from './context/LoadingContext';

function App() {
    useAutoTheme();
    const location = useLocation();
    const hideSidebar = location.pathname === '/login';

    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
    const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Update: Use context-based loading
    const { isLoading, loadingText } = useLoading();

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) {
                setSidebarOpen(false);
                setSidebarCollapsed(false);
            } else {
                setSidebarOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSidebarToggle = () => {
        if (isMobile) {
            setSidebarOpen((prev) => !prev);
        } else {
            setSidebarCollapsed((prev) => !prev);
        }
    };

    const mainContentMarginClass = () => {
        if (hideSidebar) return '';
        if (isMobile) return '';
        if (sidebarOpen && !sidebarCollapsed) return 'md:ml-64';
        if (sidebarOpen && sidebarCollapsed) return 'md:ml-20';
        return '';
    };

    return (
        <div className="relative min-h-screen bg-gray-50">

            {!hideSidebar && (
                <Sidebar
                    open={sidebarOpen}
                    collapsed={sidebarCollapsed}
                    onToggle={handleSidebarToggle}
                    isMobile={isMobile}
                />
            )}

            {!hideSidebar && sidebarOpen && isMobile && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-20"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Mobile-only expand button (visible when sidebar is closed on mobile) */}
            {/* Ensure its z-index is lower than the global overlay but higher than main content */}
            {!hideSidebar && !sidebarOpen && isMobile && (
                <button
                    className="fixed top-4 left-4 z-30 bg-[var(--card-bg)] rounded-full shadow-md flex items-center justify-center w-10 h-10 focus:outline-none focus:ring-2 focus:ring-[var(--button-bg)] md:hidden"
                    onClick={handleSidebarToggle}
                    aria-label="Open sidebar"
                >
                    <Menu className="w-6 h-6 text-[var(--fg)]" />
                </button>
            )}

            <div className={`${mainContentMarginClass()} transition-all duration-200`}>
                <Outlet />
            </div>

            {/* Update: Use context loading overlay */}
            {isLoading && <LoadingOverlay text={loadingText} />}
        </div>
    );
}

// Update: Wrap App in LoadingProvider
export default function AppWithProvider() {
    return (
        <LoadingProvider>
            <App />
        </LoadingProvider>
    );
}

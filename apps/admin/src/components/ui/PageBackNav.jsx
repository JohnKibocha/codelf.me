import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

/**
 * PageBackNav - A compact back navigation button for page containers.
 * Shows just "Back" to save space.
 */
export default function PageBackNav({ fallback = '/dashboard', label }) {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Use compact label logic: if label provided, use it, otherwise just "Back"
  const displayLabel = label || 'Back';

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Listen for sidebar state changes
  useEffect(() => {
    const checkSidebarState = () => {
      const sidebarElement = document.querySelector('aside');
      if (sidebarElement) {
        const isCollapsed = sidebarElement.classList.contains('w-24') || 
                           sidebarElement.querySelector('.w-24');
        setSidebarCollapsed(isCollapsed);
      }
    };

    checkSidebarState();
    
    const observer = new MutationObserver(checkSidebarState);
    const sidebarElement = document.querySelector('aside');
    if (sidebarElement) {
      observer.observe(sidebarElement, { 
        attributes: true, 
        subtree: true, 
        attributeFilter: ['class'] 
      });
    }

    return () => observer.disconnect();
  }, []);
  
  // If history length is 1, go to fallback (e.g. dashboard)
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  // Calculate the left margin based on screen size and sidebar state
  const getLeftMarginClass = () => {
    if (isMobile) {
      return 'ml-16'; // Clear mobile expand button (64px)
    }
    
    // Desktop: match the main content margin logic from App.jsx
    if (sidebarCollapsed) {
      return 'ml-28'; // ml-24 (96px sidebar) + ml-4 (16px gap) = 112px
    } else {
      return 'ml-[272px]'; // ml-64 (256px sidebar) + 16px gap = 272px
    }
  };

  return (
    <div
      className="fixed top-4 left-0 z-50 pointer-events-none"
      style={{ minWidth: 0 }}
    >
      <div className={`${getLeftMarginClass()} pointer-events-auto transition-all duration-200`}>
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 shadow-sm hover:bg-white/90 dark:hover:bg-gray-900/90 text-gray-700 dark:text-gray-200 font-medium text-sm transition-all duration-200"
          aria-label={displayLabel}
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">{displayLabel}</span>
        </button>
      </div>
    </div>
  );
}

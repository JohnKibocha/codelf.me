import { useEffect } from 'react';

export default function useAutoTheme() {
    useEffect(() => {
        const applyTheme = () => {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const theme = prefersDark ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', theme);
        };

        applyTheme();

        // Listen to changes in system theme
        const listener = (e) => {
            const theme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', theme);
        };

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', listener);

        return () => {
            mediaQuery.removeEventListener('change', listener);
        };
    }, []);
}

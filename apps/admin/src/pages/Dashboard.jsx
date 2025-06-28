// src/components/Dashboard.jsx
import { useEffect, useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    LayoutGrid,
    FileText,
    Star,
    Mail,
    User,
    FilePlus
} from 'lucide-react';

import CardGrid from '../components/CardGrid';
import RecentTable from '../components/RecentTable';
import { fetchCollectionStats, fetchRecentDocuments } from '../lib/appwrite/appwrite';
import { useDashboardData } from '../hooks/useDashboardData';
import { client } from '../lib/appwrite/appwrite';
import { Databases, Query } from 'appwrite';
import { useAuth } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';
import SkeletonLoader from '../components/ui/SkeletonLoader';

const APPWRITE_DATABASE_ID = 'codelf-cms';

// Static card metadata
const cardMeta = [
    { id: 'projects', title: 'Total Projects', icon: LayoutGrid, to: '/projects' },
    { id: 'blogs', title: 'Published Blogs', icon: FileText, to: '/blogs' },
    { id: 'reviews', title: 'Pending Reviews', icon: Star, to: '/reviews' },
    { id: 'messages', title: 'Messages', icon: Mail, to: '/messages' },
    { id: 'drafts', title: 'Drafts', icon: FilePlus, to: '/drafts' },
    { id: 'views', title: 'Profile Views', icon: User, to: '/analytics' },
];

export default function Dashboard() {
    const { setLoading } = useLoading();
    const { user, loading: authLoading } = useAuth();
    const [counts, setCounts] = useState({});
    const [recent, setRecent] = useState([]);

    // Initial data from custom hook (on app load)
    const {
        counts: initialCounts,
        recent: initialRecent,
        loading: initialLoading
    } = useDashboardData();

    // Prevent data fetching if not authed or still checking auth
    useEffect(() => {
        if (authLoading || !user) {
            setLoading(true, 'Loading dashboard...');
            return;
        }
        setCounts(initialCounts);
        setRecent(initialRecent);
        setLoading(initialLoading, 'Loading dashboard...');
    }, [authLoading, user, initialCounts, initialRecent, initialLoading, setLoading]);

    // Background real-time sync
    const updateLiveData = useCallback(async () => {
        const newCounts = {};
        const keys = {
            projects: 'projects',
            blogs: 'posts',
            reviews: 'reviews',
            messages: 'contacts',
            drafts: 'posts',
            views: 'profile',
        };

        for (const [key, collectionId] of Object.entries(keys)) {
            if (key === 'drafts') {
                newCounts[key] = await fetchCollectionStats(collectionId, [Query.equal('status', 'draft')]);
            } else if (key === 'views') {
                newCounts[key] = await fetchCollectionStats(collectionId);
            } else {
                newCounts[key] = await fetchCollectionStats(collectionId);
            }
        }

        const activeCollections = ['posts', 'projects', 'reviews', 'contacts'];
        const combinedRecent = await Promise.all(
            activeCollections.map(fetchRecentDocuments)
        );

        const filteredRecent = combinedRecent
            .flat()
            .filter(doc => {
                const date = new Date(doc.publishedAt || doc.submittedAt || doc.$createdAt);
                return date >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            })
            .sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));

        setCounts(newCounts);
        setRecent(filteredRecent);
    }, []);

    // Fetch fresh data on mount or when user/auth is ready
    useEffect(() => {
        if (!authLoading && user) {
            let isMounted = true;
            setLoading(true, 'Refreshing dashboard...');
            updateLiveData().finally(() => {
                if (isMounted) setLoading(false);
            });
            return () => { isMounted = false; };
        }
    }, [authLoading, user, updateLiveData, setLoading]);

    // Don't render anything while auth is loading
    if (authLoading) {
        return <SkeletonLoader rows={3} height={60} className="mt-10" />;
    }
    if (!user) {
        return null;
    }

    // Setup real-time listeners (no page reload)
    useEffect(() => {
        const databases = new Databases(client);
        const collectionIds = ['posts', 'projects', 'reviews', 'contacts'];
        const subscriptions = collectionIds.map(id =>
            client.subscribe(
                `databases.${APPWRITE_DATABASE_ID}.collections.${id}.documents`,
                () => updateLiveData()
            )
        );

        return () => subscriptions.forEach(unsub => unsub());
    }, [updateLiveData]);

    const cardData = cardMeta.map(card => ({
        ...card,
        count: counts[card.id] ?? 0,
    }));

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-8">
            <h1 className="text-2xl font-semibold text-[var(--fg)] mb-2">Overview</h1>
            <CardGrid data={cardData} />
            <div>
                <h2 className="text-xl font-semibold mb-4 text-[var(--fg)]">Recent Activity</h2>
                {recent.length > 0 ? (
                    <RecentTable rows={recent.slice(0, 5)} />
                ) : (
                    <SkeletonLoader rows={3} height={40} />
                )}
            </div>
        </div>
    );
}

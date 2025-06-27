// src/hooks/useDashboardData.js
import { useEffect, useState } from 'react';
import { fetchCollectionStats, fetchRecentDocuments } from '../lib/appwrite/appwrite';
import { Query } from 'appwrite';

const collectionMap = {
    projects: 'projects',
    blogs: 'posts',
    reviews: 'reviews',
    messages: 'contacts',
    drafts: 'posts',      // filtered by status='draft'
    views: 'profile',     // not included in recents
};

const recentsIncluded = ['projects', 'blogs', 'reviews', 'messages'];

export function useDashboardData() {
    const [counts, setCounts] = useState({});
    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const fetchedCounts = {};

            // 1. Get counts for all collections
            for (const [key, id] of Object.entries(collectionMap)) {
                try {
                    if (key === 'drafts') {
                        fetchedCounts[key] = await fetchCollectionStats(id, [Query.equal('status', 'draft')]);
                    } else {
                        fetchedCounts[key] = await fetchCollectionStats(id);
                    }
                } catch (err) {
                    console.error(`Error fetching count for ${key}:`, err);
                    fetchedCounts[key] = 0;
                }
            }

            // 2. Fetch recents from selected collections only
            const recentFetchPromises = recentsIncluded.map(key =>
                fetchRecentDocuments(collectionMap[key])
                    .then(docs => docs.map(doc => ({ ...doc, type: key })))
                    .catch(err => {
                        console.error(`Error fetching recent for ${key}:`, err);
                        return [];
                    })
            );

            const allRecentDocs = (await Promise.all(recentFetchPromises)).flat();

            const now = new Date();
            const cutoff = new Date(now.setDate(now.getDate() - 30));

            const filteredRecent = allRecentDocs
                .filter(doc => {
                    const date = new Date(doc.publishedAt || doc.submittedAt || doc.$createdAt);
                    return date >= cutoff;
                })
                .sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));

            setCounts(fetchedCounts);
            setRecent(filteredRecent);
            setLoading(false);
        })();
    }, []);

    return { counts, recent, loading };
}

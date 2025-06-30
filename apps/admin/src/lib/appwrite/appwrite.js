// src/lib/appwrite/appwrite.js
import { Client, Account, Databases, Storage, Query } from 'appwrite';

export const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Centralized database ID
const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

/**
 * Fetch total count of documents in a collection.
 * Optionally accepts query filters (e.g., for "drafts").
 */
export async function fetchCollectionStats(collectionId, queries = []) {
    try {
        const { total } = await databases.listDocuments(DB_ID, collectionId, queries);
        return total;
    } catch (err) {
        console.error(`Error fetching count for ${collectionId}`, err);
        return 0;
    }
}

/**
 * Fetch up to 5 most recent documents from a collection.
 */
export async function fetchRecentDocuments(collectionId) {
    try {
        const { documents } = await databases.listDocuments(
            DB_ID,
            collectionId,
            [
                Query.orderDesc('$createdAt'),
                Query.limit(5)
            ]
        );
        return documents;
    } catch (err) {
        console.error(`Error fetching recent documents for ${collectionId}`, err);
        return [];
    }
}

/**
 * Update an existing blog post document in Appwrite
 */
export async function updateBlogPost(blogId, data) {
    try {
        const doc = await databases.updateDocument(
            DB_ID,
            'posts',
            blogId,
            data
        );
        return doc;
    } catch (err) {
        console.error('Error updating blog post', err);
        throw err;
    }
}

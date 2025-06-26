// lib/fetchRecentDocuments.js
import { Client, Databases, Query } from 'appwrite'

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)

const databases = new Databases(client)

export async function fetchRecentDocuments(collectionId) {
    try {
        const res = await databases.listDocuments(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            collectionId,
            [Query.orderDesc('$createdAt'), Query.limit(5)]
        )
        return res.documents
    } catch (error) {
        console.error(`Failed to fetch recent docs from ${collectionId}:`, error.message)
        return []
    }
}

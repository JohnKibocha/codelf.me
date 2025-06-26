// lib/fetchCollectionStats.js
import { Client, Databases } from 'appwrite'

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)

const databases = new Databases(client)

export async function fetchCollectionStats(collectionId) {
    try {
        const response = await databases.listDocuments(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            collectionId,
            [ ]
        )
        return response.total
    } catch (error) {
        console.error(`Failed to fetch stats for ${collectionId}:`, error.message)
        return 0
    }
}

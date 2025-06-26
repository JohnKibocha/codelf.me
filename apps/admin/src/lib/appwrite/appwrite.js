import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);


export async function fetchCollectionStats(collectionId) {
    try {
        const { total } = await databases.listDocuments(
            import.meta.env.VITE_APPWRITE_DB_ID,
            collectionId,
            []
        );
        return total;
    } catch (err) {
        console.error(`Error fetching count for ${collectionId}`, err);
        return 0;
    }
}

export async function fetchRecentDocuments(collectionId) {
    try {
        const { documents } = await databases.listDocuments(
            import.meta.env.VITE_APPWRITE_DB_ID,
            collectionId,
            [ 'orderDesc("$createdAt")', 'limit(5)' ]
        );
        return documents;
    } catch (err) {
        console.error(`Error fetching recent documents for ${collectionId}`, err);
        return [];
    }
}

// seed_data.js
import { Client, Databases, ID } from 'appwrite';
import 'dotenv/config';

const client = new Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID);

// Set API key manually
client.headers['X-Appwrite-Key'] = process.env.VITE_APPWRITE_API_KEY;

const databases = new Databases(client);

const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = 'projects';

const projects = [
    {
        title: "Codelf.me",
        slug: "codelf.me",
        description: "Personal portfolio and blog platform for showcasing full-stack projects and technical writing.",
        stack: ["React", "Appwrite", "TailwindCSS", "Vite"],
        githubUrl: "https://github.com/sahilm0/codelf.me",
        liveUrl: "https://codelf.me",
        androidUrl: "",
        iosUrl: "",
        banner: "https://cdn.codelf.me/banners/codelfme.png",
        status: "Active"
    },
    {
        title: "FixMate",
        slug: "fixmate",
        description: "Freelancer platform helping verified tradespeople connect with trusted clients in real-time.",
        stack: ["Next.js", "Appwrite", "ShadcnUI", "Firebase Auth"],
        githubUrl: "https://github.com/sahilm0/fixmate",
        liveUrl: "https://fixmate.codelf.me",
        androidUrl: "https://play.google.com/store/apps/details?id=com.codelf.fixmate",
        iosUrl: "",
        banner: "https://cdn.codelf.me/banners/fixmate.png",
        status: "In Progress"
    },
    {
        title: "PromptPilot",
        slug: "promptpilot",
        description: "A no-code AI workflow builder for chaining GPT prompts with logic, memory and API support.",
        stack: ["React", "OpenAI API", "Zustand", "Express.js"],
        githubUrl: "https://github.com/sahilm0/promptpilot",
        liveUrl: "https://promptpilot.dev",
        androidUrl: "",
        iosUrl: "",
        banner: "https://cdn.codelf.me/banners/promptpilot.png",
        status: "Archived"
    },
    {
        title: "DevCheck",
        slug: "devcheck",
        description: "An open-source developer productivity dashboard with integrated GitHub, Jira, and Notion metrics.",
        stack: ["Vue", "Firebase", "Notion API", "GitHub GraphQL"],
        githubUrl: "https://github.com/sahilm0/devcheck",
        liveUrl: "https://devcheck.codelf.me",
        androidUrl: "",
        iosUrl: "",
        banner: "https://cdn.codelf.me/banners/devcheck.png",
        status: "Active"
    }
];

async function seedProjects() {
    try {
        for (const project of projects) {
            // Fix status to match Appwrite's enum format
            const payload = {
                ...project,
                status: project.status === 'In Progress' ? 'In_Progress' : project.status
            };

            const res = await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                payload
            );
            console.log(`✅ Added: ${res.title}`);
        }
    } catch (err) {
        console.error('❌ Error creating documents:', err.message);
    }
}

seedProjects();

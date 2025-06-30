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

// --- Project seeding commented out ---
// async function seedProjects() {
//     try {
//         for (const project of projects) {
//             // Fix status to match Appwrite's enum format
//             const payload = {
//                 ...project,
//                 status: project.status === 'In Progress' ? 'In_Progress' : project.status
//             };
//
//             const res = await databases.createDocument(
//                 DATABASE_ID,
//                 COLLECTION_ID,
//                 ID.unique(),
//                 payload
//             );
//             console.log(`✅ Added: ${res.title}`);
//         }
//     } catch (err) {
//         console.error('❌ Error creating documents:', err.message);
//     }
// }

// --- Blog seeds ---
const BLOG_COLLECTION_ID = 'posts';
const blogs = [
  {
    title: 'Welcome to Codelf Blog',
    slug: 'welcome-to-codelf-blog',
    body: `# Welcome to Codelf Blog\n\nWelcome to the very first post on the Codelf blog!\n\nThis space will be dedicated to sharing updates, tutorials, and stories from the journey of building and growing Codelf.\n\nStay tuned for more content, and thank you for being part of our community.`,
    tags: ['welcome', 'intro'],
    coverImage: '',
    category: 'General',
    status: 'published',
    publishedAt: new Date().toISOString(),
  },
  {
    title: 'Building with Appwrite',
    slug: 'building-with-appwrite',
    body: `# Building with Appwrite\n\nAppwrite powers the backend of Codelf, providing authentication, database, and storage services.\n\nIn this post, we explore how Appwrite simplifies backend development and enables rapid prototyping.\n\nFrom user management to secure data storage, Appwrite is a core part of our tech stack.`,
    tags: ['appwrite', 'backend'],
    coverImage: '',
    category: 'Tech',
    status: 'published',
    publishedAt: new Date().toISOString(),
  },
  {
    title: 'Styling with TailwindCSS',
    slug: 'styling-with-tailwindcss',
    body: `# Styling with TailwindCSS\n\nTailwindCSS allows us to build beautiful UIs quickly and efficiently.\n\nThis post covers our approach to using utility-first CSS for rapid development and consistent design.\n\nWe share tips and patterns for making the most of Tailwind in your own projects.`,
    tags: ['tailwindcss', 'frontend'],
    coverImage: '',
    category: 'Design',
    status: 'draft',
    publishedAt: null,
  },
];

async function seedBlogs() {
  try {
    for (const blog of blogs) {
      const res = await databases.createDocument(
        DATABASE_ID,
        BLOG_COLLECTION_ID,
        ID.unique(),
        blog
      );
      console.log(`✅ Blog added: ${res.title}`);
    }
  } catch (err) {
    console.error('❌ Error creating blog documents:', err.message);
  }
}

const CATEGORY_COLLECTION_ID = 'categories';
const categories = [
  { name: 'General', slug: 'general', color: '#2196F3' },
  { name: 'Tech', slug: 'tech', color: '#673AB7' },
  { name: 'Design', slug: 'design', color: '#FF9800' },
  { name: 'Engineering', slug: 'engineering', color: '#4CAF50' },
  { name: 'Lifestyle', slug: 'lifestyle', color: '#E91E63' },
  { name: 'Freelance', slug: 'freelance', color: '#009688' },
];

async function seedCategories() {
  try {
    for (const cat of categories) {
      const res = await databases.createDocument(
        DATABASE_ID,
        CATEGORY_COLLECTION_ID,
        ID.unique(),
        cat
      );
      console.log(`✅ Category added: ${res.name}`);
    }
  } catch (err) {
    console.error('❌ Error creating category documents:', err.message);
  }
}

// Seed profile collection with John Kibocha's profile
const profileSeed = {
  name: "John Kibocha",
  tagline: "From Keystroke to Meaning.",
  bio: "As a writer and full-stack web developer, I'm passionate about transforming concepts into software that is expressive and scalable. I write across domains and create efficient, content-driven web applications, distilling concepts, instruments, and procedures into understandable, approachable stories.\n\nI have practical experience with the FERN stack, Django, and Android development, and my area of expertise is the MERN stack (MongoDB, Express, React, and Node.js). I concentrate on producing work that is clear, flexible, and actually helpful, whether I'm using TipTap to create rich editors, Anime.js to create animated user interfaces, or writing tutorials to help people understand complex ideas.\n\nDeveloped with contemporary stacks and intended for developers, freelancers, and educators, Codelf is a modular content management system (CMS) that combines blog publishing, dashboard administration, and an editable editor. I believe that good software and good writing share the same goal: to make things easier to understand, use, and build on.",
  skills: [
    "UI Design",
    "Content Architecture",
    "Rich Text Editors",
    "Full Stack Development",
    "Writing & Documentation"
  ],
  stack: [
    "MERN",
    "FERN",
    "Django",
    "Android",
    "Appwrite",
    "TipTap",
    "TailwindCSS",
    "Vite"
  ],
  githubUrl: "https://github.com/johnkibocha",
  linkedinUrl: "https://www.linkedin.com/in/johnkibocha",
  twitterUrl: null,
  websiteUrl: "https://codelf.me",
  avatar: "https://cdn.jsdelivr.net/gh/johnkibocha/assets@main/avatar.jpg"
};

async function seedProfileCollection(databases, profileCollectionId) {
  // Only seed the profile collection with this one profile
  await databases.createDocument(
    DATABASE_ID, // <-- fix: use DATABASE_ID, not process.env.APPWRITE_DATABASE_ID
    profileCollectionId,
    'unique()',
    profileSeed
  );
}
seedProfileCollection(databases, 'profile');
// seedBlogs();
// seedCategories();

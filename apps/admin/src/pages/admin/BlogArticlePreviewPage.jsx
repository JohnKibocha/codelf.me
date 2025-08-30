import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import ArticlePreview from '../../components/ArticlePreview';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import PageBackNav from '../../components/ui/PageBackNav';
import {databases} from '../../lib/appwrite/appwrite';
import '../../components/canvas.css';
import '../../styles/medium-like.css';
import { Query } from 'appwrite';
import { Copy } from 'lucide-react';

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const POSTS_ID = 'posts';

export default function BlogArticlePreviewPage() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [darkTheme, setDarkTheme] = useState(false);

    // Auto-detect theme
    useEffect(() => {
        const updateTheme = () => {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches || 
                           document.documentElement.getAttribute('data-theme') === 'dark';
            setDarkTheme(isDark);
        };

        updateTheme();
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', updateTheme);

        return () => mediaQuery.removeEventListener('change', updateTheme);
    }, []);

    useEffect(() => {
        async function fetchBlog() {
            setLoading(true);
            setError(null);
            try {
                const doc = await databases.getDocument(DB_ID, POSTS_ID, id);
                setBlog(doc);
            } catch (e) {
                console.error('Error fetching blog:', e);
                setError('Failed to load blog post');
                setBlog(null);
            } finally {
                setLoading(false);
            }
        }
        async function fetchProfile() {
            try {
                const res = await databases.listDocuments(DB_ID, 'profile', []);
                if (res.documents && res.documents.length > 0) {
                    setProfile(res.documents[0]);
                }
            } catch (e) {
                console.error('Error fetching profile:', e);
            }
        }
        if (id) {
            fetchBlog();
            fetchProfile();
        }
    }, [id]);

    const handleCopyHtml = () => {
        if (blog?.body) {
            navigator.clipboard.writeText(blog.body);
        }
    };

    if (loading) return <LoadingOverlay message="Loading article..."/>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!blog) return <div className="p-8 text-center">Article not found.</div>;

    return (
        <div
            className={`medium-editor-container relative w-full min-h-screen${darkTheme ? ' dark' : ''}`}
            data-theme={darkTheme ? 'dark' : 'light'}
        >
            <PageBackNav fallback="/blog-manager" label="Back to Blog Manager" />
            <div
                className={`medium-editor-container relative w-full min-h-screen flex justify-center items-start${darkTheme ? ' dark' : ''}`}
                data-theme={darkTheme ? 'dark' : 'light'}
            >
                <article
                    className="w-full max-w-[700px] min-w-[340px] min-h-[1123px] px-4 py-8 border-0 bg-transparent shadow-none"
                >
                    <div className="pt-4" style={{ borderRadius: 0 }}>
                        <div className="flex justify-end mb-4">
                            <button
                                className="medium-toolbar-btn flex items-center gap-2"
                                onClick={handleCopyHtml}
                                title="Copy Article HTML"
                            >
                                <Copy size={16} />
                                <span className="btn-text">Copy HTML</span>
                            </button>
                        </div>
                        <ArticlePreview
                            html={blog.body || '<p>No content available.</p>'}
                            meta={blog}
                            title={blog.title || 'Untitled Article'}
                            date={blog.publishedAt || blog.date || blog.$createdAt}
                            onBack={() => navigate('/blogs')}
                            category={blog.category}
                            tags={blog.tags || []}
                            darkTheme={darkTheme}
                            username={profile?.name || 'Anonymous'}
                            avatar={profile?.avatar || ''}
                        />
                    </div>
                </article>
            </div>
        </div>
    );
}

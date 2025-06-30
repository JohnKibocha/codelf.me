import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import ArticlePreview from '../../components/ArticlePreview';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import {databases} from '../../lib/appwrite/appwrite';
import '../../components/canvas.css';
import { Query } from 'appwrite';
import { Copy } from 'lucide-react';

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const POSTS_ID = 'posts';

export default function BlogArticlePreviewPage({darkTheme}) {
    const {id} = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBlog() {
            setLoading(true);
            try {
                const doc = await databases.getDocument(DB_ID, POSTS_ID, id);
                setBlog(doc);
            } catch (e) {
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
            } catch {}
        }
        fetchBlog();
        fetchProfile();
    }, [id]);

    const handleCopyHtml = () => {
        if (blog?.body) {
            navigator.clipboard.writeText(blog.body);
        }
    };

    if (loading) return <LoadingOverlay message="Loading article..."/>;
    if (!blog) return <div className="p-8 text-center">Article not found.</div>;

    return (
        <div
            style={{ backgroundColor: 'var(--card-bg)', color: 'var(--fg)' }}
            className={`relative${darkTheme ? ' dark' : ''}`}
            data-theme={darkTheme ? 'dark' : 'light'}
        >
            <div
                style={{ backgroundColor: 'var(--card-bg)', color: 'var(--fg)' }}
                className={`relative w-full min-h-screen flex justify-center items-start${darkTheme ? ' dark' : ''}`}
                data-theme={darkTheme ? 'dark' : 'light'}
            >
                <article
                    className="prose prose-lg dark:prose-invert mx-auto w-full max-w-[700px] min-w-[340px] min-h-[1123px] px-0 py-0 border-0 bg-transparent shadow-none"
                >
                    <div className="pt-4 tiptap" style={{ borderRadius: 0 }}>
                        <div className="flex justify-end mb-4">
                            <button
                                className="flex items-center gap-2 px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                                onClick={handleCopyHtml}
                                title="Copy Article HTML"
                            >
                                <Copy size={16} />
                                Copy HTML
                            </button>
                        </div>
                        <ArticlePreview
                            html={blog.body}
                            meta={blog}
                            title={blog.title}
                            date={blog.publishedAt || blog.date || blog.$createdAt}
                            onBack={() => navigate('/blogs')}
                            category={blog.category}
                            tags={blog.tags}
                            darkTheme={darkTheme}
                            username={profile?.name}
                            avatar={profile?.avatar}
                        />
                    </div>
                </article>
            </div>
        </div>
    );
}

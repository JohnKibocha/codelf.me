import ChipInput from '../../components/ui/ChipInput';
import Tag from '../../components/ui/Tag';
import PageBackNav from '../../components/ui/PageBackNav';
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Toolbar from '../../components/Toolbar.jsx';
import Canvas from '../../components/Canvas.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import { databases, updateBlogPost } from '../../lib/appwrite/appwrite';
import { Query } from 'appwrite';
import DOMPurify from 'dompurify';
import { useAuth } from '../../context/AuthContext';
import { useSnackbar } from '../../components/ui/Snackbar.jsx';
import { CheckCircle, Loader2 } from 'lucide-react';
import '../../styles/medium-like.css';

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const POSTS_ID = 'posts';

const BlogEditor = ({ initialValue = '', theme = 'light', onSave }) => {
  const { id: blogId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [value, setValue] = useState(initialValue);
  const [preview, setPreview] = useState(false);
  const [editor, setEditor] = useState(null);
  const [meta, setMeta] = useState(null);
  const [profileAvatar, setProfileAvatar] = useState('');
  const [profile, setProfile] = useState(null);

  // Example meta fields for demonstration; in a real app, these would come from form inputs or state
  const [title, setTitle] = useState(meta?.title || '');
  const [category, setCategory] = useState(meta?.category || '');
  const [tags, setTags] = useState(meta?.tags || []);
  const [coverImage, setCoverImage] = useState(meta?.coverImage || '');
  const [author, setAuthor] = useState(meta?.author || '');
  const [authorImage, setAuthorImage] = useState(meta?.authorImage || '');
  const [subtitle, setSubtitle] = useState(meta?.subtitle || '');
  const [date, setDate] = useState(meta?.date || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // Update value if initialValue changes (for editing different blogs)
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Fetch site profile (singleton) and set name/avatar for editor and previews
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await databases.listDocuments(DB_ID, 'profile', []);
        if (res.documents && res.documents.length > 0) {
          setProfile(res.documents[0]);
          setProfileAvatar(res.documents[0].avatar);
          setAuthor(res.documents[0].name);
          setAuthorImage(res.documents[0].avatar);
        } else {
          setProfile(null);
          setProfileAvatar('');
          setAuthor('');
          setAuthorImage('');
        }
      } catch (e) {
        setProfile(null);
        setProfileAvatar('');
        setAuthor('');
        setAuthorImage('');
      }
    }
    fetchProfile();
  }, []);

  // Save/publish handler
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    showSnackbar({ message: 'Publishing article...', icon: <Loader2 className="animate-spin" />, variant: 'default', duration: 2000 });
    try {
      const sanitizedBody = DOMPurify.sanitize(value);
      // Only update the body and status, do not pass meta fields that are not in the schema
      await updateBlogPost(blogId, {
        body: sanitizedBody,
        status: 'published',
        publishedAt: new Date().toISOString(),
        // Remove createdAt, only update allowed fields
      });
      setSuccess(true);
      showSnackbar({ message: 'Article published successfully!', icon: <CheckCircle className="text-green-500" />, variant: 'default' });
      setTimeout(() => {
        navigate('/blogs');
      }, 1200);
    } catch (e) {
      setError('Failed to save blog post.');
      showSnackbar({ message: 'Failed to publish article.', variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Decoupled: Only run add logic if blogId is 'new', otherwise run edit logic
  useEffect(() => {
    if (blogId === 'new' && location.state?.meta) {
      // ADD BLOG POST FLOW
      const timer = setTimeout(async () => {
        try {
          const doc = await databases.createDocument(DB_ID, POSTS_ID, 'unique()', {
            ...location.state.meta,
            status: 'draft',
            body: '',
          });
          navigate(`/blogs/${doc.$id}/edit`, { replace: true });
        } catch (e) {
          setError('Failed to create new blog post.');
          showSnackbar({ message: 'Failed to create new blog post.', variant: 'error' });
          setLoading(false);
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else if (blogId && blogId !== 'new') {
      // EDIT BLOG POST FLOW
      async function fetchMeta() {
        setLoading(true);
        try {
          const doc = await databases.getDocument(DB_ID, POSTS_ID, blogId);
          // Set basic meta data, will be updated when profile loads
          setMeta({
            title: doc.title,
            subtitle: doc.subtitle,
            author: doc.author || profile?.name || '',
            authorImage: doc.authorImage || profile?.avatar || '',
            date: doc.publishedAt || doc.$createdAt,
            coverImage: doc.coverImage,
            tags: doc.tags,
            category: doc.category
          });
          setValue(doc.body || ' ');
          setTitle(doc.title || '');
          setCategory(doc.category || '');
          setTags(doc.tags || []);
          setCoverImage(doc.coverImage || '');
          setSubtitle(doc.subtitle || '');
          setDate(doc.publishedAt || doc.$createdAt);
          setLoading(false);
        } catch (e) {
          console.error('Error fetching blog post:', e);
          setError('Failed to load blog post.');
          showSnackbar({ message: 'Failed to load blog post.', variant: 'error' });
          setLoading(false);
        }
      }
      fetchMeta();
    } else {
      setLoading(false);
    }
  }, [blogId, location.state, navigate, showSnackbar]);

  // Update author info when profile loads
  useEffect(() => {
    if (profile && meta) {
      setMeta(prevMeta => ({
        ...prevMeta,
        author: profile.name || prevMeta.author,
        authorImage: profile.avatar || prevMeta.authorImage
      }));
      setAuthor(profile.name || '');
      setAuthorImage(profile.avatar || '');
    }
  }, [profile, meta]);

  // Modern: Remove sidebar, make toolbar fixed, center canvas
  return (
    <div className="medium-editor-container min-h-screen w-full bg-white dark:bg-black">
      <PageBackNav fallback="/blog-manager" label="Back" />
      
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="animate-spin mx-auto mb-4" size={32} />
            <p className="text-gray-500">Loading blog editor...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center p-8">
            <div className="text-red-500 mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2">Error Loading Blog</h2>
            <p className="text-gray-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Main Editor Content */}
      {!loading && !error && (
        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* Sidebar - Hidden on mobile */}
          <div className="hidden lg:block lg:w-80 xl:w-96 border-r border-gray-200 dark:border-gray-800 overflow-y-auto">
            <Sidebar meta={meta} />
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Fixed Toolbar with responsive design */}
            {!preview && (
              <div className="sticky top-0 left-0 w-full z-30 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 px-2 sm:px-4 lg:px-6">
                <div className="max-w-none lg:max-w-4xl mx-auto">
                  <Toolbar
                    value={value}
                    setValue={setValue}
                    preview={preview}
                    setPreview={setPreview}
                    onPreview={() => setPreview(!preview)}
                    editor={editor}
                    setEditor={setEditor}
                    meta={meta}
                    title={title}
                    setTitle={setTitle}
                    category={category}
                    setCategory={setCategory}
                    tags={tags}
                    setTags={setTags}
                    coverImage={coverImage}
                    setCoverImage={setCoverImage}
                    author={author}
                    setAuthor={setAuthor}
                    authorImage={authorImage}
                    setAuthorImage={setAuthorImage}
                    subtitle={subtitle}
                    setSubtitle={setSubtitle}
                    date={date}
                    setDate={setDate}
                    saving={saving}
                    onSave={onSave}
                    blogId={blogId}
                    onPublish={handleSave}
                  />
                </div>
              </div>
            )}
            
            {/* Main Editor Area - Responsive */}
            <main className="flex-1 overflow-y-auto">
              <div className="max-w-none lg:max-w-4xl xl:max-w-5xl mx-auto px-4 py-6 lg:px-8 lg:py-12">
                <Canvas
                  value={value}
                  onChange={setValue}
                  preview={preview}
                  theme={theme}
                  editor={editor}
                  setEditor={setEditor}
                  meta={meta}
                  title={title}
                  date={date}
                  category={category}
                  tags={tags}
                  blogId={blogId}
                  onRequestEdit={() => setPreview(false)}
                  username={profile?.name || meta?.author}
                  avatar={profile?.avatar || meta?.authorImage}
                />
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogEditor;

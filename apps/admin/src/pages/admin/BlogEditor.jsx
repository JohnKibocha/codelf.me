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
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else if (blogId && blogId !== 'new') {
      // EDIT BLOG POST FLOW
      async function fetchMeta() {
        try {
          const doc = await databases.getDocument(DB_ID, POSTS_ID, blogId);
          // Use profile state for author info
          setMeta({
            title: doc.title,
            subtitle: doc.subtitle,
            author: profile?.name || '',
            authorImage: profile?.avatar || '',
            date: doc.publishedAt || doc.$createdAt,
            coverImage: doc.coverImage,
            tags: doc.tags,
            category: doc.category
          });
          setValue(doc.body || ' ');
        } catch (e) {
          setError('Failed to load blog post.');
        }
      }
      fetchMeta();
    }
  }, [blogId, location.state, navigate, showSnackbar, profile]);

  // Modern: Remove sidebar, make toolbar fixed, center canvas
  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-colors duration-200">
      {/* Sidebar */}
      <Sidebar meta={meta} />
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Fixed Toolbar */}
        {!preview && (
          <div className="sticky top-0 left-0 w-full z-30 shadow-md bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-3xl mx-auto px-2 md:px-0">
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
        {/* Main Editor Area */}
        <main className="flex flex-col items-center justify-start flex-1 overflow-y-auto pt-8 pb-16 px-2">
          <div className="w-full max-w-3xl">
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
  );
};

export default BlogEditor;

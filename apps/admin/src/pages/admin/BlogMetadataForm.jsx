import { useEffect, useState, useRef } from 'react';
import { databases, storage } from '../../lib/appwrite/appwrite';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import ChipInput from '../../components/ui/ChipInput';
import Tag from '../../components/ui/Tag';
import Dropdown from '../../components/ui/Dropdown';
import Textarea from '../../components/ui/Textarea';
import { Info, Tag as TagIcon, Image as ImageIcon, Hash, FileText, XCircle, CheckCircle, Plus } from 'lucide-react';
import BannerInput from '../../components/ui/BannerInput.jsx';
import Dialog from '../../components/ui/Dialog';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import { useSnackbar } from '../../components/ui/Snackbar';

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const POSTS_ID = 'posts';
const CATEGORIES_ID = 'categories';

const MEDIA_BUCKET = 'codelf.me-media';

const MATERIAL_COLORS = [
  '#F44336', // Red
  '#E91E63', // Pink
  '#9C27B0', // Purple
  '#673AB7', // Deep Purple
  '#3F51B5', // Indigo
  '#2196F3', // Blue
  '#03A9F4', // Light Blue
  '#00BCD4', // Cyan
  '#009688', // Teal
  '#4CAF50', // Green
  '#FF9800', // Orange
  '#FFEB3B', // Yellow
];
const DEFAULT_BANNER = '/banner-light.jpg';

export default function BlogMetadataForm({ blog, onClose, onSuccess, onCreated }) {
  const [title, setTitle] = useState(blog?.title || '');
  const [tags, setTags] = useState(blog?.tags || []);
  const [coverImage, setCoverImage] = useState(blog?.coverImage || '');
  const [category, setCategory] = useState(blog?.category || '');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bannerPreview, setBannerPreview] = useState(blog?.coverImage || '');
  const [bannerLoading, setBannerLoading] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', slug: '', color: '' });
  const [categoryObjects, setCategoryObjects] = useState([]); // for dropdown with color
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [addCategoryOption, setAddCategoryOption] = useState('add-category');
  const [showBannerUrlInput, setShowBannerUrlInput] = useState(false);
  const addCategoryRef = useRef();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // Only focus the input when the add category dialog is opened
    if (showAddCategory && addCategoryRef.current) {
      addCategoryRef.current.focus();
    }
  }, [showAddCategory]);

  async function fetchCategories() {
    setCategoryLoading(true);
    try {
      const res = await databases.listDocuments(DB_ID, CATEGORIES_ID, []);
      setCategoryObjects(res.documents);
      setCategories(res.documents.map(c => c.name));
    } catch {
      setCategoryObjects([]);
      setCategories([]);
    }
    setCategoryLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (blog) {
        // Edit mode: update existing blog post using Appwrite update logic
        await databases.updateDocument(DB_ID, POSTS_ID, blog.$id, {
          title, tags, coverImage, category
        });
        showSnackbar({
          icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
          message: 'Blog updated!'
        });
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      } else {
        // Add mode: create a new blog post as draft
        const doc = await databases.createDocument(DB_ID, POSTS_ID, 'unique()', {
          title, 
          tags, 
          coverImage, 
          category, 
          status: 'draft',
          content: '', // Initialize with empty content
          excerpt: '',
          readTime: 0,
          publishedAt: null
        });
        
        showSnackbar({
          icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
          message: 'Blog created! Opening editor...'
        });

        // Call onCreated with the new document to handle navigation
        if (onCreated) {
          onCreated(doc);
        } else {
          // Fallback to onSuccess if onCreated is not provided
          if (onSuccess) onSuccess();
          if (onClose) onClose();
        }
        return;
      }
    } catch (e) {
      setError('Failed to save. Please check your input.');
      showSnackbar({
        icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" /></svg>,
        message: 'Failed to save. Please check your input.',
        variant: 'error'
      });
    }
    setLoading(false);
  }

  async function handleBannerUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setBannerLoading(true);
    try {
      // Upload to Appwrite media bucket
      const uploaded = await storage.createFile(MEDIA_BUCKET, 'unique()', file);
      const url = storage.getFilePreview(MEDIA_BUCKET, uploaded.$id); // FIX: getFilePreview returns a string
      setBannerPreview(url);
      setCoverImage(url);
      showSnackbar({
        icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
        message: 'Banner uploaded!'
      });
    } catch (err) {
      showSnackbar({
        icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" /></svg>,
        message: 'Failed to upload image.',
        variant: 'error'
      });
    } finally {
      setBannerLoading(false);
    }
  }

  function handleRemoveBanner() {
    setBannerPreview('');
    setCoverImage('');
  }

  async function handleAddCategory(e) {
    e.preventDefault();
    // Auto-generate slug
    const slug = slugify(newCategory.name);
    const color = newCategory.color || MATERIAL_COLORS[0];
    try {
      const doc = await databases.createDocument(DB_ID, CATEGORIES_ID, 'unique()', {
        name: newCategory.name,
        slug,
        color
      });
      await fetchCategories(); // Refresh categories from DB
      setCategory(doc.name);
      setShowAddCategory(false);
      setNewCategory({ name: '', slug: '', color: MATERIAL_COLORS[0] });
      showSnackbar({
        icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
        message: 'Category added!'
      });
    } catch {
      showSnackbar({
        icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" /></svg>,
        message: 'Failed to add category.',
        variant: 'error'
      });
    }
  }

  function slugify(str) {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/--+/g, '-');
  }

  function handleCategoryChange(val) {
    if (val === addCategoryOption) {
      setShowAddCategory(true);
      return;
    }
    setCategory(val);
  }

  async function handleContinue(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Validate required fields
      if (!title || !category || !Array.isArray(tags) || tags.length === 0) {
        setError('All fields (title, tags, category) are required.');
        setLoading(false);
        return;
      }
      showSnackbar({
        message: 'Saving metadata...',
        variant: 'default',
        duration: 2000
      });
      let doc;
      if (blog) {
        doc = await databases.updateDocument(DB_ID, POSTS_ID, blog.$id, {
          title, tags, coverImage, category, status: blog.status || 'draft', body: blog.body || '', slug: blog.slug || slugify(title)
        });
        showSnackbar({
          icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
          message: 'Blog updated!'
        });
        if (onSuccess) onSuccess(doc);
        if (onClose) onClose();
      } else {
        doc = await databases.createDocument(DB_ID, POSTS_ID, 'unique()', {
          title,
          tags,
          coverImage,
          category,
          status: 'draft',
          body: ' ', // Use a non-empty string to satisfy Appwrite required field
          slug: slugify(title)
        });
        showSnackbar({
          message: 'Loading editor... Redirecting to canvas.',
          variant: 'default',
          duration: 2000
        });
        window.location.href = `/blogs/${doc.$id}/edit`;
        return;
      }
    } catch (e) {
      console.error('Appwrite error:', e);
      setError('Failed to save. Please check your input.');
      showSnackbar({
        icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" /></svg>,
        message: 'Failed to save. Please check your input.',
        variant: 'error'
      });
    }
    setLoading(false);
  }

  const handleToggleBannerUrlInput = () => setShowBannerUrlInput(v => !v);

  function handleBannerUrlChange(e) {
    setBannerPreview(e.target.value);
    setCoverImage(e.target.value);
  }

  return (
    <form
      className="flex flex-col gap-4 p-4 sm:p-8 min-w-0 w-full max-w-3xl items-center overflow-y-auto max-h-[90vh] bg-white dark:bg-[var(--card-bg)] rounded-lg shadow-md"
      style={{ boxSizing: 'border-box' }}
      onSubmit={handleContinue}
    >
      <div className="flex flex-col items-center gap-2 mb-2 w-full">
        <Info size={36} className="text-blue-500" />
        <h2 className="text-xl font-bold text-center">Step 1: Add Blog Metadata</h2>
        <p className="text-center text-gray-500 text-base">Let's start by adding the essential details for your blog post.</p>
      </div>
      <div className="w-full">
        {bannerLoading ? <SkeletonLoader rows={1} height={192} /> : (
          <BannerInput
            bannerPreview={bannerPreview ? bannerPreview : DEFAULT_BANNER}
            bannerLoading={bannerLoading}
            showBannerUrlInput={showBannerUrlInput}
            formBanner={showBannerUrlInput ? bannerPreview : ''}
            onBannerUpload={handleBannerUpload}
            onBannerUrlChange={handleBannerUrlChange}
            onRemoveBanner={handleRemoveBanner}
            onToggleBannerUrlInput={handleToggleBannerUrlInput}
          />
        )}
      </div>
      <Input label={<span className="flex items-center gap-2"><FileText size={18} /> Title</span>} value={title} onChange={e => setTitle(e.target.value)} required maxLength={128} className="w-full" />
      <ChipInput label={<span className="flex items-center gap-2"><Hash size={16} /> Tags</span>} value={tags} onChange={setTags} placeholder="Add tag..." maxChips={6} className="w-full" />
      <div className="w-full flex flex-col gap-2">
        <Dropdown
          label={<span className="flex items-center gap-2"><Tag size={16} /> Category</span>}
          value={category}
          onChange={handleCategoryChange}
          options={categoryLoading ? [] : [...categoryObjects.map(c => c.name), addCategoryOption]}
          placeholder={categoryLoading ? 'Loading...' : 'Select category'}
          required
          getLabel={opt => opt === addCategoryOption ? <span className="text-blue-500 flex items-center"><Plus size={16} /> Add Category</span> : (
            <span className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full" style={{ background: (categoryObjects.find(c => c.name === opt)?.color || '#ccc') }}></span>
              {opt}
            </span>
          )}
          getKey={opt => opt}
        />
      </div>
      {error && <div className="text-red-500 text-sm flex items-center gap-2"><XCircle size={16} /> {error}</div>}
      <div className="flex flex-row gap-2 mt-4 w-full justify-between">
        <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="flex items-center justify-center gap-2 w-1/2 py-3 rounded-lg">
          <XCircle size={18} /> Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading} className="flex items-center justify-center gap-2 w-1/2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
          <CheckCircle size={18} /> Continue
        </Button>
      </div>
      {/* Add Category Mini-Dialog */}
      <Dialog open={showAddCategory} onClose={() => setShowAddCategory(false)}>
        <div className="flex flex-col gap-3 p-4 min-w-[300px] max-w-xs w-full">
          <h3 className="text-lg font-semibold flex items-center gap-2"><Tag size={18} className="text-purple-500" /> Add New Category</h3>
          <Input label="Name" value={newCategory.name} onChange={e => setNewCategory(c => ({ ...c, name: e.target.value }))} required maxLength={64} ref={addCategoryRef} autoFocus={showAddCategory} />
          {/* Slug is auto-generated and hidden */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Color</label>
            <div className="flex flex-wrap gap-2">
              {MATERIAL_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`w-7 h-7 rounded-full border-2 ${newCategory.color === color ? 'border-black' : 'border-transparent'}`}
                  style={{ background: color }}
                  onClick={() => setNewCategory(c => ({ ...c, color }))}
                  aria-label={color}
                />
              ))}
            </div>
          </div>
            <label className="block mb-2 font-semibold text-sm text-gray-700 dark:text-gray-200">Tags</label>
            <ChipInput value={tags} onChange={setTags} placeholder="Add tag and press Enter" chipColor="blue" chipVariant="tag" />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, i) => <Tag key={i} color="blue" size="sm">{tag}</Tag>)}
              </div>
            )}
          <div className="flex flex-row gap-2 mt-2 w-full justify-between">
            <Button type="button" variant="outline" onClick={() => setShowAddCategory(false)} className="flex-1">Cancel</Button>
            <Button type="button" variant="primary" className="flex-1" onClick={handleAddCategory}>Add</Button>
          </div>
        </div>
      </Dialog>
    </form>
  );
}

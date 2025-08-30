import {useEffect, useState} from 'react';
import {databases} from '../../lib/appwrite/appwrite';
import {Query} from 'appwrite';
import Table from '../../components/ui/Table';
import {Button} from '../../components/ui/Button';
import {Badge} from '../../components/ui/Badge';
import Dialog from '../../components/ui/Dialog';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import SearchBar from '../../components/ui/SearchBar';
import {Edit3, FileText, Filter as FilterIcon, Info, Layers, Pencil, Plus, Search, Tag, Trash2} from 'lucide-react';
import Filter from '../../components/ui/Filter';
import BlogMetadataForm from './BlogMetadataForm';
import {useSnackbar} from '../../components/ui/Snackbar';
import {useNavigate} from 'react-router-dom';
import PageBackNav from '../../components/ui/PageBackNav';

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = 'posts';

export default function BlogManager() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [searching, setSearching] = useState(false);
    const [status, setStatus] = useState('all');
    const [category, setCategory] = useState('all');
    const [categories, setCategories] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState(null);
    const [showMetadataDialog, setShowMetadataDialog] = useState(false);
    const [editMode, setEditMode] = useState(null); // 'metadata' | 'content' | null
    const [showEditChoiceDialog, setShowEditChoiceDialog] = useState(false);
    const navigate = useNavigate();
    const {showSnackbar} = useSnackbar();

    useEffect(() => {
        fetchFilters();
    }, []);

    // Real-time search/filter for blogs and categories
    useEffect(() => {
        fetchBlogs();
        // eslint-disable-next-line
    }, [status, category]);

    async function fetchBlogs(q = search) {
        setLoading(true);
        let queries = [Query.limit(100), Query.orderDesc('publishedAt')];
        if (status !== 'all') queries.push(Query.equal('status', status));
        if (category !== 'all') queries.push(Query.equal('category', category));
        // Fetch all blogs, then filter client-side for all fields
        const res = await databases.listDocuments(DB_ID, COLLECTION_ID, queries);
        console.log('Appwrite listDocuments response:', res); // Debug log
        let filtered = res.documents;
        const qStr = typeof q === 'string' ? q : '';
        if (qStr.trim()) {
            const term = qStr.trim().toLowerCase();
            filtered = filtered.filter(doc =>
                (doc.title && doc.title.toLowerCase().includes(term)) ||
                (doc.slug && doc.slug.toLowerCase().includes(term)) ||
                (doc.body && doc.body.toLowerCase().includes(term)) ||
                (Array.isArray(doc.tags) && doc.tags.join(',').toLowerCase().includes(term)) ||
                (doc.coverImage && doc.coverImage.toLowerCase().includes(term)) ||
                (doc.category && doc.category.toLowerCase().includes(term)) ||
                (doc.status && doc.status.toLowerCase().includes(term))
            );
        }
        // Sort by publishedAt descending (latest first)
        filtered.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
        setBlogs(filtered);
        setLoading(false);
    }

    async function fetchFilters() {
        setLoading(true);
        try {
            const res = await databases.listDocuments(DB_ID, COLLECTION_ID, [Query.limit(100)]);
            const cats = Array.from(new Set(res.documents.map(b => b.category).filter(Boolean)));
            setCategories(['all', ...cats]);
            const stats = Array.from(new Set(res.documents.map(b => b.status).filter(Boolean)));
            setStatuses(['all', ...stats]);
        } catch {
            setCategories(['all']);
            setStatuses(['all']);
        }
        setLoading(false);
    }

    async function handleDelete(blog) {
        setBlogToDelete(blog);
        setShowDeleteDialog(true);
    }

    async function confirmDelete() {
        if (!blogToDelete) return;
        setDeletingId(blogToDelete.$id);
        try {
            await databases.deleteDocument(DB_ID, COLLECTION_ID, blogToDelete.$id);
            setBlogs(blogs => blogs.filter(b => b.$id !== blogToDelete.$id));
            showSnackbar({
                icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                </svg>,
                message: 'Blog post deleted!'
            });
        } catch {
        }
        setDeletingId(null);
        setShowDeleteDialog(false);
        setBlogToDelete(null);
    }

    function cancelDelete() {
        setShowDeleteDialog(false);
        setBlogToDelete(null);
    }

    async function handleSearch(val) {
        setSearching(true);
        const query = typeof val === 'string' ? val : search;
        await fetchBlogs(query);
        setSearching(false);
    }

// Add row click handler to go to ArticlePreview
    function handleRowClick(row) {
        navigate(`/blogs/${row.$id}/preview`);
    }

    const columns = [
        {
            key: 'title',
            label: 'Title',
            render: row => (
                <span className="font-medium text-[var(--fg)] flex items-center gap-2 group relative">
                    <Layers size={16} className="text-blue-500"/>
                    {row.title}
                    <button
                        className="ml-3 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 border border-blue-300 dark:border-blue-700 shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition text-xs font-semibold flex items-center gap-1"
                        title="Preview"
                        onClick={e => {
                            e.stopPropagation();
                            navigate(`/blogs/${row.$id}/preview`);
                        }}
                    >
                        <FileText size={18} className="text-blue-500"/>
                        Preview
                    </button>
                </span>
            )
        },
        {
            key: 'category',
            label: 'Category',
            render: row => (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 border border-purple-300 dark:border-purple-700 max-w-[120px] truncate">
                    {row.category || '-'}
                </span>
            )
        },
        {
            key: 'status',
            label: 'Status',
            render: row => (
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border max-w-[120px] truncate ${row.status === 'published' ? 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700' : 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700'}`}>
                    {row.status || '-'}
                </span>
            )
        },
        {
            key: 'publishedAt',
            label: 'Published',
            render: row => row.publishedAt ? new Date(row.publishedAt).toLocaleDateString() : '-'
        },
        {
            key: 'actions', label: '', render: row => (
                <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => {
                        setSelectedBlog(row);
                        setShowEditChoiceDialog(true);
                    }} title="Edit"><Pencil size={18} className="text-blue-500"/></Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(row)} disabled={deletingId === row.$id}
                            title="Delete"><Trash2 size={18} className="text-red-500"/></Button>
                </div>
            )
        },
    ];

    return (
        <div
            className="p-0 md:p-8 min-h-screen w-full flex flex-col items-center justify-start bg-[var(--screen-bg)] app-screen-bg">
            <PageBackNav fallback="/dashboard" label="Back" />
            {loading && <LoadingOverlay/>}
            <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 px-2 sm:px-0">
                {/* Title section - match ProjectsList style */}
                <div className="flex flex-col items-center justify-center gap-2 mt-6 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-center text-[var(--fg)] flex items-center gap-2">
                        <Layers size={28} className="text-blue-500"/>
                        Blog Manager
                    </h1>
                    <p className="text-gray-500 text-center text-base md:text-lg">Create, edit, and manage your blog posts
                        with ease.</p>
                </div>
                {/* Search and filters row */}
                <div className="flex flex-col gap-6 w-full">
                    {/* Search Bar */}
                    <div className="w-full">
                        <SearchBar
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onSearch={handleSearch}
                            searching={searching}
                            placeholder="Search blog posts by any field..."
                            variant="modern"
                            size="large"
                            autoSearch={false}
                            debounceMs={300}
                        />
                    </div>
                    
                    {/* Filters and Actions Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
                        {/* Filters Section */}
                        <div className="flex gap-3 items-center flex-wrap min-w-0">
                            <Filter
                                value={status}
                                onChange={setStatus}
                                options={statuses}
                                icon={FilterIcon}
                                placeholder="All Statuses"
                                getLabel={opt => opt === 'all' ? 'All Statuses' : opt.charAt(0).toUpperCase() + opt.slice(1)}
                                getKey={opt => opt}
                                width="w-44"
                                variant="outlined"
                                size="medium"
                            />
                            <Filter
                                value={category}
                                onChange={setCategory}
                                options={categories}
                                icon={Tag}
                                placeholder="All Categories"
                                getLabel={opt => opt === 'all' ? 'All Categories' : opt}
                                getKey={opt => opt}
                                width="w-44"
                                variant="outlined"
                                size="medium"
                            />
                        </div>
                        
                        {/* Action Buttons Section */}
                        <div className="flex justify-center sm:justify-end w-full sm:w-auto">
                            <Button
                                onClick={() => {
                                    setShowDialog(true);
                                    setEditMode(null);
                                    setSelectedBlog(null);
                                }}
                                icon={<Plus size={18}/>}
                                className="rounded-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto max-w-xs mx-auto sm:mx-0"
                            >
                                New Blog Post
                            </Button>
                        </div>
                    </div>
                </div>
                {/* Table section */}
                <div className="relative rounded-xl overflow-hidden bg-[var(--card-bg)] shadow-lg mt-4 sm:mt-0"
                     style={{zIndex: 1}}>
                    <Table columns={columns} data={blogs}/>
                </div>
            </div>
            {/* Edit Choice Dialog */}
            <Dialog open={showEditChoiceDialog} onClose={() => setShowEditChoiceDialog(false)}>
                <div className="p-8 flex flex-col items-center gap-6">
                    <Edit3 size={36} className="text-blue-500 mb-2"/>
                    <h2 className="text-xl font-bold text-center">Edit Blog</h2>
                    <p className="text-center text-gray-500">What would you like to edit?</p>
                    <div className="flex gap-6 mt-2 w-full justify-center">
                        <Button onClick={() => {
                            setEditMode('metadata');
                            setShowEditChoiceDialog(false);
                            setShowDialog(true);
                        }}
                                className="flex flex-col items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold px-6 py-4 rounded-lg shadow transition-all">
                            <Info size={24} className="mb-1"/>
                            Metadata
                        </Button>
                        <Button onClick={() => {
                            setShowEditChoiceDialog(false);
                            navigate(`/blogs/${selectedBlog?.$id}/edit`);
                        }}
                                className="flex flex-col items-center gap-1 bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold px-6 py-4 rounded-lg shadow transition-all">
                            <FileText size={24} className="mb-1"/>
                            Content
                        </Button>
                    </div>
                </div>
            </Dialog>
            {/* BlogMetadataForm Dialog for Add */}
            <Dialog open={showDialog && !selectedBlog} onClose={() => setShowDialog(false)}>
                <BlogMetadataForm
                    onClose={() => setShowDialog(false)}
                    onSuccess={fetchBlogs}
                    onCreated={doc => {
                        setShowDialog(false);
                        navigate(`/blogs/${doc.$id}/edit`, {state: {meta: doc}});
                    }}
                />
            </Dialog>
            {/* BlogMetadataForm Dialog for Edit Metadata */}
            <Dialog open={showDialog && editMode === 'metadata'} onClose={() => {
                setShowDialog(false);
                setEditMode(null);
            }}>
                <BlogMetadataForm
                    blog={selectedBlog}
                    onClose={() => {
                        setShowDialog(false);
                        setEditMode(null);
                    }}
                    onSuccess={() => {
                        setShowDialog(false);
                        setEditMode(null);
                        fetchBlogs(); // Just refresh list, do not redirect
                    }}
                />
            </Dialog>
            <Dialog open={showDeleteDialog} onClose={cancelDelete}>
                <div className="p-4 text-center">
                    <Trash2 size={40} className="mx-auto mb-3 text-red-500"/>
                    <h2 className="text-lg font-semibold mb-2">Delete Blog Post?</h2>
                    <p className="mb-4">Are you sure you want to delete <span
                        className="font-bold">{blogToDelete?.title}</span>? This action cannot be undone.</p>
                    <div className="flex gap-2 justify-center">
                        <Button onClick={cancelDelete} variant="outline">Cancel</Button>
                        <Button onClick={confirmDelete} variant="destructive"
                                loading={deletingId === blogToDelete?.$id}>Delete</Button>
                    </div>
                </div>
            </Dialog>
        </div>
    );

}

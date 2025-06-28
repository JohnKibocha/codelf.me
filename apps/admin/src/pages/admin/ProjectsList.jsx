import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { databases } from './../../lib/appwrite/appwrite';
import { Query, ID } from 'appwrite';
import { Button } from './../../components/ui/Button';
import { Input } from './../../components/ui/Input';
import { Badge } from './../../components/ui/Badge';
import { Card, CardContent } from './../../components/ui/Card';
import { toast } from 'react-toastify';
import { Plus, Search, Pencil, Trash2, ExternalLink, Github, Globe, Smartphone, Apple } from 'lucide-react';
import { Dialog } from './../../components/ui/Dialog';
import { useLoading } from './../../context/LoadingContext';
import SkeletonLoader from './../../components/ui/SkeletonLoader';
import SearchBar from '../../components/ui/SearchBar';

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = 'projects';
const STATUS_OPTIONS = [
    { label: 'All', value: 'All' },
    { label: 'Active', value: 'Active' },
    { label: 'In Progress', value: 'In_Progress' },
    { label: 'Archived', value: 'Archived' }
];

function mapStatus(status) {
    if (!status) return '';
    if (status === 'In_Progress' || status === 'In Progress' || status === 'InProgress') return 'In_Progress';
    return status;
}

function displayStatus(status) {
    if (!status) return '';
    if (status === 'In_Progress' || status === 'InProgress') return 'In Progress';
    return status;
}

// Add a ChipInput for stack tags (copied from ProjectForm)
function ChipInput({ value, onChange, placeholder }) {
  const [input, setInput] = useState('');
  const tags = value || [];

  function handleInput(e) {
    setInput(e.target.value);
  }

  function handleKeyDown(e) {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      if (!tags.includes(input.trim())) {
        onChange([...tags, input.trim()]);
      }
      setInput('');
    } else if (e.key === 'Backspace' && !input && tags.length) {
      onChange(tags.slice(0, -1));
    }
  }

  function removeTag(idx) {
    onChange(tags.filter((_, i) => i !== idx));
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border rounded px-2 py-2 bg-[var(--input-bg)]">
      {tags.map((tag, i) => (
        <span key={i} className="flex items-center bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-2 py-1 rounded-full text-xs font-medium">
          {tag}
          <button type="button" className="ml-1 text-blue-500 hover:text-red-500" onClick={() => removeTag(i)} aria-label="Remove tag">&times;</button>
        </span>
      ))}
      <input
        className="flex-1 min-w-[80px] bg-transparent outline-none text-[var(--input-fg)]"
        value={input}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
    </div>
  );
}

export default function ProjectsList() {
    const navigate = useNavigate();
    const { isLoading, setLoading, setLoadingText } = useLoading();
    const [projects, setProjects] = useState([]);
    const [search, setSearch] = useState('');
    const [searching, setSearching] = useState(false);
    const [statusFilter, setStatusFilter] = useState('All');
    const [addingInline, setAddingInline] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [newProject, setNewProject] = useState({
        title: '',
        description: '',
        stack: '',
        status: 'Active',
        githubUrl: '',
        liveUrl: '',
        androidUrl: '',
        iosUrl: '',
        banner: '',
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const searchTimeout = useRef();
    const defaultBanner = '/banner-light.jpg';

    const fetchProjects = async (q = search, status = statusFilter) => {
        setLoading(true, 'Loading projects...');
        try {
            const queries = [];
            if (status !== 'All') queries.push(Query.equal('status', mapStatus(status)));
            // Only filter by status on server, do search client-side for all fields
            const { documents } = await databases.listDocuments(DB_ID, COLLECTION_ID, queries);
            let filtered = documents;
            if (q && q.trim()) {
                const term = q.trim().toLowerCase();
                filtered = documents.filter(doc =>
                    (doc.title && doc.title.toLowerCase().includes(term)) ||
                    (doc.description && doc.description.toLowerCase().includes(term)) ||
                    (Array.isArray(doc.stack) && doc.stack.join(',').toLowerCase().includes(term)) ||
                    (typeof doc.stack === 'string' && doc.stack.toLowerCase().includes(term)) ||
                    (doc.githubUrl && doc.githubUrl.toLowerCase().includes(term)) ||
                    (doc.liveUrl && doc.liveUrl.toLowerCase().includes(term)) ||
                    (doc.androidUrl && doc.androidUrl.toLowerCase().includes(term)) ||
                    (doc.iosUrl && doc.iosUrl.toLowerCase().includes(term))
                );
            }
            setProjects(filtered);
        } catch (err) {
            toast.error('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    // Debounced search handler
    const handleSearch = async () => {
        setSearching(true);
        await fetchProjects(search, statusFilter);
        setSearching(false);
    };

    useEffect(() => {
        fetchProjects();
        // eslint-disable-next-line
    }, [search, statusFilter]);

    // Edit handler
    const handleEdit = (project) => {
        setEditingProject(project);
        setNewProject({
            title: project.title || '',
            description: project.description || '',
            stack: Array.isArray(project.stack) ? project.stack.join(', ') : (project.stack || ''),
            status: project.status || 'Active',
            githubUrl: project.githubUrl || '',
            liveUrl: project.liveUrl || '',
            androidUrl: project.androidUrl || '',
            iosUrl: project.iosUrl || '',
            banner: project.banner || '',
        });
    };

    // Save handler (add or edit)
    const handleSave = async () => {
        if (!newProject.title.trim()) {
            toast.warning('Project title required');
            return;
        }
        setLoading(true, editingProject ? 'Updating project...' : 'Adding project...');
        try {
            if (editingProject) {
                await databases.updateDocument(DB_ID, COLLECTION_ID, editingProject.$id, newProject);
                toast.success('Project updated');
            } else {
                await databases.createDocument(DB_ID, COLLECTION_ID, ID.unique(), newProject);
                toast.success('Project added');
            }
            setNewProject({ title: '', description: '', stack: '', status: 'Active', githubUrl: '', liveUrl: '', androidUrl: '', iosUrl: '', banner: '' });
            setAddingInline(false);
            setEditingProject(null);
            fetchProjects();
        } catch (err) {
            toast.error('Failed to save project');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setLoading(true, 'Deleting project...');
        try {
            await databases.deleteDocument(DB_ID, COLLECTION_ID, id);
            fetchProjects();
            toast.success('Project deleted');
        } catch (err) {
            toast.error('Failed to delete project');
        } finally {
            setLoading(false);
            setShowDeleteModal(false);
            setDeleteId(null);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[var(--bg)] transition-colors duration-300 px-2 md:px-8">
            <h1 className="text-3xl font-bold text-center mt-8 mb-8 text-[var(--fg)]">Projects</h1>
            {/* Search Bar - now using reusable component */}
            <div className="w-full flex justify-center mb-6">
                <div className="flex-1 max-w-2xl">
                    <SearchBar
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onSearch={handleSearch}
                        searching={searching}
                        placeholder="Search any project"
                        inputClassName="pr-16 pl-4 py-3 text-base rounded-full border border-gray-200 dark:border-gray-600 bg-[var(--input-bg)] text-[var(--input-fg)] placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm focus:border-blue-400 w-full"
                        inputStyle={{ height: 48 }}
                        buttonClassName="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full h-12 w-12 shadow transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
                        iconSize={20}
                    />
                </div>
            </div>
            {/* Chips below search/add, smaller and left-aligned */}
            <div className="w-full flex justify-center mb-8">
                <div className="w-full max-w-6xl flex flex-row flex-nowrap gap-1 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 py-1 px-2 md:px-0 justify-start">
                    {STATUS_OPTIONS.map(option => (
                        <button
                            key={option.value}
                            onClick={() => setStatusFilter(option.value)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all border flex items-center justify-center gap-2 whitespace-nowrap leading-tight inline-flex text-center max-w-[144px] w-full
                                ${statusFilter === option.value ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900'}`}
                            style={{ fontWeight: 500 }}
                        >
                            <span className="truncate w-full text-center">{option.label}</span>
                        </button>
                    ))}
                </div>
                <div className="flex-shrink-0 flex items-center ml-2">
                    <Button
                        onClick={() => navigate('/projects/new')}
                        variant="primary"
                        className="flex items-center gap-2 px-3 py-2 rounded-full text-xs shadow-md"
                        style={{ minWidth: 0, fontWeight: 500 }}
                    >
                        <Plus size={16} /> Add Project
                    </Button>
                </div>
            </div>
            {/* Projects Grid */}
            <div className="w-full flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
                    {isLoading ? (
                        <div className="col-span-full">
                            <SkeletonLoader rows={6} height={120} />
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-10">
                            No projects found.
                        </div>
                    ) : (
                        projects.map(project => (
                            <Card key={project.$id} className="hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-[var(--card-bg)]">
                                <img
                                    src={project.banner || defaultBanner}
                                    alt={project.title}
                                    className="w-full h-40 object-cover bg-gray-200 dark:bg-gray-800"
                                    onError={e => { e.target.onerror = null; e.target.src = defaultBanner; }}
                                />
                                <CardContent className="p-5 flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-xl text-[var(--fg)]">{project.title}</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${displayStatus(project.status) === 'Active' ? 'bg-green-500 text-white' : displayStatus(project.status) === 'In Progress' ? 'bg-yellow-500 text-white' : displayStatus(project.status) === 'Archived' ? 'bg-gray-400 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}>{displayStatus(project.status)}</span>
                                    </div>
                                    <div className="text-gray-700 dark:text-gray-300 text-sm mb-1">{project.description}</div>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {(Array.isArray(project.stack) ? project.stack : (project.stack || '').split(',')).filter(Boolean).map((tech, i) => (
                                            <span key={i} className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-2 py-1 rounded-full text-xs font-medium">{tech.trim()}</span>
                                        ))}
                                    </div>
                                    <div className="flex flex-wrap gap-3 items-center text-xs">
                                        {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"><Github size={16}/>GitHub</a>}
                                        {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"><Globe size={16}/>Live</a>}
                                        {project.androidUrl && <a href={project.androidUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"><Smartphone size={16}/>Android</a>}
                                        {project.iosUrl && <a href={project.iosUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"><Apple size={16}/>iOS</a>}
                                    </div>
                                    <div className="flex gap-2 mt-3">
                                        <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={() => navigate(`/projects/${project.$id}/edit`)}>
                                            <Pencil size={16}/> Edit
                                        </Button>
                                        <Button size="sm" variant="danger" className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white border-none" onClick={() => { setShowDeleteModal(true); setDeleteId(project.$id); }}>
                                            <Trash2 size={16}/> Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
            {/* Delete Modal */}
            {showDeleteModal && (
                <Dialog open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                    <div className="p-6 flex flex-col items-center">
                        <Trash2 size={40} className="text-red-500 mb-4" />
                        <div className="text-lg font-semibold mb-2 text-[var(--fg)]">Confirm Deletion</div>
                        <div className="mb-4 text-gray-600 dark:text-gray-300 text-center">Are you sure you want to delete this project? This action cannot be undone.</div>
                        <div className="flex gap-4">
                            <Button variant="danger" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => handleDelete(deleteId)}>Delete</Button>
                            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                        </div>
                    </div>
                </Dialog>
            )}
        </div>
    );
}

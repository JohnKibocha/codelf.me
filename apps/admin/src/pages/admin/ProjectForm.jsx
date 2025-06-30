import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { databases, storage } from '../../lib/appwrite/appwrite';
import { Query, ID } from 'appwrite';
import { Input } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Textarea from '../../components/ui/Textarea';
import ChipInput from '../../components/ui/ChipInput';
import Dropdown from '../../components/ui/Dropdown';
import { useSnackbar } from '../../components/ui/Snackbar';
import { X, Upload, Image as ImageIcon, Link as LinkIcon, Loader2, PlusCircle, Pencil, CheckCircle2, XCircle } from 'lucide-react';
import UniversalForm from '../../components/ui/UniversalForm';
import BannerInput from '../../components/ui/BannerInput.jsx';

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = 'projects';
const BUCKET_ID = 'media';
const defaultBanner = '/banner-light.jpg';

const initialState = {
  banner: '',
  title: '',
  slug: '',
  description: '',
  stack: [],
  status: 'Active',
  githubUrl: '',
  liveUrl: '',
  androidUrl: '',
  iosUrl: '',
};

export default function ProjectForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [form, setForm] = useState(initialState);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(defaultBanner);
  const [showBannerUrlInput, setShowBannerUrlInput] = useState(false);
  const fileInputRef = useRef();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [bannerLoading, setBannerLoading] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [resultSuccess, setResultSuccess] = useState(false);

  useEffect(() => {
    if (isEdit) {
      databases.getDocument(DB_ID, COLLECTION_ID, id)
          .then((doc) => {
            setForm({ ...doc, stack: doc.stack || [] });
            setBannerPreview(doc.banner || defaultBanner);
          })
          .catch(() => showSnackbar({
            icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" /></svg>,
            message: 'Failed to load project',
            variant: 'error'
          }));
    }
  }, [id, isEdit, showSnackbar]);

  useEffect(() => {
    if (bannerFile) {
      const reader = new FileReader();
      reader.onload = (e) => setBannerPreview(e.target.result);
      reader.readAsDataURL(bannerFile);
    } else {
      setBannerPreview(form.banner || defaultBanner);
    }
  }, [form.banner, bannerFile]);

  // Live validation
  useEffect(() => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.slug.trim()) newErrors.slug = 'Slug is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    const urlFields = ['githubUrl', 'liveUrl', 'androidUrl', 'iosUrl'];
    urlFields.forEach(field => {
      if (form[field] && !/^https?:\/\//.test(form[field])) {
        newErrors[field] = 'Must be a valid URL (start with http:// or https://)';
      }
    });
    setErrors(newErrors);
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleStackChange = (stack) => {
    setForm((f) => ({ ...f, stack }));
  };

  const handleStatusChange = (status) => {
    setForm((f) => ({ ...f, status }));
  };

  const handleBannerUrlChange = (e) => {
    const url = e.target.value;
    setBannerPreview(url);
    setForm((f) => ({ ...f, banner: url }));
  };

  const handleBannerUpload = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file || !(file instanceof File)) {
      showSnackbar({
        icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" /></svg>,
        message: 'No file selected or invalid file type',
        variant: 'error'
      });
      return;
    }
    setBannerLoading(true);
    try {
      const uploaded = await storage.createFile(BUCKET_ID, ID.unique(), file);
      const url = storage.getFilePreview(BUCKET_ID, uploaded.$id);
      setBannerPreview(url);
      setForm((f) => ({ ...f, banner: url }));
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
  };

  const handleRemoveBanner = () => {
    setBannerPreview('');
    setForm((f) => ({ ...f, banner: '' }));
  };

  const handleToggleBannerUrlInput = () => setShowBannerUrlInput(v => !v);

  // UniversalForm fields schema
  const fields = [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'slug', label: 'Slug', type: 'text' },
    { name: 'description', label: 'Description', type: 'textarea', required: true },
    { name: 'status', label: 'Status', type: 'select', options: [
      { label: 'Active', value: 'Active' },
      { label: 'In Progress', value: 'In_Progress' },
      { label: 'Archived', value: 'Archived' },
    ], required: true },
    { name: 'githubUrl', label: 'GitHub URL', type: 'text' },
    { name: 'liveUrl', label: 'Live URL', type: 'text' },
    { name: 'androidUrl', label: 'Android URL', type: 'text' },
    { name: 'iosUrl', label: 'iOS URL', type: 'text' },
  ];

  // UniversalForm onChange handler
  const handleFormChange = (name, value) => {
    setForm(f => ({ ...f, [name]: value }));
  };

  const getSchemaFields = () => [
    'banner',
    'title',
    'slug',
    'description',
    'stack',
    'status',
    'githubUrl',
    'liveUrl',
    'androidUrl',
    'iosUrl',
  ];

  const filterPayload = (data) => {
    const allowed = getSchemaFields();
    const filtered = {};
    for (const key of allowed) {
      if (typeof data[key] !== 'undefined') filtered[key] = data[key];
    }
    return filtered;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    // Validation
    if (!form.title.trim()) {
      setErrors({ title: 'Title is required' });
      showSnackbar({
        icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" /></svg>,
        message: 'Project title is required',
        variant: 'error'
      });
      setSubmitting(false);
      return;
    }
    try {
      const payload = filterPayload(form);
      console.log('Submitting payload:', payload); // Debugging
      if (isEdit) {
        // Overwrite: updateDocument with all fields, replacing existing data
        await databases.updateDocument(DB_ID, COLLECTION_ID, id, payload);
        showSnackbar({
          icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
          message: 'Project updated!'
        });
      } else {
        await databases.createDocument(DB_ID, COLLECTION_ID, ID.unique(), payload);
        showSnackbar({
          icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
          message: 'Project created!'
        });
      }
      navigate('/projects');
    } catch (err) {
      showSnackbar({
        icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" /></svg>,
        message: 'Failed to save project',
        variant: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--bg)] transition-colors duration-300 py-8">
      <UniversalForm
        fields={fields}
        values={form}
        onChange={handleFormChange}
        onSubmit={handleSubmit}
        errors={errors}
        renderBeforeFields={
          <BannerInput
            bannerPreview={bannerPreview}
            bannerLoading={bannerLoading}
            showBannerUrlInput={showBannerUrlInput}
            formBanner={form.banner}
            onBannerUpload={handleBannerUpload}
            onBannerUrlChange={handleBannerUrlChange}
            onRemoveBanner={() => setForm((f) => ({ ...f, banner: '' }))}
            onToggleBannerUrlInput={() => setShowBannerUrlInput((v) => !v)}
            setFileInputRef={ref => { fileInputRef.current = ref.current; }}
          />
        }
      >
        {/* Custom stack input */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-sm text-gray-700 dark:text-gray-200">Stack</label>
          <ChipInput
            value={form.stack}
            onChange={stack => setForm(f => ({ ...f, stack }))}
            placeholder="Add a tech and press Enter"
            className="mb-4"
          />
        </div>

        <div className="flex gap-2 mt-6">
          <Button type="submit" disabled={submitting} className="px-4 py-2 rounded-full text-sm flex items-center gap-2 min-w-[130px] justify-center">
            {submitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : isEdit ? (
              <>
                <Pencil size={18} /> Update Project
              </>
            ) : (
              <>
                <PlusCircle size={18} /> Create Project
              </>
            )}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate(-1)} className="px-4 py-2 rounded-full text-sm min-w-[100px]">
            <X size={16} className="mr-1" /> Cancel
          </Button>
        </div>
      </UniversalForm>

      {/* Result Dialog */}
      {showResultDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-[var(--card-bg)] rounded-xl shadow-xl p-8 flex flex-col items-center gap-4 min-w-[380px] max-w-md w-full relative">
            {/* Close button at the top right */}
            <button
              onClick={() => setShowResultDialog(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 dark:bg-[var(--input-bg)] shadow-md border border-gray-200 dark:border-gray-700 hover:bg-red-100 dark:hover:bg-red-900 text-gray-500 hover:text-red-700 dark:text-gray-300 dark:hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors duration-150"
              aria-label="Close dialog"
              type="button"
            >
              <X size={18} />
            </button>
            {resultSuccess ? (
              <>
                <CheckCircle2 className="text-green-500 w-12 h-12" />
                <div className="text-lg font-semibold">Success!</div>
                <div className="text-sm text-center">Project {isEdit ? 'updated' : 'created'} successfully.</div>
                <div className="flex flex-row gap-2 w-full mt-2">
                  <Button onClick={() => navigate('/admin/projects')} className="bg-green-500 text-white hover:bg-green-600 w-full">Go to List</Button>
                  <Button onClick={() => { setShowResultDialog(false); if (!isEdit) setForm(initialState); }} className="bg-blue-500 text-white hover:bg-blue-600 w-full">{isEdit ? 'Edit Again' : 'Add Another'}</Button>
                </div>
              </>
            ) : (
              <>
                <XCircle className="text-red-500 w-12 h-12" />
                <div className="text-lg font-semibold">Failed</div>
                <div className="text-sm text-center">There was an error. Please try again.</div>
                <Button onClick={() => setShowResultDialog(false)} className="bg-gray-500 text-white hover:bg-gray-600 mt-2 w-full">Close</Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

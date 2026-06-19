import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  FileText,
  Film,
  FolderOpen,
  Image as ImageIcon,
  Link2,
  RefreshCw,
  Save,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import * as api from '../../api';

interface MediaItem {
  id: string;
  url: string;
  fileName: string;
  category: string;
  title: string;
  altText: string;
  fileSize: string;
  fileType: string;
  contentType: string;
  assetType: 'image' | 'video' | 'document';
  storagePath?: string;
  sourceType?: 'upload' | 'link';
  uploadedAt: string;
  uploadedBy: string;
  active?: boolean;
}

const CATEGORIES = [
  'hero',
  'logos',
  'venues',
  'events',
  'gallery',
  'partners',
  'downloads',
  'videos',
  'other',
];

const categoryClassMap: Record<string, string> = {
  hero: 'bg-blue-600 text-white',
  logos: 'bg-purple-600 text-white',
  venues: 'bg-green-600 text-white',
  events: 'bg-amber-500 text-white',
  gallery: 'bg-pink-600 text-white',
  partners: 'bg-indigo-600 text-white',
  downloads: 'bg-slate-700 text-white',
  videos: 'bg-rose-600 text-white',
  other: 'bg-gray-500 text-white',
};

export default function MediaLibraryTab() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [sourceMode, setSourceMode] = useState<'upload' | 'link'>('upload');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [linkAltText, setLinkAltText] = useState('');
  const [uploadCategory, setUploadCategory] = useState('other');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void loadMedia();
  }, []);

  const filteredMedia = useMemo(() => {
    return media.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !query ||
        item.fileName.toLowerCase().includes(query) ||
        item.title.toLowerCase().includes(query) ||
        item.altText.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });
  }, [media, searchQuery, selectedCategory]);

  const loadMedia = async () => {
    setLoading(true);
    try {
      setMedia(await api.fetchMediaLibrary());
    } catch (error) {
      console.error('Error loading media library:', error);
      showMessage('error', 'Failed to load media library.');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    window.setTimeout(() => setMessage(null), 3500);
  };

  const resetUploadForm = () => {
    setLinkUrl('');
    setLinkTitle('');
    setLinkAltText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    setSaving(true);
    try {
      for (const file of Array.from(files)) {
        const uploaded = await api.uploadAdminAsset(file, uploadCategory);
        await api.createMediaLibraryItem({
          ...uploaded,
          category: uploadCategory,
          title: file.name.replace(/\.[^/.]+$/, ''),
          altText: '',
          uploadedBy: localStorage.getItem('bicc_username') || 'admin',
          active: true,
        });
      }

      await loadMedia();
      resetUploadForm();
      showMessage('success', 'Media uploaded successfully.');
    } catch (error) {
      console.error('Error uploading media:', error);
      showMessage('error', 'Failed to upload one or more files.');
    } finally {
      setSaving(false);
    }
  };

  const handleLinkSave = async () => {
    if (!linkUrl.trim()) {
      showMessage('error', 'Add a media URL first.');
      return;
    }

    setSaving(true);
    try {
      const linked = api.createLinkedAdminAsset(linkUrl.trim(), linkTitle.trim() || undefined);
      await api.createMediaLibraryItem({
        ...linked,
        category: uploadCategory,
        title: linkTitle.trim() || linked.fileName,
        altText: linkAltText.trim(),
        uploadedBy: localStorage.getItem('bicc_username') || 'admin',
        active: true,
      });
      await loadMedia();
      resetUploadForm();
      showMessage('success', 'Linked media saved successfully.');
    } catch (error) {
      console.error('Error saving linked media:', error);
      showMessage('error', 'Failed to save linked media.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Delete "${item.fileName}" from the media library?`)) return;

    try {
      await api.deleteStoredAsset(item.storagePath);
      await api.deleteMediaLibraryItem(item.id);
      if (selectedItem?.id === item.id) setSelectedItem(null);
      await loadMedia();
      showMessage('success', 'Media deleted successfully.');
    } catch (error) {
      console.error('Error deleting media:', error);
      showMessage('error', 'Failed to delete media.');
    }
  };

  const handleUpdateMetadata = async (item: MediaItem, updates: Partial<MediaItem>) => {
    try {
      await api.updateMediaLibraryItem(item.id, updates);
      await loadMedia();
      setSelectedItem((current) => (current?.id === item.id ? { ...current, ...updates } as MediaItem : current));
      showMessage('success', 'Media details saved.');
    } catch (error) {
      console.error('Error updating media metadata:', error);
      showMessage('error', 'Failed to save media details.');
    }
  };

  const renderPreview = (item: MediaItem, large = false) => {
    const commonClass = large
      ? 'w-full h-full object-cover'
      : 'w-full h-full object-cover';

    if (item.assetType === 'image') {
      return <img src={item.url} alt={item.altText || item.title} className={commonClass} />;
    }

    if (item.assetType === 'video') {
      return (
        <video src={item.url} className={commonClass} controls={large} muted={!large}>
          <track kind="captions" />
        </video>
      );
    }

    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-600 gap-2">
        <FileText size={large ? 52 : 36} />
        <span className="text-xs font-semibold">{item.fileType}</span>
      </div>
    );
  };

  const renderAssetIcon = (item: MediaItem) => {
    if (item.assetType === 'image') return <ImageIcon size={18} className="text-blue-600" />;
    if (item.assetType === 'video') return <Film size={18} className="text-rose-600" />;
    return <FileText size={18} className="text-slate-600" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1F85A8] mb-2">Media Library</h2>
          <p className="text-sm text-gray-500">
            Manage images, videos, and downloadable media. You can add content from your device or save a direct link.
          </p>
        </div>
        <button
          onClick={() => void loadMedia()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {message && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl ${
          message.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSourceMode('upload')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold ${sourceMode === 'upload' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Device Upload
          </button>
          <button
            onClick={() => setSourceMode('link')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold ${sourceMode === 'link' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Save by Link
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">CATEGORY</label>
            <select
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600"
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {sourceMode === 'link' && (
            <>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-2">MEDIA URL</label>
                <input
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com/file.jpg"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">TITLE</label>
                <input
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  placeholder="Homepage hero"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </>
          )}
        </div>

        {sourceMode === 'link' ? (
          <div className="grid lg:grid-cols-[1fr_auto] gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2">ALT TEXT</label>
              <input
                value={linkAltText}
                onChange={(e) => setLinkAltText(e.target.value)}
                placeholder="Describe the image or video"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <button
              onClick={handleLinkSave}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              <Link2 size={16} />
              {saving ? 'Saving...' : 'Save Link'}
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              <Upload size={16} />
              {saving ? 'Uploading...' : 'Choose Files'}
            </button>
            <p className="text-sm text-gray-500">
              Images, videos, PDF, Word, Excel, ZIP and similar files are supported.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {['all', ...CATEGORIES].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-2 rounded-xl text-sm font-medium ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search media..."
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {filteredMedia.length === 0 ? (
          <div className="text-center py-16">
            <FolderOpen className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-400">No media items match the current filters.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMedia.map((item) => (
              <div key={item.id} className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                <div className="relative aspect-[4/3] bg-white">
                  {renderPreview(item)}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-[11px] font-semibold ${categoryClassMap[item.category] || categoryClassMap.other}`}>
                      {item.category}
                    </span>
                    {!item.active && (
                      <span className="px-2 py-1 rounded-full text-[11px] font-semibold bg-gray-200 text-gray-700">
                        Off
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-[#1F85A8] text-sm truncate">{item.title || item.fileName}</p>
                      <p className="text-xs text-gray-500 truncate">{item.fileName}</p>
                    </div>
                    <div className="shrink-0">{renderAssetIcon(item)}</div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {item.fileType} • {item.fileSize} • {item.sourceType === 'link' ? 'Link' : 'Firebase upload'}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-semibold hover:bg-blue-100"
                    >
                      <Eye size={14} />
                      View
                    </button>
                    <button
                      onClick={() => void handleDelete(item)}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-xl text-xs font-semibold hover:bg-red-100"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/70 p-4 flex items-center justify-center" onClick={() => setSelectedItem(null)}>
          <div
            className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#1F85A8]">Media Details</h3>
              <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-gray-100 rounded-xl">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 grid lg:grid-cols-[1.2fr_1fr] gap-6">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white aspect-video">
                  {renderPreview(selectedItem, true)}
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <label className="block text-xs font-semibold text-gray-500 mb-2">DIRECT URL</label>
                  <div className="flex gap-2">
                    <input
                      readOnly
                      value={selectedItem.url}
                      className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm"
                    />
                    <button
                      onClick={() => {
                        void navigator.clipboard.writeText(selectedItem.url);
                        showMessage('success', 'Media URL copied.');
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <EditableField
                  label="Title"
                  value={selectedItem.title || ''}
                  onSave={(value) => handleUpdateMetadata(selectedItem, { title: value })}
                />
                <EditableField
                  label="Alt text"
                  value={selectedItem.altText || ''}
                  onSave={(value) => handleUpdateMetadata(selectedItem, { altText: value })}
                />
                <EditableSelect
                  label="Category"
                  value={selectedItem.category}
                  options={CATEGORIES}
                  onSave={(value) => handleUpdateMetadata(selectedItem, { category: value })}
                />
                <EditableSelect
                  label="Visibility"
                  value={selectedItem.active === false ? 'off' : 'on'}
                  options={['on', 'off']}
                  onSave={(value) => handleUpdateMetadata(selectedItem, { active: value === 'on' })}
                />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <InfoCard label="File name" value={selectedItem.fileName} />
                  <InfoCard label="File type" value={selectedItem.fileType} />
                  <InfoCard label="File size" value={selectedItem.fileSize} />
                  <InfoCard label="Source" value={selectedItem.sourceType === 'link' ? 'Link' : 'Firebase upload'} />
                  <InfoCard label="Uploaded by" value={selectedItem.uploadedBy} />
                  <InfoCard label="Uploaded" value={new Date(selectedItem.uploadedAt).toLocaleString()} />
                </div>

                <button
                  onClick={() => void handleDelete(selectedItem)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-700 rounded-2xl font-semibold hover:bg-red-100"
                >
                  <Trash2 size={16} />
                  Delete Media
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EditableField({
  label,
  value,
  onSave,
}: {
  label: string;
  value: string;
  onSave: (value: string) => Promise<void>;
}) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  return (
    <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
      <label className="block text-xs font-semibold text-gray-500">{label.toUpperCase()}</label>
      <input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600"
      />
      <button
        onClick={() => void onSave(draft)}
        className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700"
      >
        <Save size={14} />
        Save
      </button>
    </div>
  );
}

function EditableSelect({
  label,
  value,
  options,
  onSave,
}: {
  label: string;
  value: string;
  options: string[];
  onSave: (value: string) => Promise<void>;
}) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  return (
    <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
      <label className="block text-xs font-semibold text-gray-500">{label.toUpperCase()}</label>
      <select
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <button
        onClick={() => void onSave(draft)}
        className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700"
      >
        <Save size={14} />
        Save
      </button>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-4">
      <p className="text-xs font-semibold text-gray-500 mb-1 uppercase">{label}</p>
      <p className="text-sm text-gray-700 break-words">{value || '—'}</p>
    </div>
  );
}

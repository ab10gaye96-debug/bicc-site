import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, FileText } from 'lucide-react';
import * as api from '../../api';

const CATEGORIES = [
  'Corporate Profile',
  'Brochure',
  'Venue Guide',
  'Floor Plans',
  'Technical Specs',
  'Event Packages',
  'Media Kit',
  'Annual Reports',
  'Policies & Procedures',
];

const emptyForm = {
  title: '',
  category: 'Corporate Profile',
  description: '',
  fileUrl: '',
  fileSize: '',
  fileType: 'PDF',
};

export default function DownloadsTab() {
  const [downloads, setDownloads] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  useEffect(() => {
    api.fetchDownloads().then(setDownloads).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = { ...form, uploadedAt: new Date().toISOString() };
      if (editingItem) {
        await api.updateDownload(editingItem.id, data);
      } else {
        await api.createDownload(data);
      }
      setDownloads(await api.fetchDownloads());
      handleCancel();
    } catch {
      alert('Error saving document');
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setForm({
      title: item.title || '',
      category: item.category || 'Corporate Profile',
      description: item.description || '',
      fileUrl: item.fileUrl || '',
      fileSize: item.fileSize || '',
      fileType: item.fileType || 'PDF',
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
    setForm({ ...emptyForm });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this document?')) {
      await api.deleteDownload(id);
      setDownloads(await api.fetchDownloads());
    }
  };

  const inputClass = 'w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600';
  const labelClass = 'block text-sm font-medium text-[#1F85A8] mb-1';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#1F85A8]">Manage Downloads</h2>
        {api.canEdit() && (
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700">
            <Plus size={16} /> Add Document
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 mb-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Title *</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g., BICC Corporate Profile" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Category *</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
                {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>File URL *</label>
            <input required value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} placeholder="https://.../document.pdf" className={inputClass} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>File Type</label>
              <select value={form.fileType} onChange={(e) => setForm({ ...form, fileType: e.target.value })} className={inputClass}>
                {['PDF', 'Word', 'Excel', 'ZIP', 'Image'].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>File Size</label>
              <input value={form.fileSize} onChange={(e) => setForm({ ...form, fileSize: e.target.value })} placeholder="e.g., 2.4 MB" className={inputClass} />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">{editingItem ? 'Update' : 'Add'} Document</button>
            <button type="button" onClick={handleCancel} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {downloads.length === 0 ? (
          <div className="text-center py-10 text-gray-400">No documents yet. Click "Add Document" to create one.</div>
        ) : (
          downloads.map((item) => (
            <div key={item.id} className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <FileText className="text-blue-600" size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-[#1F85A8] text-sm truncate">{item.title}</h3>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">{item.category}</span>
                  <span className="text-xs text-gray-400">{item.fileType}{item.fileSize ? ` · ${item.fileSize}` : ''}</span>
                </div>
                {item.description && <p className="text-xs text-gray-600 truncate">{item.description}</p>}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {api.canEdit() && <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit"><Edit size={16} /></button>}
                {api.canDelete() && <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 size={16} /></button>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

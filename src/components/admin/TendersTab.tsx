import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, FileSpreadsheet } from 'lucide-react';
import * as api from '../../api';

const CATEGORIES = ['Goods', 'Services', 'Works', 'Consulting'];

const emptyForm = {
  title: '',
  reference: '',
  category: 'Goods',
  description: '',
  publishedDate: '',
  closingDate: '',
  estimatedValue: '',
  status: 'Open',
  documentName: '',
  documentUrl: '',
};

export default function TendersTab() {
  const [tenders, setTenders] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  useEffect(() => {
    api.fetchTenders().then(setTenders).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { documentName, documentUrl, ...rest } = form;
    const data: any = { ...rest };
    if (documentUrl) {
      data.documents = [{ name: documentName || 'Tender Document', url: documentUrl, size: '' }];
    }
    try {
      if (editingItem) {
        await api.updateTender(editingItem.id, data);
      } else {
        await api.createTender(data);
      }
      setTenders(await api.fetchTenders());
      handleCancel();
    } catch {
      alert('Error saving tender');
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setForm({
      title: item.title || '',
      reference: item.reference || '',
      category: item.category || 'Goods',
      description: item.description || '',
      publishedDate: item.publishedDate || '',
      closingDate: item.closingDate || '',
      estimatedValue: item.estimatedValue || '',
      status: item.status || 'Open',
      documentName: item.documents?.[0]?.name || '',
      documentUrl: item.documents?.[0]?.url || '',
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
    setForm({ ...emptyForm });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this tender?')) {
      await api.deleteTender(id);
      setTenders(await api.fetchTenders());
    }
  };

  const inputClass = 'w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600';
  const labelClass = 'block text-sm font-medium text-[#1F85A8] mb-1';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#1F85A8]">Manage Tenders</h2>
        {api.canEdit() && (
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700">
            <Plus size={16} /> Add Tender
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 mb-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Title *</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Reference *</label>
              <input required value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} placeholder="BICC/PROC/2026/001" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
                <option>Open</option><option>Closed</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Published Date</label>
              <input type="date" value={form.publishedDate} onChange={(e) => setForm({ ...form, publishedDate: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Closing Date</label>
              <input type="date" value={form.closingDate} onChange={(e) => setForm({ ...form, closingDate: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Estimated Value</label>
            <input value={form.estimatedValue} onChange={(e) => setForm({ ...form, estimatedValue: e.target.value })} placeholder="GMD 2,500,000" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className={inputClass} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Document Name</label>
              <input value={form.documentName} onChange={(e) => setForm({ ...form, documentName: e.target.value })} placeholder="Tender Notice" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Document URL</label>
              <input value={form.documentUrl} onChange={(e) => setForm({ ...form, documentUrl: e.target.value })} placeholder="https://.../notice.pdf" className={inputClass} />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">{editingItem ? 'Update' : 'Add'} Tender</button>
            <button type="button" onClick={handleCancel} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {tenders.length === 0 ? (
          <div className="text-center py-10 text-gray-400">No tenders yet. Click "Add Tender" to create one.</div>
        ) : (
          tenders.map((item) => (
            <div key={item.id} className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <FileSpreadsheet className="text-blue-600" size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-[#1F85A8] text-sm truncate">{item.title}</h3>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${item.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{item.status}</span>
                </div>
                <p className="text-xs text-gray-500 font-mono">{item.reference} · {item.category}{item.closingDate ? ` · closes ${item.closingDate}` : ''}</p>
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

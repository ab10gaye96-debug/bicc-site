import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, DollarSign } from 'lucide-react';
import * as api from '../../api';

const TYPES = ['Venue', 'Service', 'Catering', 'Equipment'];

const emptyForm = {
  name: '',
  type: 'Venue',
  unitPrice: '',
  unit: 'per day',
  currency: 'GMD',
};

export default function PricingTab() {
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  useEffect(() => {
    api.fetchPricing().then(setItems).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, unitPrice: Number(form.unitPrice) || 0 };
    try {
      if (editingItem) {
        await api.updatePricing(editingItem.id, data);
      } else {
        await api.createPricing(data);
      }
      setItems(await api.fetchPricing());
      handleCancel();
    } catch {
      alert('Error saving pricing item');
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setForm({
      name: item.name || '',
      type: item.type || 'Venue',
      unitPrice: String(item.unitPrice ?? ''),
      unit: item.unit || 'per day',
      currency: item.currency || 'GMD',
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
    setForm({ ...emptyForm });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this pricing item?')) {
      await api.deletePricing(id);
      setItems(await api.fetchPricing());
    }
  };

  const inputClass = 'w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600';
  const labelClass = 'block text-sm font-medium text-[#1F85A8] mb-1';

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-[#1F85A8]">Pricing</h2>
        {api.canEdit() && (
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700">
            <Plus size={16} /> Add Price
          </button>
        )}
      </div>
      <p className="text-sm text-gray-500 mb-6">Define venue and service prices used to generate quotations.</p>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 mb-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Item Name *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., Plenary Hall" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputClass}>
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Unit Price *</label>
              <input required type="number" min="0" step="0.01" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Unit</label>
              <input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="per day / per person" className={inputClass} />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">{editingItem ? 'Update' : 'Add'} Price</button>
            <button type="button" onClick={handleCancel} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {items.length === 0 ? (
          <div className="text-center py-10 text-gray-400">No pricing defined yet. Add venue and service prices.</div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                <DollarSign className="text-green-600" size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-[#1F85A8] text-sm truncate">{item.name}</h3>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">{item.type}</span>
                </div>
                <p className="text-xs text-gray-500">{item.currency || 'GMD'} {Number(item.unitPrice).toLocaleString()} {item.unit}</p>
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

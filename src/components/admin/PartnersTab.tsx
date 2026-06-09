import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Building2 } from 'lucide-react';
import * as api from '../../api';

export default function PartnersTab() {
  const [partners, setPartners] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [form, setForm] = useState({
    name: '',
    logo: '',
    category: 'Corporate Partners',
    website: '',
    active: true,
  });

  const categories = [
    'International Organizations',
    'Government',
    'Hospitality Partners',
    'Corporate Partners',
    'Media Partners',
    'Other',
  ];

  useEffect(() => {
    api.fetchPartners().then(setPartners).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.updatePartner(editingItem.id, form);
        alert('✅ Partner updated successfully!');
      } else {
        await api.createPartner(form);
        alert('✅ Partner added successfully!');
      }
      setPartners(await api.fetchPartners());
      handleCancel();
    } catch (error) {
      alert('Error saving partner');
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setForm({
      name: item.name || '',
      logo: item.logo || '',
      category: item.category || 'Corporate Partners',
      website: item.website || '',
      active: item.active !== false,
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
    setForm({
      name: '',
      logo: '',
      category: 'Corporate Partners',
      website: '',
      active: true,
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this partner?')) {
      await api.deletePartner(id);
      setPartners(await api.fetchPartners());
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#1F85A8]">Manage Partners</h2>
        {api.canEdit() && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700"
          >
            <Plus size={16} /> Add Partner
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 mb-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>{editingItem ? 'Edit' : 'Add'} Partner:</strong> Strategic partner logos appear on the homepage.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1F85A8] mb-1">Partner Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., African Union"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1F85A8] mb-1">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1F85A8] mb-1">Logo URL *</label>
            <input
              required
              value={form.logo}
              onChange={(e) => setForm({ ...form, logo: e.target.value })}
              placeholder="https://example.com/logo.png"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 Tip: Use a transparent PNG logo for best results
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1F85A8] mb-1">Website (optional)</label>
            <input
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              placeholder="https://partner-website.com"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-[#1F85A8]">Display on homepage</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">
              {editingItem ? 'Update' : 'Add'} Partner
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {partners.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-400">
            No partners yet. Click "Add Partner" to create one.
          </div>
        ) : (
          partners.map((item) => (
            <div key={item.id} className="bg-gray-50 rounded-xl p-4 flex flex-col items-center">
              <div className="w-full h-24 flex items-center justify-center mb-3 bg-white rounded-lg">
                {item.logo ? (
                  <img src={item.logo} alt={item.name} className="max-w-full max-h-20 object-contain" />
                ) : (
                  <Building2 className="text-gray-300" size={40} />
                )}
              </div>
              <div className="text-center mb-3 w-full">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <h3 className="font-semibold text-[#1F85A8] text-sm">{item.name}</h3>
                  {!item.active && (
                    <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-full">Hidden</span>
                  )}
                </div>
                <p className="text-xs text-gray-600">{item.category}</p>
              </div>
              <div className="flex items-center gap-2">
                {api.canEdit() && (
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                )}
                {api.canDelete() && (
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Hotel } from 'lucide-react';
import * as api from '../../api';
import { MediaField } from './MediaField';

const CATEGORIES = ['5-Star', '4-Star', '3-Star', 'Boutique', 'Other'];

const emptyForm = {
  name: '',
  category: '4-Star',
  description: '',
  location: '',
  rooms: '',
  image: '',
  phone: '',
  email: '',
  website: '',
  amenities: '',
  distanceToVenue: '',
  order: 0,
  active: true,
};

export default function HotelsTab() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    api.fetchHotels().then(setHotels).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      rooms: parseInt(form.rooms) || 0,
      amenities: form.amenities.split(',').map((a) => a.trim()).filter(Boolean),
    };
    try {
      if (editingItem) {
        await api.updateHotel(editingItem.id, payload);
        alert('Hotel updated successfully!');
      } else {
        await api.createHotel(payload);
        alert('Hotel added successfully!');
      }
      setHotels(await api.fetchHotels());
      handleCancel();
    } catch {
      alert('Error saving hotel. Please try again.');
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setForm({
      name: item.name || '',
      category: item.category || '4-Star',
      description: item.description || '',
      location: item.location || '',
      rooms: String(item.rooms || ''),
      image: item.image || '',
      phone: item.phone || '',
      email: item.email || '',
      website: item.website || '',
      amenities: Array.isArray(item.amenities) ? item.amenities.join(', ') : '',
      distanceToVenue: item.distanceToVenue || '',
      order: item.order ?? 0,
      active: item.active !== false,
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
    setForm(emptyForm);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this hotel listing?')) {
      await api.deleteHotel(id);
      setHotels(await api.fetchHotels());
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#1F85A8]">Manage Hotels</h2>
          <p className="text-sm text-gray-500 mt-1">Partner hotels shown on the Destination → Hotels page.</p>
        </div>
        {api.canEdit() && (
          <button
            onClick={() => { setEditingItem(null); setForm(emptyForm); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700"
          >
            <Plus size={16} /> Add Hotel
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 mb-6 space-y-4 border border-gray-200">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1F85A8] mb-1">Hotel Name *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1F85A8] mb-1">Category *</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600">
                {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <TextArea label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} placeholder="e.g., Bijilo" />
            <Field label="Number of Rooms" value={form.rooms} onChange={(v) => setForm({ ...form, rooms: v })} placeholder="180" />
            <Field label="Distance to BICC" value={form.distanceToVenue} onChange={(v) => setForm({ ...form, distanceToVenue: v })} placeholder="2 km" />
          </div>

          <MediaField label="Hotel Photo" value={form.image} onChange={(url) => setForm({ ...form, image: url })}
            accept="image" uploadFolder="hotels" helpText="Main photo for the hotel card." />

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
            <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          </div>
          <Field label="Website" value={form.website} onChange={(v) => setForm({ ...form, website: v })} placeholder="www.example.com" />
          <Field label="Amenities (comma-separated)" value={form.amenities} onChange={(v) => setForm({ ...form, amenities: v })}
            placeholder="Wi-Fi, Pool, Spa, Restaurant" />

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Display Order" value={String(form.order)} onChange={(v) => setForm({ ...form, order: parseInt(v) || 0 })} />
            <label className="flex items-center gap-2 cursor-pointer self-end pb-2">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4" />
              <span className="text-sm font-medium text-[#1F85A8]">Show on website</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">
              {editingItem ? 'Update' : 'Add'} Hotel
            </button>
            <button type="button" onClick={handleCancel} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {hotels.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            No hotels yet. Add partner hotels or they will show from the built-in fallback list on the website.
          </div>
        ) : (
          hotels.map((item) => (
            <div key={item.id} className="bg-gray-50 rounded-xl p-4 flex gap-4">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover shrink-0" />
              ) : (
                <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center shrink-0">
                  <Hotel size={24} className="text-gray-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-[#1F85A8] text-sm">{item.name}</h3>
                    <p className="text-xs text-gray-600">{item.category} • {item.location}</p>
                    {!item.active && <span className="text-xs text-gray-400">Hidden</span>}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {api.canEdit() && (
                      <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
                    )}
                    {api.canDelete() && (
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#1F85A8] mb-1">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600" />
    </div>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#1F85A8] mb-1">{label}</label>
      <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600 resize-none" />
    </div>
  );
}

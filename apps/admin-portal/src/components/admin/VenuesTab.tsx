import { useEffect, useState } from 'react';
import { Edit, Plus, Trash2, Table } from 'lucide-react';
import * as api from '../../api';
import { MediaListField } from './MediaField';

const emptyForm = {
  name: '',
  capacity: '',
  description: '',
  features: '',
  images: [] as string[],
  videos: [] as string[],
};

const emptyCapacityRow = { space: '', capacity: '' };

export default function VenuesTab() {
  const [venues, setVenues] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingVenue, setEditingVenue] = useState<any | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // Venue Capacity Overview state
  const [capacityTable, setCapacityTable] = useState<any[]>([]);
  const [showCapacityForm, setShowCapacityForm] = useState(false);
  const [editingCapacityIndex, setEditingCapacityIndex] = useState<number | null>(null);
  const [capacityForm, setCapacityForm] = useState(emptyCapacityRow);
  const [savingCapacity, setSavingCapacity] = useState(false);

  useEffect(() => {
    void loadVenues();
    void loadCapacityTable();
  }, []);

  const loadVenues = async () => {
    try {
      setVenues(await api.fetchVenues());
    } catch {
      setVenues([]);
    }
  };

  const loadCapacityTable = async () => {
    try {
      setCapacityTable(await api.fetchVenueCapacity());
    } catch {
      setCapacityTable([]);
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingVenue(null);
    setShowForm(false);
  };

  const handleEdit = (venue: any) => {
    setEditingVenue(venue);
    setForm({
      name: venue.name || '',
      capacity: venue.capacity || '',
      description: venue.description || '',
      features: Array.isArray(venue.features) ? venue.features.join(', ') : '',
      images: Array.isArray(venue.images) && venue.images.length > 0
        ? venue.images
        : venue.image
          ? [venue.image]
          : [],
      videos: Array.isArray(venue.videos) ? venue.videos : [],
    });
    setShowForm(true);
  };

  const buildPayload = () => {
    const featuresArray = form.features
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);

    const images = form.images.filter(Boolean);
    const videos = form.videos.filter(Boolean);

    return {
      name: form.name,
      capacity: form.capacity,
      description: form.description,
      features: featuresArray,
      images,
      videos,
      image: images[0] || '/images/conference-hall.jpg',
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = buildPayload();
      if (editingVenue) {
        await api.updateVenue(editingVenue.id, payload);
      } else {
        await api.createVenue(payload);
      }
      await loadVenues();
      resetForm();
    } catch (err) {
      console.error(err);
      alert('Failed to save venue. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this venue?')) return;
    await api.deleteVenue(id);
    await loadVenues();
  };

  // Capacity Table handlers
  const handleAddCapacityRow = () => {
    setCapacityForm(emptyCapacityRow);
    setEditingCapacityIndex(null);
    setShowCapacityForm(true);
  };

  const handleEditCapacityRow = (index: number) => {
    setCapacityForm({ ...capacityTable[index] });
    setEditingCapacityIndex(index);
    setShowCapacityForm(true);
  };

  const handleDeleteCapacityRow = async (index: number) => {
    if (!confirm('Remove this capacity row?')) return;
    const updated = capacityTable.filter((_, i) => i !== index);
    setCapacityTable(updated);
    try {
      await api.updateVenueCapacity(updated);
      alert('Capacity table updated successfully!');
    } catch {
      alert('Failed to update capacity table. Please try again.');
    }
  };

  const handleCapacitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCapacity(true);
    try {
      let updated;
      if (editingCapacityIndex !== null) {
        updated = capacityTable.map((row, i) =>
          i === editingCapacityIndex ? capacityForm : row
        );
      } else {
        updated = [...capacityTable, capacityForm];
      }
      setCapacityTable(updated);
      await api.updateVenueCapacity(updated);
      setShowCapacityForm(false);
      setCapacityForm(emptyCapacityRow);
      setEditingCapacityIndex(null);
      alert('Capacity table updated successfully!');
    } catch {
      alert('Failed to update capacity table. Please try again.');
    } finally {
      setSavingCapacity(false);
    }
  };

  const handleCapacityCancel = () => {
    setShowCapacityForm(false);
    setCapacityForm(emptyCapacityRow);
    setEditingCapacityIndex(null);
  };

  return (
    <div className="space-y-8">
      {/* Venue Management */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#1F85A8]">Manage Venues</h2>
            <p className="text-xs text-gray-500 mt-1">Add venues with photos and videos shown on the public Venues page.</p>
          </div>
          {api.canEdit() && (
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700"
            >
              <Plus size={16} />
              Add Venue
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-6 space-y-4 border border-gray-200">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>{editingVenue ? 'Edit venue' : 'New venue'}:</strong> Upload images and optional videos. The first image is the cover photo on the website.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1F85A8] mb-1">Venue name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Plenary Hall"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1F85A8] mb-1">Capacity</label>
                <input
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                  placeholder="e.g. 1,013 seats"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F85A8] mb-1">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the venue…"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F85A8] mb-1">Features</label>
              <input
                value={form.features}
                onChange={(e) => setForm({ ...form, features: e.target.value })}
                placeholder="Wi-Fi, Projector, Sound System (comma separated)"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <MediaListField
              label="Venue photos & videos"
              images={form.images}
              videos={form.videos}
              onImagesChange={(images) => setForm({ ...form, images })}
              onVideosChange={(videos) => setForm({ ...form, videos })}
              uploadFolder="venues"
            />

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving…' : editingVenue ? 'Update Venue' : 'Save Venue'}
              </button>
              <button type="button" onClick={resetForm} className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {venues.length === 0 ? (
            <div className="text-center py-10 text-gray-400">No venues yet. Click &quot;Add Venue&quot; to create one.</div>
          ) : (
            venues.map((venue) => {
              const thumb =
                (Array.isArray(venue.images) && venue.images[0]) ||
                venue.image ||
                '/images/conference-hall.jpg';
              const imageCount = Array.isArray(venue.images) ? venue.images.length : venue.image ? 1 : 0;
              const videoCount = Array.isArray(venue.videos) ? venue.videos.length : 0;

              return (
                <div key={venue.id} className="flex items-center gap-4 bg-gray-50 rounded-xl p-4">
                  <img src={thumb} alt="" className="w-20 h-16 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#1F85A8] text-sm">{venue.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{venue.capacity}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {imageCount} photo{imageCount !== 1 ? 's' : ''}
                      {videoCount > 0 ? ` · ${videoCount} video${videoCount !== 1 ? 's' : ''}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {api.canEdit() && (
                      <button
                        onClick={() => handleEdit(venue)}
                        className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit venue"
                      >
                        <Edit size={16} />
                      </button>
                    )}
                    {api.canDelete() && (
                      <button
                        onClick={() => void handleDelete(venue.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete venue"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Venue Capacity Overview */}
      <div className="border-t border-gray-200 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#1F85A8] flex items-center gap-2">
              <Table size={20} />
              Venue Capacity Overview
            </h2>
            <p className="text-xs text-gray-500 mt-1">Manage the capacity table shown on the public Venues page.</p>
          </div>
          {api.canEdit() && (
            <button
              onClick={handleAddCapacityRow}
              className="flex items-center gap-2 px-4 py-2 bg-[#1F85A8] text-white rounded-xl text-sm font-bold hover:bg-[#1a6d8a]"
            >
              <Plus size={16} />
              Add Capacity Row
            </button>
          )}
        </div>

        {showCapacityForm && (
          <form onSubmit={handleCapacitySubmit} className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-6 space-y-4 border border-gray-200">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>{editingCapacityIndex !== null ? 'Edit' : 'Add'} capacity row:</strong> This will appear in the Venue Capacity Overview table on the public site.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1F85A8] mb-1">Event Space *</label>
                <input
                  required
                  value={capacityForm.space}
                  onChange={(e) => setCapacityForm({ ...capacityForm, space: e.target.value })}
                  placeholder="e.g. Plenary Hall"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1F85A8] mb-1">Capacity *</label>
                <input
                  required
                  value={capacityForm.capacity}
                  onChange={(e) => setCapacityForm({ ...capacityForm, capacity: e.target.value })}
                  placeholder="e.g. 1,013 seats"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={savingCapacity}
                className="px-6 py-2.5 bg-[#1F85A8] text-white rounded-lg text-sm font-bold hover:bg-[#1a6d8a] disabled:opacity-50"
              >
                {savingCapacity ? 'Saving…' : editingCapacityIndex !== null ? 'Update Row' : 'Add Row'}
              </button>
              <button type="button" onClick={handleCapacityCancel} className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[320px]">
              <thead className="bg-[#1F85A8] text-white">
                <tr>
                  <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold">Event Space</th>
                  <th className="px-4 sm:px-6 py-4 text-right text-sm font-semibold">Capacity</th>
                  <th className="px-4 sm:px-6 py-4 text-right text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {capacityTable.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 sm:px-6 py-8 text-center text-gray-400">
                      No capacity rows yet. Click "Add Capacity Row" to get started.
                    </td>
                  </tr>
                ) : (
                  capacityTable.map((row, i) => (
                    <tr key={i} className="hover:bg-blue-50 transition-colors">
                      <td className="px-4 sm:px-6 py-4 text-sm font-medium text-[#1F85A8]">{row.space}</td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-right text-gray-600">{row.capacity}</td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {api.canEdit() && (
                            <button
                              onClick={() => handleEditCapacityRow(i)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Edit row"
                            >
                              <Edit size={16} />
                            </button>
                          )}
                          {api.canDelete() && (
                            <button
                              onClick={() => void handleDeleteCapacityRow(i)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                              title="Delete row"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

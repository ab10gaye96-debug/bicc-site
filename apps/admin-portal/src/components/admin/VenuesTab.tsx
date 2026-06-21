import { useEffect, useState } from 'react';
import { Edit, Plus, Trash2 } from 'lucide-react';
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

export default function VenuesTab() {
  const [venues, setVenues] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingVenue, setEditingVenue] = useState<any | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void loadVenues();
  }, []);

  const loadVenues = async () => {
    try {
      setVenues(await api.fetchVenues());
    } catch {
      setVenues([]);
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

  return (
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
  );
}

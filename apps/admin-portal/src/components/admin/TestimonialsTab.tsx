import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Star } from 'lucide-react';
import * as api from '../../api';

export default function TestimonialsTab() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [form, setForm] = useState({
    name: '',
    position: '',
    organization: '',
    content: '',
    rating: 5,
    image: '',
    published: true,
  });

  useEffect(() => {
    api.fetchTestimonials().then(setTestimonials).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.updateTestimonial(editingItem.id, form);
        alert('✅ Testimonial updated successfully!');
      } else {
        await api.createTestimonial(form);
        alert('✅ Testimonial added successfully!');
      }
      setTestimonials(await api.fetchTestimonials());
      handleCancel();
    } catch (error) {
      alert('Error saving testimonial');
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setForm({
      name: item.name || '',
      position: item.position || '',
      organization: item.organization || '',
      content: item.content || '',
      rating: item.rating || 5,
      image: item.image || '',
      published: item.published !== false,
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
    setForm({
      name: '',
      position: '',
      organization: '',
      content: '',
      rating: 5,
      image: '',
      published: true,
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this testimonial?')) {
      await api.deleteTestimonial(id);
      setTestimonials(await api.fetchTestimonials());
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#1F85A8]">Manage Testimonials</h2>
        {api.canEdit() && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700"
          >
            <Plus size={16} /> Add Testimonial
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 mb-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>{editingItem ? 'Edit' : 'Add'} Testimonial:</strong> Client testimonials appear on the homepage.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1F85A8] mb-1">Client Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Dr. Fatou Bensouda"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1F85A8] mb-1">Position *</label>
              <input
                required
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                placeholder="e.g., Conference Organizer"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1F85A8] mb-1">Organization *</label>
              <input
                required
                value={form.organization}
                onChange={(e) => setForm({ ...form, organization: e.target.value })}
                placeholder="e.g., African Union"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1F85A8] mb-1">Rating</label>
              <select
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} Star{r !== 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1F85A8] mb-1">Testimonial Content *</label>
            <textarea
              required
              rows={4}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="The client's testimonial or review..."
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1F85A8] mb-1">Photo URL (optional)</label>
            <input
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://example.com/photo.jpg"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-[#1F85A8]">Publish on homepage</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">
              {editingItem ? 'Update' : 'Add'} Testimonial
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

      <div className="space-y-3">
        {testimonials.length === 0 ? (
          <div className="text-center py-10 text-gray-400">No testimonials yet. Click "Add Testimonial" to create one.</div>
        ) : (
          testimonials.map((item) => (
            <div key={item.id} className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-[#1F85A8] text-sm">{item.name}</h3>
                    {!item.published && (
                      <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-full">Unpublished</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600">
                    {item.position} • {item.organization}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} size={12} className="text-yellow-400 fill-current" />
                    ))}
                  </div>
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
              <p className="text-sm text-gray-700 italic">"{item.content}"</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

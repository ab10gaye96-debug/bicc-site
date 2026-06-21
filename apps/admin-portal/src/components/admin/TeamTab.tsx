import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Users, Crown } from 'lucide-react';
import * as api from '../../api';
import { MediaField } from './MediaField';

type TeamGroup = 'board' | 'team';

const GROUP_LABELS: Record<TeamGroup, string> = {
  board: 'Board of Directors',
  team: 'BICC Team',
};

const emptyForm = {
  name: '',
  title: '',
  bio: '',
  image: '',
  group: 'board' as TeamGroup,
  order: 0,
  published: true,
};

export default function TeamTab() {
  const [members, setMembers] = useState<any[]>([]);
  const [filter, setFilter] = useState<TeamGroup | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    api.fetchTeamMembers().then(setMembers).catch(() => {});
  }, []);

  const filtered = filter === 'all' ? members : members.filter((m) => m.group === filter);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.updateTeamMember(editingItem.id, form);
        alert('Team member updated successfully!');
      } else {
        await api.createTeamMember(form);
        alert('Team member added successfully!');
      }
      setMembers(await api.fetchTeamMembers());
      handleCancel();
    } catch {
      alert('Error saving team member. Please try again.');
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setForm({
      name: item.name || '',
      title: item.title || '',
      bio: item.bio || '',
      image: item.image || '',
      group: item.group || 'board',
      order: item.order ?? 0,
      published: item.published !== false,
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
    setForm(emptyForm);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Remove this person from the website? You can also unpublish instead of deleting.')) {
      await api.deleteTeamMember(id);
      setMembers(await api.fetchTeamMembers());
    }
  };

  const openAddForm = (group: TeamGroup) => {
    setForm({ ...emptyForm, group });
    setEditingItem(null);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#1F85A8]">Team & Board</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage Board of Directors and BICC Team shown on the About page.
          </p>
        </div>
        {api.canEdit() && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => openAddForm('board')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700"
            >
              <Plus size={16} /> Add Board Member
            </button>
            <button
              onClick={() => openAddForm('team')}
              className="flex items-center gap-2 px-4 py-2 bg-[#1F85A8] text-white rounded-xl text-sm font-bold hover:bg-[#1a6d8a]"
            >
              <Plus size={16} /> Add Team Member
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {(['all', 'board', 'team'] as const).map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {key === 'all' ? 'All' : GROUP_LABELS[key]}
            <span className="ml-2 opacity-70">
              ({key === 'all' ? members.length : members.filter((m) => m.group === key).length})
            </span>
          </button>
        ))}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 mb-6 space-y-4 border border-gray-200">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>{editingItem ? 'Edit' : 'Add'} {GROUP_LABELS[form.group]}:</strong>{' '}
              Photo, name, and title appear on the About page. Unpublish to hide someone who has left without deleting their record.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1F85A8] mb-1">Full Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Dr. Fatou Bensouda"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1F85A8] mb-1">Title / Position *</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g., Chairman of the Board"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1F85A8] mb-1">Section *</label>
              <select
                value={form.group}
                onChange={(e) => setForm({ ...form, group: e.target.value as TeamGroup })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="board">Board of Directors</option>
                <option value="team">BICC Team</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1F85A8] mb-1">Display Order</label>
              <input
                type="number"
                min={0}
                value={form.order}
                onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              />
              <p className="text-xs text-gray-400 mt-1">Lower numbers appear first</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1F85A8] mb-1">Short Bio (optional)</label>
            <textarea
              rows={3}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Brief background or responsibilities..."
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600 resize-none"
            />
          </div>

          <MediaField
            label="Photo"
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
            accept="image"
            uploadFolder="team"
            helpText="Upload a professional headshot. Square or portrait photos work best."
          />

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-[#1F85A8]">Show on About page</span>
            </label>
            <p className="text-xs text-gray-400 mt-1 ml-6">
              Uncheck to hide someone who has left the company — their record stays in the admin for reference.
            </p>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">
              {editingItem ? 'Update' : 'Add'} Member
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
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-400">
            No {filter === 'all' ? 'team members' : GROUP_LABELS[filter as TeamGroup].toLowerCase()} yet.
            Click "Add" above to get started.
          </div>
        ) : (
          filtered.map((item) => (
            <div key={item.id} className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
              <div className="aspect-[4/3] bg-gray-200 relative">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    {item.group === 'board' ? <Crown size={40} /> : <Users size={40} />}
                  </div>
                )}
                {!item.published && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 bg-gray-800/80 text-white text-xs rounded-full">
                    Hidden
                  </span>
                )}
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-blue-600/90 text-white text-xs rounded-full">
                  {GROUP_LABELS[item.group as TeamGroup] || item.group}
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[#1F85A8] text-sm truncate">{item.name}</h3>
                    <p className="text-xs text-gray-600 mt-0.5">{item.title}</p>
                    {item.bio && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{item.bio}</p>}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
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
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

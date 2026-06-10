import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Briefcase, FileText, Mail, Phone } from 'lucide-react';
import * as api from '../../api';

const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Graduate Programme', 'Contract'];

const emptyForm = {
  title: '',
  department: '',
  type: 'Full-time',
  location: 'Bijilo, The Gambia',
  salary: 'Competitive',
  description: '',
  requirements: '',
  responsibilities: '',
  postedDate: '',
  closingDate: '',
  status: 'Open',
};

function VacanciesView() {
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  useEffect(() => {
    api.fetchVacancies().then(setVacancies).catch(() => {});
  }, []);

  const toLines = (s: string) => s.split('\n').map((l) => l.trim()).filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...form,
      requirements: toLines(form.requirements),
      responsibilities: toLines(form.responsibilities),
    };
    try {
      if (editingItem) {
        await api.updateVacancy(editingItem.id, data);
      } else {
        await api.createVacancy(data);
      }
      setVacancies(await api.fetchVacancies());
      handleCancel();
    } catch {
      alert('Error saving vacancy');
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setForm({
      title: item.title || '',
      department: item.department || '',
      type: item.type || 'Full-time',
      location: item.location || 'Bijilo, The Gambia',
      salary: item.salary || 'Competitive',
      description: item.description || '',
      requirements: Array.isArray(item.requirements) ? item.requirements.join('\n') : (item.requirements || ''),
      responsibilities: Array.isArray(item.responsibilities) ? item.responsibilities.join('\n') : (item.responsibilities || ''),
      postedDate: item.postedDate || '',
      closingDate: item.closingDate || '',
      status: item.status || 'Open',
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
    setForm({ ...emptyForm });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this vacancy?')) {
      await api.deleteVacancy(id);
      setVacancies(await api.fetchVacancies());
    }
  };

  const inputClass = 'w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600';
  const labelClass = 'block text-sm font-medium text-[#1F85A8] mb-1';

  return (
    <div>
      <div className="flex items-center justify-end mb-4">
        {api.canEdit() && (
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700">
            <Plus size={16} /> Add Vacancy
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 mb-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Job Title *</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Department</label>
              <input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputClass}>
                {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
                <option>Open</option><option>Closed</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Salary</label>
              <input value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Posted Date</label>
              <input type="date" value={form.postedDate} onChange={(e) => setForm({ ...form, postedDate: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Closing Date</label>
              <input type="date" value={form.closingDate} onChange={(e) => setForm({ ...form, closingDate: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className={inputClass} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Requirements <span className="text-gray-400 font-normal">(one per line)</span></label>
              <textarea value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} rows={4} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Responsibilities <span className="text-gray-400 font-normal">(one per line)</span></label>
              <textarea value={form.responsibilities} onChange={(e) => setForm({ ...form, responsibilities: e.target.value })} rows={4} className={inputClass} />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">{editingItem ? 'Update' : 'Add'} Vacancy</button>
            <button type="button" onClick={handleCancel} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {vacancies.length === 0 ? (
          <div className="text-center py-10 text-gray-400">No vacancies yet. Click "Add Vacancy" to create one.</div>
        ) : (
          vacancies.map((item) => (
            <div key={item.id} className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <Briefcase className="text-blue-600" size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-[#1F85A8] text-sm truncate">{item.title}</h3>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${item.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{item.status}</span>
                </div>
                <p className="text-xs text-gray-500">{item.department}{item.department ? ' · ' : ''}{item.type}{item.closingDate ? ` · closes ${item.closingDate}` : ''}</p>
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

function ApplicationsView() {
  const [applications, setApplications] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);

  const load = () => api.fetchApplications().then(setApplications).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Delete this application?')) {
      await api.deleteApplication(id);
      await load();
      if (selected?.id === id) setSelected(null);
    }
  };

  const markReviewed = async (item: any) => {
    await api.updateApplication(item.id, { status: 'Reviewed' });
    await load();
    if (selected?.id === item.id) setSelected({ ...item, status: 'Reviewed' });
  };

  if (applications.length === 0) {
    return <div className="text-center py-10 text-gray-400">No applications received yet.</div>;
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-2 max-h-[600px] overflow-y-auto">
        {applications.map((a) => (
          <div key={a.id} onClick={() => setSelected(a)} className={`p-3 rounded-xl cursor-pointer transition-all ${selected?.id === a.id ? 'bg-blue-50 border-2 border-blue-300' : 'bg-gray-50 hover:bg-gray-100'}`}>
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-[#1F85A8] text-sm truncate">{a.firstName} {a.lastName}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${a.status === 'Reviewed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'}`}>{a.status || 'New'}</span>
            </div>
            <p className="text-xs text-gray-500 truncate">{a.jobTitle || 'General Application'}</p>
          </div>
        ))}
      </div>
      {selected ? (
        <div className="lg:col-span-2 bg-gray-50 rounded-xl p-5 overflow-y-auto max-h-[600px]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-[#1F85A8] text-lg">{selected.firstName} {selected.lastName}</h3>
              <p className="text-sm text-gray-500">Applying for: {selected.jobTitle || 'General Application'}</p>
            </div>
            <div className="flex gap-2">
              {selected.status !== 'Reviewed' && <button onClick={() => markReviewed(selected)} className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">Mark Reviewed</button>}
              {api.canDelete() && <button onClick={() => handleDelete(selected.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>}
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3 flex items-center gap-2"><Mail size={14} className="text-gray-400" /><span className="truncate">{selected.email}</span></div>
              <div className="bg-white rounded-lg p-3 flex items-center gap-2"><Phone size={14} className="text-gray-400" /><span>{selected.phone || '—'}</span></div>
            </div>
            {(selected.education || selected.institution) && (
              <div className="bg-white rounded-lg p-3"><p className="text-xs text-gray-400 mb-0.5">Education</p><p>{selected.education} {selected.institution ? `· ${selected.institution}` : ''} {selected.graduationYear ? `(${selected.graduationYear})` : ''}</p></div>
            )}
            {selected.experience && <div className="bg-white rounded-lg p-3"><p className="text-xs text-gray-400 mb-0.5">Experience</p><p className="whitespace-pre-line">{selected.experience}</p></div>}
            {selected.coverLetter && <div className="bg-white rounded-lg p-3"><p className="text-xs text-gray-400 mb-0.5">Cover Letter</p><p className="whitespace-pre-line">{selected.coverLetter}</p></div>}
            {selected.resumeUrl && <a href={selected.resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"><FileText size={14} /> View Resume</a>}
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex items-center justify-center bg-gray-50 rounded-xl p-10"><p className="text-gray-400 text-sm">Select an application to view details</p></div>
      )}
    </div>
  );
}

export default function CareersTab() {
  const [view, setView] = useState<'vacancies' | 'applications'>('vacancies');

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h2 className="text-xl font-bold text-[#1F85A8]">Careers</h2>
        <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
          <button onClick={() => setView('vacancies')} className={`px-4 py-1.5 rounded-lg text-sm font-medium ${view === 'vacancies' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>Vacancies</button>
          <button onClick={() => setView('applications')} className={`px-4 py-1.5 rounded-lg text-sm font-medium ${view === 'applications' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>Applications</button>
        </div>
      </div>
      {view === 'vacancies' ? <VacanciesView /> : <ApplicationsView />}
    </div>
  );
}

import { useState, useEffect } from 'react';
import * as api from '../api';
import { sendReplyEmail } from '../emailService';
import {
  Lock, LogOut, LayoutDashboard, Calendar, MessageSquare, Newspaper,
  Image, Building2, Plus, Trash2, Mail, Phone, Clock, Users,
  AlertCircle, Check, Send, X, Edit,
} from 'lucide-react';

type Tab = 'dashboard' | 'events' | 'news' | 'contacts' | 'gallery' | 'venues' | 'users';

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(api.isAdminLoggedIn());
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [unreadCount, setUnreadCount] = useState(0);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    if (loggedIn) {
      api.verifyToken().then(valid => {
        if (!valid) setLoggedIn(false);
      });
      api.fetchDashboard().then(d => setUnreadCount(d.unreadContacts)).catch(() => { });
      const superAdmin = api.isSuperAdmin();
      console.log('Is Super Admin:', superAdmin, 'Role:', api.getCurrentUserRole());
      setIsSuperAdmin(superAdmin);
    }
  }, [loggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await api.loginAdmin(username, password);
    if (ok) { setLoggedIn(true); setLoginError(''); }
    else setLoginError('Invalid credentials. Please check your username and password.');
  };

  const handleLogout = () => { api.logoutAdmin(); setLoggedIn(false); };

  if (!loggedIn) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#1F85A8] rounded-2xl flex items-center justify-center mx-auto mb-4"><Lock className="text-blue-400" size={28} /></div>
            <h1 className="text-2xl font-bold text-[#1F85A8]">Admin Login</h1>
            <p className="text-gray-500 text-sm mt-2">Sign in to manage the BICC website</p>
          </div>
          {loginError && <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 mb-6"><AlertCircle className="text-red-500 shrink-0" size={16} /><span className="text-red-600 text-sm">{loginError}</span></div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div><label className="block text-sm font-medium text-[#1F85A8] mb-1.5">Email / Username</label><input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none" placeholder="admin@bicc.gm" /></div>
            <div><label className="block text-sm font-medium text-[#1F85A8] mb-1.5">Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none" placeholder="••••••••" /></div>
            <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-400 hover:to-blue-600 transition-all">Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  const allTabs: { key: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'events', label: 'Events', icon: Calendar },
    { key: 'news', label: 'News', icon: Newspaper },
    { key: 'contacts', label: 'Messages', icon: MessageSquare },
    { key: 'gallery', label: 'Gallery', icon: Image },
    { key: 'venues', label: 'Venues', icon: Building2 },
    { key: 'users', label: 'Users', icon: Users },
  ];

  const tabs = allTabs.filter(tab => api.canAccessTab(tab.key));

  return (
    <div className="pt-20 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#1F85A8]">Admin Panel</h1>
            <p className="text-gray-500 text-sm">
              Manage your BICC website content
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${isSuperAdmin ? 'bg-purple-100 text-purple-700' :
                api.getCurrentUserRole() === 'Manager' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                {api.getCurrentUserRole()}
              </span>
            </p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"><LogOut size={16} /> Logout</button>
        </div>
        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          <div className="bg-white rounded-2xl p-4 h-fit shadow-sm">
            <nav className="space-y-1">
              {tabs.map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.key ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <tab.icon size={18} />{tab.label}
                  {tab.key === 'contacts' && unreadCount > 0 && <span className="ml-auto bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{unreadCount}</span>}
                </button>
              ))}
            </nav>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 min-h-[600px]">
            {activeTab === 'dashboard' && <DashboardTab />}
            {activeTab === 'events' && <EventsTab />}
            {activeTab === 'news' && <NewsTab />}
            {activeTab === 'contacts' && <ContactsTab />}
            {activeTab === 'gallery' && <GalleryTab />}
            {activeTab === 'venues' && <VenuesTab />}
            {activeTab === 'users' && <UsersTab />}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardTab() {
  const [stats, setStats] = useState<any>(null);
  const [recentMsgs, setRecentMsgs] = useState<any[]>([]);
  useEffect(() => {
    api.fetchDashboard().then(setStats).catch(() => { });
    api.fetchContacts().then(c => setRecentMsgs(c.filter((m: any) => !m.read).slice(0, 5))).catch(() => { });
  }, []);

  const statItems = [
    { label: 'Total Events', value: stats?.events || 0, icon: Calendar, color: 'bg-blue-50 text-blue-600' },
    { label: 'News Articles', value: stats?.news || 0, icon: Newspaper, color: 'bg-green-50 text-green-600' },
    { label: 'Messages', value: stats?.contacts || 0, icon: MessageSquare, color: 'bg-purple-50 text-purple-600' },
    { label: 'Gallery Images', value: stats?.gallery || 0, icon: Image, color: 'bg-blue-50 text-blue-700' },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-[#1F85A8] mb-6">Dashboard Overview</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statItems.map((s, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color} mb-3`}><s.icon size={20} /></div>
            <div className="text-2xl font-bold text-[#1F85A8]">{s.value}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>
      <h3 className="text-lg font-bold text-[#1F85A8] mb-4">Recent Unread Messages</h3>
      {recentMsgs.length === 0 ? <p className="text-gray-400 text-sm">No unread messages</p> : (
        <div className="space-y-3">
          {recentMsgs.map(msg => (
            <div key={msg.id} className="flex items-start gap-4 bg-blue-50 rounded-xl p-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0"><Mail size={16} className="text-blue-700" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2"><span className="font-medium text-[#1F85A8] text-sm">{msg.name}</span><span className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleDateString()}</span></div>
                <p className="text-sm text-gray-600 font-medium">{msg.subject}</p>
                <p className="text-sm text-gray-500 line-clamp-1">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EventsTab() {
  const [events, setEvents] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [form, setForm] = useState({ title: '', date: '', time: '', location: '', description: '', image: '', category: 'Conference' });
  const [useCustomImage, setUseCustomImage] = useState(false);

  useEffect(() => { api.fetchEvents().then(setEvents).catch(() => { }); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const imageUrl = useCustomImage && form.image ? form.image : '/images/conference-hall.jpg';

    if (editingEvent) {
      await api.updateEvent(editingEvent.id, { ...form, image: imageUrl });
      alert('✅ Event updated successfully!');
    } else {
      await api.createEvent({ ...form, image: imageUrl });
      alert('✅ Event created successfully!');
    }

    setEvents(await api.fetchEvents());
    setShowForm(false);
    setEditingEvent(null);
    setForm({ title: '', date: '', time: '', location: '', description: '', image: '', category: 'Conference' });
    setUseCustomImage(false);
  };

  const handleEdit = (event: any) => {
    setEditingEvent(event);
    setForm({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      description: event.description,
      image: event.image,
      category: event.category
    });
    setUseCustomImage(!!event.image && event.image !== '/images/conference-hall.jpg');
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEvent(null);
    setForm({ title: '', date: '', time: '', location: '', description: '', image: '', category: 'Conference' });
    setUseCustomImage(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this event?')) { await api.deleteEvent(id); setEvents(await api.fetchEvents()); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#1F85A8]">Manage Events</h2>
        {api.canEdit() && (
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700"><Plus size={16} /> Add Event</button>
        )}
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 mb-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-800"><strong>{editingEvent ? 'Edit Event:' : 'Add Event:'}</strong> {editingEvent ? 'Update the event details below.' : 'Fill in the details below. For images, you can use our default images or paste a link from another website.'}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-[#1F85A8] mb-1">Event Title *</label><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g., ECOWAS Summit 2026" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600" /></div>
            <div><label className="block text-sm font-medium text-[#1F85A8] mb-1">Category *</label><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"><option>Conference</option><option>Summit</option><option>Exhibition</option><option>Gala</option><option>Workshop</option></select></div>
            <div><label className="block text-sm font-medium text-[#1F85A8] mb-1">Date *</label><input type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600" /></div>
            <div><label className="block text-sm font-medium text-[#1F85A8] mb-1">Time *</label><input required value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} placeholder="e.g., 09:00 AM" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600" /></div>
          </div>
          <div><label className="block text-sm font-medium text-[#1F85A8] mb-1">Location *</label><input required value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g., Plenary Hall" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600" /></div>
          <div><label className="block text-sm font-medium text-[#1F85A8] mb-1">Description *</label><textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the event..." className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600 resize-none" /></div>

          <div className="border-t pt-4">
            <label className="flex items-center gap-2 mb-3 cursor-pointer">
              <input type="checkbox" checked={useCustomImage} onChange={e => setUseCustomImage(e.target.checked)} className="w-4 h-4" />
              <span className="text-sm font-medium text-[#1F85A8]">Use image from another website</span>
            </label>
            {useCustomImage ? (
              <div>
                <label className="block text-sm font-medium text-[#1F85A8] mb-1">Image URL</label>
                <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="Paste image link here (e.g., https://example.com/image.jpg)" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600" />
                <p className="text-xs text-gray-500 mt-1">💡 Tip: Right-click on any image online → "Copy image address" → Paste here</p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">Default conference hall image will be used</p>
            )}
          </div>

          <div className="flex gap-3">
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">{editingEvent ? 'Update Event' : 'Save Event'}</button>
            <button type="button" onClick={handleCancel} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">Cancel</button>
          </div>
        </form>
      )}
      <div className="space-y-3">
        {events.length === 0 ? (
          <div className="text-center py-10 text-gray-400">No events yet. Click "Add Event" to create one.</div>
        ) : (
          events.map(event => (
            <div key={event.id} className="flex items-center gap-4 bg-gray-50 rounded-xl p-4">
              <img src={event.image} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[#1F85A8] text-sm">{event.title}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {event.date}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {event.time}</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{event.category}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {api.canEdit() && (
                  <button onClick={() => handleEdit(event)} className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit event">
                    <Edit size={16} />
                  </button>
                )}
                {api.canDelete() && (
                  <button onClick={() => handleDelete(event.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete event"><Trash2 size={16} /></button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function NewsTab() {
  const [news, setNews] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', author: 'BICC Communications', image: '' });
  const [useCustomImage, setUseCustomImage] = useState(false);

  useEffect(() => { api.fetchNews().then(setNews).catch(() => { }); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const imageUrl = useCustomImage && form.image ? form.image : '/images/conference-hall.jpg';
    await api.createNews({ ...form, image: imageUrl, date: new Date().toISOString().split('T')[0] });
    setNews(await api.fetchNews());
    setShowForm(false);
    setForm({ title: '', excerpt: '', content: '', author: 'BICC Communications', image: '' });
    setUseCustomImage(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this article?')) { await api.deleteNewsItem(id); setNews(await api.fetchNews()); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#1F85A8]">Manage News</h2>
        {api.canEdit() && (
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700"><Plus size={16} /> Add Article</button>
        )}
      </div>
      {showForm && (
        <form onSubmit={handleAdd} className="bg-gray-50 rounded-xl p-6 mb-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-800"><strong>How to add news:</strong> Write your article below. The date will be set automatically to today.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-[#1F85A8] mb-1">Article Title *</label><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g., BICC Hosts Regional Summit" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600" /></div>
            <div><label className="block text-sm font-medium text-[#1F85A8] mb-1">Author *</label><input required value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600" /></div>
          </div>
          <div><label className="block text-sm font-medium text-[#1F85A8] mb-1">Short Summary (Excerpt) *</label><input required value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} placeholder="Brief summary that appears on the news page" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600" /></div>
          <div><label className="block text-sm font-medium text-[#1F85A8] mb-1">Full Article Content *</label><textarea required rows={5} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Write the full article here..." className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600 resize-none" /></div>

          <div className="border-t pt-4">
            <label className="flex items-center gap-2 mb-3 cursor-pointer">
              <input type="checkbox" checked={useCustomImage} onChange={e => setUseCustomImage(e.target.checked)} className="w-4 h-4" />
              <span className="text-sm font-medium text-[#1F85A8]">Use image from another website</span>
            </label>
            {useCustomImage ? (
              <div>
                <label className="block text-sm font-medium text-[#1F85A8] mb-1">Image URL</label>
                <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="Paste image link here (e.g., https://example.com/image.jpg)" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600" />
                <p className="text-xs text-gray-500 mt-1">💡 Tip: Right-click on any image online → "Copy image address" → Paste here</p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">Default conference hall image will be used</p>
            )}
          </div>

          <div className="flex gap-3">
            <button type="submit" className="px-6 py-2 bg-blue-600 text-[#1F85A8] rounded-lg text-sm font-bold hover:bg-blue-400">Publish Article</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">Cancel</button>
          </div>
        </form>
      )}
      <div className="space-y-3">
        {news.length === 0 ? (
          <div className="text-center py-10 text-gray-400">No news articles yet. Click "Add Article" to create one.</div>
        ) : (
          news.map(item => (
            <div key={item.id} className="flex items-center gap-4 bg-gray-50 rounded-xl p-4">
              <img src={item.image} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[#1F85A8] text-sm line-clamp-1">{item.title}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1"><span>{item.date}</span><span>{item.author}</span></div>
              </div>
              <button onClick={() => handleDelete(item.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ContactsTab() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [replySubject, setReplySubject] = useState('');

  useEffect(() => { api.fetchContacts().then(setContacts).catch(() => { }); }, []);

  const handleRead = async (id: number) => { await api.markContactRead(id); setContacts(await api.fetchContacts()); };
  const handleDelete = async (id: number) => {
    if (confirm('Delete this message?')) {
      await api.deleteContact(id);
      setContacts(await api.fetchContacts());
      if (selected?.id === id) setSelected(null);
    }
  };

  const handleReply = () => {
    if (!selected) return;
    setReplySubject(`Re: ${selected.subject}`);
    setReplyMessage('');
    setShowReplyForm(true);
  };

  const sendReply = async () => {
    if (!selected || !replyMessage.trim()) return;

    // Send email using EmailJS
    const success = await sendReplyEmail(
      selected.email,
      selected.name,
      replySubject,
      replyMessage,
      selected.message
    );

    if (success) {
      alert('✅ Reply sent successfully!');
      // Close the form
      setShowReplyForm(false);
      setReplyMessage('');
      setReplySubject('');
    } else {
      alert('❌ Failed to send reply. Please try again.');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-[#1F85A8] mb-6">Contact Messages</h2>
      {contacts.length === 0 ? (
        <div className="text-center py-20"><MessageSquare className="mx-auto text-gray-300 mb-4" size={48} /><p className="text-gray-400">No messages yet.</p></div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {contacts.map(msg => (
              <div key={msg.id} onClick={() => { setSelected(msg); handleRead(msg.id); }}
                className={`p-4 rounded-xl cursor-pointer transition-all ${selected?.id === msg.id ? 'bg-blue-50 border-2 border-blue-300' : msg.read ? 'bg-gray-50 hover:bg-gray-100' : 'bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-500'}`}>
                <div className="flex items-center justify-between mb-1"><span className="font-semibold text-[#1F85A8] text-sm">{msg.name}</span><span className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleDateString()}</span></div>
                <p className="text-sm font-medium text-gray-700">{msg.subject}</p>
                <p className="text-xs text-gray-500 line-clamp-1">{msg.message}</p>
              </div>
            ))}
          </div>
          {selected ? (
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-[#1F85A8]">{selected.subject}</h3>
                <div className="flex gap-2">
                  <button onClick={handleReply} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium">
                    <Send size={16} />Reply
                  </button>
                  <button onClick={() => handleDelete(selected.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm"><Users size={14} className="text-gray-400" /><span className="text-gray-600">{selected.name}</span></div>
                <div className="flex items-center gap-2 text-sm"><Mail size={14} className="text-gray-400" /><span className="text-gray-600">{selected.email}</span></div>
                {selected.phone && <div className="flex items-center gap-2 text-sm"><Phone size={14} className="text-gray-400" /><span className="text-gray-600">{selected.phone}</span></div>}
                <div className="flex items-center gap-2 text-sm"><Clock size={14} className="text-gray-400" /><span className="text-gray-600">{new Date(selected.created_at).toLocaleString()}</span></div>
              </div>
              <div className="bg-white rounded-lg p-4 mb-4"><p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{selected.message}</p></div>

              {showReplyForm && (
                <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-[#1F85A8] flex items-center gap-2">
                      <Send size={16} className="text-blue-600" />
                      Reply to {selected.name}
                    </h4>
                    <button onClick={() => setShowReplyForm(false)} className="text-gray-400 hover:text-gray-600">
                      <X size={18} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                      <input
                        type="text"
                        value={replySubject}
                        onChange={(e) => setReplySubject(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <textarea
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        rows={6}
                        placeholder="Type your reply here..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm resize-none"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={sendReply}
                        disabled={!replyMessage.trim()}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        <Send size={16} />
                        Send Reply
                      </button>
                      <button
                        onClick={() => setShowReplyForm(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 italic">✉️ The email will be sent directly from your BICC email address.</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center bg-gray-50 rounded-xl p-10"><p className="text-gray-400 text-sm">Select a message to view details</p></div>
          )}
        </div>
      )}
    </div>
  );
}

function GalleryTab() {
  const [gallery, setGallery] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ url: '', caption: '', category: 'Venue' });
  useEffect(() => { api.fetchGallery().then(setGallery).catch(() => { }); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const imageUrl = form.url || '/images/conference-hall.jpg';
    await api.createGalleryItem({ ...form, url: imageUrl });
    setGallery(await api.fetchGallery());
    setShowForm(false);
    setForm({ url: '', caption: '', category: 'Venue' });
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this image?')) {
      await api.deleteGalleryItem(id);
      setGallery(await api.fetchGallery());
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#1F85A8]">Manage Gallery</h2>
        {api.canEdit() && (
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700"><Plus size={16} /> Add Image</button>
        )}
      </div>
      {showForm && (
        <form onSubmit={handleAdd} className="bg-gray-50 rounded-xl p-6 mb-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-800"><strong>How to add gallery images:</strong> Paste an image link from any website, add a caption, and choose a category.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1F85A8] mb-1">Image URL *</label>
            <input
              value={form.url}
              onChange={e => setForm({ ...form, url: e.target.value })}
              placeholder="Paste image link here (e.g., https://example.com/photo.jpg)"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
            />
            <p className="text-xs text-gray-500 mt-1">💡 Tip: Right-click on any image online → "Copy image address" → Paste here</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-[#1F85A8] mb-1">Caption *</label><input required value={form.caption} onChange={e => setForm({ ...form, caption: e.target.value })} placeholder="e.g., Conference Hall Interior" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600" /></div>
            <div><label className="block text-sm font-medium text-[#1F85A8] mb-1">Category *</label><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"><option>Venue</option><option>Events</option><option>VIP</option><option>Brand</option></select></div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="px-6 py-2 bg-blue-600 text-[#1F85A8] rounded-lg text-sm font-bold hover:bg-blue-400">Add to Gallery</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">Cancel</button>
          </div>
        </form>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {gallery.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-400">No gallery images yet. Click "Add Image" to upload one.</div>
        ) : (
          gallery.map(item => (
            <div key={item.id} className="relative group bg-gray-50 rounded-xl overflow-hidden">
              <img src={item.url} alt={item.caption} className="w-full h-48 object-cover" />
              <div className="p-3">
                <p className="text-sm font-medium text-[#1F85A8] line-clamp-1">{item.caption}</p>
                <span className="text-xs text-gray-500">{item.category}</span>
              </div>
              <button onClick={() => handleDelete(item.id)} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"><Trash2 size={14} /></button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function VenuesTab() {
  const [venues, setVenues] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', capacity: '', description: '', image: '', features: '' });
  const [useCustomImage, setUseCustomImage] = useState(false);

  useEffect(() => { api.fetchVenues().then(setVenues).catch(() => { }); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const imageUrl = useCustomImage && form.image ? form.image : '/images/conference-hall.jpg';
    const featuresArray = form.features.split(',').map(f => f.trim()).filter(f => f);
    await api.createVenue({ ...form, image: imageUrl, features: featuresArray });
    setVenues(await api.fetchVenues());
    setShowForm(false);
    setForm({ name: '', capacity: '', description: '', image: '', features: '' });
    setUseCustomImage(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this venue?')) {
      await api.deleteVenue(id);
      setVenues(await api.fetchVenues());
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#1F85A8]">Manage Venues</h2>
        {api.canEdit() && (
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700"><Plus size={16} /> Add Venue</button>
        )}
      </div>
      {showForm && (
        <form onSubmit={handleAdd} className="bg-gray-50 rounded-xl p-6 mb-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-800"><strong>How to add a venue:</strong> Fill in the venue details. For features, separate them with commas (e.g., "WiFi, Projector, Sound System").</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-[#1F85A8] mb-1">Venue Name *</label><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g., Plenary Hall" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600" /></div>
            <div><label className="block text-sm font-medium text-[#1F85A8] mb-1">Capacity *</label><input required value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} placeholder="e.g., 1,013 seats" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600" /></div>
          </div>
          <div><label className="block text-sm font-medium text-[#1F85A8] mb-1">Description *</label><textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the venue..." className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600 resize-none" /></div>
          <div><label className="block text-sm font-medium text-[#1F85A8] mb-1">Features</label><input value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} placeholder="e.g., WiFi, Projector, Sound System, Air Conditioning" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600" /><p className="text-xs text-gray-500 mt-1">Separate features with commas</p></div>

          <div className="border-t pt-4">
            <label className="flex items-center gap-2 mb-3 cursor-pointer">
              <input type="checkbox" checked={useCustomImage} onChange={e => setUseCustomImage(e.target.checked)} className="w-4 h-4" />
              <span className="text-sm font-medium text-[#1F85A8]">Use image from another website</span>
            </label>
            {useCustomImage ? (
              <div>
                <label className="block text-sm font-medium text-[#1F85A8] mb-1">Image URL</label>
                <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="Paste image link here (e.g., https://example.com/image.jpg)" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600" />
                <p className="text-xs text-gray-500 mt-1">💡 Tip: Right-click on any image online → "Copy image address" → Paste here</p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">Default conference hall image will be used</p>
            )}
          </div>

          <div className="flex gap-3">
            <button type="submit" className="px-6 py-2 bg-blue-600 text-[#1F85A8] rounded-lg text-sm font-bold hover:bg-blue-400">Save Venue</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">Cancel</button>
          </div>
        </form>
      )}
      <div className="space-y-4">
        {venues.length === 0 ? (
          <div className="text-center py-10 text-gray-400">No venues yet. Click "Add Venue" to create one.</div>
        ) : (
          venues.map(venue => (
            <div key={venue.id} className="flex items-start gap-4 bg-gray-50 rounded-xl p-4">
              <img src={venue.image} alt="" className="w-20 h-20 rounded-lg object-cover shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-[#1F85A8]">{venue.name}</h3>
                <div className="flex items-center gap-2 text-sm text-blue-700 font-medium mt-1"><Users size={14} />{venue.capacity}</div>
                <p className="text-sm text-gray-500 mt-2">{venue.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(venue.features || []).map((f: string, i: number) => (
                    <span key={i} className="flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full"><Check size={10} /> {f}</span>
                  ))}
                </div>
              </div>
              <button onClick={() => handleDelete(venue.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}




function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [form, setForm] = useState({ email: '', username: '', password: '', role: 'Staff' });

  useEffect(() => {
    console.log('Fetching users...');
    api.fetchUsers().then(users => {
      console.log('Users loaded:', users);
      setUsers(users);
    }).catch(err => {
      console.error('Error fetching users:', err);
    });
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Update existing user
        console.log('Updating user:', editingUser.id, form);
        await api.updateUser(editingUser.id, form);
        alert('✅ User updated successfully!');
      } else {
        // Create new user
        console.log('Creating user with data:', form);
        const result = await api.createUser(form);
        console.log('User created:', result);
        alert('✅ User created successfully!');
      }
      setUsers(await api.fetchUsers());
      setShowForm(false);
      setEditingUser(null);
      setForm({ email: '', username: '', password: '', role: 'Staff' });
    } catch (error: any) {
      console.error('Error saving user:', error);
      alert('❌ ' + (error.message || 'Failed to save user'));
    }
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setForm({
      email: user.email,
      username: user.username,
      password: user.password || '',
      role: user.role
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUser(null);
    setForm({ email: '', username: '', password: '', role: 'Staff' });
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this user? They will no longer be able to log in.')) {
      await api.deleteUser(id);
      setUsers(await api.fetchUsers());
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#1F85A8]">Manage Users</h2>
          <p className="text-sm text-gray-500 mt-1">Create and manage admin accounts</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700"><Plus size={16} /> Add User</button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-gray-50 rounded-xl p-6 mb-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-800"><strong>{editingUser ? 'Edit User:' : 'Create New User:'}</strong> {editingUser ? 'Update the user details below.' : 'Fill in the details below to create a new admin account. The user will be able to log in with their email or username.'}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1F85A8] mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="user@bicc.gm"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1F85A8] mb-1">Username *</label>
              <input
                required
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                placeholder="e.g., jdoe"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1F85A8] mb-1">Password *</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters recommended</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1F85A8] mb-1">Role *</label>
              <select
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option>Staff</option>
                <option>Manager</option>
                <option>Super Admin</option>
              </select>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700">
              <strong>Roles:</strong><br />
              • <strong>Staff</strong> - Can manage events, news, gallery, and contacts<br />
              • <strong>Manager</strong> - Staff permissions + venue management<br />
              • <strong>Super Admin</strong> - Full access including user management
            </p>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">{editingUser ? 'Update User' : 'Create User'}</button>
            <button type="button" onClick={handleCancel} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {users.length === 0 ? (
          <div className="text-center py-10 text-gray-400">No users yet. Click "Add User" to create one.</div>
        ) : (
          users.map(user => (
            <div key={user.id} className="flex items-center gap-4 bg-gray-50 rounded-xl p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <Users size={20} className="text-blue-700" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-[#1F85A8] text-sm">{user.username}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${user.role === 'Super Admin' ? 'bg-purple-100 text-purple-700' :
                    user.role === 'Manager' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>{user.role}</span>
                </div>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-xs text-gray-400 mt-1">Created: {new Date(user.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(user)}
                  className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit user"
                >
                  <Edit size={16} />
                </button>
                {user.role !== 'Super Admin' && (
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete user"
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

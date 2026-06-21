import { useState, useEffect } from 'react';
import * as api from '../api';
import { sendReplyEmail } from '../emailService';
import { storage } from '../firebase';
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL
} from 'firebase/storage';
import {
  Lock, LogOut, LayoutDashboard, Calendar, MessageSquare, Newspaper,
  Image, Building2, Plus, Trash2, Mail, Phone, Clock, Users,
  AlertCircle, Check, Send, X, Edit, BookOpen, ChevronDown,
  TrendingUp, DollarSign, GripVertical, Download,
  Star, Handshake, Briefcase, FileSpreadsheet, Receipt,
  ChevronLeft, ChevronRight, StickyNote, List, Settings, ArrowLeft,
} from 'lucide-react';
import TestimonialsTab from '../components/admin/TestimonialsTab';
import TeamTab from '../components/admin/TeamTab';
import HotelsTab from '../components/admin/HotelsTab';
import PartnersTab from '../components/admin/PartnersTab';
import DownloadsTab from '../components/admin/DownloadsTab';
import CareersTab from '../components/admin/CareersTab';
import TendersTab from '../components/admin/TendersTab';
import SubscribersTab from '../components/admin/SubscribersTab';
import PricingTab from '../components/admin/PricingTab';
import QuotationsTab from '../components/admin/QuotationsTab';
import ContentManagementTab from '../components/admin/ContentManagementTab';
import VenuesTab from '../components/admin/VenuesTab';
import { MediaField } from '../components/admin/MediaField';
import MediaLibraryTab from '../components/admin/MediaLibraryTab';
import PagesContentTab from '../components/admin/PagesContentTab';
import UserManagementTab from '../components/admin/UserManagementTab';
import AdminShell from '../components/admin/layout/AdminShell';
import EnhancedDashboard from '../components/admin/dashboard/EnhancedDashboard';
import { IMAGES } from '../images';

type Tab =
  | 'dashboard' | 'events' | 'news' | 'contacts' | 'bookings' | 'gallery' | 'venues' | 'users'
  | 'testimonials' | 'team' | 'partners' | 'hotels' | 'downloads' | 'careers' | 'tenders' | 'subscribers'
  | 'pricing' | 'quotations' | 'settings' | 'media' | 'pages';

// Image compression utility
const compressImage = async (file: File, maxWidth: number = 1200, quality: number = 0.8): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = (event.target?.result as string) || '';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Image compression failed (canvas context unavailable).'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Image compression failed (toBlob returned null).'));
        }, 'image/jpeg', quality);
      };
    };
  });
};

const isThisMonth = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
};

const isUpcoming = (dateString: string): boolean => {
  return new Date(dateString) > new Date();
};

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(api.isAdminLoggedIn());
  const [showSetup, setShowSetup] = useState(false);
  const [setupEmail, setSetupEmail] = useState('');
  const [setupUsername, setSetupUsername] = useState('');
  const [setupPassword, setSetupPassword] = useState('');
  const [setupConfirmPassword, setSetupConfirmPassword] = useState('');
  const [setupError, setSetupError] = useState('');
  const [setupSuccess, setSetupSuccess] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [displayName, setDisplayName] = useState(api.getCurrentUserDisplayName());

  useEffect(() => {
    if (loggedIn) {
      api.verifyToken().then(valid => {
        if (!valid) setLoggedIn(false);
      });
      api.fetchDashboard().then(d => {
        setUnreadCount(d.unreadContacts);
        setPendingBookings(d.pendingBookings);
      }).catch(() => { });
      const superAdmin = api.isSuperAdmin();
      setIsSuperAdmin(superAdmin);
      setDisplayName(api.getCurrentUserDisplayName());
    }
  }, [loggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await api.loginAdmin(username, password);
    if (ok) { setLoggedIn(true); setDisplayName(api.getCurrentUserDisplayName()); setLoginError(''); }
    else setLoginError('Login failed. Use your email and password first if your username was created before today, then username login will work after that.');
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSetupError('');
    setSetupSuccess('');

    if (!setupEmail || !setupUsername || !setupPassword || !setupConfirmPassword) {
      setSetupError('All fields are required');
      return;
    }

    if (setupPassword !== setupConfirmPassword) {
      setSetupError('Passwords do not match');
      return;
    }

    if (setupPassword.length < 8) {
      setSetupError('Password must be at least 8 characters');
      return;
    }

    try {
      await api.createAdminUser({
        email: setupEmail,
        username: setupUsername,
        password: setupPassword,
        role: 'Super Admin',
        status: 'active'
      });
      setSetupSuccess('Super Admin account created! You can now log in.');
      setTimeout(() => {
        setShowSetup(false);
        setSetupEmail('');
        setSetupUsername('');
        setSetupPassword('');
        setSetupConfirmPassword('');
      }, 2000);
    } catch (err: any) {
      setSetupError(err.message || 'Failed to create account');
    }
  };

  const handleLogout = () => { api.logoutAdmin(); setLoggedIn(false); };

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-bicc-primary-light flex items-center justify-center px-4 py-10">
        <div className="admin-panel w-full max-w-md p-6 sm:p-8 shadow-admin-lg">
          <div className="text-center mb-8">
            <div className="mb-8 flex justify-center">
              <img
                src={IMAGES.logo}
                alt="BICC — Banjul International Convention Centre"
                className="h-20 sm:h-24 w-auto max-w-[280px] object-contain bg-white rounded-2xl px-3 py-2 shadow-xl border border-blue-100"
              />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-4">
              <Lock size={14} />
              BICC Admin Portal
            </div>
            <h1 className="text-2xl font-bold text-bicc-primary">{showSetup ? 'Create Account' : 'Welcome back'}</h1>
            <p className="text-gray-500 text-sm mt-2">{showSetup ? 'Set up your Super Admin account' : 'Sign in to manage website content, users, and live updates.'}</p>
          </div>

          {!showSetup ? (
            <>
              {loginError && <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 mb-6"><AlertCircle className="text-red-500 shrink-0" size={16} /><span className="text-red-600 text-sm">{loginError}</span></div>}
              <form onSubmit={handleLogin} className="space-y-4">
                <div><label className="block text-sm font-medium text-bicc-primary mb-1.5">Email / Username</label><input type="text" value={username} onChange={e => setUsername(e.target.value)} className="admin-input" placeholder="admin@bicc.gm" /></div>
                <div><label className="block text-sm font-medium text-bicc-primary mb-1.5">Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} className="admin-input" placeholder="••••••••" /></div>
                <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-bicc-primary to-bicc-primary-dark text-white rounded-xl font-bold hover:shadow-lg hover:shadow-bicc-primary/25 transition-all">Sign In</button>
              </form>
              <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                <button onClick={() => setShowSetup(true)} className="text-blue-600 hover:text-blue-700 text-sm font-medium">Create new account →</button>
              </div>
            </>
          ) : (
            <>
              {setupError && <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 mb-6"><AlertCircle className="text-red-500 shrink-0" size={16} /><span className="text-red-600 text-sm">{setupError}</span></div>}
              {setupSuccess && <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3 mb-6"><Check className="text-green-500 shrink-0" size={16} /><span className="text-green-600 text-sm">{setupSuccess}</span></div>}
              <form onSubmit={handleSetup} className="space-y-4">
                <div><label className="block text-sm font-medium text-bicc-primary mb-1.5">Email Address</label><input type="email" value={setupEmail} onChange={e => setSetupEmail(e.target.value)} className="admin-input" placeholder="admin@bicc.gm" /></div>
                <div><label className="block text-sm font-medium text-bicc-primary mb-1.5">Username</label><input type="text" value={setupUsername} onChange={e => setSetupUsername(e.target.value)} className="admin-input" placeholder="admin" /></div>
                <div><label className="block text-sm font-medium text-bicc-primary mb-1.5">Password</label><input type="password" value={setupPassword} onChange={e => setSetupPassword(e.target.value)} className="admin-input" placeholder="••••••••" /></div>
                <div><label className="block text-sm font-medium text-bicc-primary mb-1.5">Confirm Password</label><input type="password" value={setupConfirmPassword} onChange={e => setSetupConfirmPassword(e.target.value)} className="admin-input" placeholder="••••••••" /></div>
                <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-bicc-primary to-bicc-primary-dark text-white rounded-xl font-bold hover:shadow-lg hover:shadow-bicc-primary/25 transition-all">Create Super Admin Account</button>
              </form>
              <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                <button onClick={() => setShowSetup(false)} className="text-blue-600 hover:text-blue-700 text-sm font-medium">← Back to Sign In</button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  const allTabs: { key: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'settings', label: 'Content', icon: Settings },
    { key: 'pages', label: 'Page Content', icon: StickyNote },
    { key: 'media', label: 'Media Library', icon: Image },
    { key: 'events', label: 'Events', icon: Calendar },
    { key: 'news', label: 'News', icon: Newspaper },
    { key: 'contacts', label: 'Messages', icon: MessageSquare },
    { key: 'bookings', label: 'Bookings', icon: BookOpen },
    { key: 'gallery', label: 'Gallery', icon: Image },
    { key: 'venues', label: 'Venues', icon: Building2 },
    { key: 'quotations', label: 'Quotations', icon: Receipt },
    { key: 'pricing', label: 'Pricing', icon: DollarSign },
    { key: 'downloads', label: 'Downloads', icon: Download },
    { key: 'careers', label: 'Careers', icon: Briefcase },
    { key: 'tenders', label: 'Tenders', icon: FileSpreadsheet },
    { key: 'testimonials', label: 'Testimonials', icon: Star },
    { key: 'team', label: 'Team & Board', icon: Users },
    { key: 'partners', label: 'Partners', icon: Handshake },
    { key: 'hotels', label: 'Hotels', icon: Building2 },
    { key: 'subscribers', label: 'Subscribers', icon: Mail },
    { key: 'users', label: 'Users', icon: Users },
  ];

  const tabs = allTabs.filter(tab => api.canAccessTab(tab.key));
  const currentRole = api.getCurrentUserRole();
  const roleBadgeClass = isSuperAdmin
    ? 'bg-purple-100 text-purple-700 border border-purple-200'
    : currentRole === 'Manager'
      ? 'bg-blue-100 text-blue-700 border border-blue-200'
      : currentRole === 'Editor'
        ? 'bg-amber-100 text-amber-700 border border-amber-200'
        : 'bg-gray-100 text-gray-700 border border-gray-200';
  const roleBadgeLabel = isSuperAdmin
    ? 'Super Admin'
    : currentRole === 'Manager'
      ? 'Manager'
      : currentRole === 'Editor'
        ? 'Editor'
        : 'Staff';
  return (
    <AdminShell
      activeTab={activeTab}
      onTabChange={(tab) => setActiveTab(tab as Tab)}
      tabs={tabs}
      displayName={displayName}
      roleBadgeClass={roleBadgeClass}
      roleBadgeLabel={roleBadgeLabel}
      unreadCount={unreadCount}
      pendingBookings={pendingBookings}
      onLogout={handleLogout}
    >
      {activeTab === 'dashboard' && <EnhancedDashboard onTabChange={(tab) => setActiveTab(tab as Tab)} />}
      {activeTab === 'settings' && <ContentManagementTab />}
      {activeTab === 'media' && <MediaLibraryTab />}
      {activeTab === 'pages' && <PagesContentTab />}
      {activeTab === 'events' && <EventsTab />}
      {activeTab === 'news' && <NewsTab />}
      {activeTab === 'contacts' && <ContactsTab />}
      {activeTab === 'bookings' && <BookingsTab />}
      {activeTab === 'gallery' && <GalleryTab />}
      {activeTab === 'venues' && <VenuesTab />}
      {activeTab === 'users' && <UserManagementTab />}
      {activeTab === 'testimonials' && <TestimonialsTab />}
      {activeTab === 'team' && <TeamTab />}
      {activeTab === 'partners' && <PartnersTab />}
      {activeTab === 'hotels' && <HotelsTab />}
      {activeTab === 'downloads' && <DownloadsTab />}
      {activeTab === 'careers' && <CareersTab />}
      {activeTab === 'tenders' && <TendersTab />}
      {activeTab === 'subscribers' && <SubscribersTab />}
      {activeTab === 'pricing' && <PricingTab />}
      {activeTab === 'quotations' && <QuotationsTab />}
    </AdminShell>
  );
}

function DashboardTab() {
  const [stats, setStats] = useState<any>(null);
  const [recentMsgs, setRecentMsgs] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    api.fetchDashboard().then(setStats).catch(() => { });
    api.fetchContacts().then(c => setRecentMsgs(c.filter((m: any) => !m.read).slice(0, 3))).catch(() => { });
    api.fetchBookings().then(b => {
      setAllBookings(b);
      setRecentBookings(b.filter((x: any) => x.status === 'Pending').slice(0, 3));
    }).catch(() => { });
    api.fetchEvents().then(setAllEvents).catch(() => { });
    api.fetchAuditLogs().then(logs => setAuditLogs(logs.slice(0, 8))).catch(() => { });
  }, []);

  const bookingsThisMonth = allBookings.filter(b => isThisMonth(b.created_at)).length;
  const upcomingEvents = allEvents.filter(e => isUpcoming(e.date)).length;
  const approvedBookings = allBookings.filter(b => b.status === 'Approved').length;

  const statItems = [
    { label: 'Total Events', value: stats?.events || 0, icon: Calendar, color: 'bg-blue-50 text-blue-600', subtitle: `${upcomingEvents} upcoming` },
    { label: 'This Month Bookings', value: bookingsThisMonth, icon: BookOpen, color: 'bg-green-50 text-green-600', subtitle: `${approvedBookings} approved` },
    { label: 'Messages', value: stats?.contacts || 0, icon: MessageSquare, color: 'bg-purple-50 text-purple-600', subtitle: `${recentMsgs.length} unread` },
    { label: 'Pending Bookings', value: stats?.pendingBookings || 0, icon: TrendingUp, color: 'bg-yellow-50 text-yellow-600', subtitle: 'Awaiting action' },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-[#1F85A8] mb-6">Dashboard Overview</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statItems.map((s, i) => (
          <div key={i} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color} mb-3`}><s.icon size={20} /></div>
            <div className="text-2xl font-bold text-[#1F85A8]">{s.value}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
            {s.subtitle && <div className="text-xs text-gray-400 mt-1">{s.subtitle}</div>}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-bold text-[#1F85A8] mb-4">Recent Unread Messages</h3>
          {recentMsgs.length === 0 ? <p className="text-gray-400 text-sm">No unread messages</p> : (
            <div className="space-y-3">
              {recentMsgs.map(msg => (
                <div key={msg.id} className="flex items-start gap-4 bg-blue-50 rounded-xl p-4 border border-blue-100">
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

        <div>
          <h3 className="text-lg font-bold text-[#1F85A8] mb-4">Pending Booking Requests</h3>
          {recentBookings.length === 0 ? <p className="text-gray-400 text-sm">No pending bookings</p> : (
            <div className="space-y-3">
              {recentBookings.map(b => (
                <div key={b.id} className="flex items-start gap-4 bg-yellow-50 rounded-xl p-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center shrink-0"><BookOpen size={16} className="text-yellow-700" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2"><span className="font-medium text-[#1F85A8] text-sm">{b.institutionName}</span><span className="text-xs text-gray-400">{new Date(b.created_at).toLocaleDateString()}</span></div>
                    <p className="text-sm text-gray-600">{b.firstName} {b.lastName} · {b.eventType}</p>
                    <p className="text-xs text-gray-500">{b.startDate} → {b.endDate}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-bold text-[#1F85A8] mb-4">Security & Activity Logs</h3>
        {auditLogs.length === 0 ? (
          <p className="text-gray-400 text-sm">No audit entries yet.</p>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl p-3 sm:p-4 max-h-[420px] overflow-y-auto space-y-3">
            {auditLogs.map((entry) => (
              <div key={entry.id} className="bg-gray-50 rounded-xl p-4 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#1F85A8] break-words">
                    {entry.actorDisplayName || entry.actorUsername || 'Admin'}
                  </p>
                  <p className="text-sm text-gray-700 capitalize">
                    {entry.action} {formatTargetType(entry.targetType)}
                  </p>
                  <p className="text-xs text-gray-500 break-words">
                    {entry.details?.title || entry.details?.name || entry.details?.username || entry.details?.email || entry.targetId || 'System activity'}
                  </p>
                </div>
                <div className="text-xs text-gray-500 shrink-0">
                  {entry.createdAt ? new Date(entry.createdAt).toLocaleString() : 'Unknown time'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function formatTargetType(targetType?: string) {
  if (!targetType) return 'record';
  return targetType
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .trim();
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
  const [editingArticle, setEditingArticle] = useState<any | null>(null);
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', author: 'BICC Communications', image: '', date: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { api.fetchNews().then(setNews).catch(() => { }); }, []);

  const resetForm = () => {
    setForm({ title: '', excerpt: '', content: '', author: 'BICC Communications', image: '', date: '' });
    setEditingArticle(null);
    setShowForm(false);
  };

  const handleEdit = (item: any) => {
    setEditingArticle(item);
    setForm({
      title: item.title || '',
      excerpt: item.excerpt || '',
      content: item.content || '',
      author: item.author || 'BICC Communications',
      image: item.image || '',
      date: item.date || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const imageUrl = form.image || '/images/conference-hall.jpg';
      if (editingArticle) {
        await api.updateNews(editingArticle.id, {
          title: form.title,
          excerpt: form.excerpt,
          content: form.content,
          author: form.author,
          image: imageUrl,
          date: form.date || editingArticle.date,
        });
      } else {
        await api.createNews({
          title: form.title,
          excerpt: form.excerpt,
          content: form.content,
          author: form.author,
          image: imageUrl,
          date: new Date().toISOString().split('T')[0],
        });
      }
      setNews(await api.fetchNews());
      resetForm();
    } catch (err) {
      console.error(err);
      alert('Failed to save article. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this article?')) { await api.deleteNewsItem(id); setNews(await api.fetchNews()); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#1F85A8]">Manage News</h2>
          <p className="text-xs text-gray-500 mt-1">Publish and edit news articles on the public website.</p>
        </div>
        {api.canEdit() && (
          <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700"><Plus size={16} /> Add Article</button>
        )}
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 mb-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-800"><strong>{editingArticle ? 'Edit article' : 'New article'}:</strong> Upload a cover image or pick one from the media library.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-[#1F85A8] mb-1">Article Title *</label><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g., BICC Hosts Regional Summit" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600" /></div>
            <div><label className="block text-sm font-medium text-[#1F85A8] mb-1">Author *</label><input required value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600" /></div>
          </div>
          {editingArticle && (
            <div><label className="block text-sm font-medium text-[#1F85A8] mb-1">Publish Date</label><input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600" /></div>
          )}
          <div><label className="block text-sm font-medium text-[#1F85A8] mb-1">Short Summary (Excerpt) *</label><input required value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} placeholder="Brief summary that appears on the news page" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600" /></div>
          <div><label className="block text-sm font-medium text-[#1F85A8] mb-1">Full Article Content *</label><textarea required rows={5} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Write the full article here..." className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600 resize-none" /></div>

          <MediaField
            label="Cover image"
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
            accept="image"
            uploadFolder="news"
            helpText="This image appears on the news listing and article page."
          />

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-50">{saving ? 'Saving…' : editingArticle ? 'Update Article' : 'Publish Article'}</button>
            <button type="button" onClick={resetForm} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">Cancel</button>
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
              <div className="flex items-center gap-2">
                {api.canEdit() && (
                  <button onClick={() => handleEdit(item)} className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit article">
                    <Edit size={16} />
                  </button>
                )}
                {api.canDelete() && (
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete article"><Trash2 size={16} /></button>
                )}
              </div>
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
      <h2 className="admin-section-title mb-4 sm:mb-6">Contact Messages</h2>
      {contacts.length === 0 ? (
        <div className="text-center py-20"><MessageSquare className="mx-auto text-gray-300 mb-4" size={48} /><p className="text-gray-400">No messages yet.</p></div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
          <div className={`space-y-2 max-h-[500px] overflow-y-auto admin-scrollbar ${selected ? 'max-lg:hidden' : ''}`}>
            {contacts.map(msg => (
              <div key={msg.id} onClick={() => { setSelected(msg); handleRead(msg.id); }}
                className={`p-4 rounded-xl cursor-pointer transition-all ${selected?.id === msg.id ? 'bg-blue-50 border-2 border-blue-300' : msg.read ? 'bg-gray-50 hover:bg-gray-100' : 'bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-500'}`}>
                <div className="flex items-center justify-between mb-1 gap-2"><span className="font-semibold text-bicc-primary text-sm truncate">{msg.name}</span><span className="text-xs text-gray-400 shrink-0">{new Date(msg.created_at).toLocaleDateString()}</span></div>
                <p className="text-sm font-medium text-gray-700">{msg.subject}</p>
                <p className="text-xs text-gray-500 line-clamp-1">{msg.message}</p>
              </div>
            ))}
          </div>
          {selected ? (
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6 max-lg:min-h-[420px]">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="lg:hidden inline-flex items-center gap-2 text-sm text-bicc-primary font-medium mb-4 hover:underline"
              >
                <ArrowLeft size={16} />
                Back to messages
              </button>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <h3 className="font-bold text-bicc-primary">{selected.subject}</h3>
                <div className="flex gap-2 shrink-0">
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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ caption: '', category: 'Venue' });

  const [form, setForm] = useState({ url: '', caption: '', category: 'Venue', mediaType: 'image' as 'image' | 'video' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    api.fetchGallery().then(setGallery).catch(() => {});
  }, []);

  const isVideoFile = (file: File) => file.type.startsWith('video/');

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setForm(f => ({ ...f, mediaType: isVideoFile(file) ? 'video' : 'image' }));
  };

  const isVideoUrl = (url: string) =>
    url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');

  const getYouTubeEmbed = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?\s]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsUploading(true);
      let mediaUrl = form.url;

      if (selectedFile) {
        let uploadBlob: Blob = selectedFile;
        if (!isVideoFile(selectedFile)) uploadBlob = await compressImage(selectedFile);
        const uploadFile = new File([uploadBlob], selectedFile.name, {
          type: isVideoFile(selectedFile) ? selectedFile.type : 'image/jpeg',
        });
        const uploaded = await api.uploadAdminAsset(uploadFile, 'gallery');
        mediaUrl = uploaded.url;
      }

      // Auto-detect video type from URL if no file was uploaded
      const detectedMediaType = selectedFile
        ? form.mediaType
        : isVideoUrl(form.url) ? 'video' : form.mediaType;

      await api.createGalleryItem({ ...form, url: mediaUrl, mediaType: detectedMediaType });
      setGallery(await api.fetchGallery());
      setForm({ url: '', caption: '', category: 'Venue', mediaType: 'image' });
      setSelectedFile(null);
      setPreview('');
      setUploadProgress(0);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteGallery = async (id: number) => {
    if (confirm('Delete this item?')) {
      await api.deleteGalleryItem?.(id);
      setGallery(await api.fetchGallery());
    }
  };

  const handleEditGallery = (item: any) => {
    setEditingId(item.id);
    setEditForm({ caption: item.caption || '', category: item.category || 'Venue' });
  };

  const handleSaveGallery = async (id: number) => {
    try {
      await api.updateGalleryItem(id, editForm);
      setGallery(await api.fetchGallery());
      setEditingId(null);
    } catch (err) {
      console.error('Error saving gallery item:', err);
      alert('Failed to save changes');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ caption: '', category: 'Venue' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#1F85A8]">Manage Gallery</h2>
          <p className="text-xs text-gray-400 mt-0.5">Upload images or videos, or paste a URL (including YouTube links)</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center gap-2"
        >
          <Plus size={15} /> Add Media
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="space-y-4 bg-gray-50 p-6 rounded-xl mb-6 border border-gray-200">
          <h3 className="font-semibold text-[#1F85A8] text-sm">Add Image or Video</h3>

          {/* Media type toggle */}
          <div className="flex gap-2">
            {(['image', 'video'] as const).map(type => (
              <button
                key={type}
                type="button"
                onClick={() => { setForm(f => ({ ...f, mediaType: type })); setSelectedFile(null); setPreview(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                  form.mediaType === type ? 'bg-[#1F85A8] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {type === 'image' ? '🖼 Image' : '🎬 Video'}
              </button>
            ))}
          </div>

          {/* Drag & Drop */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              handleFileChange(e.dataTransfer.files?.[0] || null);
            }}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
          >
            <div className="text-3xl mb-2">{form.mediaType === 'video' ? '🎬' : '🖼'}</div>
            <p className="text-sm text-gray-600 font-medium mb-1">
              Drag & drop {form.mediaType === 'video' ? 'a video' : 'an image'} here, or click to browse
            </p>
            <p className="text-xs text-gray-400 mb-3">
              {form.mediaType === 'video' ? 'MP4, MOV, WEBM — max 100MB' : 'JPG, PNG, WEBP — max 20MB, auto-compressed'}
            </p>
            <input
              type="file"
              accept={form.mediaType === 'video' ? 'video/*' : 'image/*'}
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              className="text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            />
          </div>

          {/* Preview */}
          {preview && (
            <div className="rounded-xl overflow-hidden border border-gray-200">
              {form.mediaType === 'video' ? (
                <video src={preview} controls className="w-full max-h-48 bg-black" />
              ) : (
                <img src={preview} className="w-full max-h-48 object-cover" />
              )}
            </div>
          )}

          {/* Progress */}
          {isUploading && (
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Uploading…</span><span>{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          <div className="border-t pt-4 space-y-3">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Or paste a URL directly</p>
            <input
              placeholder={form.mediaType === 'video' ? 'Paste YouTube, Vimeo or direct video URL' : 'Paste image URL'}
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
            />
            {form.url && isVideoUrl(form.url) && (
              <p className="text-xs text-green-600 font-medium">✅ YouTube/Vimeo URL detected — will embed as video</p>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Caption</label>
              <input
                placeholder="e.g., Plenary Hall during summit"
                value={form.caption}
                onChange={(e) => setForm({ ...form, caption: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option>Venue</option>
                <option>Plenary Hall</option>
                <option>Banquet</option>
                <option>Exterior</option>
                <option>VVIP Lounge</option>
                <option>Hospitality</option>
                <option>Control Room</option>
                <option>Events</option>
                <option>Tour</option>
                <option>VIP</option>
                <option>Brand</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isUploading} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-50">
              {isUploading ? 'Uploading…' : `Save ${form.mediaType === 'video' ? 'Video' : 'Image'}`}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setSelectedFile(null); setPreview(''); }} className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
        {gallery.length === 0 && (
          <div className="col-span-3 text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">🖼</div>
            <p>No media yet. Click "Add Media" to get started.</p>
          </div>
        )}
        {gallery.map((item) => {
          const isVideo = item.mediaType === 'video' || isVideoUrl(item.url || '');
          const embedUrl = isVideo && isVideoUrl(item.url || '') ? getYouTubeEmbed(item.url) : null;
          const isEditing = editingId === item.id;
          
          return (
            <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="relative h-40 overflow-hidden bg-black">
                {isVideo ? (
                  embedUrl ? (
                    <iframe src={embedUrl} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope" allowFullScreen title={item.caption} />
                  ) : (
                    <video src={item.url} className="w-full h-full object-cover" muted playsInline />
                  )
                ) : (
                  <img src={item.url} alt={item.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                )}
                {isVideo && (
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full font-medium">🎬 Video</div>
                )}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEditGallery(item)}
                    className="p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    title="Edit"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteGallery(item.id)}
                    className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="p-3">
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editForm.caption}
                      onChange={(e) => setEditForm({ ...editForm, caption: e.target.value })}
                      placeholder="Caption"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Venue</option>
                      <option>Plenary Hall</option>
                      <option>Banquet</option>
                      <option>Exterior</option>
                      <option>VVIP Lounge</option>
                      <option>Hospitality</option>
                      <option>Control Room</option>
                      <option>Events</option>
                      <option>Tour</option>
                      <option>VIP</option>
                      <option>Brand</option>
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveGallery(item.id)}
                        className="flex-1 px-2 py-1 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 px-2 py-1 bg-gray-300 text-gray-700 rounded text-xs font-medium hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="font-semibold text-sm text-[#1F85A8] line-clamp-1">{item.caption || '—'}</p>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full inline-block mt-1">{item.category}</span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


function BookingCalendar({ bookings, statusColor, onSelect }: { bookings: any[]; statusColor: Record<string, string>; onSelect: (b: any) => void }) {
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  // Map each date (YYYY-MM-DD) to the bookings active that day.
  const bookingMap: Record<string, any[]> = {};
  bookings.forEach(b => {
    if (!b.startDate) return;
    const start = new Date(b.startDate);
    const end = new Date(b.endDate || b.startDate);
    const cur = new Date(start);
    while (cur <= end) {
      const key = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}-${String(cur.getDate()).padStart(2, '0')}`;
      (bookingMap[key] ||= []).push(b);
      cur.setDate(cur.getDate() + 1);
    }
  });

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="bg-gray-50 rounded-2xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 hover:bg-gray-200 rounded-lg"><ChevronLeft size={18} /></button>
        <h3 className="font-bold text-[#1F85A8]">{MONTHS[month]} {year}</h3>
        <button onClick={nextMonth} className="p-2 hover:bg-gray-200 rounded-lg"><ChevronRight size={18} /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {DAYS.map(d => <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>)}
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;
          const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayBookings = bookingMap[key] || [];
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          return (
            <div key={i} className={`min-h-[64px] sm:min-h-[84px] rounded-lg border p-1 ${isToday ? 'border-blue-400 bg-blue-50' : 'border-gray-100 bg-white'}`}>
              <div className="text-xs text-gray-500 mb-1">{day}</div>
              <div className="space-y-0.5">
                {dayBookings.slice(0, 3).map((b, idx) => (
                  <button key={idx} onClick={() => onSelect(b)} title={`${b.institutionName} — ${b.status}`}
                    className={`w-full text-left truncate px-1 py-0.5 rounded text-[10px] font-medium ${statusColor[b.status] || 'bg-gray-100 text-gray-700'}`}>
                    {b.institutionName}
                  </button>
                ))}
                {dayBookings.length > 3 && <p className="text-[10px] text-gray-400 px-1">+{dayBookings.length - 3} more</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BookingsTab() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [statusFilter, setStatusFilter] = useState('All');
  const [notesDraft, setNotesDraft] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => { api.fetchBookings().then(setBookings).catch(() => { }); }, []);

  useEffect(() => { setNotesDraft(selected?.internalNotes || ''); }, [selected]);

  const saveNotes = async () => {
    if (!selected) return;
    setSavingNotes(true);
    try {
      await api.updateBooking(selected.id, { internalNotes: notesDraft });
      const updated = await api.fetchBookings();
      setBookings(updated);
      setSelected(updated.find((b: any) => b.id === selected.id) || null);
    } finally {
      setSavingNotes(false);
    }
  };

  const filteredBookings = statusFilter === 'All'
    ? bookings
    : bookings.filter(b => b.status === statusFilter);
  const reservedCalendarBookings = bookings.filter((b) =>
    ['Pending', 'Under Review', 'Approved', 'Confirmed', 'Completed'].includes(b.status)
  );

  const handleStatusChange = async (id: string, status: string) => {
    await api.updateBookingStatus(id, status);
    
    // Auto-send email notification based on new status
    if (selected && status !== 'Pending') {
      const { sendBookingReplyEmail } = await import('../emailService');
      const statusMessages: Record<string, string> = {
        Approved: `Your booking request has been approved! We will contact you shortly with further details. Reference: ${selected.refNumber || id}`,
        Rejected: `We regret to inform you that your booking request has been declined. Please contact us for more information. Reference: ${selected.refNumber || id}`,
        Completed: `Your booking has been completed. Thank you for choosing BICC! Reference: ${selected.refNumber || id}`,
      };
      
      await sendBookingReplyEmail(
        selected.email,
        `${selected.firstName} ${selected.lastName}`,
        `Booking ${status} - [${selected.refNumber || id}]`,
        statusMessages[status] || `Your booking status has been updated to: ${status}`,
        selected.refNumber || id
      );
    }
    
    const updated = await api.fetchBookings();
    setBookings(updated);
    if (selected?.id === id) setSelected(updated.find((b: any) => b.id === id) || null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this booking request?')) {
      await api.deleteBooking(id);
      setBookings(await api.fetchBookings());
      if (selected?.id === id) setSelected(null);
    }
  };

  const handleReply = () => {
    if (!selected) return;
    setReplySubject(`Re: Booking Request [${selected.refNumber || selected.id}] — ${selected.institutionName}`);
    setReplyMessage('');
    setShowReplyForm(true);
  };

  const sendReply = async () => {
    if (!selected || !replyMessage.trim()) return;
    const { sendBookingReplyEmail } = await import('../emailService');
    const ok = await sendBookingReplyEmail(
      selected.email,
      `${selected.firstName} ${selected.lastName}`,
      replySubject,
      replyMessage,
      selected.refNumber || selected.id
    );
    if (ok) {
      // Persist the reply on the booking so it's visible on reload.
      try {
        await api.updateBooking(selected.id, {
          lastReply: replyMessage,
          lastReplySubject: replySubject,
          repliedAt: new Date().toISOString(),
        });
        const updated = await api.fetchBookings();
        setBookings(updated);
        setSelected(updated.find((b: any) => b.id === selected.id) || null);
      } catch { /* email already sent; persistence is best-effort */ }
      alert('✅ Reply sent successfully!');
      setShowReplyForm(false);
      setReplyMessage('');
    } else {
      alert('❌ Failed to send reply. Please try again.');
    }
  };

  const statusColor: Record<string, string> = {
    Pending:       'bg-yellow-100 text-yellow-800',
    'Under Review': 'bg-orange-100 text-orange-800',
    Approved:      'bg-green-100 text-green-800',
    Rejected:      'bg-red-100 text-red-800',
    Confirmed:     'bg-teal-100 text-teal-800',
    Completed:     'bg-blue-100 text-blue-800',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h2 className="text-xl font-bold text-[#1F85A8]">Booking Requests</h2>
        <div className="flex items-center gap-3 flex-wrap">
          {view === 'list' && (
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600">
              <option value="All">All statuses</option>
              {api.BOOKING_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          )}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            <button onClick={() => setView('list')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${view === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}><List size={14} /> List</button>
            <button onClick={() => setView('calendar')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${view === 'calendar' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}><Calendar size={14} /> Calendar</button>
          </div>
        </div>
      </div>
      {bookings.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-400">No booking requests yet.</p>
        </div>
      ) : view === 'calendar' ? (
        <BookingCalendar bookings={reservedCalendarBookings} statusColor={statusColor} onSelect={(b) => { setSelected(b); setView('list'); }} />
      ) : (
        <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
          {/* List */}
          <div className={`lg:col-span-1 space-y-2 max-h-[600px] overflow-y-auto admin-scrollbar ${selected ? 'max-lg:hidden' : ''}`}>
            {filteredBookings.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-6">No bookings with status "{statusFilter}".</p>
            )}
            {filteredBookings.map(b => (
              <div key={b.id} onClick={() => { setSelected(b); setShowReplyForm(false); }}
                className={`p-3 sm:p-4 rounded-xl cursor-pointer transition-all ${
                  selected?.id === b.id ? 'bg-blue-50 border-2 border-blue-300'
                  : b.status === 'Pending' ? 'bg-yellow-50 hover:bg-yellow-100 border-l-4 border-yellow-400'
                  : 'bg-gray-50 hover:bg-gray-100'
                }`}>
                <div className="flex items-center justify-between mb-1 gap-2">
                  <span className="font-semibold text-[#1F85A8] text-xs sm:text-sm truncate">{b.institutionName}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${statusColor[b.status] || 'bg-gray-100 text-gray-700'}`}>{b.status}</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 truncate">{b.firstName} {b.lastName}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-1">
                  <span>{b.eventType}</span><span>·</span>
                  <span>{b.startDate}</span>
                </div>
                {b.refNumber && <p className="text-xs text-blue-500 mt-1 font-mono truncate">{b.refNumber}</p>}
              </div>
            ))}
          </div>

          {/* Detail */}
          {selected ? (
            <div className="lg:col-span-2 bg-gray-50 rounded-xl p-4 sm:p-6 overflow-y-auto max-h-[600px] max-lg:min-h-[420px]">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="lg:hidden inline-flex items-center gap-2 text-sm text-bicc-primary font-medium mb-4 hover:underline"
              >
                <ArrowLeft size={16} />
                Back to bookings
              </button>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
                <div>
                  <h3 className="font-bold text-[#1F85A8] text-lg">{selected.institutionName}</h3>
                  {selected.refNumber && <p className="text-xs font-mono text-blue-500">{selected.refNumber}</p>}
                  <p className="text-sm text-gray-500">Submitted {new Date(selected.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleReply} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1.5 text-sm font-medium">
                    <Send size={14} /> Reply
                  </button>
                  <button onClick={() => handleDelete(selected.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Status */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-[#1F85A8] mb-1.5">Status</label>
                <div className="relative">
                  <select value={selected.status} onChange={e => handleStatusChange(selected.id, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600 appearance-none pr-8">
                    {api.BOOKING_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Last reply sent */}
              {selected.lastReply && (
                <div className="mb-5 bg-blue-50 border border-blue-100 rounded-lg p-3">
                  <p className="text-xs text-blue-700 font-medium mb-1 flex items-center gap-1.5"><Send size={12} /> Last reply sent{selected.repliedAt ? ` · ${new Date(selected.repliedAt).toLocaleDateString()}` : ''}</p>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{selected.lastReply}</p>
                </div>
              )}

              {/* Internal notes (admin only) */}
              <div className="mb-5">
                <label className="flex items-center gap-1.5 text-sm font-medium text-[#1F85A8] mb-1.5"><StickyNote size={14} /> Internal Notes <span className="text-xs font-normal text-gray-400">(staff only)</span></label>
                <textarea value={notesDraft} onChange={e => setNotesDraft(e.target.value)} rows={3}
                  placeholder="Add internal notes about this booking…"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600 resize-none" />
                <div className="flex justify-end mt-2">
                  <button onClick={saveNotes} disabled={savingNotes || notesDraft === (selected.internalNotes || '')}
                    className="px-3 py-1.5 bg-gray-700 text-white rounded-lg text-xs font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed">
                    {savingNotes ? 'Saving…' : 'Save Notes'}
                  </button>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3"><p className="text-xs text-gray-400 mb-0.5">Contact Person</p><p className="font-medium text-gray-800">{selected.firstName} {selected.lastName}</p></div>
                  <div className="bg-white rounded-lg p-3"><p className="text-xs text-gray-400 mb-0.5">Event Type</p><p className="font-medium text-gray-800">{selected.eventType === 'Other' ? selected.otherEventType : selected.eventType}</p></div>
                  <div className="bg-white rounded-lg p-3"><p className="text-xs text-gray-400 mb-0.5">Participants</p><p className="font-medium text-gray-800">{selected.participants}</p></div>
                  <div className="bg-white rounded-lg p-3"><p className="text-xs text-gray-400 mb-0.5">City</p><p className="font-medium text-gray-800">{selected.city || '—'}</p></div>
                </div>
                <div className="bg-white rounded-lg p-3"><p className="text-xs text-gray-400 mb-0.5">Email</p><p className="font-medium text-gray-800">{selected.email}</p></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3"><p className="text-xs text-gray-400 mb-0.5">Primary Phone</p><p className="font-medium text-gray-800">{selected.primaryPhone}</p></div>
                  {selected.alternatePhone && <div className="bg-white rounded-lg p-3"><p className="text-xs text-gray-400 mb-0.5">Alternate Phone</p><p className="font-medium text-gray-800">{selected.alternatePhone}</p></div>}
                </div>
                <div className="bg-white rounded-lg p-3"><p className="text-xs text-gray-400 mb-1">Event Schedule</p><p className="font-medium text-gray-800">{selected.startDate} {selected.startTime} → {selected.endDate} {selected.endTime}</p></div>
                {selected.services?.length > 0 && (
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-2">Services Required</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.services.map((s: string) => <span key={s} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">{s}</span>)}
                      {selected.otherService && <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">{selected.otherService}</span>}
                    </div>
                  </div>
                )}
                {selected.eventDescription && <div className="bg-white rounded-lg p-3"><p className="text-xs text-gray-400 mb-1">Event Description</p><p className="text-gray-700 text-sm leading-relaxed">{selected.eventDescription}</p></div>}
                {selected.specialRequirements && <div className="bg-white rounded-lg p-3"><p className="text-xs text-gray-400 mb-1">Special Requirements</p><p className="text-gray-700 text-sm leading-relaxed">{selected.specialRequirements}</p></div>}
              </div>

              {/* Reply form */}
              {showReplyForm && (
                <div className="mt-4 bg-white rounded-lg p-4 border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-[#1F85A8] flex items-center gap-2"><Send size={16} className="text-blue-600" />Reply to {selected.firstName}</h4>
                    <button onClick={() => setShowReplyForm(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                      <input type="text" value={replySubject} onChange={e => setReplySubject(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <textarea value={replyMessage} onChange={e => setReplyMessage(e.target.value)} rows={5}
                        placeholder="Type your reply here..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 text-sm resize-none" />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={sendReply} disabled={!replyMessage.trim()}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium">
                        <Send size={16} /> Send Reply
                      </button>
                      <button onClick={() => setShowReplyForm(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden lg:flex items-center justify-center bg-gray-50 rounded-xl p-10">
              <p className="text-gray-400 text-sm">Select a booking to view details</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [form, setForm] = useState<any>({
    email: '',
    username: '',
    password: '',
    role: 'Staff',
    status: 'active',
    permissions: api.ROLE_TAB_PRESETS.Staff,
  });

  useEffect(() => {
    api.fetchUsers().then(setUsers).catch(console.error);
  }, []);

  const applyRolePreset = (role: string) => {
    setForm((current: any) => ({
      ...current,
      role,
      permissions: api.ROLE_TAB_PRESETS[role] || api.ROLE_TAB_PRESETS.Staff,
    }));
  };

  const togglePermission = (tab: string) => {
    setForm((current: any) => ({
      ...current,
      permissions: current.permissions.includes(tab)
        ? current.permissions.filter((entry: any) => entry !== tab)
        : [...current.permissions, tab],
    }));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.updateUser(editingUser.id, form);
        alert('✅ User updated successfully!');
      } else {
        await api.createUser(form);
        alert('✅ User created successfully!');
      }
      setUsers(await api.fetchUsers());
      setShowForm(false);
      setEditingUser(null);
      setForm({
        email: '',
        username: '',
        password: '',
        role: 'Staff',
        status: 'active',
        permissions: api.ROLE_TAB_PRESETS.Staff,
      });
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
      password: '',
      role: user.role || 'Staff',
      status: user.status || 'active',
      permissions: user.permissions || api.ROLE_TAB_PRESETS[user.role] || api.ROLE_TAB_PRESETS.Staff,
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUser(null);
    setForm({
      email: '',
      username: '',
      password: '',
      role: 'Staff',
      status: 'active',
      permissions: api.ROLE_TAB_PRESETS.Staff,
    });
  };

  const handleDelete = async (id: number) => {
    if (confirm('Remove this user from the admin portal? They will no longer be able to log in.')) {
      await api.deleteUser(id);
      setUsers(await api.fetchUsers());
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#1F85A8]">Manage Users</h2>
          <p className="text-sm text-gray-500 mt-1">Create users, set roles, and choose which admin sections they can access</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700"><Plus size={16} /> Add User</button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-gray-50 rounded-xl p-6 mb-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-800"><strong>{editingUser ? 'Edit User:' : 'Create New User:'}</strong> {editingUser ? 'Update access, status, and profile details below.' : 'Create a new admin user and define exactly which parts of the admin they can access.'}</p>
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
              <label className="block text-sm font-medium text-[#1F85A8] mb-1">Password {editingUser ? '' : '*'}</label>
              <input
                type="password"
                required={!editingUser}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder={editingUser ? 'Leave blank to keep existing password' : '••••••••'}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              />
              <p className="text-xs text-gray-500 mt-1">{editingUser ? 'Password updates require a separate reset in Firebase Auth.' : 'Minimum 6 characters recommended'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1F85A8] mb-1">Role *</label>
              <select
                value={form.role}
                onChange={e => applyRolePreset(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option>Staff</option>
                <option>Editor</option>
                <option>Manager</option>
                <option>Super Admin</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1F85A8] mb-1">Account Status</label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-600">
                <strong>Preset behavior:</strong> changing the role loads a default access set. You can then fine-tune the pages below.
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3 gap-3">
              <div>
                <h3 className="text-sm font-semibold text-[#1F85A8]">Section Access</h3>
                <p className="text-xs text-gray-500">Choose which admin tabs this user can see.</p>
              </div>
              <button
                type="button"
                onClick={() => applyRolePreset(form.role)}
                className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
              >
                Reset to Role Preset
              </button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {Object.entries(api.ADMIN_TAB_LABELS).map(([tabKey, label]) => (
                <label key={tabKey} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.permissions.includes(tabKey)}
                    onChange={() => togglePermission(tabKey)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700">
              <strong>Roles:</strong><br />
              • <strong>Staff</strong> - Daily content operations and lighter publishing work<br />
              • <strong>Editor</strong> - Content publishing and page updates without user management or destructive access<br />
              • <strong>Manager</strong> - Broader business content and operational control<br />
              • <strong>Super Admin</strong> - Full access including user management and system-wide control
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
            <div key={user.id} className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
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
                  <span className={`text-xs px-2 py-0.5 rounded-full ${(user.status || 'active') === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {(user.status || 'active') === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Access: {(user.permissions || api.ROLE_TAB_PRESETS[user.role] || []).length} sections · Created: {new Date(user.created_at).toLocaleDateString()}
                </p>
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


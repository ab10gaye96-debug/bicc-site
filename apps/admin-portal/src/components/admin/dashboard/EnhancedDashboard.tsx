import { useState, useEffect } from 'react';
import { Calendar, BookOpen, MessageSquare, Briefcase, Plus, TrendingUp, Users, FileText } from 'lucide-react';
import * as api from '../../../api';
import KPICard from './KPICard';
import RecentActivity from './RecentActivity';
import QuickActions from './QuickActions';

interface EnhancedDashboardProps {
  onTabChange: (tab: string) => void;
}

const isThisMonth = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
};

const isUpcoming = (dateString: string): boolean => {
  return new Date(dateString) > new Date();
};

export default function EnhancedDashboard({ onTabChange }: EnhancedDashboardProps) {
  const [stats, setStats] = useState<any>(null);
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [recentContacts, setRecentContacts] = useState<any[]>([]);
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardStats, bookings, events, contacts] = await Promise.all([
        api.fetchDashboard(),
        api.fetchBookings(),
        api.fetchEvents(),
        api.fetchContacts(),
      ]);

      setStats(dashboardStats);
      setAllBookings(bookings);
      setAllEvents(events);
      setRecentContacts(contacts.filter((m: any) => !m.read).slice(0, 10));

      // Try to fetch applications if available
      try {
        const applications = await api.fetchApplications();
        setRecentApplications(applications.slice(0, 10));
      } catch {
        setRecentApplications([]);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const bookingsThisMonth = allBookings.filter(b => isThisMonth(b.created_at)).length;
  const upcomingEvents = allEvents.filter(e => isUpcoming(e.date)).length;
  const approvedBookings = allBookings.filter(b => b.status === 'Approved').length;
  const pendingBookings = allBookings.filter(b => b.status === 'Pending').length;

  const quickActions = [
    {
      label: 'New Event',
      icon: Calendar,
      onClick: () => onTabChange('events'),
      color: 'blue' as const,
      disabled: !api.canEdit(),
    },
    {
      label: 'New Booking',
      icon: BookOpen,
      onClick: () => onTabChange('bookings'),
      color: 'green' as const,
    },
    {
      label: 'Add News',
      icon: FileText,
      onClick: () => onTabChange('news'),
      color: 'purple' as const,
      disabled: !api.canEdit(),
    },
    {
      label: 'View Messages',
      icon: MessageSquare,
      onClick: () => onTabChange('contacts'),
      color: 'yellow' as const,
    },
    {
      label: 'Add Venue',
      icon: Plus,
      onClick: () => onTabChange('venues'),
      color: 'blue' as const,
      disabled: !api.canEdit(),
    },
    {
      label: 'Manage Users',
      icon: Users,
      onClick: () => onTabChange('users'),
      color: 'purple' as const,
      disabled: !api.isSuperAdmin(),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-sm text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Events"
          value={stats?.events || 0}
          icon={Calendar}
          color="blue"
          subtitle={`${upcomingEvents} upcoming`}
          onClick={() => onTabChange('events')}
          loading={loading}
        />
        <KPICard
          title="This Month Bookings"
          value={bookingsThisMonth}
          icon={BookOpen}
          color="green"
          subtitle={`${approvedBookings} approved`}
          onClick={() => onTabChange('bookings')}
          loading={loading}
          trend={{
            value: bookingsThisMonth - (stats?.pendingBookings || 0),
            label: 'from last month',
            direction: bookingsThisMonth > (stats?.pendingBookings || 0) ? 'up' : 'down',
          }}
        />
        <KPICard
          title="Messages"
          value={stats?.contacts || 0}
          icon={MessageSquare}
          color="purple"
          subtitle={`${recentContacts.length} unread`}
          onClick={() => onTabChange('contacts')}
          loading={loading}
        />
        <KPICard
          title="Pending Bookings"
          value={pendingBookings}
          icon={TrendingUp}
          color="yellow"
          subtitle="Awaiting action"
          onClick={() => onTabChange('bookings')}
          loading={loading}
        />
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <QuickActions actions={quickActions.filter(a => !a.disabled)} />
        </div>
        <div className="lg:col-span-2">
          <RecentActivity
            bookings={allBookings.slice(0, 5)}
            contacts={recentContacts}
            applications={recentApplications}
            events={allEvents.slice(0, 3)}
            maxItems={10}
          />
        </div>
      </div>

      {/* Legacy Recent Items - Keep for compatibility */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Unread Messages</h3>
          {recentContacts.length === 0 ? (
            <p className="text-gray-400 text-sm">No unread messages</p>
          ) : (
            <div className="space-y-3">
              {recentContacts.slice(0, 3).map((msg: any) => (
                <div
                  key={msg.id}
                  onClick={() => onTabChange('contacts')}
                  className="flex items-start gap-4 bg-purple-50 rounded-lg p-4 border border-purple-100 hover:bg-purple-100 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                    <MessageSquare size={16} className="text-purple-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 text-sm">{msg.name}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">{msg.subject}</p>
                    <p className="text-sm text-gray-500 line-clamp-1">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Pending Booking Requests</h3>
          {pendingBookings === 0 ? (
            <p className="text-gray-400 text-sm">No pending bookings</p>
          ) : (
            <div className="space-y-3">
              {allBookings
                .filter((b: any) => b.status === 'Pending')
                .slice(0, 3)
                .map((b: any) => (
                  <div
                    key={b.id}
                    onClick={() => onTabChange('bookings')}
                    className="flex items-start gap-4 bg-yellow-50 rounded-lg p-4 hover:bg-yellow-100 transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
                      <BookOpen size={16} className="text-yellow-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 text-sm">{b.institutionName}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(b.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {b.firstName} {b.lastName} · {b.eventType}
                      </p>
                      <p className="text-xs text-gray-500">
                        {b.startDate} → {b.endDate}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

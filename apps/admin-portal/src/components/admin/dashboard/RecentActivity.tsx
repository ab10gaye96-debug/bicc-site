import { useMemo } from 'react';
import { BookOpen, Mail, Briefcase, Calendar, FileText, Clock } from 'lucide-react';

interface Activity {
  type: 'booking' | 'contact' | 'application' | 'event' | 'other';
  time: string | Date;
  title: string;
  subtitle?: string;
  onClick?: () => void;
}

interface RecentActivityProps {
  bookings?: any[];
  contacts?: any[];
  applications?: any[];
  events?: any[];
  maxItems?: number;
}

const activityIcons = {
  booking: BookOpen,
  contact: Mail,
  application: Briefcase,
  event: Calendar,
  other: FileText,
};

const activityColors = {
  booking: 'bg-blue-50 text-blue-600',
  contact: 'bg-purple-50 text-purple-600',
  application: 'bg-green-50 text-green-600',
  event: 'bg-yellow-50 text-yellow-600',
  other: 'bg-gray-50 text-gray-600',
};

const formatTimeAgo = (date: string | Date): string => {
  const now = new Date();
  const then = new Date(date);
  const diff = now.getTime() - then.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return then.toLocaleDateString();
};

export default function RecentActivity({
  bookings = [],
  contacts = [],
  applications = [],
  events = [],
  maxItems = 10
}: RecentActivityProps) {
  const activities: Activity[] = useMemo(() => {
    const items: Activity[] = [];

    // Add bookings
    bookings.forEach(b => {
      items.push({
        type: 'booking',
        time: b.created_at || b.createdAt || new Date(),
        title: 'New booking submitted',
        subtitle: `${b.refNumber || b.institutionName || 'Unknown'}`,
      });
    });

    // Add contacts
    contacts.forEach(c => {
      items.push({
        type: 'contact',
        time: c.created_at || c.createdAt || new Date(),
        title: 'New contact message',
        subtitle: `${c.name} - ${c.subject || 'No subject'}`,
      });
    });

    // Add applications
    applications.forEach(a => {
      items.push({
        type: 'application',
        time: a.created_at || a.createdAt || new Date(),
        title: 'Career application received',
        subtitle: `${a.position || 'Position'} - ${a.firstName} ${a.lastName}`,
      });
    });

    // Add events
    events.forEach(e => {
      items.push({
        type: 'event',
        time: e.created_at || e.createdAt || new Date(),
        title: 'Event created',
        subtitle: e.title,
      });
    });

    // Sort by most recent
    return items
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, maxItems);
  }, [bookings, contacts, applications, events, maxItems]);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Clock size={20} className="text-gray-600" />
          Recent Activity
        </h3>
        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
          View all →
        </button>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">
          No recent activity
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity, index) => {
            const Icon = activityIcons[activity.type];
            const colorClass = activityColors[activity.type];

            return (
              <div
                key={index}
                onClick={activity.onClick}
                className={`flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors ${
                  activity.onClick ? 'cursor-pointer' : ''
                }`}
              >
                <div className={`w-10 h-10 ${colorClass} rounded-lg flex items-center justify-center shrink-0`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <span className="text-xs text-gray-400">{formatTimeAgo(activity.time)}</span>
                  </div>
                  {activity.subtitle && (
                    <p className="text-xs text-gray-600 mt-0.5 truncate">{activity.subtitle}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

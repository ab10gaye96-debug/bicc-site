import { ReactNode } from 'react';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  userName?: string;
  userRole: string;
  unreadCount: number;
  pendingBookings: number;
  tabs: Array<{ key: string; label: string; icon: any }>;
}

export default function AdminLayout({
  children,
  activeTab,
  onTabChange,
  onLogout,
  userName,
  userRole,
  unreadCount,
  pendingBookings,
  tabs
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader
        userName={userName || 'Admin User'}
        userRole={userRole}
        notificationCount={unreadCount + pendingBookings}
        onLogout={onLogout}
      />
      <div className="flex pt-16">
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={onTabChange}
          tabs={tabs}
          unreadCount={unreadCount}
          pendingBookings={pendingBookings}
        />
        <main className="flex-1 p-6 lg:p-8 lg:ml-64">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

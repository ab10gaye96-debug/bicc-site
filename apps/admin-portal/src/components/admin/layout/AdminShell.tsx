import { ReactNode, useEffect, useMemo, useState } from 'react';
import {
  LogOut,
  Menu,
  Search,
  X,
  ChevronRight,
  Bell,
  User,
  type LucideIcon,
} from 'lucide-react';
import { IMAGES } from '../../../images';
import { cn } from '../../../utils/cn';

export interface AdminTab {
  key: string;
  label: string;
  icon: LucideIcon;
}

interface AdminShellProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: AdminTab[];
  displayName: string;
  roleBadgeClass: string;
  roleBadgeLabel: string;
  unreadCount: number;
  pendingBookings: number;
  onLogout: () => void;
}

const NAV_GROUPS: { label: string; keys: string[] }[] = [
  { label: 'Overview', keys: ['dashboard'] },
  { label: 'Content', keys: ['settings', 'pages', 'media'] },
  { label: 'Events & Venues', keys: ['events', 'bookings', 'venues', 'gallery'] },
  { label: 'Communications', keys: ['news', 'contacts', 'subscribers'] },
  { label: 'Business', keys: ['quotations', 'pricing', 'downloads', 'careers', 'tenders'] },
  { label: 'Website', keys: ['testimonials', 'partners'] },
  { label: 'Administration', keys: ['users'] },
];

function getTabBadge(tabKey: string, unreadCount: number, pendingBookings: number): number | null {
  if (tabKey === 'contacts' && unreadCount > 0) return unreadCount;
  if (tabKey === 'bookings' && pendingBookings > 0) return pendingBookings;
  return null;
}

export default function AdminShell({
  children,
  activeTab,
  onTabChange,
  tabs,
  displayName,
  roleBadgeClass,
  roleBadgeLabel,
  unreadCount,
  pendingBookings,
  onLogout,
}: AdminShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [navQuery, setNavQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const tabMap = useMemo(() => new Map(tabs.map((tab) => [tab.key, tab])), [tabs]);

  const groupedNav = useMemo(() => {
    const query = navQuery.trim().toLowerCase();
    return NAV_GROUPS.map((group) => ({
      ...group,
      items: group.keys
        .map((key) => tabMap.get(key))
        .filter((tab): tab is AdminTab => Boolean(tab))
        .filter((tab) => !query || tab.label.toLowerCase().includes(query)),
    })).filter((group) => group.items.length > 0);
  }, [navQuery, tabMap]);

  const activeTabMeta = tabMap.get(activeTab);
  const notificationTotal = unreadCount + pendingBookings;

  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileNavOpen]);

  const handleTabSelect = (key: string) => {
    onTabChange(key);
    setMobileNavOpen(false);
    setNavQuery('');
  };

  const renderNavButton = (tab: AdminTab, compact = false) => {
    const isActive = activeTab === tab.key;
    const badge = getTabBadge(tab.key, unreadCount, pendingBookings);
    const Icon = tab.icon;

    return (
      <button
        key={tab.key}
        type="button"
        onClick={() => handleTabSelect(tab.key)}
        className={cn(
          'group w-full flex items-center gap-3 rounded-xl text-sm font-medium transition-all',
          compact ? 'px-3 py-2.5' : 'px-3.5 py-2.5',
          isActive
            ? 'bg-bicc-primary text-white shadow-md shadow-bicc-primary/20'
            : 'text-slate-700 hover:bg-slate-100',
        )}
      >
        <Icon size={18} className="shrink-0" />
        <span className="flex-1 text-left truncate">{tab.label}</span>
        {badge !== null && (
          <span
            className={cn(
              'min-w-[1.25rem] h-5 px-1.5 rounded-full text-[11px] font-bold flex items-center justify-center',
              isActive ? 'bg-white text-bicc-primary' : tab.key === 'contacts' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white',
            )}
          >
            {badge > 9 ? '9+' : badge}
          </span>
        )}
        {!compact && (
          <ChevronRight
            size={14}
            className={cn('shrink-0 opacity-0 group-hover:opacity-60 transition-opacity', isActive && 'opacity-80')}
          />
        )}
      </button>
    );
  };

  const renderNavGroups = (compact = false) => (
    <div className="space-y-5">
      {groupedNav.map((group) => (
        <div key={group.label}>
          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {group.label}
          </p>
          <div className="space-y-1">{group.items.map((tab) => renderNavButton(tab, compact))}</div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-white border border-bicc-primary/15 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                <img src={IMAGES.logo} alt="BICC" className="w-8 h-8 object-contain" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-bicc-primary truncate">BICC Admin</p>
                <p className="text-xs text-slate-500 truncate hidden sm:block">
                  {activeTabMeta?.label || 'Control panel'}
                </p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            {unreadCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-medium border border-red-100">
                <Bell size={12} />
                {unreadCount} unread
              </span>
            )}
            {pendingBookings > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-medium border border-amber-100">
                {pendingBookings} pending
              </span>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen((open) => !open)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-bicc-primary to-blue-700 flex items-center justify-center shrink-0">
                <User size={16} className="text-white" />
              </div>
              <div className="hidden sm:block text-left min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate max-w-[120px] md:max-w-[160px]">{displayName}</p>
                <span className={cn('inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold', roleBadgeClass)}>
                  {roleBadgeLabel}
                </span>
              </div>
            </button>

            {userMenuOpen && (
              <>
                <button
                  type="button"
                  className="fixed inset-0 z-40"
                  aria-label="Close user menu"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-xl py-2 z-50">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-800 truncate">{displayName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{roleBadgeLabel}</p>
                    {notificationTotal > 0 && (
                      <p className="text-xs text-slate-500 mt-2">{notificationTotal} items need attention</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="pt-16 lg:pl-72">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex lg:flex-col fixed left-0 top-16 bottom-0 w-72 border-r border-slate-200 bg-white z-30">
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={navQuery}
                onChange={(e) => setNavQuery(e.target.value)}
                placeholder="Search sections..."
                className="admin-input pl-9 py-2.5 text-sm"
              />
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto p-4 admin-scrollbar">{renderNavGroups()}</nav>
        </aside>

        {/* Mobile drawer */}
        {mobileNavOpen && (
          <div className="lg:hidden fixed inset-0 z-[60]">
            <button
              type="button"
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
              aria-label="Close navigation menu"
              onClick={() => setMobileNavOpen(false)}
            />
            <aside className="absolute inset-y-0 left-0 w-[min(100vw-3rem,320px)] bg-white shadow-2xl flex flex-col animate-slide-in-left">
              <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
                <div>
                  <p className="font-bold text-bicc-primary">Navigation</p>
                  <p className="text-xs text-slate-500">{tabs.length} sections available</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileNavOpen(false)}
                  className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-600"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 border-b border-slate-100">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    value={navQuery}
                    onChange={(e) => setNavQuery(e.target.value)}
                    placeholder="Search sections..."
                    className="admin-input pl-9 py-2.5 text-sm"
                    autoFocus
                  />
                </div>
              </div>
              <nav className="flex-1 overflow-y-auto p-4 admin-scrollbar">{renderNavGroups(true)}</nav>
              <div className="p-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Main content */}
        <main className="min-h-[calc(100vh-4rem)]">
          <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8 max-w-[1400px] mx-auto">
            <div className="admin-panel animate-fade-in-up">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}

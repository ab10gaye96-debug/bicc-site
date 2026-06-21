import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Search,
  ChevronDown,
  Building2,
  Package,
  Calendar,
  Globe2,
  Download,
  Briefcase,
  FileText,
  ClipboardCheck,
  type LucideIcon,
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import TopBar from './TopBar';
import { usePageContent } from '../hooks/usePageContent';
import {
  DEFAULT_NAV_LINKS,
  DEFAULT_VENUES_DROPDOWN,
  DEFAULT_RESOURCES_DROPDOWN,
  resolveLinks,
  type NavDropdownLink,
} from '../contentDefaults';

const NAV_ICON_MAP: Record<string, LucideIcon> = {
  Building2,
  Package,
  Calendar,
  Globe2,
  Download,
  Briefcase,
  FileText,
  ClipboardCheck,
};

function getDropdownIcon(iconName?: string): LucideIcon {
  return NAV_ICON_MAP[iconName || ''] || Building2;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showVenuesMenu, setShowVenuesMenu] = useState(false);
  const [showMobileVenues, setShowMobileVenues] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: cmsContent } = usePageContent('navbar');
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navLinks = resolveLinks(cmsContent?.navLinks, DEFAULT_NAV_LINKS);
  const venuesDropdown = resolveLinks(cmsContent?.venuesDropdown, DEFAULT_VENUES_DROPDOWN) as NavDropdownLink[];
  const resourcesDropdown = resolveLinks(cmsContent?.resourcesDropdown, DEFAULT_RESOURCES_DROPDOWN) as NavDropdownLink[];

  const venuesMenuLabel = cmsContent?.labels?.venues || 'Venues';
  const resourcesMenuLabel = cmsContent?.labels?.resources || 'Resources';
  const bookButtonText = cmsContent?.bookButton?.text || 'Book an Event';
  const searchPlaceholder = cmsContent?.search?.placeholder || 'Search...';

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowVenuesMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setShowVenuesMenu(false);
    setIsOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const venuesPaths = venuesDropdown.map((item) => item.path);
  const resourcesPaths = resourcesDropdown.map((item) => item.path);
  const isVenuesActive = venuesPaths.includes(location.pathname);
  const isResourcesActive = resourcesPaths.some((path) => location.pathname.startsWith(path));

  const [showResourcesMenu, setShowResourcesMenu] = useState(false);
  const [showMobileResources, setShowMobileResources] = useState(false);
  const resourcesRef = useRef<HTMLDivElement>(null);

  // Close resources dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (resourcesRef.current && !resourcesRef.current.contains(e.target as Node)) {
        setShowResourcesMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <TopBar />
      <nav className={`transition-all duration-300 ${isHome ? 'bg-[#1F85A8]/95 backdrop-blur-md border-b border-white/15' : 'bg-[#1F85A8] shadow-xl shadow-slate-900/15 border-b border-white/10'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2.5 sm:py-3 gap-4">
          {/* Logo — full BICC mark (same as admin portal) */}
          <BrandLogo />

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Home & About */}
            {navLinks.slice(0, 2).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.path
                    ? 'text-white bg-white/20'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Venues dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowVenuesMenu(v => !v)}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isVenuesActive || showVenuesMenu
                    ? 'text-white bg-white/20'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {venuesMenuLabel}
                <ChevronDown size={14} className={`transition-transform duration-200 ${showVenuesMenu ? 'rotate-180' : ''}`} />
              </button>

              {showVenuesMenu && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                  {venuesDropdown.map((item) => {
                    const Icon = getDropdownIcon(item.icon);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-start gap-3 px-4 py-3.5 hover:bg-blue-50 transition-colors ${
                          location.pathname === item.path ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                          <Icon size={15} className="text-blue-700" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1F85A8]">{item.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Events, Gallery, News links */}
            {navLinks.slice(2, 5).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.path
                    ? 'text-white bg-white/20'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Resources dropdown */}
            <div className="relative" ref={resourcesRef}>
              <button
                onClick={() => setShowResourcesMenu(v => !v)}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isResourcesActive || showResourcesMenu
                    ? 'text-white bg-white/20'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {resourcesMenuLabel}
                <ChevronDown size={14} className={`transition-transform duration-200 ${showResourcesMenu ? 'rotate-180' : ''}`} />
              </button>

              {showResourcesMenu && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                  {resourcesDropdown.map((item) => {
                    const Icon = getDropdownIcon(item.icon);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-start gap-3 px-4 py-3.5 hover:bg-blue-50 transition-colors ${
                          location.pathname.startsWith(item.path) ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                          <Icon size={15} className="text-blue-700" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1F85A8]">{item.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Contact link */}
            {navLinks.slice(5).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.path
                    ? 'text-white bg-white/20'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Search icon */}
            <button onClick={() => setShowSearch(s => !s)}
              className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all ml-1"
              aria-label="Search">
              <Search size={18} />
            </button>
            <Link
              to="/booking"
              className="ml-2 px-5 py-2.5 bg-white text-[#1F85A8] rounded-lg text-sm font-bold hover:bg-gray-100 transition-all shadow-lg"
            >
              {bookButtonText}
            </Link>
          </div>

          {/* Mobile: search + menu */}
          <div className="lg:hidden flex items-center gap-2">
            <button onClick={() => setShowSearch(s => !s)}
              className="text-white p-2 rounded-lg hover:bg-white/10" aria-label="Search">
              <Search size={20} />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2 rounded-lg hover:bg-white/10"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Search bar dropdown */}
        {showSearch && (
          <div className="pb-4">
            <form onSubmit={handleSearch} className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                autoFocus
                className="w-full pl-9 pr-24 py-2.5 rounded-xl bg-white text-gray-800 text-sm outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700">
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="lg:hidden bg-[#1F85A8]/95 backdrop-blur-lg border-t border-white/10">
          <div className="px-4 py-4 space-y-1">
            {navLinks.slice(0, 2).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === link.path
                    ? 'text-white bg-white/20'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Venues accordion */}
            <div>
              <button
                onClick={() => setShowMobileVenues(v => !v)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isVenuesActive ? 'text-white bg-white/20' : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {venuesMenuLabel}
                <ChevronDown size={14} className={`transition-transform duration-200 ${showMobileVenues ? 'rotate-180' : ''}`} />
              </button>
              {showMobileVenues && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-white/20 pl-4">
                  {venuesDropdown.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`block px-3 py-2 rounded-lg text-sm transition-all ${
                        location.pathname === item.path
                          ? 'text-white bg-white/20'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Events, Gallery, News */}
            {navLinks.slice(2, 5).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === link.path
                    ? 'text-white bg-white/20'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Resources accordion */}
            <div>
              <button
                onClick={() => setShowMobileResources(v => !v)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isResourcesActive ? 'text-white bg-white/20' : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {resourcesMenuLabel}
                <ChevronDown size={14} className={`transition-transform duration-200 ${showMobileResources ? 'rotate-180' : ''}`} />
              </button>
              {showMobileResources && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-white/20 pl-4">
                  {resourcesDropdown.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`block px-3 py-2 rounded-lg text-sm transition-all ${
                        location.pathname.startsWith(item.path)
                          ? 'text-white bg-white/20'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Contact */}
            {navLinks.slice(5).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === link.path
                    ? 'text-white bg-white/20'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <Link
              to="/booking"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 bg-white text-[#1F85A8] rounded-lg text-sm font-bold text-center mt-3"
            >
              {bookButtonText}
            </Link>
          </div>
        </div>
      )}
      </nav>
    </header>
  );
}

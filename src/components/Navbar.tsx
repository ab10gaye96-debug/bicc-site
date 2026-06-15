import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ChevronDown, Building2, Package, Calendar, Globe2, Download, Briefcase, FileText, ClipboardCheck } from 'lucide-react';
import { IMAGES } from '../images';
import { useSiteSettings } from '../hooks/useSiteSettings';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Events', path: '/events' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'News', path: '/news' },
  { name: 'Contact', path: '/contact' },
];

const venuesDropdown = [
  { name: 'Our Venues', path: '/venues', icon: Building2, desc: 'Explore all event spaces' },
  { name: 'Services & Packages', path: '/services', icon: Package, desc: 'Conference & banquet packages' },
  { name: 'Check Availability', path: '/availability', icon: Calendar, desc: 'View open dates' },
];

const resourcesDropdown = [
  { name: 'Destination Gambia', path: '/destination', icon: Globe2, desc: 'Explore The Gambia' },
  { name: 'Plan Your Event', path: '/plan-your-event', icon: ClipboardCheck, desc: 'Event planning guide' },
  { name: 'Downloads', path: '/downloads', icon: Download, desc: 'Brochures & documents' },
  { name: 'Careers', path: '/careers', icon: Briefcase, desc: 'Join our team' },
  { name: 'Procurement', path: '/procurement', icon: FileText, desc: 'Tenders & opportunities' },
];

const adminPortalUrl = import.meta.env.VITE_ADMIN_PORTAL_URL?.trim();
const embeddedAdminEnabled =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_EMBEDDED_ADMIN === 'true';

export default function Navbar() {
  const { settings } = useSiteSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showVenuesMenu, setShowVenuesMenu] = useState(false);
  const [showMobileVenues, setShowMobileVenues] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const isVenuesActive = ['/venues', '/services', '/availability'].includes(location.pathname);
  const isResourcesActive = ['/destination', '/plan-your-event', '/downloads', '/careers', '/procurement'].some(p => location.pathname.startsWith(p));
  
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isHome ? 'bg-[#1F85A8]/80 backdrop-blur-md' : 'bg-[#1F85A8] shadow-lg'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={IMAGES.logo} alt="BICC Logo" className="h-12 w-auto rounded-md bg-white p-1 object-contain" />
            <div>
              <span className="text-white font-bold text-lg tracking-wide">{settings.siteName}</span>
              <span className="hidden sm:block text-white/80 text-xs tracking-wider">{settings.siteTagline}</span>
            </div>
          </Link>

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
                Venues
                <ChevronDown size={14} className={`transition-transform duration-200 ${showVenuesMenu ? 'rotate-180' : ''}`} />
              </button>

              {showVenuesMenu && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                  {venuesDropdown.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-start gap-3 px-4 py-3.5 hover:bg-blue-50 transition-colors ${
                        location.pathname === item.path ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                        <item.icon size={15} className="text-blue-700" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1F85A8]">{item.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                      </div>
                    </Link>
                  ))}
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
                Resources
                <ChevronDown size={14} className={`transition-transform duration-200 ${showResourcesMenu ? 'rotate-180' : ''}`} />
              </button>

              {showResourcesMenu && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                  {resourcesDropdown.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-start gap-3 px-4 py-3.5 hover:bg-blue-50 transition-colors ${
                        location.pathname.startsWith(item.path) ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                        <item.icon size={15} className="text-blue-700" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1F85A8]">{item.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                      </div>
                    </Link>
                  ))}
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
              Book an Event
            </Link>
            {(adminPortalUrl || embeddedAdminEnabled) && (
              adminPortalUrl ? (
                <a
                  href={adminPortalUrl}
                  className="ml-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-bold hover:from-blue-400 hover:to-blue-600 transition-all shadow-lg shadow-blue-600/20"
                >
                  Admin
                </a>
              ) : (
                <Link
                  to="/admin"
                  className="ml-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-bold hover:from-blue-400 hover:to-blue-600 transition-all shadow-lg shadow-blue-600/20"
                >
                  Admin
                </Link>
              )
            )}
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
                placeholder="Search events, news..."
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
                Venues
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
                Resources
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
              Book an Event
            </Link>
            {(adminPortalUrl || embeddedAdminEnabled) && (
              adminPortalUrl ? (
                <a
                  href={adminPortalUrl}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-bold text-center mt-2"
                >
                  Admin Panel
                </a>
              ) : (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-bold text-center mt-2"
                >
                  Admin Panel
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export interface NavLink {
  name: string;
  path: string;
}

export interface NavDropdownLink extends NavLink {
  desc: string;
  icon: string;
}

export const DEFAULT_NAV_LINKS: NavLink[] = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Events', path: '/events' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'News', path: '/news' },
  { name: 'Contact', path: '/contact' },
];

export const DEFAULT_VENUES_DROPDOWN: NavDropdownLink[] = [
  { name: 'Our Venues', path: '/venues', icon: 'Building2', desc: 'Explore all event spaces' },
  { name: 'Services & Packages', path: '/services', icon: 'Package', desc: 'Conference & banquet packages' },
  { name: 'Check Availability', path: '/availability', icon: 'Calendar', desc: 'View open dates' },
];

export const DEFAULT_RESOURCES_DROPDOWN: NavDropdownLink[] = [
  { name: 'Destination Gambia', path: '/destination', icon: 'Globe2', desc: 'Explore The Gambia' },
  { name: 'Plan Your Event', path: '/plan-your-event', icon: 'ClipboardCheck', desc: 'Event planning guide' },
  { name: 'Downloads', path: '/downloads', icon: 'Download', desc: 'Brochures & documents' },
  { name: 'Careers', path: '/careers', icon: 'Briefcase', desc: 'Join our team' },
  { name: 'Procurement', path: '/procurement', icon: 'FileText', desc: 'Tenders & opportunities' },
];

export const DEFAULT_FOOTER_QUICK_LINKS: NavLink[] = [
  { name: 'About Us', path: '/about' },
  { name: 'Our Venues', path: '/venues' },
  { name: 'Services & Packages', path: '/services' },
  { name: 'Upcoming Events', path: '/events' },
  { name: 'Photo Gallery', path: '/gallery' },
  { name: 'Latest News', path: '/news' },
  { name: 'Contact Us', path: '/contact' },
];

export const DEFAULT_FOOTER_RESOURCE_LINKS: NavLink[] = [
  { name: 'Destination Gambia', path: '/destination' },
  { name: 'Plan Your Event', path: '/plan-your-event' },
  { name: 'Downloads Centre', path: '/downloads' },
  { name: 'Careers', path: '/careers' },
  { name: 'Procurement & Tenders', path: '/procurement' },
  { name: 'Book an Event', path: '/booking' },
];

export function resolveLinks<T extends NavLink>(cmsLinks: T[] | undefined, defaults: T[]): T[] {
  if (!Array.isArray(cmsLinks) || cmsLinks.length === 0) return defaults;
  return cmsLinks.filter((link) => link?.name && link?.path) as T[];
}

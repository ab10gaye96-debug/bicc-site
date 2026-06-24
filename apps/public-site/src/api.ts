import { db } from './firebase';
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
} from 'firebase/firestore';

// ────────────────────────────────────────────────────────────────────────────
// PUBLIC API - Read-only data fetching + form submissions
// ────────────────────────────────────────────────────────────────────────────

// ── Site Settings (Read Only) ────────────────────────────────────────────────

export interface SiteSettings {
  showHeroSection: boolean;
  showAboutSection: boolean;
  showStatsSection: boolean;
  showVenuesSection: boolean;
  showEventsSection: boolean;
  showServicesSection: boolean;
  showDestinationSection: boolean;
  showGallerySection: boolean;
  showPartnersSection: boolean;
  showTestimonialsSection: boolean;
  showContactSection: boolean;
  showFooter: boolean;
}

const DEFAULT_VISIBILITY: SiteSettings = {
  showHeroSection: true,
  showAboutSection: true,
  showStatsSection: true,
  showVenuesSection: true,
  showEventsSection: true,
  showServicesSection: true,
  showDestinationSection: true,
  showGallerySection: true,
  showPartnersSection: true,
  showTestimonialsSection: true,
  showContactSection: true,
  showFooter: true,
};

export async function fetchSiteSettings(): Promise<SiteSettings> {
  try {
    const docRef = doc(db, 'siteSettings', 'general');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        showHeroSection: data.showHeroSection ?? true,
        showAboutSection: data.showAboutSection ?? true,
        showStatsSection: data.showStatsSection ?? true,
        showVenuesSection: data.showVenuesSection ?? true,
        showEventsSection: data.showEventsSection ?? true,
        showServicesSection: data.showServicesSection ?? true,
        showDestinationSection: data.showDestinationSection ?? true,
        showGallerySection: data.showGallerySection ?? true,
        showPartnersSection: data.showPartnersSection ?? true,
        showTestimonialsSection: data.showTestimonialsSection ?? true,
        showContactSection: data.showContactSection ?? true,
        showFooter: data.showFooter ?? true,
      };
    }
    return DEFAULT_VISIBILITY;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return DEFAULT_VISIBILITY;
  }
}

// ── Events (Read Only) ────────────────────────────────────────────────────────

export async function fetchEvents(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'events'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

// ── Venues (Read Only) ────────────────────────────────────────────────────────

export async function fetchVenues(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'venues'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

export const FALLBACK_BOOKABLE_VENUES = [
  { id: 'plenary-hall', name: 'Plenary Hall', capacity: '1,013 seats' },
  { id: 'banquet-hall-a', name: 'Banquet Hall A', capacity: '500 guests' },
  { id: 'banquet-hall-b', name: 'Banquet Hall B', capacity: '250 guests' },
  { id: 'meeting-room-1', name: 'Meeting Room 1', capacity: '50 people' },
  { id: 'meeting-room-2', name: 'Meeting Room 2', capacity: '50 people' },
  { id: 'meeting-room-3', name: 'Meeting Room 3', capacity: '50 people' },
  { id: 'meeting-room-4', name: 'Meeting Room 4', capacity: '50 people' },
  { id: 'vvip-lounge', name: 'VVIP Lounge', capacity: '100 people' },
  { id: 'outdoor-space', name: 'Outdoor Space', capacity: 'Flexible' },
];

export async function fetchBookableVenues(): Promise<{ id: string; name: string; capacity: string }[]> {
  const venues = await fetchVenues();
  if (venues.length === 0) return FALLBACK_BOOKABLE_VENUES;
  return venues.map((v) => ({
    id: v.id,
    name: v.name,
    capacity: v.capacity || '',
  }));
}

// ── Gallery (Read Only) ───────────────────────────────────────────────────────

export async function fetchGallery(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'gallery'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

// ── News (Read Only) ──────────────────────────────────────────────────────────

export async function fetchNews(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'news'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

// ── Hotels (Read Only) ────────────────────────────────────────────────────────

export async function fetchHotels(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'hotels'));
  return snap.docs
    .map((entry) => ({ id: entry.id, ...entry.data() }))
    .filter((h) => h.active !== false)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

// ── Bookable Venues (with fallback) ───────────────────────────────────────────

// ── Downloads (Read Only) ─────────────────────────────────────────────────────

export async function fetchDownloads(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'downloads'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

// ── Vacancies / Careers (Read Only) ──────────────────────────────────────────

export async function fetchVacancies(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'vacancies'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

// ── Tenders / Procurement (Read Only) ────────────────────────────────────────

export async function fetchTenders(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'tenders'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

// ── Testimonials (Read Only) ──────────────────────────────────────────────────

export async function fetchTestimonials(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'testimonials'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

// ── Partners (Read Only) ──────────────────────────────────────────────────────

export async function fetchPartners(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'partners'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

// ── Bookings (Public Submission & Availability Check) ────────────────────────

export async function submitBooking(data: any): Promise<any> {
  if (!Array.isArray(data?.venues) || data.venues.length === 0) {
    throw new Error('Please select at least one venue before submitting your booking request.');
  }

  const conflicts = await checkAvailability(
    data.startDate,
    data.endDate || data.startDate,
    data.venues || [],
    data.startTime || '',
    data.endTime || ''
  );

  if (conflicts.length > 0) {
    throw new Error('That venue is already reserved for the selected date and time. Please choose a different slot.');
  }

  const bookingData = {
    ...data,
    created_at: new Date().toISOString(),
    read: false,
    status: 'Pending',
  };
  const docRef = await addDoc(collection(db, 'bookings'), bookingData);
  return { id: docRef.id, ...bookingData };
}

export async function fetchBookings(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'bookings'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

/** Ordered booking lifecycle statuses */
export const BOOKING_STATUSES = [
  'Pending',
  'Under Review',
  'Approved',
  'Rejected',
  'Confirmed',
  'Completed',
] as const;

/** Statuses that block a venue from being available */
export const RESERVED_BOOKING_STATUSES = ['Pending', 'Under Review', 'Approved', 'Confirmed', 'Completed'];

function normaliseDateTime(date: string, time: string | undefined, fallback: 'start' | 'end'): number {
  if (!date) return Number.NaN;
  const safeTime = time || (fallback === 'end' ? '23:59' : '00:00');
  return new Date(`${date}T${safeTime}:00`).getTime();
}

function dateTimeRangesOverlap(
  aStartDate: string,
  aEndDate: string,
  aStartTime: string | undefined,
  aEndTime: string | undefined,
  bStartDate: string,
  bEndDate: string,
  bStartTime: string | undefined,
  bEndTime: string | undefined
): boolean {
  if (!aStartDate || !bStartDate) return false;

  const aStart = normaliseDateTime(aStartDate, aStartTime, 'start');
  const aEnd = normaliseDateTime(aEndDate || aStartDate, aEndTime, 'end');
  const bStart = normaliseDateTime(bStartDate, bStartTime, 'start');
  const bEnd = normaliseDateTime(bEndDate || bStartDate, bEndTime, 'end');

  return aStart <= bEnd && bStart <= aEnd;
}

function venuesOverlap(requestedVenues: string[] = [], existingVenues: string[] = []): boolean {
  if (!requestedVenues.length || !existingVenues.length) return false;
  return existingVenues.some((venue) => requestedVenues.includes(venue));
}

/**
 * Check if venues are available for the given date range.
 * Returns conflicting bookings if any.
 */
export async function checkAvailability(
  startDate: string,
  endDate: string,
  venues: string[] = [],
  startTime?: string,
  endTime?: string,
  excludeId?: string
): Promise<any[]> {
  if (!startDate || !venues.length) return [];
  const snap = await getDocs(collection(db, 'bookings'));
  const bookings: any[] = snap.docs.map((entry) => ({ id: entry.id, ...(entry.data() as any) }));
  
  return bookings.filter((b) => {
    if (excludeId && b.id === excludeId) return false;
    if (!RESERVED_BOOKING_STATUSES.includes(b.status)) return false;
    if (!Array.isArray(b.venues) || !b.venues.length) return false;
    if (!venuesOverlap(venues, b.venues)) return false;
    return dateTimeRangesOverlap(
      startDate,
      endDate || startDate,
      startTime,
      endTime,
      b.startDate,
      b.endDate || b.startDate,
      b.startTime,
      b.endTime
    );
  });
}

// ── Contacts (Public Submission) ──────────────────────────────────────────────

export async function submitContact(data: any): Promise<any> {
  const contactData = { ...data, created_at: new Date().toISOString(), read: false };
  const docRef = await addDoc(collection(db, 'contacts'), contactData);
  return { id: docRef.id, ...contactData };
}

// ── Job Applications (Public Submission) ──────────────────────────────────────

export async function createApplication(data: any): Promise<any> {
  const applicationData = {
    ...data,
    created_at: new Date().toISOString(),
    status: 'New',
  };
  const docRef = await addDoc(collection(db, 'applications'), applicationData);
  return { id: docRef.id, ...applicationData };
}

// ── Newsletter Subscription (Public Submission) ───────────────────────────────

export async function subscribeNewsletter(email: string, name?: string): Promise<any> {
  const subscriberData = {
    email,
    name: name || '',
    subscribed_at: new Date().toISOString(),
    status: 'active',
  };
  const docRef = await addDoc(collection(db, 'subscribers'), subscriberData);
  return { id: docRef.id, ...subscriberData };
}

// ── Search (Read Only) ────────────────────────────────────────────────────────

export async function searchContent(query: string): Promise<{
  events: any[];
  news: any[];
  venues: any[];
}> {
  const [events, news, venues] = await Promise.all([
    fetchEvents(),
    fetchNews(),
    fetchVenues(),
  ]);

  const lowerQuery = query.toLowerCase();

  return {
    events: events.filter(e =>
      e.title?.toLowerCase().includes(lowerQuery) ||
      e.description?.toLowerCase().includes(lowerQuery)
    ),
    news: news.filter(n =>
      n.title?.toLowerCase().includes(lowerQuery) ||
      n.content?.toLowerCase().includes(lowerQuery)
    ),
    venues: venues.filter(v =>
      v.name?.toLowerCase().includes(lowerQuery) ||
      v.description?.toLowerCase().includes(lowerQuery)
    ),
  };
}


// ── Content Management (Read Only) ───────────────────────────────────────────

/**
 * Fetch page content from Firestore CMS
 * Falls back to null if not found - components handle defaults
 */
export async function fetchPageContent(section: string): Promise<any> {
  try {
    const docRef = doc(db, 'pageContent', section);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching ${section} content:`, error);
    return null;
  }
}

/**
 * Fetch venue capacity table from pageContent
 */
export async function fetchVenueCapacity(): Promise<any[]> {
  try {
    const data = await fetchPageContent('venuesPage');
    if (data?.capacityTable && Array.isArray(data.capacityTable)) {
      return data.capacityTable;
    }
    // Return default capacity data if not found
    return [
      { space: 'Plenary Hall', capacity: '1,013 seats' },
      { space: 'Banquet Hall A', capacity: '500 guests' },
      { space: 'Banquet Hall B', capacity: '250 guests' },
      { space: '4 Thematic Rooms', capacity: '200 each' },
      { space: '11 Bilateral Rooms', capacity: '25 each' },
      { space: '4 Press Rooms', capacity: '40 each' },
      { space: 'Cafeteria', capacity: '40 guests' },
    ];
  } catch (error) {
    console.error('Error fetching venue capacity:', error);
    return [
      { space: 'Plenary Hall', capacity: '1,013 seats' },
      { space: 'Banquet Hall A', capacity: '500 guests' },
      { space: 'Banquet Hall B', capacity: '250 guests' },
      { space: '4 Thematic Rooms', capacity: '200 each' },
      { space: '11 Bilateral Rooms', capacity: '25 each' },
      { space: '4 Press Rooms', capacity: '40 each' },
      { space: 'Cafeteria', capacity: '40 guests' },
    ];
  }
}

/**
 * Convenience functions for specific sections
 */
export const fetchHomeContent = () => fetchPageContent('home');
export const fetchFooterContent = () => fetchPageContent('footer');
export const fetchNavbarContent = () => fetchPageContent('navbar');
export const fetchContactContent = () => fetchPageContent('contact');


// ── Team & Board Members (Read Only) ──────────────────────────────────────────

export async function fetchTeamMembers(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'teamMembers'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() })).sort((a, b) => (a.order || 0) - (b.order || 0));
}

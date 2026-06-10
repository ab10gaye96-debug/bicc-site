import { db } from './firebase';
import {
  collection,
  getDocs,
  addDoc,
} from 'firebase/firestore';

// ────────────────────────────────────────────────────────────────────────────
// PUBLIC API - Read-only data fetching + form submissions
// ────────────────────────────────────────────────────────────────────────────

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
const BLOCKING_STATUSES = ['Under Review', 'Approved', 'Confirmed', 'Completed'];

function datesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  if (!aStart || !bStart) return false;
  const aS = new Date(aStart).getTime();
  const aE = new Date(aEnd || aStart).getTime();
  const bS = new Date(bStart).getTime();
  const bE = new Date(bEnd || bStart).getTime();
  return aS <= bE && bS <= aE;
}

/**
 * Check if venues are available for the given date range.
 * Returns conflicting bookings if any.
 */
export async function checkAvailability(
  startDate: string,
  endDate: string,
  venues: string[] = [],
  excludeId?: string
): Promise<any[]> {
  if (!startDate) return [];
  const snap = await getDocs(collection(db, 'bookings'));
  const bookings = snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
  
  return bookings.filter((b) => {
    if (excludeId && b.id === excludeId) return false;
    if (!BLOCKING_STATUSES.includes(b.status)) return false;
    if (!datesOverlap(startDate, endDate, b.startDate, b.endDate)) return false;
    // If no specific venues requested on either side, a date overlap is a conflict.
    if (!venues.length || !Array.isArray(b.venues) || !b.venues.length) return true;
    return b.venues.some((v: string) => venues.includes(v));
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

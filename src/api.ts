import { db, auth } from './firebase';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { sendBookingStatusEmail } from './emailService';
// ── Auth ──────────────────────────────────────────────────────────────────────

/**
 * Login with email OR username.
 * - If the input looks like an email, use it directly.
 * - Otherwise, look up the email from the Firestore users collection first.
 * After login, fetches the user's role from Firestore and saves it to localStorage.
 */
export async function loginAdmin(
  emailOrUsername: string,
  password: string
): Promise<boolean> {
  try {
    let email = emailOrUsername;

    // Fix 6: support username login by looking up email in Firestore
    if (!emailOrUsername.includes('@')) {
      const q = query(
        collection(db, 'users'),
        where('username', '==', emailOrUsername)
      );
      const snap = await getDocs(q);
      if (snap.empty) return false;
      email = snap.docs[0].data().email;
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();

    localStorage.setItem('bicc_token', token);
    localStorage.setItem('bicc_username', userCredential.user.email || '');

    // Fix 1: fetch and save the user's role after login
    const q = query(
      collection(db, 'users'),
      where('email', '==', userCredential.user.email)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const userData = snapshot.docs[0].data();
      localStorage.setItem('bicc_user_role', userData.role || 'Staff');
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function verifyToken(): Promise<boolean> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(!!user);
    });
  });
}

// Fix 2: clear role on logout
export function logoutAdmin() {
  signOut(auth).catch(console.error);
  localStorage.removeItem('bicc_token');
  localStorage.removeItem('bicc_username');
  localStorage.removeItem('bicc_user_role');
}

export function isAdminLoggedIn(): boolean {
  return !!localStorage.getItem('bicc_token');
}

// ── Events ────────────────────────────────────────────────────────────────────

export async function fetchEvents(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'events'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

export async function createEvent(data: any): Promise<any> {
  const docRef = await addDoc(collection(db, 'events'), data);
  return { id: docRef.id, ...data };
}

export async function updateEvent(id: string | number, data: any): Promise<void> {
  await updateDoc(doc(db, 'events', id.toString()), data);
}

export async function deleteEvent(id: string | number): Promise<void> {
  await deleteDoc(doc(db, 'events', id.toString()));
}

// ── Venues ────────────────────────────────────────────────────────────────────

export async function fetchVenues(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'venues'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

export async function createVenue(data: any): Promise<any> {
  const docRef = await addDoc(collection(db, 'venues'), data);
  return { id: docRef.id, ...data };
}

export async function updateVenue(id: string | number, data: any): Promise<void> {
  await updateDoc(doc(db, 'venues', id.toString()), data);
}

export async function deleteVenue(id: string | number): Promise<void> {
  await deleteDoc(doc(db, 'venues', id.toString()));
}

// ── Gallery ───────────────────────────────────────────────────────────────────

export async function fetchGallery(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'gallery'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

export async function createGalleryItem(data: any): Promise<any> {
  const docRef = await addDoc(collection(db, 'gallery'), data);
  return { id: docRef.id, ...data };
}

export async function updateGalleryItem(id: string | number, data: any): Promise<void> {
  await updateDoc(doc(db, 'gallery', id.toString()), data);
}

export async function deleteGalleryItem(id: string | number): Promise<void> {
  await deleteDoc(doc(db, 'gallery', id.toString()));
}

// ── News ──────────────────────────────────────────────────────────────────────

export async function fetchNews(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'news'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

export async function createNews(data: any): Promise<any> {
  const docRef = await addDoc(collection(db, 'news'), data);
  return { id: docRef.id, ...data };
}

export async function updateNews(id: string | number, data: any): Promise<void> {
  await updateDoc(doc(db, 'news', id.toString()), data);
}

export async function deleteNewsItem(id: string | number): Promise<void> {
  await deleteDoc(doc(db, 'news', id.toString()));
}

// ── Bookings ──────────────────────────────────────────────────────────────────

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

export async function updateBookingStatus(id: string | number, status: string): Promise<void> {
  await updateDoc(doc(db, 'bookings', id.toString()), { status, read: true });

  // Auto-email the client whenever status changes
  try {
    const snap = await getDocs(query(collection(db, 'bookings'), where('__name__', '==', id.toString())));
    if (!snap.empty) {
      const b = snap.docs[0].data();
      await sendBookingStatusEmail({
        refNumber: b.refNumber || '',
        firstName: b.firstName || '',
        lastName: b.lastName || '',
        email: b.email || '',
        institutionName: b.institutionName || '',
        eventType: b.eventType || '',
        startDate: b.startDate || '',
        endDate: b.endDate || '',
        status,
      });
    }
  } catch (err) {
    console.error('Failed to send booking status email:', err);
  }
}

export async function deleteBooking(id: string | number): Promise<void> {
  await deleteDoc(doc(db, 'bookings', id.toString()));
}

// ── Contacts ──────────────────────────────────────────────────────────────────

export async function submitContact(data: any): Promise<any> {
  const contactData = { ...data, created_at: new Date().toISOString(), read: false };
  const docRef = await addDoc(collection(db, 'contacts'), contactData);
  return { id: docRef.id, ...contactData };
}

export async function fetchContacts(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'contacts'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

export async function markContactRead(id: string | number): Promise<void> {
  await updateDoc(doc(db, 'contacts', id.toString()), { read: true });
}

export async function deleteContact(id: string | number): Promise<void> {
  await deleteDoc(doc(db, 'contacts', id.toString()));
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export async function fetchDashboard(): Promise<any> {
  const [events, news, contacts, gallery, venues, bookings] = await Promise.all([
    fetchEvents(),
    fetchNews(),
    fetchContacts(),
    fetchGallery(),
    fetchVenues(),
    fetchBookings(),
  ]);

  return {
    events: events.length,
    news: news.length,
    contacts: contacts.length,
    unreadContacts: contacts.filter((c) => !c.read).length,
    gallery: gallery.length,
    venues: venues.length,
    bookings: bookings.length,
    pendingBookings: bookings.filter((b) => b.status === 'Pending').length,
  };
}

// ── User Management ───────────────────────────────────────────────────────────

export async function fetchUsers(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'users'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

/**
 * Fix 5: Creates the user in Firebase Auth (password never stored in Firestore).
 * Only safe metadata is saved to the users collection.
 */
export async function createUser(data: {
  email: string;
  username: string;
  password: string;
  role?: string;
}): Promise<any> {
  // Create account in Firebase Auth
  await createUserWithEmailAndPassword(auth, data.email, data.password);

  // Save metadata to Firestore — NO password
  const userData = {
    email: data.email,
    username: data.username,
    role: data.role || 'Staff',
    created_at: new Date().toISOString(),
  };

  const docRef = await addDoc(collection(db, 'users'), userData);
  return { id: docRef.id, ...userData };
}

export async function updateUser(id: string | number, data: any): Promise<void> {
  await updateDoc(doc(db, 'users', id.toString()), data);
}

export async function deleteUser(id: string | number): Promise<void> {
  await deleteDoc(doc(db, 'users', id.toString()));
}

// ── Role & Permissions ────────────────────────────────────────────────────────

export function getCurrentUserRole(): string {
  return localStorage.getItem('bicc_user_role') || 'Staff';
}

export function isSuperAdmin(): boolean {
  return getCurrentUserRole() === 'Super Admin';
}

export function hasPermission(action: string): boolean {
  const role = getCurrentUserRole();
  const permissions: Record<string, string[]> = {
    'Super Admin': ['events', 'news', 'contacts', 'gallery', 'venues', 'users', 'delete', 'edit'],
    'Manager':     ['events', 'news', 'contacts', 'gallery', 'venues', 'delete', 'edit'],
    'Staff':       ['events', 'news', 'contacts', 'view_gallery', 'view_venues', 'gallery', 'edit'],
  };
  return permissions[role]?.includes(action) || false;
}

export function canAccessTab(tab: string): boolean {
  const role = getCurrentUserRole();
  const tabAccess: Record<string, string[]> = {
    'Super Admin': [
      'dashboard', 'settings', 'media', 'events', 'news', 'contacts', 'bookings', 'gallery', 'venues', 'users',
      'testimonials', 'partners', 'downloads', 'careers', 'tenders', 'subscribers',
      'pricing', 'quotations',
    ],
    'Manager': [
      'dashboard', 'settings', 'media', 'events', 'news', 'contacts', 'bookings', 'gallery', 'venues',
      'testimonials', 'partners', 'downloads', 'careers', 'tenders', 'subscribers',
      'pricing', 'quotations',
    ],
    'Staff': [
      'dashboard', 'settings', 'media', 'events', 'news', 'contacts', 'bookings', 'gallery',
      'downloads', 'careers',
    ],
  };
  return tabAccess[role]?.includes(tab) || false;
}

export function canEdit(): boolean {
  return hasPermission('edit');
}

export function canDelete(): boolean {
  return hasPermission('delete');
}

export async function replyToBooking(
  id: string,
  status: string,
  message: string
): Promise<void> {
  await updateDoc(doc(db, 'bookings', id), {
    status,
    adminMessage: message,
    read: true,
    updatedAt: new Date().toISOString(),
  });

  // Auto-email the client with the status + admin message
  try {
    const snap = await getDocs(query(collection(db, 'bookings'), where('__name__', '==', id)));
    if (!snap.empty) {
      const b = snap.docs[0].data();
      await sendBookingStatusEmail({
        refNumber: b.refNumber || '',
        firstName: b.firstName || '',
        lastName: b.lastName || '',
        email: b.email || '',
        institutionName: b.institutionName || '',
        eventType: b.eventType || '',
        startDate: b.startDate || '',
        endDate: b.endDate || '',
        status,
        adminMessage: message,
      });
    }
  } catch (err) {
    console.error('Failed to send booking reply email:', err);
  }
}

// ── Testimonials ──────────────────────────────────────────────────────────────

export async function fetchTestimonials(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'testimonials'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

export async function createTestimonial(data: any): Promise<any> {
  const docRef = await addDoc(collection(db, 'testimonials'), data);
  return { id: docRef.id, ...data };
}

export async function updateTestimonial(id: string | number, data: any): Promise<void> {
  await updateDoc(doc(db, 'testimonials', id.toString()), data);
}

export async function deleteTestimonial(id: string | number): Promise<void> {
  await deleteDoc(doc(db, 'testimonials', id.toString()));
}

// ── Partners ──────────────────────────────────────────────────────────────────

export async function fetchPartners(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'partners'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

export async function createPartner(data: any): Promise<any> {
  const docRef = await addDoc(collection(db, 'partners'), data);
  return { id: docRef.id, ...data };
}

export async function updatePartner(id: string | number, data: any): Promise<void> {
  await updateDoc(doc(db, 'partners', id.toString()), data);
}

export async function deletePartner(id: string | number): Promise<void> {
  await deleteDoc(doc(db, 'partners', id.toString()));
}

// ── Downloads ─────────────────────────────────────────────────────────────────

export async function fetchDownloads(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'downloads'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

export async function createDownload(data: any): Promise<any> {
  const docRef = await addDoc(collection(db, 'downloads'), data);
  return { id: docRef.id, ...data };
}

export async function updateDownload(id: string | number, data: any): Promise<void> {
  await updateDoc(doc(db, 'downloads', id.toString()), data);
}

export async function deleteDownload(id: string | number): Promise<void> {
  await deleteDoc(doc(db, 'downloads', id.toString()));
}

// ── Vacancies ─────────────────────────────────────────────────────────────────

export async function fetchVacancies(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'vacancies'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

export async function createVacancy(data: any): Promise<any> {
  const docRef = await addDoc(collection(db, 'vacancies'), data);
  return { id: docRef.id, ...data };
}

export async function updateVacancy(id: string | number, data: any): Promise<void> {
  await updateDoc(doc(db, 'vacancies', id.toString()), data);
}

export async function deleteVacancy(id: string | number): Promise<void> {
  await deleteDoc(doc(db, 'vacancies', id.toString()));
}

// ── Applications ──────────────────────────────────────────────────────────────

export async function fetchApplications(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'applications'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

export async function deleteApplication(id: string | number): Promise<void> {
  await deleteDoc(doc(db, 'applications', id.toString()));
}

// ── Tenders ───────────────────────────────────────────────────────────────────

export async function fetchTenders(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'tenders'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

export async function createTender(data: any): Promise<any> {
  const docRef = await addDoc(collection(db, 'tenders'), data);
  return { id: docRef.id, ...data };
}

export async function updateTender(id: string | number, data: any): Promise<void> {
  await updateDoc(doc(db, 'tenders', id.toString()), data);
}

export async function deleteTender(id: string | number): Promise<void> {
  await deleteDoc(doc(db, 'tenders', id.toString()));
}

// ── Subscribers ───────────────────────────────────────────────────────────────

export async function fetchSubscribers(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'subscribers'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

export async function deleteSubscriber(id: string | number): Promise<void> {
  await deleteDoc(doc(db, 'subscribers', id.toString()));
}

// ── Applications (job) ────────────────────────────────────────────────────────

export async function createApplication(data: any): Promise<any> {
  const applicationData = {
    ...data,
    created_at: new Date().toISOString(),
    status: 'New',
  };
  const docRef = await addDoc(collection(db, 'applications'), applicationData);
  return { id: docRef.id, ...applicationData };
}

export async function updateApplication(id: string | number, data: any): Promise<void> {
  await updateDoc(doc(db, 'applications', id.toString()), data);
}

// ── Booking workflow ──────────────────────────────────────────────────────────

/** Ordered booking lifecycle used across admin + emails. */
export const BOOKING_STATUSES = [
  'Pending',
  'Under Review',
  'Approved',
  'Rejected',
  'Confirmed',
  'Completed',
] as const;

/** Statuses that hold a venue (i.e. count towards a date being unavailable). */
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
 * Returns the existing confirmed/approved bookings that conflict with the given
 * date range and (optionally) any of the requested venues. Used to prevent
 * double-booking on the public booking form.
 */
export async function checkAvailability(
  startDate: string,
  endDate: string,
  venues: string[] = [],
  excludeId?: string
): Promise<any[]> {
  if (!startDate) return [];
  const bookings = await fetchBookings();
  return bookings.filter((b) => {
    if (excludeId && b.id === excludeId) return false;
    if (!BLOCKING_STATUSES.includes(b.status)) return false;
    if (!datesOverlap(startDate, endDate, b.startDate, b.endDate)) return false;
    // If no specific venues requested on either side, a date overlap is a conflict.
    if (!venues.length || !Array.isArray(b.venues) || !b.venues.length) return true;
    return b.venues.some((v: string) => venues.includes(v));
  });
}

/** Persist an admin reply + status + internal notes on a booking. */
export async function updateBooking(id: string | number, data: any): Promise<void> {
  await updateDoc(doc(db, 'bookings', id.toString()), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

// ── Pricing ───────────────────────────────────────────────────────────────────

export async function fetchPricing(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'pricing'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

export async function createPricing(data: any): Promise<any> {
  const docRef = await addDoc(collection(db, 'pricing'), data);
  return { id: docRef.id, ...data };
}

export async function updatePricing(id: string | number, data: any): Promise<void> {
  await updateDoc(doc(db, 'pricing', id.toString()), data);
}

export async function deletePricing(id: string | number): Promise<void> {
  await deleteDoc(doc(db, 'pricing', id.toString()));
}

// ── Quotations ────────────────────────────────────────────────────────────────

export async function fetchQuotations(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'quotations'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

export async function createQuotation(data: any): Promise<any> {
  const quotationData = { ...data, created_at: new Date().toISOString() };
  const docRef = await addDoc(collection(db, 'quotations'), quotationData);
  return { id: docRef.id, ...quotationData };
}

export async function updateQuotation(id: string | number, data: any): Promise<void> {
  await updateDoc(doc(db, 'quotations', id.toString()), data);
}

export async function deleteQuotation(id: string | number): Promise<void> {
  await deleteDoc(doc(db, 'quotations', id.toString()));
}
import { db, auth, getSecondaryAdminAuth } from './firebase';
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
  setDoc,
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { sendBookingStatusEmail } from './emailService';

const TOKEN_KEY = 'bicc_token';
const USERNAME_KEY = 'bicc_username';
const ROLE_KEY = 'bicc_user_role';
const DISPLAY_NAME_KEY = 'bicc_display_name';
const PERMISSIONS_KEY = 'bicc_user_permissions';

export const ADMIN_TAB_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  settings: 'Content',
  pages: 'Page Content',
  media: 'Media Library',
  events: 'Events',
  news: 'News',
  contacts: 'Messages',
  bookings: 'Bookings',
  gallery: 'Gallery',
  venues: 'Venues',
  users: 'Users',
  testimonials: 'Testimonials',
  partners: 'Partners',
  downloads: 'Downloads',
  careers: 'Careers',
  tenders: 'Tenders',
  subscribers: 'Subscribers',
  pricing: 'Pricing',
  quotations: 'Quotations',
};

export const ROLE_TAB_PRESETS: Record<string, string[]> = {
  'Super Admin': Object.keys(ADMIN_TAB_LABELS),
  'Manager': [
    'dashboard', 'settings', 'pages', 'media', 'events', 'news', 'contacts', 'bookings', 'gallery', 'venues',
    'testimonials', 'partners', 'downloads', 'careers', 'tenders', 'subscribers', 'pricing', 'quotations',
  ],
  'Staff': [
    'dashboard', 'settings', 'pages', 'media', 'events', 'news', 'contacts', 'bookings', 'gallery',
    'downloads', 'careers', 'testimonials', 'partners',
  ],
};

function clearAdminStorage() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(DISPLAY_NAME_KEY);
  localStorage.removeItem(PERMISSIONS_KEY);
}

function normalisePermissions(permissions: unknown, fallbackRole: string): string[] {
  if (Array.isArray(permissions) && permissions.length > 0) {
    return permissions.filter((entry): entry is string => typeof entry === 'string');
  }

  return ROLE_TAB_PRESETS[fallbackRole] || ROLE_TAB_PRESETS.Staff;
}

// ────────────────────────────────────────────────────────────────────────────
// ADMIN API - Authentication, CRUD operations, and admin management
// ────────────────────────────────────────────────────────────────────────────

// ── Authentication ────────────────────────────────────────────────────────────

/**
 * Login with email OR username.
 * After login, fetches the user's role from Firestore and saves it to localStorage.
 */
export async function loginAdmin(
  emailOrUsername: string,
  password: string
): Promise<boolean> {
  try {
    let email = emailOrUsername;

    // Support username login by looking up email in Firestore
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

    // Fetch and save the user's role after login
    const q = query(
      collection(db, 'users'),
      where('email', '==', userCredential.user.email)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      await signOut(auth);
      clearAdminStorage();
      return false;
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    if (userData.status === 'inactive') {
      await signOut(auth);
      clearAdminStorage();
      return false;
    }

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USERNAME_KEY, userData.username || userCredential.user.email || '');
    localStorage.setItem(ROLE_KEY, userData.role || 'Staff');
    localStorage.setItem(DISPLAY_NAME_KEY, userData.username || userCredential.user.email || 'Admin');
    localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(normalisePermissions(userData.permissions, userData.role || 'Staff')));

    return true;
  } catch (error) {
    console.error(error);
    clearAdminStorage();
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

export function logoutAdmin() {
  signOut(auth).catch(console.error);
  clearAdminStorage();
}

export function isAdminLoggedIn(): boolean {
  return !!localStorage.getItem(TOKEN_KEY);
}

// ── Role & Permissions ────────────────────────────────────────────────────────

export function getCurrentUserRole(): string {
  return localStorage.getItem(ROLE_KEY) || 'Staff';
}

export function getCurrentUserDisplayName(): string {
  return localStorage.getItem(DISPLAY_NAME_KEY) || localStorage.getItem(USERNAME_KEY) || 'Admin';
}

export function getCurrentUserPermissions(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(PERMISSIONS_KEY) || '[]');
    return normalisePermissions(parsed, getCurrentUserRole());
  } catch {
    return ROLE_TAB_PRESETS[getCurrentUserRole()] || ROLE_TAB_PRESETS.Staff;
  }
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
  return getCurrentUserPermissions().includes(tab);
}

export function canEdit(): boolean {
  return hasPermission('edit');
}

export function canDelete(): boolean {
  return hasPermission('delete');
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

export async function updateBooking(id: string | number, data: any): Promise<void> {
  await updateDoc(doc(db, 'bookings', id.toString()), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

// ── Contacts ──────────────────────────────────────────────────────────────────

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

// ── User Management ───────────────────────────────────────────────────────────

export async function fetchUsers(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'users'));
  return snap.docs
    .map((entry) => ({ id: entry.id, ...entry.data() }))
    .sort((a: any, b: any) => (a.username || '').localeCompare(b.username || ''));
}

/**
 * Creates the user in Firebase Auth (password never stored in Firestore).
 * Only safe metadata is saved to the users collection.
 */
export async function createUser(data: {
  email: string;
  username: string;
  password: string;
  role?: string;
  status?: 'active' | 'inactive';
  permissions?: string[];
}): Promise<any> {
  const secondaryAuth = getSecondaryAdminAuth();
  const userCredential = await createUserWithEmailAndPassword(secondaryAuth, data.email, data.password);
  await signOut(secondaryAuth);

  // Save metadata to Firestore — NO password
  const userData = {
    email: data.email,
    username: data.username,
    role: data.role || 'Staff',
    status: data.status || 'active',
    permissions: normalisePermissions(data.permissions, data.role || 'Staff'),
    created_at: new Date().toISOString(),
  };

  const docRef = await addDoc(collection(db, 'users'), userData);
  return { id: docRef.id, authUid: userCredential.user.uid, ...userData };
}

export async function updateUser(id: string | number, data: any): Promise<void> {
  const { password, ...safeData } = data;
  const payload = {
    ...safeData,
    permissions: normalisePermissions(safeData.permissions, safeData.role || 'Staff'),
  };
  await updateDoc(doc(db, 'users', id.toString()), payload);
}

export async function deleteUser(id: string | number): Promise<void> {
  await deleteDoc(doc(db, 'users', id.toString()));
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

export async function updateApplication(id: string | number, data: any): Promise<void> {
  await updateDoc(doc(db, 'applications', id.toString()), data);
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

// ── Booking Workflow Constants ────────────────────────────────────────────────

/** Ordered booking lifecycle used across admin + emails. */
export const BOOKING_STATUSES = [
  'Pending',
  'Under Review',
  'Approved',
  'Rejected',
  'Confirmed',
  'Completed',
] as const;

// ── Content Management ────────────────────────────────────────────────────────

/**
 * Fetch content for a specific section (home, footer, navbar, contact)
 */
export async function fetchContentSection(section: string): Promise<any> {
  try {
    const docRef = doc(db, 'pageContent', section);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching content section:', error);
    return null;
  }
}

/**
 * Update content for a specific section
 */
export async function updateContentSection(section: string, content: any): Promise<void> {
  try {
    const docRef = doc(db, 'pageContent', section);
    await setDoc(docRef, {
      ...content,
      section,
      updatedAt: new Date().toISOString(),
      updatedBy: localStorage.getItem('bicc_username') || 'admin',
    }, { merge: true });
  } catch (error) {
    console.error('Error updating content section:', error);
    throw error;
  }
}

// ────────────────────────────────────────────────────────────────────────────
// USER MANAGEMENT
// ────────────────────────────────────────────────────────────────────────────

/**
 * Fetch all admin users
 */
export async function fetchAllUsers(): Promise<any[]> {
  try {
    const snap = await getDocs(collection(db, 'users'));
    return snap.docs.map(d => ({ uid: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

/**
 * Create a new admin user
 */
export async function createAdminUser(userData: any): Promise<string> {
  try {
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password || 'TemporaryPass123!');
    const uid = userCredential.user.uid;

    // Create user document in Firestore
    await setDoc(doc(db, 'users', uid), {
      uid,
      email: userData.email,
      username: userData.username,
      role: userData.role || 'Staff',
      status: userData.status || 'active',
      permissions: userData.permissions || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return uid;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

/**
 * Update admin user
 */
export async function updateAdminUser(uid: string, userData: any): Promise<void> {
  try {
    await updateDoc(doc(db, 'users', uid), {
      ...userData,
      updatedAt: new Date().toISOString(),
      updatedBy: localStorage.getItem(USERNAME_KEY),
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

/**
 * Delete admin user
 */
export async function deleteAdminUser(uid: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'users', uid));
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}


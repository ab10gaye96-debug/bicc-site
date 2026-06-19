import { db, auth, storage, getSecondaryAdminAuth } from './firebase';
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
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { sendBookingStatusEmail } from './emailService';

const TOKEN_KEY = 'bicc_token';
const USERNAME_KEY = 'bicc_username';
const ROLE_KEY = 'bicc_user_role';
const DISPLAY_NAME_KEY = 'bicc_display_name';
const PERMISSIONS_KEY = 'bicc_user_permissions';
const USERNAME_INDEX_COLLECTION = 'adminUsernames';
const AUDIT_LOGS_COLLECTION = 'auditLogs';

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
  'Editor': [
    'dashboard', 'settings', 'pages', 'media', 'events', 'news', 'gallery',
    'downloads', 'careers', 'testimonials', 'partners', 'pricing', 'quotations',
  ],
  'Staff': [
    'dashboard', 'settings', 'pages', 'media', 'events', 'news', 'contacts', 'bookings', 'gallery',
    'downloads', 'careers', 'testimonials', 'partners',
  ],
};

type AuditAction = 'login' | 'logout' | 'create' | 'update' | 'delete' | 'upload';

export interface UploadedAdminAsset {
  url: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  contentType: string;
  assetType: 'image' | 'video' | 'document';
  storagePath?: string;
  sourceType: 'upload' | 'link';
  uploadedAt: string;
}

function getCurrentAuditActor() {
  return {
    uid: auth.currentUser?.uid || null,
    username: localStorage.getItem(USERNAME_KEY) || '',
    role: localStorage.getItem(ROLE_KEY) || 'Staff',
    displayName: localStorage.getItem(DISPLAY_NAME_KEY) || localStorage.getItem(USERNAME_KEY) || 'Admin',
  };
}

async function logAdminActivity(
  action: AuditAction,
  targetType: string,
  targetId: string,
  details: Record<string, any> = {}
): Promise<void> {
  try {
    const actor = getCurrentAuditActor();
    await addDoc(collection(db, AUDIT_LOGS_COLLECTION), {
      action,
      targetType,
      targetId,
      actorUid: actor.uid,
      actorUsername: actor.username,
      actorDisplayName: actor.displayName,
      actorRole: actor.role,
      details,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}

function sanitizeFileName(fileName: string): string {
  return fileName
    .trim()
    .replace(/[^a-zA-Z0-9.\-_]+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

function getFileExtension(fileName: string): string {
  const parts = fileName.split('.');
  return parts.length > 1 ? parts.pop() || '' : '';
}

export function formatReadableFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 Bytes';
  const units = ['Bytes', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value >= 10 || unitIndex === 0 ? Math.round(value) : value.toFixed(1)} ${units[unitIndex]}`;
}

function detectAssetType(fileName: string, contentType = ''): 'image' | 'video' | 'document' {
  if (contentType.startsWith('image/')) return 'image';
  if (contentType.startsWith('video/')) return 'video';

  const ext = getFileExtension(fileName).toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'avif'].includes(ext)) return 'image';
  if (['mp4', 'mov', 'avi', 'webm', 'm4v', 'mkv'].includes(ext)) return 'video';
  return 'document';
}

function detectFileTypeLabel(fileName: string, contentType = ''): string {
  if (contentType.startsWith('image/')) return 'Image';
  if (contentType.startsWith('video/')) return 'Video';

  const ext = getFileExtension(fileName).toUpperCase();
  return ext || 'FILE';
}

function detectContentTypeFromUrl(url: string): string {
  const cleaned = url.split('?')[0].toLowerCase();
  if (/\.(jpg|jpeg|png|gif|webp|svg|bmp|avif)$/.test(cleaned)) return 'image/*';
  if (/\.(mp4|mov|avi|webm|m4v|mkv)$/.test(cleaned)) return 'video/*';
  if (cleaned.endsWith('.pdf')) return 'application/pdf';
  if (cleaned.endsWith('.doc') || cleaned.endsWith('.docx')) return 'application/msword';
  return 'application/octet-stream';
}

export async function uploadAdminAsset(file: File, folder: string): Promise<UploadedAdminAsset> {
  const safeName = sanitizeFileName(file.name);
  const extension = getFileExtension(safeName);
  const timestamp = Date.now();
  const storagePath = `content/${folder}/${timestamp}-${safeName || `file.${extension || 'bin'}`}`;
  const fileRef = storageRef(storage, storagePath);

  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);

  const asset: UploadedAdminAsset = {
    url,
    fileName: file.name,
    fileSize: formatReadableFileSize(file.size),
    fileType: detectFileTypeLabel(file.name, file.type),
    contentType: file.type || 'application/octet-stream',
    assetType: detectAssetType(file.name, file.type),
    storagePath,
    sourceType: 'upload',
    uploadedAt: new Date().toISOString(),
  };

  await logAdminActivity('upload', 'storage', storagePath, {
    folder,
    fileName: file.name,
    fileType: asset.fileType,
    assetType: asset.assetType,
  });

  return asset;
}

export function createLinkedAdminAsset(url: string, label?: string): UploadedAdminAsset {
  const inferredName = label || url.split('/').pop()?.split('?')[0] || 'linked-file';
  const contentType = detectContentTypeFromUrl(url);

  return {
    url,
    fileName: inferredName,
    fileSize: 'Remote link',
    fileType: detectFileTypeLabel(inferredName, contentType),
    contentType,
    assetType: detectAssetType(inferredName, contentType),
    sourceType: 'link',
    uploadedAt: new Date().toISOString(),
  };
}

export async function deleteStoredAsset(storagePath?: string | null): Promise<void> {
  if (!storagePath) return;

  try {
    await deleteObject(storageRef(storage, storagePath));
  } catch (error) {
    console.error('Failed to delete storage asset:', error);
  }
}

export async function fetchAuditLogs(): Promise<any[]> {
  const snap = await getDocs(collection(db, AUDIT_LOGS_COLLECTION));
  return snap.docs
    .map((entry) => ({ id: entry.id, ...entry.data() }))
    .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
}

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

function normaliseUsername(username: string): string {
  return username.trim().toLowerCase();
}

function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

async function syncUsernameIndex(userData: { uid: string; username?: string; email?: string; status?: string }) {
  const username = normaliseUsername(userData.username || '');
  const email = normaliseEmail(userData.email || '');

  if (!username || !email || !userData.uid) return;

  await setDoc(doc(db, USERNAME_INDEX_COLLECTION, username), {
    uid: userData.uid,
    username,
    email,
    status: userData.status || 'active',
    updatedAt: new Date().toISOString(),
  }, { merge: true });
}

async function deleteUsernameIndex(username?: string) {
  const normalisedUsername = normaliseUsername(username || '');
  if (!normalisedUsername) return;

  await deleteDoc(doc(db, USERNAME_INDEX_COLLECTION, normalisedUsername));
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
    const trimmedIdentity = emailOrUsername.trim();
    let email = trimmedIdentity;

    // Support username login by looking up email in Firestore
    if (!trimmedIdentity.includes('@')) {
      const usernameSnap = await getDoc(doc(db, USERNAME_INDEX_COLLECTION, normaliseUsername(trimmedIdentity)));
      if (!usernameSnap.exists()) return false;
      email = usernameSnap.data().email;
    }

    const userCredential = await signInWithEmailAndPassword(auth, normaliseEmail(email), password);
    const token = await userCredential.user.getIdToken();

    const canonicalRef = doc(db, 'users', userCredential.user.uid);
    let userSnap = await getDoc(canonicalRef);
    let userData = userSnap.exists() ? userSnap.data() : null;

    if (!userData && userCredential.user.email) {
      const legacySnapshot = await getDocs(
        query(collection(db, 'users'), where('email', '==', normaliseEmail(userCredential.user.email)))
      );

      if (!legacySnapshot.empty) {
        const legacyData = legacySnapshot.docs[0].data();
        userData = {
          ...legacyData,
          uid: userCredential.user.uid,
          email: normaliseEmail(legacyData.email || userCredential.user.email),
          username: legacyData.username || trimmedIdentity,
          status: legacyData.status || 'active',
          role: legacyData.role || 'Staff',
          permissions: normalisePermissions(legacyData.permissions, legacyData.role || 'Staff'),
          updatedAt: new Date().toISOString(),
        };

        await setDoc(canonicalRef, userData, { merge: true });
      }
    }

    if (!userData) {
      await signOut(auth);
      clearAdminStorage();
      return false;
    }

    if (userData.status === 'inactive') {
      await signOut(auth);
      clearAdminStorage();
      return false;
    }

    const safeUserData = {
      uid: userCredential.user.uid,
      email: normaliseEmail(userData.email || userCredential.user.email || ''),
      username: userData.username || trimmedIdentity,
      status: userData.status || 'active',
      role: userData.role || 'Staff',
      permissions: normalisePermissions(userData.permissions, userData.role || 'Staff'),
    };

    await setDoc(canonicalRef, {
      ...safeUserData,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    await syncUsernameIndex(safeUserData);

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USERNAME_KEY, safeUserData.username || safeUserData.email || '');
    localStorage.setItem(ROLE_KEY, safeUserData.role);
    localStorage.setItem(DISPLAY_NAME_KEY, safeUserData.username || safeUserData.email || 'Admin');
    localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(safeUserData.permissions));

    await logAdminActivity('login', 'auth', userCredential.user.uid, {
      email: safeUserData.email,
      username: safeUserData.username,
      role: safeUserData.role,
    });

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
  void logAdminActivity('logout', 'auth', auth.currentUser?.uid || '', {});
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
    'Editor':      ['events', 'news', 'gallery', 'edit'],
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
  await logAdminActivity('create', 'events', docRef.id, { title: data.title || '' });
  return { id: docRef.id, ...data };
}

export async function updateEvent(id: string | number, data: any): Promise<void> {
  await updateDoc(doc(db, 'events', id.toString()), data);
  await logAdminActivity('update', 'events', id.toString(), { title: data.title || '' });
}

export async function deleteEvent(id: string | number): Promise<void> {
  await deleteDoc(doc(db, 'events', id.toString()));
  await logAdminActivity('delete', 'events', id.toString());
}

// ── Venues ────────────────────────────────────────────────────────────────────

export async function fetchVenues(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'venues'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

export async function createVenue(data: any): Promise<any> {
  const docRef = await addDoc(collection(db, 'venues'), data);
  await logAdminActivity('create', 'venues', docRef.id, { name: data.name || '' });
  return { id: docRef.id, ...data };
}

export async function updateVenue(id: string | number, data: any): Promise<void> {
  await updateDoc(doc(db, 'venues', id.toString()), data);
  await logAdminActivity('update', 'venues', id.toString(), { name: data.name || '' });
}

export async function deleteVenue(id: string | number): Promise<void> {
  await deleteDoc(doc(db, 'venues', id.toString()));
  await logAdminActivity('delete', 'venues', id.toString());
}

// ── Gallery ───────────────────────────────────────────────────────────────────

export async function fetchGallery(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'gallery'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

export async function createGalleryItem(data: any): Promise<any> {
  const docRef = await addDoc(collection(db, 'gallery'), data);
  await logAdminActivity('create', 'gallery', docRef.id, { title: data.title || data.caption || '' });
  return { id: docRef.id, ...data };
}

export async function updateGalleryItem(id: string | number, data: any): Promise<void> {
  await updateDoc(doc(db, 'gallery', id.toString()), data);
  await logAdminActivity('update', 'gallery', id.toString(), { title: data.title || data.caption || '' });
}

export async function deleteGalleryItem(id: string | number): Promise<void> {
  await deleteDoc(doc(db, 'gallery', id.toString()));
  await logAdminActivity('delete', 'gallery', id.toString());
}

// ── News ──────────────────────────────────────────────────────────────────────

export async function fetchNews(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'news'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

export async function createNews(data: any): Promise<any> {
  const docRef = await addDoc(collection(db, 'news'), data);
  await logAdminActivity('create', 'news', docRef.id, { title: data.title || '' });
  return { id: docRef.id, ...data };
}

export async function updateNews(id: string | number, data: any): Promise<void> {
  await updateDoc(doc(db, 'news', id.toString()), data);
  await logAdminActivity('update', 'news', id.toString(), { title: data.title || '' });
}

export async function deleteNewsItem(id: string | number): Promise<void> {
  await deleteDoc(doc(db, 'news', id.toString()));
  await logAdminActivity('delete', 'news', id.toString());
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
  await logAdminActivity('delete', 'bookings', id.toString());
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
  await logAdminActivity('update', 'bookings', id.toString(), { status: data.status || '' });
}

// ── Contacts ──────────────────────────────────────────────────────────────────

export async function fetchContacts(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'contacts'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

export async function markContactRead(id: string | number): Promise<void> {
  await updateDoc(doc(db, 'contacts', id.toString()), { read: true });
  await logAdminActivity('update', 'contacts', id.toString(), { read: true });
}

export async function deleteContact(id: string | number): Promise<void> {
  await deleteDoc(doc(db, 'contacts', id.toString()));
  await logAdminActivity('delete', 'contacts', id.toString());
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
  const email = normaliseEmail(data.email);
  const username = normaliseUsername(data.username);
  const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, data.password);
  await signOut(secondaryAuth);

  // Save metadata to Firestore — NO password
  const userData = {
    uid: userCredential.user.uid,
    email,
    username,
    role: data.role || 'Staff',
    status: data.status || 'active',
    permissions: normalisePermissions(data.permissions, data.role || 'Staff'),
    created_at: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(doc(db, 'users', userCredential.user.uid), userData);
  await syncUsernameIndex(userData);
  await logAdminActivity('create', 'users', userCredential.user.uid, {
    username,
    email,
    role: userData.role,
  });
  return { id: userCredential.user.uid, authUid: userCredential.user.uid, ...userData };
}

export async function updateUser(id: string | number, data: any): Promise<void> {
  const userId = id.toString();
  const userRef = doc(db, 'users', userId);
  const existingSnap = await getDoc(userRef);
  const existingData = existingSnap.exists() ? existingSnap.data() : {};
  const { password, ...safeData } = data;
  const nextRole = safeData.role || existingData.role || 'Staff';
  const nextEmail = safeData.email
    ? normaliseEmail(safeData.email)
    : normaliseEmail(existingData.email || '');
  const nextUsername = safeData.username
    ? normaliseUsername(safeData.username)
    : normaliseUsername(existingData.username || '');
  const nextStatus = safeData.status || existingData.status || 'active';

  const payload = {
    ...safeData,
    ...(safeData.email ? { email: nextEmail } : {}),
    ...(safeData.username ? { username: nextUsername } : {}),
    permissions: normalisePermissions(
      safeData.permissions ?? existingData.permissions,
      nextRole
    ),
  };

  await updateDoc(userRef, payload);

  const previousUsername = normaliseUsername(existingData.username || '');
  if (previousUsername && previousUsername !== nextUsername) {
    await deleteUsernameIndex(previousUsername);
  }

  await syncUsernameIndex({
    uid: userId,
    email: nextEmail,
    username: nextUsername,
    status: nextStatus,
  });
  await logAdminActivity('update', 'users', userId, {
    username: nextUsername,
    email: nextEmail,
    role: payload.role || nextRole,
    status: nextStatus,
  });
}

export async function deleteUser(id: string | number): Promise<void> {
  const userId = id.toString();
  const userRef = doc(db, 'users', userId);
  const existingSnap = await getDoc(userRef);
  const existingData = existingSnap.exists() ? existingSnap.data() : null;

  await deleteDoc(userRef);

  if (existingData?.username) {
    await deleteUsernameIndex(existingData.username);
  }

  await logAdminActivity('delete', 'users', userId, {
    username: existingData?.username || '',
    email: existingData?.email || '',
  });
}

// ── Testimonials ──────────────────────────────────────────────────────────────

export async function fetchTestimonials(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'testimonials'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

export async function createTestimonial(data: any): Promise<any> {
  const docRef = await addDoc(collection(db, 'testimonials'), data);
  await logAdminActivity('create', 'testimonials', docRef.id, { name: data.name || '' });
  return { id: docRef.id, ...data };
}

export async function updateTestimonial(id: string | number, data: any): Promise<void> {
  await updateDoc(doc(db, 'testimonials', id.toString()), data);
  await logAdminActivity('update', 'testimonials', id.toString(), { name: data.name || '' });
}

export async function deleteTestimonial(id: string | number): Promise<void> {
  await deleteDoc(doc(db, 'testimonials', id.toString()));
  await logAdminActivity('delete', 'testimonials', id.toString());
}

// ── Partners ──────────────────────────────────────────────────────────────────

export async function fetchPartners(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'partners'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

export async function createPartner(data: any): Promise<any> {
  const docRef = await addDoc(collection(db, 'partners'), data);
  await logAdminActivity('create', 'partners', docRef.id, { name: data.name || '' });
  return { id: docRef.id, ...data };
}

export async function updatePartner(id: string | number, data: any): Promise<void> {
  await updateDoc(doc(db, 'partners', id.toString()), data);
  await logAdminActivity('update', 'partners', id.toString(), { name: data.name || '' });
}

export async function deletePartner(id: string | number): Promise<void> {
  await deleteDoc(doc(db, 'partners', id.toString()));
  await logAdminActivity('delete', 'partners', id.toString());
}

// ── Downloads ─────────────────────────────────────────────────────────────────

export async function fetchDownloads(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'downloads'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

export async function createDownload(data: any): Promise<any> {
  const docRef = await addDoc(collection(db, 'downloads'), data);
  await logAdminActivity('create', 'downloads', docRef.id, { title: data.title || '' });
  return { id: docRef.id, ...data };
}

export async function updateDownload(id: string | number, data: any): Promise<void> {
  await updateDoc(doc(db, 'downloads', id.toString()), data);
  await logAdminActivity('update', 'downloads', id.toString(), { title: data.title || '' });
}

export async function deleteDownload(id: string | number): Promise<void> {
  await deleteDoc(doc(db, 'downloads', id.toString()));
  await logAdminActivity('delete', 'downloads', id.toString());
}

// ── Vacancies ─────────────────────────────────────────────────────────────────

export async function fetchVacancies(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'vacancies'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

export async function createVacancy(data: any): Promise<any> {
  const docRef = await addDoc(collection(db, 'vacancies'), data);
  await logAdminActivity('create', 'vacancies', docRef.id, { title: data.title || '' });
  return { id: docRef.id, ...data };
}

export async function updateVacancy(id: string | number, data: any): Promise<void> {
  await updateDoc(doc(db, 'vacancies', id.toString()), data);
  await logAdminActivity('update', 'vacancies', id.toString(), { title: data.title || '' });
}

export async function deleteVacancy(id: string | number): Promise<void> {
  await deleteDoc(doc(db, 'vacancies', id.toString()));
  await logAdminActivity('delete', 'vacancies', id.toString());
}

// ── Applications ──────────────────────────────────────────────────────────────

export async function fetchApplications(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'applications'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

export async function updateApplication(id: string | number, data: any): Promise<void> {
  await updateDoc(doc(db, 'applications', id.toString()), data);
  await logAdminActivity('update', 'applications', id.toString(), { status: data.status || '' });
}

export async function deleteApplication(id: string | number): Promise<void> {
  await deleteDoc(doc(db, 'applications', id.toString()));
  await logAdminActivity('delete', 'applications', id.toString());
}

// ── Tenders ───────────────────────────────────────────────────────────────────

export async function fetchTenders(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'tenders'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

export async function createTender(data: any): Promise<any> {
  const docRef = await addDoc(collection(db, 'tenders'), data);
  await logAdminActivity('create', 'tenders', docRef.id, { title: data.title || '', reference: data.reference || '' });
  return { id: docRef.id, ...data };
}

export async function updateTender(id: string | number, data: any): Promise<void> {
  await updateDoc(doc(db, 'tenders', id.toString()), data);
  await logAdminActivity('update', 'tenders', id.toString(), { title: data.title || '', reference: data.reference || '' });
}

export async function deleteTender(id: string | number): Promise<void> {
  await deleteDoc(doc(db, 'tenders', id.toString()));
  await logAdminActivity('delete', 'tenders', id.toString());
}

// ── Subscribers ───────────────────────────────────────────────────────────────

export async function fetchSubscribers(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'subscribers'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

export async function deleteSubscriber(id: string | number): Promise<void> {
  await deleteDoc(doc(db, 'subscribers', id.toString()));
  await logAdminActivity('delete', 'subscribers', id.toString());
}

// ── Pricing ───────────────────────────────────────────────────────────────────

export async function fetchPricing(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'pricing'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

export async function createPricing(data: any): Promise<any> {
  const docRef = await addDoc(collection(db, 'pricing'), data);
  await logAdminActivity('create', 'pricing', docRef.id, { title: data.title || data.name || '' });
  return { id: docRef.id, ...data };
}

export async function updatePricing(id: string | number, data: any): Promise<void> {
  await updateDoc(doc(db, 'pricing', id.toString()), data);
  await logAdminActivity('update', 'pricing', id.toString(), { title: data.title || data.name || '' });
}

export async function deletePricing(id: string | number): Promise<void> {
  await deleteDoc(doc(db, 'pricing', id.toString()));
  await logAdminActivity('delete', 'pricing', id.toString());
}

// ── Quotations ────────────────────────────────────────────────────────────────

export async function fetchQuotations(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'quotations'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

export async function createQuotation(data: any): Promise<any> {
  const quotationData = { ...data, created_at: new Date().toISOString() };
  const docRef = await addDoc(collection(db, 'quotations'), quotationData);
  await logAdminActivity('create', 'quotations', docRef.id, { clientName: data.clientName || data.name || '' });
  return { id: docRef.id, ...quotationData };
}

export async function updateQuotation(id: string | number, data: any): Promise<void> {
  await updateDoc(doc(db, 'quotations', id.toString()), data);
  await logAdminActivity('update', 'quotations', id.toString(), { clientName: data.clientName || data.name || '' });
}

export async function deleteQuotation(id: string | number): Promise<void> {
  await deleteDoc(doc(db, 'quotations', id.toString()));
  await logAdminActivity('delete', 'quotations', id.toString());
}

// ── Media Library ──────────────────────────────────────────────────────────────

export async function fetchMediaLibrary(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'mediaLibrary'));
  return snap.docs
    .map((entry) => ({ id: entry.id, ...entry.data() }))
    .sort((a: any, b: any) => new Date(b.uploadedAt || 0).getTime() - new Date(a.uploadedAt || 0).getTime());
}

export async function createMediaLibraryItem(data: any): Promise<any> {
  const docRef = await addDoc(collection(db, 'mediaLibrary'), data);
  await logAdminActivity('create', 'mediaLibrary', docRef.id, {
    title: data.title || '',
    fileName: data.fileName || '',
    assetType: data.assetType || '',
  });
  return { id: docRef.id, ...data };
}

export async function updateMediaLibraryItem(id: string, data: any): Promise<void> {
  await updateDoc(doc(db, 'mediaLibrary', id), data);
  await logAdminActivity('update', 'mediaLibrary', id, {
    title: data.title || '',
    fileName: data.fileName || '',
  });
}

export async function deleteMediaLibraryItem(id: string): Promise<void> {
  await deleteDoc(doc(db, 'mediaLibrary', id));
  await logAdminActivity('delete', 'mediaLibrary', id);
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
    await logAdminActivity('update', 'pageContent', section, { section });
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
    const email = normaliseEmail(userData.email || '');
    const username = normaliseUsername(userData.username || '');
    const status = (userData.status || 'active').toString().toLowerCase();
    const role = userData.role || 'Staff';
    const permissions = normalisePermissions(userData.permissions, role);
    const secondaryAuth = getSecondaryAdminAuth();
    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, userData.password || 'TemporaryPass123!');
    await signOut(secondaryAuth);
    const uid = userCredential.user.uid;

    // Create user document in Firestore
    await setDoc(doc(db, 'users', uid), {
      uid,
      email,
      username,
      role,
      status,
      permissions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    await syncUsernameIndex({ uid, email, username, status });
    await logAdminActivity('create', 'users', uid, { username, email, role, status });

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
    const userRef = doc(db, 'users', uid);
    const existingSnap = await getDoc(userRef);
    const existingData = existingSnap.exists() ? existingSnap.data() : {};
    const payload: Record<string, any> = {
      updatedAt: new Date().toISOString(),
      updatedBy: localStorage.getItem(USERNAME_KEY),
    };

    if (userData.email) payload.email = normaliseEmail(userData.email);
    if (userData.username) payload.username = normaliseUsername(userData.username);
    if (userData.role) payload.role = userData.role;
    if (userData.status) payload.status = userData.status.toString().toLowerCase();
    if (userData.permissions) {
      payload.permissions = normalisePermissions(userData.permissions, userData.role || 'Staff');
    }

    await updateDoc(userRef, payload);

    const nextEmail = payload.email || normaliseEmail(existingData.email || '');
    const nextUsername = payload.username || normaliseUsername(existingData.username || '');
    const nextStatus = payload.status || existingData.status || 'active';
    const previousUsername = normaliseUsername(existingData.username || '');

    if (previousUsername && previousUsername !== nextUsername) {
      await deleteUsernameIndex(previousUsername);
    }

    await syncUsernameIndex({
      uid,
      email: nextEmail,
      username: nextUsername,
      status: nextStatus,
    });
    await logAdminActivity('update', 'users', uid, {
      username: nextUsername,
      email: nextEmail,
      role: payload.role || existingData.role || 'Staff',
      status: nextStatus,
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
    const userRef = doc(db, 'users', uid);
    const existingSnap = await getDoc(userRef);
    const existingData = existingSnap.exists() ? existingSnap.data() : null;

    await deleteDoc(userRef);

    if (existingData?.username) {
      await deleteUsernameIndex(existingData.username);
    }
    await logAdminActivity('delete', 'users', uid, {
      username: existingData?.username || '',
      email: existingData?.email || '',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}


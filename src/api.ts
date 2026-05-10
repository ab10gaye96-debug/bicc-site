import { db, auth } from './firebase';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { IMAGES } from './images';

const isDummyConfig = () => {
  try {
    return auth.app.options.apiKey?.includes('DummyKey');
  } catch {
    return true;
  }
};

const STORAGE_KEYS = {
  version: 'bicc_fb_seed_version',
  events: 'bicc_fb_events',
  venues: 'bicc_fb_venues',
  contacts: 'bicc_fb_contacts',
  gallery: 'bicc_fb_gallery',
  news: 'bicc_fb_news',
  users: 'bicc_fb_users',
};

const FALLBACK_VERSION = 'bicc-real-assets-v5';

const defaultEvents = [
  {
    id: '1',
    title: 'WACREN 2026 Annual Conference',
    date: '2026-03-23',
    time: '09:00 AM',
    location: 'Sir Dawda Kairaba Jawara International Conference Centre',
    description: 'The West and Central African Research and Education Network Annual Conference exploring “Connected Futures: Advancing Africa’s Digital Sovereignty Through Open Collaboration.”',
    image: IMAGES.conferenceHall,
    category: 'Conference',
  },
  {
    id: '2',
    title: 'Africa Governance & Peacebuilding Forum',
    date: '2026-06-15',
    time: '10:00 AM',
    location: 'Plenary Hall',
    description: 'UNDP West and Central Africa convenes experts from across the continent to explore how digital innovation can strengthen democratic institutions.',
    image: IMAGES.conferenceExterior,
    category: 'Summit',
  },
  {
    id: '3',
    title: 'GHIBAfriTradeX - African Trade & Finance',
    date: '2026-09-10',
    time: '08:30 AM',
    location: 'Sir Dawda Kairaba Jawara International Conference Centre',
    description: 'A premier gathering of central banks, commercial banks, development finance institutions and trade advisory firms committed to strengthening Africa’s financial connectivity.',
    image: IMAGES.heroBg,
    category: 'Exhibition',
  },
];

const defaultVenues = [
  {
    id: '1',
    name: 'Plenary Hall',
    capacity: '1,013 seats',
    description: 'Our flagship conference hall designed for major international summits, conferences, and national events at the Sir Dawda Kairaba Jawara International Conference Centre.',
    image: IMAGES.conferenceHall,
    features: ['Tiered seating', 'Simultaneous interpretation', '4K display screens', 'Professional sound system'],
  },
  {
    id: '2',
    name: 'Banquet Hall A',
    capacity: '500 guests',
    description: 'An elegant official event space for state dinners, gala receptions, ceremonial functions, and premium corporate events.',
    image: IMAGES.banquetHall,
    features: ['Flexible layout', 'Premium décor', 'Stage area', 'AV support'],
  },
  {
    id: '3',
    name: 'Control & Operations Room',
    capacity: 'Technical Operations',
    description: 'An essential operational facility supporting modern conferencing, monitoring, and technical coordination.',
    image: IMAGES.controlRoom,
    features: ['Live monitoring', 'Broadcast support', 'Technical controls'],
  },
  {
    id: '4',
    name: 'VVIP Airport Lounge',
    capacity: 'Exclusive',
    description: 'The official VVIP Airport Lounge at Banjul International Airport designed to receive heads of state, ministers, and distinguished guests with premium service.',
    image: IMAGES.vvipLounge,
    features: ['Protocol reception', 'Exclusive access', 'High-level hospitality'],
  },
];

const defaultGallery = [
  { id: '1', url: IMAGES.heroBg, caption: 'SDKJ International Conference Centre - Exterior View', category: 'Venue' },
  { id: '2', url: IMAGES.conferenceHall, caption: 'Conference Centre Main View', category: 'Venue' },
  { id: '3', url: IMAGES.conferenceExterior, caption: 'Official Exterior Security View', category: 'Venue' },
  { id: '4', url: IMAGES.banquetHall, caption: 'Official Hospitality / Hall View', category: 'Events' },
  { id: '5', url: IMAGES.hospitalityAlt, caption: 'Official Facility Hospitality Area', category: 'Events' },
  { id: '6', url: IMAGES.controlRoom, caption: 'Control Room', category: 'Venue' },
  { id: '7', url: IMAGES.vvipLounge, caption: 'VVIP Airport Lounge', category: 'VIP' },
  { id: '8', url: IMAGES.vvipLoungeAlt, caption: 'VVIP Lounge Interior/Facility View', category: 'VIP' },
  { id: '9', url: IMAGES.logo, caption: 'BICC Official Logo', category: 'Brand' },
];

const defaultNews = [
  {
    id: '1',
    title: 'WACREN 2026 Conference Successfully Held at SDKJICC',
    excerpt: 'Policymakers, researchers, and higher education leaders gathered to discuss Africa’s digital sovereignty.',
    content: 'The WACREN 2026 Annual Conference brought together policymakers, researchers, and higher education leaders at the Sir Dawda Kairaba Jawara International Conference Centre.',
    date: '2026-03-27',
    author: 'BICC Communications',
    image: IMAGES.heroBg,
  },
  {
    id: '2',
    title: 'BICC Strategic Partnership Announcement',
    excerpt: 'BICC continues strengthening regional cooperation through strategic institutional partnerships.',
    content: 'The Banjul International Convention Centre continues expanding its role as The Gambia’s premier conference destination through strategic partnerships and facility growth.',
    date: '2025-11-26',
    author: 'BICC Communications',
    image: IMAGES.biccPartnership,
  },
];

function getLocal<T>(key: string, def: T): T {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : def;
  } catch {
    return def;
  }
}

function saveLocal<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

function ensureFallbackSeeded() {
  if (!isDummyConfig()) return;
  const currentVersion = localStorage.getItem(STORAGE_KEYS.version);
  
  // Always ensure admin user exists
  const users = getLocal<any[]>(STORAGE_KEYS.users, []);
  const hasAdmin = users.some(u => u.username === 'admin' || u.email === 'admin@bicc.gm');
  
  if (!hasAdmin) {
    console.log('Adding default admin user...');
    users.push({ 
      id: Date.now().toString(), 
      email: 'admin@bicc.gm', 
      username: 'admin', 
      password: 'bicc2025', 
      role: 'Super Admin', 
      created_at: new Date().toISOString() 
    });
    saveLocal(STORAGE_KEYS.users, users);
  }
  
  if (currentVersion === FALLBACK_VERSION) return;

  saveLocal(STORAGE_KEYS.events, defaultEvents);
  saveLocal(STORAGE_KEYS.venues, defaultVenues);
  saveLocal(STORAGE_KEYS.gallery, defaultGallery);
  saveLocal(STORAGE_KEYS.news, defaultNews);
  if (!localStorage.getItem(STORAGE_KEYS.contacts)) saveLocal(STORAGE_KEYS.contacts, []);
  if (!localStorage.getItem(STORAGE_KEYS.users)) saveLocal(STORAGE_KEYS.users, [
    { id: '1', email: 'admin@bicc.gm', username: 'admin', password: 'bicc2025', role: 'Super Admin', created_at: new Date().toISOString() }
  ]);
  localStorage.setItem(STORAGE_KEYS.version, FALLBACK_VERSION);
}

ensureFallbackSeeded();

export async function loginAdmin(emailOrUsername: string, password: string): Promise<boolean> {
  if (isDummyConfig()) {
    const users = getLocal<any[]>(STORAGE_KEYS.users, []);
    console.log('Login attempt:', emailOrUsername, 'password:', password);
    console.log('Available users:', users);
    
    // Check each user
    users.forEach(u => {
      console.log('Checking user:', u.username, u.email, 'password match:', u.password === password);
    });
    
    const user = users.find(u => 
      (u.email === emailOrUsername || u.username === emailOrUsername) && u.password === password
    );
    console.log('Found user:', user);
    
    if (user) {
      localStorage.setItem('bicc_token', 'local-demo-token');
      localStorage.setItem('bicc_username', user.username);
      localStorage.setItem('bicc_user_role', user.role);
      return true;
    }
    return false;
  }

  try {
    const normalizedEmail = emailOrUsername.includes('@') ? emailOrUsername : 'admin@bicc.gm';
    const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
    const token = await userCredential.user.getIdToken();
    localStorage.setItem('bicc_token', token);
    localStorage.setItem('bicc_username', normalizedEmail);
    return true;
  } catch (err) {
    console.error('Firebase Auth Error:', err);
    return false;
  }
}

export async function verifyToken(): Promise<boolean> {
  if (isDummyConfig()) return !!localStorage.getItem('bicc_token');
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(!!user);
    });
  });
}

export function logoutAdmin() {
  if (!isDummyConfig()) signOut(auth).catch(console.error);
  localStorage.removeItem('bicc_token');
  localStorage.removeItem('bicc_username');
}

export function isAdminLoggedIn(): boolean {
  return !!localStorage.getItem('bicc_token');
}

export async function fetchEvents(): Promise<any[]> {
  if (isDummyConfig()) return getLocal(STORAGE_KEYS.events, defaultEvents);
  const snap = await getDocs(collection(db, 'events'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

export async function createEvent(data: any): Promise<any> {
  if (isDummyConfig()) {
    const list = getLocal<any[]>(STORAGE_KEYS.events, defaultEvents);
    const item = { id: Date.now().toString(), ...data };
    list.push(item);
    saveLocal(STORAGE_KEYS.events, list);
    return item;
  }
  const docRef = await addDoc(collection(db, 'events'), data);
  return { id: docRef.id, ...data };
}

export async function updateEvent(id: string | number, data: any): Promise<void> {
  if (isDummyConfig()) {
    const list = getLocal<any[]>(STORAGE_KEYS.events, defaultEvents);
    saveLocal(STORAGE_KEYS.events, list.map((e) => (e.id === id.toString() ? { ...e, ...data } : e)));
    return;
  }
  await updateDoc(doc(db, 'events', id.toString()), data);
}

export async function deleteEvent(id: string | number): Promise<void> {
  if (isDummyConfig()) {
    const list = getLocal<any[]>(STORAGE_KEYS.events, defaultEvents);
    saveLocal(STORAGE_KEYS.events, list.filter((e) => e.id !== id.toString()));
    return;
  }
  await deleteDoc(doc(db, 'events', id.toString()));
}

export async function fetchVenues(): Promise<any[]> {
  if (isDummyConfig()) return getLocal(STORAGE_KEYS.venues, defaultVenues);
  const snap = await getDocs(collection(db, 'venues'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

export async function createVenue(data: any): Promise<any> {
  if (isDummyConfig()) {
    const list = getLocal<any[]>(STORAGE_KEYS.venues, defaultVenues);
    const item = { id: Date.now().toString(), ...data };
    list.push(item);
    saveLocal(STORAGE_KEYS.venues, list);
    return item;
  }
  const docRef = await addDoc(collection(db, 'venues'), data);
  return { id: docRef.id, ...data };
}

export async function updateVenue(id: string | number, data: any): Promise<void> {
  if (isDummyConfig()) {
    const list = getLocal<any[]>(STORAGE_KEYS.venues, defaultVenues);
    saveLocal(STORAGE_KEYS.venues, list.map((v) => (v.id === id.toString() ? { ...v, ...data } : v)));
    return;
  }
  await updateDoc(doc(db, 'venues', id.toString()), data);
}

export async function deleteVenue(id: string | number): Promise<void> {
  if (isDummyConfig()) {
    const list = getLocal<any[]>(STORAGE_KEYS.venues, defaultVenues);
    saveLocal(STORAGE_KEYS.venues, list.filter((v) => v.id !== id.toString()));
    return;
  }
  await deleteDoc(doc(db, 'venues', id.toString()));
}

export async function fetchGallery(): Promise<any[]> {
  if (isDummyConfig()) return getLocal(STORAGE_KEYS.gallery, defaultGallery);
  const snap = await getDocs(collection(db, 'gallery'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

export async function createGalleryItem(data: any): Promise<any> {
  if (isDummyConfig()) {
    const list = getLocal<any[]>(STORAGE_KEYS.gallery, defaultGallery);
    const item = { id: Date.now().toString(), ...data };
    list.push(item);
    saveLocal(STORAGE_KEYS.gallery, list);
    return item;
  }
  const docRef = await addDoc(collection(db, 'gallery'), data);
  return { id: docRef.id, ...data };
}

export async function updateGalleryItem(id: string | number, data: any): Promise<void> {
  if (isDummyConfig()) {
    const list = getLocal<any[]>(STORAGE_KEYS.gallery, defaultGallery);
    saveLocal(STORAGE_KEYS.gallery, list.map((g) => (g.id === id.toString() ? { ...g, ...data } : g)));
    return;
  }
  await updateDoc(doc(db, 'gallery', id.toString()), data);
}

export async function deleteGalleryItem(id: string | number): Promise<void> {
  if (isDummyConfig()) {
    const list = getLocal<any[]>(STORAGE_KEYS.gallery, defaultGallery);
    saveLocal(STORAGE_KEYS.gallery, list.filter((g) => g.id !== id.toString()));
    return;
  }
  await deleteDoc(doc(db, 'gallery', id.toString()));
}

export async function fetchNews(): Promise<any[]> {
  if (isDummyConfig()) return getLocal(STORAGE_KEYS.news, defaultNews);
  const snap = await getDocs(collection(db, 'news'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

export async function createNews(data: any): Promise<any> {
  if (isDummyConfig()) {
    const list = getLocal<any[]>(STORAGE_KEYS.news, defaultNews);
    const item = { id: Date.now().toString(), ...data };
    list.unshift(item);
    saveLocal(STORAGE_KEYS.news, list);
    return item;
  }
  const docRef = await addDoc(collection(db, 'news'), data);
  return { id: docRef.id, ...data };
}

export async function updateNews(id: string | number, data: any): Promise<void> {
  if (isDummyConfig()) {
    const list = getLocal<any[]>(STORAGE_KEYS.news, defaultNews);
    saveLocal(STORAGE_KEYS.news, list.map((n) => (n.id === id.toString() ? { ...n, ...data } : n)));
    return;
  }
  await updateDoc(doc(db, 'news', id.toString()), data);
}

export async function deleteNewsItem(id: string | number): Promise<void> {
  if (isDummyConfig()) {
    const list = getLocal<any[]>(STORAGE_KEYS.news, defaultNews);
    saveLocal(STORAGE_KEYS.news, list.filter((n) => n.id !== id.toString()));
    return;
  }
  await deleteDoc(doc(db, 'news', id.toString()));
}

export async function submitContact(data: any): Promise<any> {
  const contactData = { ...data, created_at: new Date().toISOString(), read: false };
  if (isDummyConfig()) {
    const list = getLocal<any[]>(STORAGE_KEYS.contacts, []);
    const item = { id: Date.now().toString(), ...contactData };
    list.unshift(item);
    saveLocal(STORAGE_KEYS.contacts, list);
    return item;
  }
  const docRef = await addDoc(collection(db, 'contacts'), contactData);
  return { id: docRef.id, ...contactData };
}

export async function fetchContacts(): Promise<any[]> {
  if (isDummyConfig()) return getLocal(STORAGE_KEYS.contacts, []);
  const snap = await getDocs(collection(db, 'contacts'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

export async function markContactRead(id: string | number): Promise<void> {
  if (isDummyConfig()) {
    const list = getLocal<any[]>(STORAGE_KEYS.contacts, []);
    saveLocal(STORAGE_KEYS.contacts, list.map((c) => (c.id === id.toString() ? { ...c, read: true } : c)));
    return;
  }
  await updateDoc(doc(db, 'contacts', id.toString()), { read: true });
}

export async function deleteContact(id: string | number): Promise<void> {
  if (isDummyConfig()) {
    const list = getLocal<any[]>(STORAGE_KEYS.contacts, []);
    saveLocal(STORAGE_KEYS.contacts, list.filter((c) => c.id !== id.toString()));
    return;
  }
  await deleteDoc(doc(db, 'contacts', id.toString()));
}

export async function fetchDashboard(): Promise<any> {
  const events = await fetchEvents();
  const news = await fetchNews();
  const contacts = await fetchContacts();
  const gallery = await fetchGallery();
  const venues = await fetchVenues();

  return {
    events: events.length,
    news: news.length,
    contacts: contacts.length,
    unreadContacts: contacts.filter((c) => !c.read).length,
    gallery: gallery.length,
    venues: venues.length,
  };
}


// User Management Functions
export async function fetchUsers(): Promise<any[]> {
  if (isDummyConfig()) return getLocal(STORAGE_KEYS.users, []);
  const snap = await getDocs(collection(db, 'users'));
  return snap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

export async function createUser(data: any): Promise<any> {
  const userData = { 
    ...data, 
    created_at: new Date().toISOString(),
    role: data.role || 'Staff'
  };
  
  if (isDummyConfig()) {
    const list = getLocal<any[]>(STORAGE_KEYS.users, []);
    // Check if email or username already exists
    if (list.some(u => u.email === data.email || u.username === data.username)) {
      throw new Error('Email or username already exists');
    }
    const item = { id: Date.now().toString(), ...userData };
    list.push(item);
    saveLocal(STORAGE_KEYS.users, list);
    return item;
  }
  
  const docRef = await addDoc(collection(db, 'users'), userData);
  return { id: docRef.id, ...userData };
}

export async function updateUser(id: string | number, data: any): Promise<void> {
  if (isDummyConfig()) {
    const list = getLocal<any[]>(STORAGE_KEYS.users, []);
    saveLocal(STORAGE_KEYS.users, list.map((u) => (u.id === id.toString() ? { ...u, ...data } : u)));
    return;
  }
  await updateDoc(doc(db, 'users', id.toString()), data);
}

export async function deleteUser(id: string | number): Promise<void> {
  if (isDummyConfig()) {
    const list = getLocal<any[]>(STORAGE_KEYS.users, []);
    saveLocal(STORAGE_KEYS.users, list.filter((u) => u.id !== id.toString()));
    return;
  }
  await deleteDoc(doc(db, 'users', id.toString()));
}

export function getCurrentUserRole(): string {
  return localStorage.getItem('bicc_user_role') || 'Staff';
}

export function isSuperAdmin(): boolean {
  return getCurrentUserRole() === 'Super Admin';
}


// Permission System
export function hasPermission(action: string): boolean {
  const role = getCurrentUserRole();
  
  const permissions: Record<string, string[]> = {
    'Super Admin': ['events', 'news', 'contacts', 'gallery', 'venues', 'users', 'delete', 'edit'],
    'Manager': ['events', 'news', 'contacts', 'gallery', 'venues', 'delete', 'edit'],
    'Staff': ['events', 'news', 'contacts', 'view_gallery', 'view_venues'],
  };
  
  return permissions[role]?.includes(action) || false;
}

export function canAccessTab(tab: string): boolean {
  const role = getCurrentUserRole();
  
  const tabAccess: Record<string, string[]> = {
    'Super Admin': ['dashboard', 'events', 'news', 'contacts', 'gallery', 'venues', 'users'],
    'Manager': ['dashboard', 'events', 'news', 'contacts', 'gallery', 'venues'],
    'Staff': ['dashboard', 'events', 'news', 'contacts'],
  };
  
  return tabAccess[role]?.includes(tab) || false;
}

export function canEdit(): boolean {
  return hasPermission('edit');
}

export function canDelete(): boolean {
  return hasPermission('delete');
}

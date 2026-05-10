import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '..', 'data', 'bicc.db');

// Ensure data directory exists
import fs from 'fs';
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// If database already exists, delete it so that it gets recreated with the new reference image URLs
if (fs.existsSync(DB_PATH)) {
  try {
    fs.unlinkSync(DB_PATH);
    console.log('🔄 Re-initializing database with official reference images...');
  } catch (err) {
    console.warn('Could not reset DB file directly, proceeding with normal connection...');
  }
}

const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ─── CREATE TABLES ──────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS venues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    capacity TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    features TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    caption TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    date TEXT NOT NULL,
    author TEXT NOT NULL,
    image TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT DEFAULT '',
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    read INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// Real official image references
const IMAGES = {
  conferenceMain: 'https://www.oicgambia.org/media/nav/conference-center-8.jpg',
  conferenceLogo: 'https://www.oicgambia.org/media/nav/conference-center-logo.jpg',
  conferenceExterior: 'https://www.oicgambia.org/media/nav/conference-center-4.jpg',
  conferenceHospitality1: 'https://www.oicgambia.org/media/nav/conference-center-1.jpg',
  conferenceHospitality2: 'https://www.oicgambia.org/media/nav/conference-center-2.jpg',
  controlRoom: 'https://www.oicgambia.org/media/nav/control-room-1.jpg',
  conferenceLocation: 'https://www.oicgambia.org/media/nav/conference-center-3.jpg',
  biccPartnership: 'https://www.voicegambia.com/wp-content/uploads/2025/11/aa-9.png',
  biccSigning: 'https://www.voicegambia.com/wp-content/uploads/2025/11/aa-8.png',
  oicSecretariat: 'https://thepoint.gm/assets/Featured-Articles/OIC-secretariat__ScaleMaxWidthWzcwMF0.jpg',
  vvipLounge: '/images/vvip-lounge.jpg',
};

// ─── SEED DEFAULT DATA ──────────────────────────────────────────
function seedIfEmpty() {
  const adminCount = db.prepare('SELECT COUNT(*) as count FROM admin_users').get();
  if (adminCount.count === 0) {
    const hash = bcrypt.hashSync('bicc2025', 10);
    db.prepare('INSERT INTO admin_users (username, password) VALUES (?, ?)').run('admin', hash);
    console.log('✅ Default admin user created (admin / bicc2025)');
  }

  const eventCount = db.prepare('SELECT COUNT(*) as count FROM events').get();
  if (eventCount.count === 0) {
    const insertEvent = db.prepare(`
      INSERT INTO events (title, date, time, location, description, image, category)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const events = [
      ['WACREN 2026 Annual Conference', '2026-03-23', '09:00 AM', 'Sir Dawda Kairaba Jawara International Conference Centre', 'The West and Central African Research and Education Network Annual Conference exploring "Connected Futures: Advancing Africa\'s Digital Sovereignty Through Open Collaboration." Bringing together policymakers, researchers, and higher education leaders.', IMAGES.conferenceMain, 'Conference'],
      ['Africa Governance & Peacebuilding Forum', '2026-06-15', '10:00 AM', 'Plenary Hall', 'UNDP West and Central Africa convenes experts from across the continent to explore how digital innovation can strengthen democratic institutions and governance frameworks.', IMAGES.conferenceHospitality1, 'Summit'],
      ['GHIBAfriTradeX - African Trade & Finance', '2026-09-10', '08:30 AM', 'Sir Dawda Kairaba Jawara International Conference Centre', 'A premier gathering of central banks, commercial banks, development finance institutions and trade advisory firms committed to strengthening Africa\'s financial connectivity.', IMAGES.conferenceExterior, 'Exhibition'],
      ['REFELA National Conference 2026', '2026-03-08', '09:00 AM', 'Sir Dawda Kairaba Jawara International Conference Centre', 'The REFELA National Chapter Conference themed "Accelerating Representation, Safeguarding and Strengthening Women\'s Rights" brings together leaders in women\'s empowerment and governance.', IMAGES.conferenceHospitality2, 'Conference'],
    ];
    const insertMany = db.transaction((rows) => {
      for (const row of rows) insertEvent.run(...row);
    });
    insertMany(events);
    console.log('✅ Seeded', events.length, 'events');
  }

  const venueCount = db.prepare('SELECT COUNT(*) as count FROM venues').get();
  if (venueCount.count === 0) {
    const insertVenue = db.prepare(`
      INSERT INTO venues (name, capacity, description, image, features, sort_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const venues = [
      ['Plenary Hall', '1,013 seats', 'Our flagship conference hall designed in the style of the United Nations General Assembly. This magnificent space features tiered seating, state-of-the-art audio-visual equipment, simultaneous interpretation booths, and is perfect for large-scale international summits and conferences.', IMAGES.conferenceMain, JSON.stringify(['Tiered seating', 'Simultaneous interpretation', '4K display screens', 'Professional sound system', 'Recording facilities']), 1],
      ['Banquet Hall A', '500 guests', 'An elegant and versatile space ideal for grand galas, state dinners, award ceremonies, and large corporate events. Features stunning décor, professional lighting, and full catering support.', IMAGES.conferenceHospitality1, JSON.stringify(['Flexible layout', 'Full catering kitchen', 'Stage area', 'Professional lighting', 'AV equipment']), 2],
      ['Banquet Hall B', '250 guests', 'A refined setting for mid-sized events, workshops, and receptions. Offers the same level of elegance as Banquet Hall A in a more intimate configuration.', IMAGES.conferenceHospitality2, JSON.stringify(['Modular setup', 'Catering support', 'Built-in AV', 'Natural lighting', 'Private entrance']), 3],
      ['Thematic Meeting Rooms (4)', '200 each', 'Four dedicated meeting rooms perfect for breakout sessions, workshops, and focused discussions. Each room is equipped with modern conferencing technology.', IMAGES.controlRoom, JSON.stringify(['Video conferencing', 'Whiteboard walls', 'Climate control', 'High-speed WiFi', 'Flexible seating']), 4],
      ['Bilateral Meeting Rooms (11)', '25 each', 'Eleven private meeting rooms designed for bilateral discussions, negotiations, and intimate meetings. Each room provides a secure and comfortable environment for diplomatic and business discussions.', IMAGES.conferenceExterior, JSON.stringify(['Soundproofed', 'Secure access', 'Refreshment service', 'Display screens', 'Comfortable seating']), 5],
      ['VVIP Airport Lounge', 'Exclusive', 'Located at the Banjul International Airport, our ultra-modern VVIP Lounge provides an exceptional arrival and departure experience for heads of state, diplomats, and distinguished guests.', IMAGES.vvipLounge, JSON.stringify(['Private check-in', 'Luxury furnishing', 'Business center', 'Refreshments', 'Protocol services']), 6],
    ];
    const insertMany = db.transaction((rows) => {
      for (const row of rows) insertVenue.run(...row);
    });
    insertMany(venues);
    console.log('✅ Seeded', venues.length, 'venues');
  }

  const galleryCount = db.prepare('SELECT COUNT(*) as count FROM gallery').get();
  if (galleryCount.count === 0) {
    const insertGallery = db.prepare('INSERT INTO gallery (url, caption, category) VALUES (?, ?, ?)');
    const items = [
      [IMAGES.conferenceLocation, 'SDKJ International Conference Centre - Aerial View', 'Venue'],
      [IMAGES.conferenceMain, 'Plenary Hall - Ready for International Summit', 'Venue'],
      [IMAGES.conferenceExterior, 'Conference Centre - Guest Safety & Security', 'Venue'],
      [IMAGES.conferenceHospitality1, 'Hospitality & Guest Services', 'Events'],
      [IMAGES.conferenceHospitality2, 'World-Class Gambian Hospitality', 'Events'],
      [IMAGES.controlRoom, 'State-of-the-Art Control Room', 'Venue'],
      [IMAGES.conferenceLogo, 'SDKJ Conference Centre Branding', 'Venue'],
      [IMAGES.biccPartnership, 'BICC-EABA Strategic Partnership Signing', 'Events'],
    ];
    const insertMany = db.transaction((rows) => {
      for (const row of rows) insertGallery.run(...row);
    });
    insertMany(items);
    console.log('✅ Seeded', items.length, 'gallery images');
  }

  const newsCount = db.prepare('SELECT COUNT(*) as count FROM news').get();
  if (newsCount.count === 0) {
    const insertNews = db.prepare('INSERT INTO news (title, excerpt, content, date, author, image) VALUES (?, ?, ?, ?, ?, ?)');
    const items = [
      ['BICC Hosts UNDP Africa Governance & Peacebuilding Community of Practice', 'The Sir Dawda Kairaba Jawara International Conference Centre continues to serve as a space for important continental conversations.', 'The Sir Dawda Kairaba Jawara International Conference Centre (SDKJICC) continues to serve as a space for important continental conversations. We were pleased to host the Africa Governance & Peacebuilding Community of Practice convened by UNDP West and Central Africa in Banjul. Experts from across Africa explored how digital innovation can strengthen democratic institutions.', '2026-03-15', 'BICC Communications', IMAGES.conferenceMain],
      ['WACREN 2026 Conference Successfully Held at SDKJICC', 'Policymakers, researchers, and higher education leaders gathered to discuss "Connected Futures: Advancing Africa\'s Digital Sovereignty."', 'The WACREN 2026 Annual Conference brought together policymakers, researchers, and higher education leaders at the Sir Dawda Kairaba Jawara International Conference Centre. The historic launch of GAMREN - the Gambia Research and Education Network - was a milestone moment. His Excellency President Adama Barrow delivered the formal launch statement during the opening ceremony.', '2026-03-27', 'BICC Communications', IMAGES.conferenceLocation],
      ['OIC Secretariat Officially Renamed to Banjul International Convention Centre', 'Vice President Muhammed B.S. Jallow presided over the inauguration of the newly renamed BICC.', 'The former OIC Secretariat has officially transitioned to the Banjul International Convention Centre Ltd. (BICC), a limited liability company responsible for the management of the Sir Dawda Kairaba Jawara International Conference Centre and the VVIP Lounge at Banjul International Airport. Both facilities were constructed in preparation for the 15th OIC Islamic Summit.', '2025-09-22', 'BICC Communications', IMAGES.oicSecretariat],
      ['BICC Signs Strategic Partnership with Egyptian African Businessmen\'s Association', 'BICC CEO Ambassador Yankuba Dibba and EABA Chairman Dr. Yousrey El-Sharkawi signed an MoU to boost regional cooperation.', 'The Banjul International Convention Centre Limited (BICC) has formalised a new strategic partnership with the Egyptian African Businessmen\'s Association (EABA) through a Memorandum of Understanding (MoU) signed during a virtual ceremony on 24 November 2025. The partnership will support the organisation of conferences, networking platforms, and business development forums, while also exploring opportunities for shared investments that benefit their member networks.', '2025-11-26', 'BICC Communications', IMAGES.biccPartnership],
    ];
    const insertMany = db.transaction((rows) => {
      for (const row of rows) insertNews.run(...row);
    });
    insertMany(items);
    console.log('✅ Seeded', items.length, 'news articles');
  }
}

seedIfEmpty();

export default db;

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import fs from 'fs';
import db from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'bicc-secret-key-change-in-production-2025';

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// Serve the built frontend + static images
const distDir = path.join(__dirname, '..', 'dist');
const publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(distDir));
app.use('/images', express.static(path.join(publicDir, 'images')));

// File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(null, ext && mime);
  },
});

// ─── AUTH MIDDLEWARE ─────────────────────────────────────────────
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// ─── AUTH ROUTES ────────────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, username: user.username });
});

app.get('/api/auth/verify', authMiddleware, (req, res) => {
  res.json({ valid: true, username: req.user.username });
});

app.post('/api/auth/change-password', authMiddleware, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = db.prepare('SELECT * FROM admin_users WHERE id = ?').get(req.user.id);
  if (!bcrypt.compareSync(currentPassword, user.password)) {
    return res.status(400).json({ error: 'Current password is incorrect' });
  }
  const hash = bcrypt.hashSync(newPassword, 10);
  db.prepare('UPDATE admin_users SET password = ? WHERE id = ?').run(hash, req.user.id);
  res.json({ success: true });
});

// ─── EVENTS (PUBLIC) ────────────────────────────────────────────
app.get('/api/events', (req, res) => {
  const events = db.prepare('SELECT * FROM events ORDER BY date ASC').all();
  res.json(events);
});

app.get('/api/events/:id', (req, res) => {
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found' });
  res.json(event);
});

// ─── EVENTS (ADMIN) ─────────────────────────────────────────────
app.post('/api/events', authMiddleware, (req, res) => {
  const { title, date, time, location, description, image, category } = req.body;
  const result = db.prepare(
    'INSERT INTO events (title, date, time, location, description, image, category) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(title, date, time, location, description, image, category);
  res.json({ id: result.lastInsertRowid, ...req.body });
});

app.put('/api/events/:id', authMiddleware, (req, res) => {
  const { title, date, time, location, description, image, category } = req.body;
  db.prepare(
    'UPDATE events SET title=?, date=?, time=?, location=?, description=?, image=?, category=?, updated_at=datetime("now") WHERE id=?'
  ).run(title, date, time, location, description, image, category, req.params.id);
  res.json({ success: true });
});

app.delete('/api/events/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM events WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ─── VENUES (PUBLIC) ────────────────────────────────────────────
app.get('/api/venues', (req, res) => {
  const venues = db.prepare('SELECT * FROM venues ORDER BY sort_order ASC').all();
  res.json(venues.map(v => ({ ...v, features: JSON.parse(v.features) })));
});

// ─── VENUES (ADMIN) ─────────────────────────────────────────────
app.post('/api/venues', authMiddleware, (req, res) => {
  const { name, capacity, description, image, features, sort_order } = req.body;
  const result = db.prepare(
    'INSERT INTO venues (name, capacity, description, image, features, sort_order) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(name, capacity, description, image, JSON.stringify(features), sort_order || 0);
  res.json({ id: result.lastInsertRowid });
});

app.put('/api/venues/:id', authMiddleware, (req, res) => {
  const { name, capacity, description, image, features, sort_order } = req.body;
  db.prepare(
    'UPDATE venues SET name=?, capacity=?, description=?, image=?, features=?, sort_order=? WHERE id=?'
  ).run(name, capacity, description, image, JSON.stringify(features), sort_order || 0, req.params.id);
  res.json({ success: true });
});

app.delete('/api/venues/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM venues WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ─── GALLERY (PUBLIC) ───────────────────────────────────────────
app.get('/api/gallery', (req, res) => {
  const images = db.prepare('SELECT * FROM gallery ORDER BY created_at DESC').all();
  res.json(images);
});

// ─── GALLERY (ADMIN) ────────────────────────────────────────────
app.post('/api/gallery', authMiddleware, (req, res) => {
  const { url, caption, category } = req.body;
  const result = db.prepare('INSERT INTO gallery (url, caption, category) VALUES (?, ?, ?)').run(url, caption, category);
  res.json({ id: result.lastInsertRowid });
});

app.delete('/api/gallery/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM gallery WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ─── NEWS (PUBLIC) ──────────────────────────────────────────────
app.get('/api/news', (req, res) => {
  const news = db.prepare('SELECT * FROM news ORDER BY date DESC').all();
  res.json(news);
});

app.get('/api/news/:id', (req, res) => {
  const item = db.prepare('SELECT * FROM news WHERE id = ?').get(req.params.id);
  if (!item) return res.status(404).json({ error: 'Article not found' });
  res.json(item);
});

// ─── NEWS (ADMIN) ───────────────────────────────────────────────
app.post('/api/news', authMiddleware, (req, res) => {
  const { title, excerpt, content, date, author, image } = req.body;
  const result = db.prepare(
    'INSERT INTO news (title, excerpt, content, date, author, image) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(title, excerpt, content, date, author, image);
  res.json({ id: result.lastInsertRowid });
});

app.put('/api/news/:id', authMiddleware, (req, res) => {
  const { title, excerpt, content, date, author, image } = req.body;
  db.prepare(
    'UPDATE news SET title=?, excerpt=?, content=?, date=?, author=?, image=?, updated_at=datetime("now") WHERE id=?'
  ).run(title, excerpt, content, date, author, image, req.params.id);
  res.json({ success: true });
});

app.delete('/api/news/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM news WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ─── CONTACTS (PUBLIC - submit only) ────────────────────────────
app.post('/api/contacts', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const result = db.prepare(
    'INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)'
  ).run(name, email, phone || '', subject, message);
  res.json({ id: result.lastInsertRowid, success: true });
});

// ─── CONTACTS (ADMIN) ──────────────────────────────────────────
app.get('/api/contacts', authMiddleware, (req, res) => {
  const contacts = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all();
  res.json(contacts.map(c => ({ ...c, read: !!c.read })));
});

app.patch('/api/contacts/:id/read', authMiddleware, (req, res) => {
  db.prepare('UPDATE contacts SET read = 1 WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.delete('/api/contacts/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM contacts WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ─── UPLOAD (ADMIN) ─────────────────────────────────────────────
app.post('/api/upload', authMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// ─── DASHBOARD STATS (ADMIN) ───────────────────────────────────
app.get('/api/dashboard', authMiddleware, (req, res) => {
  const events = db.prepare('SELECT COUNT(*) as count FROM events').get().count;
  const news = db.prepare('SELECT COUNT(*) as count FROM news').get().count;
  const contacts = db.prepare('SELECT COUNT(*) as count FROM contacts').get().count;
  const unreadContacts = db.prepare('SELECT COUNT(*) as count FROM contacts WHERE read = 0').get().count;
  const gallery = db.prepare('SELECT COUNT(*) as count FROM gallery').get().count;
  const venues = db.prepare('SELECT COUNT(*) as count FROM venues').get().count;
  res.json({ events, news, contacts, unreadContacts, gallery, venues });
});
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Example API route
app.get('/api/test', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve React static files
const buildPath = path.join(__dirname, '../build');
app.use(express.static(buildPath));

// SPA fallback — must be LAST
app.get('/*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'), err => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ─── START ──────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log('  🏛️  BICC - Banjul International Convention Centre');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`  🌐  Website:  http://localhost:${PORT}`);
  console.log(`  🔧  API:      http://localhost:${PORT}/api`);
  console.log(`  🔐  Admin:    http://localhost:${PORT}/admin`);
  console.log(`  📁  Database: data/bicc.db`);
  console.log('═══════════════════════════════════════════════════════');
  console.log('  Default login: admin / bicc2025');
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
});

export default app;

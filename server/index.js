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

// ─── MIDDLEWARE ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Serve uploaded files
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// Serve React build + public images
const distDir = path.join(__dirname, '..', 'dist'); // your SPA build
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
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(null, ext && mime);
  },
});

// ─── API ROUTES ──────────────────────────────────────────────
// (Keep all your /api/* routes here, as you already have them)

// ─── SPA FALLBACK ────────────────────────────────────────────
const buildPath = path.join(__dirname, '..', 'build'); // adjust if your React build is somewhere else
app.use(express.static(buildPath)); // serve static files
app.get('/*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'), err => {
    if (err) res.status(500).send(err);
  });
});

// ─── START SERVER ────────────────────────────────────────────
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
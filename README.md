# BICC — Banjul International Convention Centre

Website and admin portal for the Banjul International Convention Centre (BICC), managing the Sir Dawda Kairaba Jawara International Conference Centre in The Gambia.

## Project structure

This repo contains **two separate apps** that share the same Firebase project (`bicc-gambia`):

| App | Folder | URL (production) |
|-----|--------|------------------|
| Public website | `apps/public-site` | https://bicc-gambia.web.app |
| Admin portal | `apps/admin-portal` | https://bicc-gambia-admin.web.app |

> **Note:** The root `src/` folder is legacy and no longer used. Always work in `apps/public-site` or `apps/admin-portal`.

---

## Quick start

### 1. Install dependencies (each app separately)

```bash
cd apps/public-site && npm install
cd ../admin-portal && npm install
```

Or from the repo root:

```bash
npm run install:all
```

### 2. Run development servers

**Public site** (http://localhost:5173):

```bash
npm run dev:public
```

**Admin portal** (http://localhost:5173):

```bash
npm run dev:admin
```

---

## Available commands (from repo root)

| Command | Description |
|---------|-------------|
| `npm run install:all` | Install deps for both apps |
| `npm run dev:public` | Start public site dev server |
| `npm run dev:admin` | Start admin portal dev server |
| `npm run build:public` | Build public site |
| `npm run build:admin` | Build admin portal |
| `npm run build` | Build both apps |

---

## Tech stack

- **Frontend:** React 18 + TypeScript + Vite 6
- **Styling:** Tailwind CSS 4
- **Routing:** React Router DOM
- **Backend:** Firebase (Firestore, Auth, Storage) — client-side
- **Email:** EmailJS
- **Deployment:** Firebase Hosting

---

## Admin portal

Production URL: **https://bicc-gambia-admin.web.app**

### First-time setup

1. Visit `/setup` on the admin portal **once** to create the first Super Admin account.
2. After setup completes, `/setup` is permanently disabled.
3. Additional users are created by a Super Admin from the **Users** tab.

### Admin features

- Dashboard, content management, page editor, media library
- Events, news, bookings, venues, gallery
- Team & board, partners, hotels
- Careers, tenders, downloads, pricing, quotations
- Contact messages, newsletter subscribers
- Role-based user management (Super Admin, Manager, Staff, Editor)

---

## Database

All data is stored in **Firebase Firestore**. There is no SQLite or Express server.

Key collections: `events`, `news`, `bookings`, `venues`, `gallery`, `contacts`, `teamMembers`, `hotels`, `users`, `pageContent`, `siteSettings`, `mediaLibrary`

Security rules are in each app's `firestore.rules` file.

---

## Environment variables

Copy `.env.example` to `.env` in each app folder (`apps/public-site` and `apps/admin-portal`).

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service ID |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template ID |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS public key |

Defaults are baked in for local development if `.env` is not set.

---

## Deployment

Use the batch scripts from the repo root:

| Script | What it deploys |
|--------|-----------------|
| `deploy-main.bat` | Public site (hosting + firestore + storage) |
| `deploy-admin.bat` | Admin portal (if present) |
| `deploy-both.bat` | Both apps |
| `deploy-firestore-rules.bat` | Firestore rules only |

### After deploying security rule updates

If you already have a Super Admin account, create this document in Firebase Console so `/setup` stays closed:

```
Collection: system
Document ID: setup
Fields: { complete: true }
```

---

## Production checklist

1. Deploy both apps with `deploy-both.bat`
2. Confirm `/setup` is closed (create `system/setup` doc if needed)
3. Create admin users only through the Users tab
4. Set strong passwords for all admin accounts
5. Optionally move Firebase/EmailJS keys to `.env` files

---

Built for the Banjul International Convention Centre, The Gambia

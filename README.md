# 🏛️ BICC - Banjul International Convention Centre

A full-stack website with admin panel for the Banjul International Convention Centre (BICC), managing the Sir Dawda Kairaba Jawara International Conference Centre in The Gambia.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

The site will be available at **http://localhost:5173**

---

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm run dev` | Start Vite dev server (http://localhost:5173) |
| `npm run build` | Build for production (outputs to dist/) |
| `npm run preview` | Preview production build locally |

---

## 🔧 Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS 4
- **Routing:** React Router DOM
- **Backend:** Firebase (Firestore + Authentication + Storage)
- **Deployment:** Firebase Hosting
- **Email:** EmailJS for notifications

---

## 🔐 Admin Panel

Access the admin panel at `/admin`

**Default credentials:**
- **Username:** `admin`
- **Password:** `bicc2025`

### Admin Features:
- 📊 **Dashboard** — Overview stats & unread messages
- 📅 **Events** — Create, edit, delete events
- 📰 **News** — Publish and manage news articles
- 💬 **Messages** — Read and manage contact form submissions
- 🖼️ **Gallery** — Add/remove gallery images
- 🏢 **Venues** — View venue information

---

## 🗄️ Database

The app uses **SQLite** (via `better-sqlite3`) for persistent data storage.

- **Database file:** `data/bicc.db`
- **Auto-created** on first run with seed data
- **Uploaded files:** stored in `uploads/` directory

### Tables:
- `admin_users` — Admin authentication (bcrypt-hashed passwords)
- `events` — Conference events & summits
- `venues` — Venue information & features
- `gallery` — Photo gallery images
- `news` — News articles
- `contacts` — Contact form submissions
- `site_settings` — Key-value site configuration

---

## 🏗️ Architecture

```
├── server/           # Express.js backend
│   ├── index.js      # API routes & server
│   ├── db.js         # SQLite database setup & seeding
│   └── start.js      # Production launcher
├── src/              # React frontend
│   ├── api.ts        # API client (fetch wrapper)
│   ├── hooks/        # Custom React hooks
│   ├── pages/        # Page components
│   ├── components/   # Shared components
│   └── images.ts     # Image path constants
├── public/images/    # Static images
├── data/             # SQLite database (auto-created)
├── uploads/          # User-uploaded files (auto-created)
└── dist/             # Built frontend (after npm run build)
```

---

## 🌍 API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | List all events |
| GET | `/api/venues` | List all venues |
| GET | `/api/gallery` | List gallery images |
| GET | `/api/news` | List news articles |
| POST | `/api/contacts` | Submit contact form |

### Admin (requires JWT token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login & get JWT |
| GET | `/api/auth/verify` | Verify token |
| POST | `/api/auth/change-password` | Change password |
| GET | `/api/dashboard` | Dashboard stats |
| POST/PUT/DELETE | `/api/events/:id` | Manage events |
| POST/PUT/DELETE | `/api/news/:id` | Manage news |
| POST/DELETE | `/api/gallery/:id` | Manage gallery |
| GET/PATCH/DELETE | `/api/contacts/:id` | Manage messages |
| POST | `/api/upload` | Upload images |

---

## 🔧 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |
| `JWT_SECRET` | (built-in) | JWT signing secret — **change in production!** |

---

## 📝 Production Deployment Checklist

1. ✅ Change the default admin password after first login
2. ✅ Set a strong `JWT_SECRET` environment variable
3. ✅ Run `npm run build` before starting the server
4. ✅ Use a process manager like PM2 for auto-restart
5. ✅ Set up a reverse proxy (nginx) for HTTPS
6. ✅ Back up `data/bicc.db` regularly

---

Built with ❤️ for the Banjul International Convention Centre, The Gambia 🇬🇲

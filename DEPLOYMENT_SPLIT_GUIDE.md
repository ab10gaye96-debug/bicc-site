# BICC Deployment Guide - Split Architecture

**Date:** June 10, 2026  
**Status:** ✅ Split Complete - Ready for Testing

---

## 🎯 Architecture Overview

The BICC project has been successfully split into two separate applications:

### 1. **Public Website** → `https://bicc.gm`
- All public-facing pages
- Booking and contact forms
- Events, news, gallery, venues
- Destination Gambia portal
- Careers and procurement

### 2. **Admin Portal** → `https://admin.bicc.gm`
- Dedicated admin login
- Full dashboard with all modules
- Content management
- Booking and contact management
- User and role management

### 3. **Shared Firebase Backend**
- Same Firestore database
- Same Firebase Authentication
- Same Firebase Storage
- Same project: `bicc-gambia`

---

## 📁 New Directory Structure

```
BICC SITE WORK/
├── apps/
│   ├── public-site/                # Public website (bicc.gm)
│   │   ├── dist/                   # Build output
│   │   ├── public/                 # Static assets
│   │   ├── src/
│   │   │   ├── components/         # Navbar, Footer, etc.
│   │   │   ├── hooks/
│   │   │   ├── pages/              # All public pages
│   │   │   ├── types/
│   │   │   ├── utils/
│   │   │   ├── api.ts              # Public API (read + submit)
│   │   │   ├── App.tsx             # Public routes
│   │   │   ├── firebase.ts
│   │   │   └── main.tsx
│   │   ├── .firebaserc
│   │   ├── firebase.json
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   └── index.html
│   │
│   └── admin-portal/               # Admin dashboard (admin.bicc.gm)
│       ├── dist/                   # Build output
│       ├── public/                 # Minimal assets (logo only)
│       ├── src/
│       │   ├── components/
│       │   │   └── admin/          # All admin tabs
│       │   ├── pages/
│       │   │   └── Admin.tsx       # Main admin page
│       │   ├── types/
│       │   ├── utils/
│       │   ├── api.ts              # Admin API (auth + CRUD)
│       │   ├── App.tsx             # Admin routes
│       │   ├── firebase.ts
│       │   └── main.tsx
│       ├── .firebaserc
│       ├── firebase.json
│       ├── package.json
│       ├── tsconfig.json
│       ├── vite.config.ts
│       └── index.html
│
├── firebase/                       # Shared Firebase configuration
│   ├── .firebaserc
│   ├── firebase.json
│   ├── firestore.rules
│   └── storage.rules
│
└── docs/                           # Documentation
    └── [all .md files]
```

---

## 🚀 Deployment Instructions

### Step 1: Install Dependencies

```bash
# Public site
cd apps/public-site
npm install

# Admin portal
cd ../admin-portal
npm install
```

### Step 2: Test Locally

**Terminal 1 - Public Site:**
```bash
cd apps/public-site
npm run dev
```
Visit: http://localhost:5173

**Terminal 2 - Admin Portal:**
```bash
cd apps/admin-portal
npm run dev
```
Visit: http://localhost:5174 (different port)

### Step 3: Build for Production

```bash
# Build public site
cd apps/public-site
npm run build

# Build admin portal
cd apps/admin-portal
npm run build
```

### Step 4: Deploy Firebase Rules (First Time Only)

```bash
cd firebase
firebase login
firebase use bicc-gambia
firebase deploy --only firestore:rules,storage
```

### Step 5: Configure Firebase Hosting Targets

```bash
# In the firebase directory
firebase target:apply hosting public bicc-public
firebase target:apply hosting admin bicc-admin
```

### Step 6: Deploy to Firebase Hosting

**Deploy Public Site:**
```bash
cd apps/public-site
firebase deploy --only hosting:public
```

**Deploy Admin Portal:**
```bash
cd apps/admin-portal
firebase deploy --only hosting:admin
```

**Deploy Both:**
```bash
# From root directory
cd apps/public-site && firebase deploy --only hosting:public && cd ../admin-portal && firebase deploy --only hosting:admin
```

### Step 7: Configure Custom Domains

In [Firebase Console](https://console.firebase.google.com/project/bicc-gambia/hosting):

1. **Public Site:**
   - Go to Hosting → bicc-public
   - Add custom domain: `bicc.gm`
   - Follow DNS configuration steps

2. **Admin Portal:**
   - Go to Hosting → bicc-admin
   - Add custom domain: `admin.bicc.gm`
   - Follow DNS configuration steps

---

## 🧪 Testing Checklist

### Public Site Tests (`https://bicc.gm`)

**Navigation & Pages:**
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] All public pages accessible
- [ ] Mobile menu works
- [ ] Footer links work
- [ ] No broken links
- [ ] **No admin links visible** ✓

**Forms:**
- [ ] Booking form submits successfully
- [ ] Contact form submits successfully
- [ ] Career application submits
- [ ] Newsletter subscription works
- [ ] Form validation works
- [ ] Confirmation emails sent

**Content:**
- [ ] Events page displays correctly
- [ ] News page displays correctly
- [ ] Gallery loads images
- [ ] Venues page shows all venues
- [ ] Downloads page works
- [ ] Search functionality works

**Responsive:**
- [ ] Mobile (320px-480px) responsive
- [ ] Tablet (768px) responsive
- [ ] Desktop (1024px+) responsive
- [ ] No horizontal scroll

**Performance:**
- [ ] Page load time < 3 seconds
- [ ] Images load correctly
- [ ] No console errors

### Admin Portal Tests (`https://admin.bicc.gm`)

**Authentication:**
- [ ] Admin login works (email)
- [ ] Admin login works (username)
- [ ] Wrong credentials show error
- [ ] Token verification works
- [ ] Logout works

**Dashboard:**
- [ ] Dashboard loads correctly
- [ ] Statistics display properly
- [ ] Recent messages show
- [ ] Pending bookings show

**Admin Tabs:**
- [ ] Events tab - view, create, edit, delete
- [ ] News tab - view, create, edit, delete
- [ ] Contacts tab - view, mark read, reply, delete
- [ ] Bookings tab - view, update status, delete
- [ ] Gallery tab - view, upload, delete
- [ ] Venues tab - view, create, edit, delete
- [ ] Users tab - view, create, edit, delete (Super Admin only)
- [ ] Testimonials tab works
- [ ] Partners tab works
- [ ] Downloads tab works
- [ ] Careers tab works
- [ ] Tenders tab works
- [ ] Subscribers tab works
- [ ] Pricing tab works
- [ ] Quotations tab works
- [ ] Booking Workflow tab works
- [ ] Customers tab works

**Permissions:**
- [ ] Role-based access works
- [ ] Super Admin sees all tabs
- [ ] Manager sees correct tabs
- [ ] Staff sees limited tabs
- [ ] Edit/delete permissions work

**File Uploads:**
- [ ] Image upload works (events)
- [ ] Document upload works (downloads)
- [ ] Gallery upload works
- [ ] File size limits enforced

**Integration:**
- [ ] Email notifications sent
- [ ] Firestore updates reflect immediately
- [ ] Firebase Storage works

**Performance:**
- [ ] No console errors
- [ ] Page load time acceptable
- [ ] All components render

### Cross-App Integration Tests

- [ ] Public booking appears in admin dashboard
- [ ] Admin event changes reflect on public site immediately
- [ ] Admin news changes reflect on public site immediately
- [ ] Public contact form appears in admin contacts
- [ ] Public job application appears in admin careers
- [ ] Firebase Auth shared correctly
- [ ] Firestore data shared correctly
- [ ] Storage files accessible by both apps

---

## 📝 Development Workflow

### Making Changes to Public Site

```bash
cd apps/public-site

# Make your changes to src/ files

# Test locally
npm run dev

# Build
npm run build

# Deploy
firebase deploy --only hosting:public
```

### Making Changes to Admin Portal

```bash
cd apps/admin-portal

# Make your changes to src/ files

# Test locally
npm run dev

# Build
npm run build

# Deploy
firebase deploy --only hosting:admin
```

### Updating Firebase Rules

```bash
cd firebase

# Edit firestore.rules or storage.rules

# Deploy
firebase deploy --only firestore:rules,storage
```

---

## 🔍 API Function Distribution

### Public API (`apps/public-site/src/api.ts`)

**Read-Only Functions:**
- `fetchEvents()`
- `fetchVenues()`
- `fetchGallery()`
- `fetchNews()`
- `fetchDownloads()`
- `fetchVacancies()`
- `fetchTenders()`
- `fetchTestimonials()`
- `fetchPartners()`

**Submission Functions:**
- `submitBooking()`
- `submitContact()`
- `createApplication()`
- `subscribeNewsletter()`

**Utility Functions:**
- `checkAvailability()`
- `searchContent()`

### Admin API (`apps/admin-portal/src/api.ts`)

**Authentication:**
- `loginAdmin()`
- `logoutAdmin()`
- `verifyToken()`
- `isAdminLoggedIn()`

**Role Management:**
- `getCurrentUserRole()`
- `isSuperAdmin()`
- `hasPermission()`
- `canAccessTab()`
- `canEdit()`
- `canDelete()`

**All CRUD Operations:**
- Events: `create`, `update`, `delete`
- News: `create`, `update`, `delete`
- Venues: `create`, `update`, `delete`
- Gallery: `create`, `update`, `delete`
- Bookings: `update`, `delete`, `replyTo`
- Contacts: `markRead`, `delete`
- Users: `create`, `update`, `delete`
- Testimonials: `create`, `update`, `delete`
- Partners: `create`, `update`, `delete`
- Downloads: `create`, `update`, `delete`
- Vacancies: `create`, `update`, `delete`
- Applications: `update`, `delete`
- Tenders: `create`, `update`, `delete`
- Subscribers: `delete`
- Pricing: `create`, `update`, `delete`
- Quotations: `create`, `update`, `delete`

**Dashboard:**
- `fetchDashboard()`

---

## ⚠️ Important Notes

### Firebase Configuration

Both apps use the **same** Firebase configuration:
```typescript
// apps/public-site/src/firebase.ts
// apps/admin-portal/src/firebase.ts
// (identical files)

const firebaseConfig = {
  apiKey: "AIzaSyBGgiAIAJbV16KnyKxznpYKStJzpsFvQZ4",
  authDomain: "bicc-gambia.firebaseapp.com",
  projectId: "bicc-gambia",
  storageBucket: "bicc-gambia.appspot.com",
  messagingSenderId: "558764119624",
  appId: "1:558764119624:web:09c83f8b7e4a243f17ea7d"
};
```

### Security Considerations

1. **Admin Portal:**
   - Has `X-Frame-Options: DENY` header
   - Has `X-Content-Type-Options: nosniff` header
   - Has `<meta name="robots" content="noindex, nofollow">`
   - Only accessible to authenticated users

2. **Firestore Rules:**
   - Public can read content collections
   - Public can write to bookings, contacts, applications, subscribers
   - Admin write requires authentication
   - Role-based access enforced

3. **Storage Rules:**
   - Public can read all files
   - Only authenticated users can upload
   - File size limits enforced

### Environment Variables

Both apps use the same Firebase project. No environment variables needed for local development or deployment.

### Build Differences

- **Public Site:** Full build with all pages
- **Admin Portal:** Minimal build (only Admin.tsx + components)
- Both use the same Tailwind CSS configuration
- Both use the same Vite configuration (simplified, no single-file plugin for admin)

---

## 🐛 Troubleshooting

### Issue: `npm install` fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Port already in use

**Solution:**
```bash
# Public site uses port 5173
# Admin portal will automatically use 5174

# Or specify port manually
npm run dev -- --port 3000
```

### Issue: Firebase deploy fails

**Solution:**
```bash
# Login again
firebase login --reauth

# Verify project
firebase use bicc-gambia

# Check targets
firebase target:list

# Re-apply targets if needed
firebase target:apply hosting public bicc-public
firebase target:apply hosting admin bicc-admin
```

### Issue: Changes not reflecting

**Solution:**
```bash
# Clear browser cache
# Or use incognito mode

# Rebuild
npm run build

# Re-deploy
firebase deploy --only hosting:public
# or
firebase deploy --only hosting:admin
```

### Issue: Admin can't log in

**Check:**
1. User exists in Firestore `users` collection
2. User has correct role (`Super Admin`, `Manager`, or `Staff`)
3. Firebase Auth has the user
4. Firestore rules allow read access to users collection

### Issue: Public site shows admin links

**This should not happen** - admin links have been removed. If you see them:
1. Check you're on the correct deployment (bicc.gm, not admin.bicc.gm)
2. Clear browser cache
3. Verify `apps/public-site/src/components/Navbar.tsx` doesn't have admin links

---

## 📊 Deployment Status

| Component | Status | URL |
|-----------|--------|-----|
| Public Site Code | ✅ Complete | `apps/public-site/` |
| Admin Portal Code | ✅ Complete | `apps/admin-portal/` |
| Firebase Rules | ✅ Ready | `firebase/` |
| Local Testing | ⏳ Pending | Run `npm run dev` |
| Firebase Deployment | ⏳ Pending | Run deploy commands |
| Custom Domains | ⏳ Pending | Configure in Firebase Console |

---

## 🎉 Success Criteria

Deployment is successful when:

- ✅ Both apps install dependencies without errors
- ✅ Both apps run locally without console errors
- ✅ Both apps build successfully
- ✅ Firebase rules deployed
- ✅ Both hosting targets configured
- ✅ Both apps deployed to Firebase
- ✅ Public site accessible at bicc.gm
- ✅ Admin portal accessible at admin.bicc.gm
- ✅ All public pages work
- ✅ All admin tabs work
- ✅ Forms submit successfully
- ✅ Data shared correctly between apps
- ✅ No broken links or console errors

---

## 📞 Next Steps

1. **Test Locally First:**
   ```bash
   # Terminal 1
   cd apps/public-site && npm install && npm run dev

   # Terminal 2 (new terminal)
   cd apps/admin-portal && npm install && npm run dev
   ```

2. **Verify Everything Works**
   - Test all pages
   - Test all forms
   - Test admin functions

3. **Deploy to Firebase:**
   ```bash
   # Deploy rules first
   cd firebase
   firebase deploy --only firestore:rules,storage

   # Deploy public site
   cd ../apps/public-site
   npm run build
   firebase deploy --only hosting:public

   # Deploy admin portal
   cd ../admin-portal
   npm run build
   firebase deploy --only hosting:admin
   ```

4. **Configure Custom Domains**
   - In Firebase Console, add bicc.gm and admin.bicc.gm
   - Update DNS records as instructed

---

**Implementation Completed:** June 10, 2026  
**Ready for Testing:** Yes ✅  
**Ready for Deployment:** Pending Testing  

For questions or issues, refer to the troubleshooting section or the original `ADMIN_PUBLIC_SPLIT_PLAN.md`.

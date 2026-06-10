# Admin/Public Split Implementation Plan

**Date:** June 10, 2026  
**Branch:** `feature/admin-public-split`  
**Backup Branch:** `backup-before-admin-split`

---

## 🎯 Objectives

Split the current monolithic BICC application into two separate deployments:

1. **Public Website** → `https://bicc.gm`
2. **Admin Portal** → `https://admin.bicc.gm`

Both applications will share the same Firebase backend (Firestore, Auth, Storage).

---

## 📁 Target Directory Structure

```
c:\Users\user\Desktop\office project\BICC SITE WORK\
├── apps/
│   ├── public-site/              → Deploy to bicc.gm
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   ├── types/
│   │   │   ├── utils/
│   │   │   ├── api.ts            (Public API only)
│   │   │   ├── App.tsx           (Public routes only)
│   │   │   ├── firebase.ts       (Shared config)
│   │   │   ├── main.tsx
│   │   │   └── index.css
│   │   ├── .firebaserc
│   │   ├── firebase.json
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   │
│   └── admin-portal/             → Deploy to admin.bicc.gm
│       ├── public/
│       ├── src/
│       │   ├── components/
│       │   │   └── admin/        (Admin components)
│       │   ├── pages/
│       │   │   └── Admin.tsx
│       │   ├── types/
│       │   ├── utils/
│       │   ├── api.ts            (Admin API only)
│       │   ├── App.tsx           (Admin routes only)
│       │   ├── firebase.ts       (Shared config)
│       │   ├── main.tsx
│       │   └── index.css
│       ├── .firebaserc
│       ├── firebase.json
│       ├── package.json
│       ├── tsconfig.json
│       └── vite.config.ts
│
├── firebase/                     (Shared Firebase config)
│   ├── firestore.rules
│   ├── storage.rules
│   └── .firebaserc
│
└── docs/                         (Documentation)
    └── [all .md files]
```

---

## 📋 Migration Checklist

### Phase 1: Preparation ✅
- [x] Create backup branch: `backup-before-admin-split`
- [x] Create feature branch: `feature/admin-public-split`
- [x] Document current structure
- [x] Create migration plan

### Phase 2: Directory Setup
- [ ] Create `apps/` directory
- [ ] Create `apps/public-site/` structure
- [ ] Create `apps/admin-portal/` structure
- [ ] Create `firebase/` directory for shared rules

### Phase 3: Public Site Migration
- [ ] Copy public pages to `apps/public-site/src/pages/`
- [ ] Copy shared components to `apps/public-site/src/components/`
- [ ] Copy `src/hooks/` to `apps/public-site/src/hooks/`
- [ ] Copy `src/types/` (excluding admin types)
- [ ] Copy `src/utils/` (excluding admin utilities)
- [ ] Create public-only `api.ts`
- [ ] Create public-only `App.tsx`
- [ ] Copy `firebase.ts`, `main.tsx`, `index.css`
- [ ] Copy `public/` directory
- [ ] Create `package.json` with dependencies
- [ ] Create `vite.config.ts`
- [ ] Create `tsconfig.json`
- [ ] Create `firebase.json` (public hosting target)
- [ ] Create `.firebaserc`

### Phase 4: Admin Portal Migration
- [ ] Copy `src/pages/Admin.tsx` to `apps/admin-portal/src/pages/`
- [ ] Copy `src/components/admin/` to `apps/admin-portal/src/components/admin/`
- [ ] Copy admin-related types
- [ ] Copy admin-related utilities
- [ ] Create admin-only `api.ts`
- [ ] Create admin-only `App.tsx`
- [ ] Copy `firebase.ts`, `main.tsx`, `index.css`
- [ ] Copy minimal `public/` directory (logo only)
- [ ] Create `package.json` with dependencies
- [ ] Create `vite.config.ts`
- [ ] Create `tsconfig.json`
- [ ] Create `firebase.json` (admin hosting target)
- [ ] Create `.firebaserc`

### Phase 5: Code Modifications
- [ ] Remove admin link from public Navbar
- [ ] Remove admin route from public App.tsx
- [ ] Create simplified admin login page
- [ ] Create admin-specific navbar
- [ ] Update import paths in public site
- [ ] Update import paths in admin portal
- [ ] Split `api.ts` functions correctly

### Phase 6: Firebase Configuration
- [ ] Move `firestore.rules` to `firebase/`
- [ ] Move `storage.rules` to `firebase/`
- [ ] Configure Firebase hosting targets
- [ ] Update `.firebaserc` for both apps

### Phase 7: Testing
- [ ] Test public site locally (`npm run dev`)
- [ ] Test admin portal locally (`npm run dev`)
- [ ] Test all public pages
- [ ] Test all admin modules
- [ ] Test booking form submission
- [ ] Test contact form submission
- [ ] Test admin login
- [ ] Test admin CRUD operations
- [ ] Test file uploads (public and admin)
- [ ] Test email notifications

### Phase 8: Build & Deploy
- [ ] Build public site (`npm run build`)
- [ ] Build admin portal (`npm run build`)
- [ ] Test production builds locally
- [ ] Deploy Firebase rules
- [ ] Deploy public site to Firebase Hosting
- [ ] Deploy admin portal to Firebase Hosting
- [ ] Configure custom domains (bicc.gm, admin.bicc.gm)
- [ ] Test deployed sites

### Phase 9: Documentation
- [ ] Update README.md
- [ ] Update deployment guides
- [ ] Create separate deployment instructions for each app
- [ ] Document new development workflow
- [ ] Update project status

### Phase 10: Cleanup
- [ ] Archive old root-level src/ (optional)
- [ ] Update .gitignore
- [ ] Commit all changes
- [ ] Merge to main

---

## 📝 Files to Copy - Public Site

### Pages (All except Admin)
```
src/pages/About.tsx
src/pages/Attractions.tsx
src/pages/Availability.tsx
src/pages/Booking.tsx
src/pages/CareerApply.tsx
src/pages/Careers.tsx
src/pages/Contact.tsx
src/pages/DestinationGambia.tsx
src/pages/Downloads.tsx
src/pages/Events.tsx
src/pages/Gallery.tsx
src/pages/Home.tsx
src/pages/Hotels.tsx
src/pages/Investment.tsx
src/pages/News.tsx
src/pages/NotFound.tsx
src/pages/PlanYourEvent.tsx
src/pages/Procurement.tsx
src/pages/Search.tsx
src/pages/Services.tsx
src/pages/TravelInfo.tsx
src/pages/Venues.tsx
src/pages/WhyGambia.tsx
```

### Components (Exclude admin/)
```
src/components/ErrorBoundary.tsx
src/components/Footer.tsx
src/components/Navbar.tsx (modified - remove admin link)
src/components/NewsletterForm.tsx
src/components/PartnersSection.tsx
src/components/SEO.tsx
src/components/Skeleton.tsx
src/components/TestimonialsSection.tsx
```

### Other Files
```
src/hooks/useApi.ts
src/types/types.ts
src/utils/cn.ts
src/utils/quotationPdf.ts (if public needs it)
src/api.ts (modified - public functions only)
src/emailService.ts
src/firebase.ts
src/images.ts
src/index.css
src/main.tsx
src/store.ts
```

---

## 📝 Files to Copy - Admin Portal

### Pages
```
src/pages/Admin.tsx (entire file)
src/pages/Admin_backup.tsx (optional)
```

### Components
```
src/components/admin/BookingWorkflowTab.tsx
src/components/admin/CareersTab.tsx
src/components/admin/CustomersTab.tsx
src/components/admin/DownloadsTab.tsx
src/components/admin/PartnersTab.tsx
src/components/admin/PricingTab.tsx
src/components/admin/QuotationsTab.tsx
src/components/admin/SubscribersTab.tsx
src/components/admin/TendersTab.tsx
src/components/admin/TestimonialsTab.tsx
src/components/ErrorBoundary.tsx
```

### Other Files
```
src/types/phase3.ts
src/utils/auditLog.ts
src/utils/bookingWorkflow.ts
src/utils/quotationPdf.ts
src/api.ts (modified - admin functions only)
src/emailService.ts
src/firebase.ts
src/images.ts (logo only)
src/index.css
src/main.tsx
```

---

## 🔧 API Split Reference

### Public API Functions (apps/public-site/src/api.ts)
```typescript
// Read-only public data
export async function fetchEvents()
export async function fetchNews()
export async function fetchVenues()
export async function fetchGallery()
export async function fetchDownloads()
export async function fetchCareers()
export async function fetchTenders()

// Public form submissions
export async function submitBooking()
export async function submitContact()
export async function submitCareerApplication()
export async function subscribeNewsletter()

// Public search
export async function searchContent()
```

### Admin API Functions (apps/admin-portal/src/api.ts)
```typescript
// Authentication
export async function loginAdmin()
export async function logoutAdmin()
export async function verifyToken()
export async function isAdminLoggedIn()

// User management
export async function getCurrentUserRole()
export async function isSuperAdmin()
export async function canEdit()
export async function canDelete()
export async function canAccessTab()

// All CRUD operations for admin modules
export async function createEvent()
export async function updateEvent()
export async function deleteEvent()
// ... [all other admin CRUD operations]

// Dashboard
export async function fetchDashboard()
export async function fetchContacts()
export async function fetchBookings()
export async function updateBookingStatus()
// ... [all other admin operations]
```

---

## 🚀 Deployment Instructions

### Public Site Deployment
```bash
cd apps/public-site
npm install
npm run build
firebase deploy --only hosting:public
```

### Admin Portal Deployment
```bash
cd apps/admin-portal
npm install
npm run build
firebase deploy --only hosting:admin
```

### Firebase Rules Deployment
```bash
cd firebase
firebase deploy --only firestore:rules,storage
```

---

## ✅ Testing Checklist

### Public Site Tests
- [ ] Homepage loads
- [ ] All navigation links work
- [ ] Booking form submits successfully
- [ ] Contact form submits successfully
- [ ] Career application submits
- [ ] Newsletter subscription works
- [ ] Search functionality works
- [ ] All pages responsive on mobile
- [ ] No console errors
- [ ] No admin links visible

### Admin Portal Tests
- [ ] Admin login works
- [ ] Dashboard displays data
- [ ] All admin tabs accessible
- [ ] Events CRUD operations work
- [ ] News CRUD operations work
- [ ] Bookings management works
- [ ] Contacts management works
- [ ] Gallery management works
- [ ] File uploads work
- [ ] User management works
- [ ] Role-based access works
- [ ] No console errors

### Integration Tests
- [ ] Public booking appears in admin dashboard
- [ ] Public contact appears in admin messages
- [ ] Admin event changes reflect on public site
- [ ] Admin news changes reflect on public site
- [ ] Firebase Auth works for both
- [ ] Firestore shared correctly
- [ ] Storage shared correctly

---

## ⚠️ Rollback Plan

If issues arise:

1. **Immediate Rollback:**
   ```bash
   git checkout backup-before-admin-split
   npm install
   npm run build
   firebase deploy
   ```

2. **Restore Previous State:**
   - Keep old deployment active
   - Test new deployment on staging URLs
   - Switch DNS only when confident

---

## 📞 Support Notes

**Current State:**
- Monolithic app with all features in one deployment
- Admin accessible at `/admin` route
- Single build, single deployment

**Target State:**
- Two separate deployments
- Shared Firebase backend
- Independent updates possible
- More professional separation

**Time Estimate:** 4-6 hours  
**Risk Level:** Low-Medium  
**Reversibility:** High (backup branch available)

---

**Created:** June 10, 2026  
**Status:** Ready to Execute

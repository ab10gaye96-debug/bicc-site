# BICC Split Architecture - Quick Reference

**Status:** ✅ Split Complete | **Branch:** `feature/admin-public-split` | **Date:** June 10, 2026

---

## 🚀 Quick Start

### Test Locally (Do This First!)

```bash
# Terminal 1 - Public Site
cd apps/public-site
npm install
npm run dev
# Visit: http://localhost:5173

# Terminal 2 - Admin Portal
cd apps/admin-portal
npm install
npm run dev
# Visit: http://localhost:5174
```

### Deploy to Production

```bash
# 1. Deploy Firebase Rules
cd firebase
firebase deploy --only firestore:rules,storage

# 2. Build & Deploy Public Site
cd ../apps/public-site
npm run build
firebase deploy --only hosting:public

# 3. Build & Deploy Admin Portal
cd ../admin-portal
npm run build
firebase deploy --only hosting:admin
```

---

## 📁 New Structure

```
apps/
├── public-site/          → https://bicc.gm
│   ├── src/              (23 public pages, no admin)
│   └── package.json
│
├── admin-portal/         → https://admin.bicc.gm
│   ├── src/              (Admin.tsx + 10 tabs)
│   └── package.json
│
firebase/                 → Shared rules
└── firestore.rules
    storage.rules
```

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| **SPLIT_IMPLEMENTATION_SUMMARY.md** | What was done, statistics, checklist |
| **DEPLOYMENT_SPLIT_GUIDE.md** | Full deployment guide with testing checklist |
| **ADMIN_PUBLIC_SPLIT_PLAN.md** | Original implementation plan and rationale |

---

## ✅ What Changed

### Public Site
- ❌ **Removed:** `/admin` route
- ❌ **Removed:** Admin links in Navbar
- ✅ **Same:** All 23 public pages
- ✅ **Same:** Firebase backend

### Admin Portal
- ✅ **New:** Standalone app at `/`
- ✅ **Same:** All admin functionality
- ✅ **Same:** Firebase backend
- ✅ **Added:** Security headers

### Shared
- ✅ Same Firebase project
- ✅ Same database
- ✅ Same authentication
- ✅ Same storage

---

## 🧪 Testing

See **DEPLOYMENT_SPLIT_GUIDE.md** → Testing Checklist

Key things to test:
- All public pages load
- All admin tabs work
- Forms submit correctly
- Data shared between apps
- No console errors

---

## 🆘 Troubleshooting

### Port conflict
```bash
# Specify custom port
npm run dev -- --port 3000
```

### Build fails
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Deploy fails
```bash
firebase login --reauth
firebase use bicc-gambia
```

---

## 📞 Questions?

- **Implementation Details:** See `SPLIT_IMPLEMENTATION_SUMMARY.md`
- **Deployment Steps:** See `DEPLOYMENT_SPLIT_GUIDE.md`
- **Original Plan:** See `ADMIN_PUBLIC_SPLIT_PLAN.md`

---

**Ready to test?** Run the Quick Start commands above! 🚀

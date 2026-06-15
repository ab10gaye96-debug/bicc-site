# BICC Website Deployment Guide

## 🚀 Quick Deployment

You have **two admin sites** that need to be kept in sync:

1. **Main Site (Automatic)**: https://bicc-gambia.web.app/admin
2. **Standalone Admin (Manual)**: https://bicc-gambia-admin.web.app/

---

## 📋 Deployment Scripts

### Option 1: Deploy to Main Site Only (Easiest)

**Double-click:** `deploy-main.bat`

This will:
- ✅ Build the project
- ✅ Deploy to https://bicc-gambia.web.app
- ✅ Takes 1-2 minutes

---

### Option 2: Deploy to Both Sites

**Double-click:** `deploy-both.bat`

This will:
- ✅ Build the project
- ✅ Deploy to main site automatically
- ⚠️ Open the `dist` folder for manual upload to admin site
- ℹ️ Show you instructions for the manual step

**Manual Step for Admin Site:**
1. The script will open File Explorer with the `dist` folder
2. Go to: https://console.firebase.google.com/
3. Select project: **bicc-gambia-admin**
4. Click **Hosting** in left menu
5. Click the **3-dot menu** → **"Deploy to site"**
6. **Drag and drop** all files from the `dist` folder:
   - `index.html`
   - `images` folder

---

## 🔧 Manual Deployment (If Scripts Don't Work)

### Build the project:
```bash
npm run build
```

### Deploy to main site:
```bash
firebase use default
firebase deploy --only hosting
```

### Deploy to admin site:
Use the Firebase Console upload method described above.

---

## ⚙️ What Gets Updated?

When you deploy, both sites will have:
- ✅ All admin features
- ✅ Site Settings tab
- ✅ Media Library tab
- ✅ All other tabs (Events, News, Bookings, etc.)
- ✅ Any code changes you made

---

## 🆘 Troubleshooting

### Build fails:
- Check for syntax errors in your code
- Run: `npm install` to ensure all packages are installed

### Main site deployment fails:
- Make sure you're logged in: `firebase login`
- Check internet connection

### Admin site won't upload:
- Make sure you're selecting the correct Firebase project
- Try refreshing the Firebase Console
- Make sure you're dragging ALL files (index.html + images folder)

---

## 📝 Notes

- The main site deployment is automatic via CLI
- The admin site requires manual upload due to a Firebase CLI bug
- Both sites use the same codebase and share the same Firebase backend
- Changes to events, news, bookings, etc. are visible on both sites (shared database)

---

## 🔗 Your Sites

- **Main Site**: https://bicc-gambia.web.app
- **Main Admin**: https://bicc-gambia.web.app/admin
- **Standalone Admin**: https://bicc-gambia-admin.web.app
- **Firebase Console**: https://console.firebase.google.com

---

**Last Updated**: June 15, 2026

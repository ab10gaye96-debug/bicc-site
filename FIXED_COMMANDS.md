# ✅ FIXED: Corrected npm Commands

## 🔧 What Was Wrong

The `package.json` had incorrect references to a `server/` folder that doesn't exist.

**This is a frontend-only Vite + React + Firebase project** (no Node.js backend server).

---

## ✅ Correct Commands to Use

### **1. Development Mode** (Recommended)
```bash
npm run dev
```
- Starts Vite dev server
- Hot reload enabled (changes appear instantly)
- Opens at: **http://localhost:5173**
- Best for development

### **2. Production Build**
```bash
npm run build
```
- Creates optimized production build
- Outputs to `dist/` folder
- Use for deployment to Firebase Hosting

### **3. Preview Production Build**
```bash
npm run preview
```
- Serves the production build locally
- Opens at: **http://localhost:4173**
- Use to test production build before deploying

---

## 📦 Project Structure

This is a **client-side only** application:

```
BICC SITE WORK/
├── src/                    # React source code
│   ├── pages/             # All page components
│   ├── components/        # Reusable components
│   ├── api.ts            # Firebase API functions
│   ├── firebase.ts       # Firebase config
│   └── App.tsx           # Main app component
├── public/                # Static assets
├── dist/                  # Production build (generated)
├── package.json          # ✅ FIXED
├── vite.config.ts        # Vite configuration
└── index.html            # Entry HTML file
```

**Backend:** All handled by Firebase
- **Database:** Firestore
- **Authentication:** Firebase Auth
- **File Storage:** Firebase Storage
- **Hosting:** Firebase Hosting

---

## 🚀 How to Run Your Site

### **First Time Setup:**
```bash
# 1. Make sure you're in the project directory
cd "c:\Users\user\Desktop\office project\BICC SITE WORK"

# 2. Install dependencies (if not already done)
npm install

# 3. Start dev server
npm run dev
```

### **Daily Development:**
```bash
npm run dev
```

Then open: **http://localhost:5173**

---

## 🌐 Deployment

### **To Firebase Hosting:**
```bash
# 1. Build production version
npm run build

# 2. Deploy to Firebase (if firebase-tools installed)
firebase deploy
```

---

## ❌ What Was Removed

- ✅ Deleted `start.js` (referenced non-existent server folder)
- ✅ Deleted `serve` file (not needed)
- ✅ Removed `npm run start` script from package.json
- ✅ Updated README with correct commands

---

## 📝 Summary

**Old (WRONG):** ❌
```bash
npm run start    # Error: Cannot find module 'server/index.js'
npm run serve    # Error: Command not found
```

**New (CORRECT):** ✅
```bash
npm run dev      # Development mode ← USE THIS
npm run build    # Production build
npm run preview  # Preview production build
```

---

**Fixed by:** Kiro AI Assistant
**Date:** June 15, 2026
**Status:** ✅ Ready to Run!
# How to See the Users/RBAC Tab in Admin Portal

## The Problem
You're logged in but can't see the **Users** tab (for managing roles and permissions).

## The Solution
**The Users tab is ONLY visible to Super Admin accounts.**

---

## Step 1: Check Your Current Role

1. Open browser console (F12 → Console tab)
2. Type: `localStorage.getItem('bicc_user_role')`
3. Press Enter

**Result:**
- If it shows `"Super Admin"` → You should see the tab (check Step 3)
- If it shows `"Manager"` or `"Staff"` → You need a Super Admin account (go to Step 2)
- If it shows `null` → Log out and log back in

---

## Step 2: Create or Promote a Super Admin Account

### Option A: Manually in Firestore Console

1. Go to Firebase Console: https://console.firebase.google.com
2. Select your BICC project
3. Click **Firestore Database** in left menu
4. Find the `users` collection
5. Find your user document (by email)
6. Click the document
7. Edit the `role` field
8. Change it to: `Super Admin` (exact spelling with capital letters)
9. Save

### Option B: Add via Script

Create a temporary script to set your first Super Admin:

1. Create file: `apps/admin-portal/src/setAdmin.ts`

```typescript
import { db } from './firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

async function makeUserSuperAdmin(email: string) {
  const q = query(collection(db, 'users'), where('email', '==', email));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    console.log('❌ User not found with email:', email);
    return;
  }
  
  const userDoc = snapshot.docs[0];
  await updateDoc(doc(db, 'users', userDoc.id), {
    role: 'Super Admin'
  });
  
  console.log('✅ User promoted to Super Admin!');
}

// Replace with your email
makeUserSuperAdmin('YOUR_EMAIL@bicc.gm');
```

2. Run it once:
```bash
cd apps/admin-portal
npx ts-node src/setAdmin.ts
```

3. Delete the file after running

---

## Step 3: Log Out and Log Back In

1. Click the logout button in admin portal
2. Clear your browser cache (Ctrl+Shift+Delete)
3. Log back in with your email/password
4. The system will fetch your new role from Firestore
5. You should now see the **Users** tab in the sidebar!

---

## Step 4: Verify Users Tab is Visible

After logging in as Super Admin, you should see:

```
Sidebar Navigation:
├── 📊 Dashboard
├── 📅 Events  
├── 📰 News
├── 💬 Messages
├── 📖 Bookings
├── 🖼️ Gallery
├── 🏢 Venues
├── 🧾 Quotations
├── 💵 Pricing
├── 📥 Downloads
├── 💼 Careers
├── 📄 Tenders
├── ⭐ Testimonials
├── 🤝 Partners
├── ✉️ Subscribers
└── 👥 Users  ← THIS TAB (only for Super Admin)
```

Click **Users** tab to access the RBAC management interface.

---

## What You'll See in the Users Tab

Once you can access it:

✅ **List of all admin users**
- Username
- Email
- Role (Super Admin / Manager / Staff)
- Created date

✅ **Add User button**
- Create new admin accounts
- Assign roles
- Set passwords

✅ **Edit user**
- Change username/email
- Change role
- Update password

✅ **Delete user**
- Remove admin access
- Cannot delete other Super Admins

---

## Troubleshooting

### Problem: Still don't see Users tab after making myself Super Admin

**Solution:**
1. Log out completely
2. Open browser console (F12)
3. Run: `localStorage.clear()`
4. Close browser
5. Open browser again
6. Log in again
7. Check role: `localStorage.getItem('bicc_user_role')`

### Problem: "Users" tab appears but shows blank/error

**Check:**
1. Browser console for errors (F12 → Console)
2. Firestore rules allow reading `users` collection
3. Your Firebase project has `users` collection

**Fix Firestore Rules:**
Edit `firebase/firestore.rules`:

```javascript
match /users/{userId} {
  allow read: if request.auth != null;
  allow write: if request.auth != null && 
               get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Super Admin';
}
```

Deploy rules:
```bash
firebase deploy --only firestore:rules
```

### Problem: Can't create new users - get Firebase error

**Common Causes:**
1. Email/Password provider not enabled in Firebase Console
2. Email already exists in Firebase Auth
3. Password too weak (minimum 6 characters)

**Fix:**
1. Go to Firebase Console → Authentication
2. Click "Sign-in method" tab
3. Enable "Email/Password" provider
4. Save

---

## Quick Test

**To test RBAC is working:**

1. Log in as Super Admin
2. Click Users tab
3. Create a test user:
   - Email: `test.staff@bicc.gm`
   - Username: `teststaff`
   - Password: `Test123`
   - Role: `Staff`
4. Log out
5. Log in as `teststaff` / `Test123`
6. You should only see 8 tabs (no Users, no Pricing, no Tenders, etc.)
7. Log out
8. Log back in as your Super Admin account

---

## Current Role Capabilities

### Super Admin (16+ tabs)
✅ Dashboard, Events, News, Contacts, Bookings, Gallery, Venues, **Users**,
Testimonials, Partners, Downloads, Careers, Tenders, Subscribers, Pricing, Quotations

### Manager (15 tabs)
✅ Dashboard, Events, News, Contacts, Bookings, Gallery, Venues,
Testimonials, Partners, Downloads, Careers, Tenders, Subscribers, Pricing, Quotations
❌ Users (cannot manage users)

### Staff (8 tabs)
✅ Dashboard, Events, News, Contacts, Bookings, Gallery, Downloads, Careers
❌ Users, Venues, Pricing, Tenders, Testimonials, Partners, Subscribers, Quotations

---

## Need Help?

**Admin portal is running at:** http://localhost:5175

**Check your role:**
```javascript
// In browser console (F12)
console.log('Current role:', localStorage.getItem('bicc_user_role'));
console.log('Logged in:', localStorage.getItem('bicc_token') ? 'Yes' : 'No');
```

**Access control functions in browser console:**
```javascript
// Test permission functions (paste in console while logged in)
console.log('Is Super Admin:', api.isSuperAdmin());
console.log('Can access Users tab:', api.canAccessTab('users'));
console.log('Can edit:', api.canEdit());
console.log('Can delete:', api.canDelete());
```

---

*The Users/RBAC management interface is fully implemented and working - you just need Super Admin access to see it!*

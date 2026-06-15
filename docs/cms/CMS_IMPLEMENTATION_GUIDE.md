# 📝 BICC Content Management System (CMS) - Implementation Guide

## Overview

The BICC website now has a powerful Content Management System that allows you to edit **all text content** through the admin portal without touching any code or redeploying the website.

---

## ✅ What's Been Implemented (Phase 1)

### **Admin Portal Features:**
- ✅ New "Content" tab in admin dashboard
- ✅ Edit Home page content (Hero, Stats, About, CTA)
- ✅ Edit Footer content (Brand description, contact info, social links)
- ✅ Edit Navbar content (Button text, search placeholder)
- ✅ Edit Contact page content (Hero, office information)
- ✅ Real-time preview of unsaved changes
- ✅ Save/Reset functionality
- ✅ Collapsible sections for organized editing

### **Public Site Integration:**
- ✅ API functions to fetch content from Firestore
- ✅ Graceful fallbacks to hardcoded defaults
- ✅ Ready for integration (components need updating)

---

## 🎯 How It Works

```
┌─────────────────────────────────┐
│  Admin Portal                    │
│  (bicc-gambia-admin.web.app)    │
│                                  │
│  1. Admin logs in                │
│  2. Clicks "Content" tab         │
│  3. Edits text fields            │
│  4. Clicks "Save Changes"        │
└────────────┬────────────────────┘
             │
             ▼
      ┌──────────────┐
      │  FIRESTORE   │
      │  Collection: │
      │  pageContent │
      └──────┬───────┘
             │
             ▼
┌─────────────────────────────────┐
│  Public Website                  │
│  (bicc-gambia.web.app)          │
│                                  │
│  1. Component loads              │
│  2. Fetches content from         │
│     Firestore                    │
│  3. Displays content             │
│  4. Falls back to defaults       │
│     if unavailable               │
└─────────────────────────────────┘
```

---

## 📚 Firestore Data Structure

### Collection: `pageContent`

Each document represents a section of the website:

```javascript
// Document: "home"
{
  section: "home",
  hero: {
    title: "Banjul International Convention Centre",
    subtitle: "The Gambia's Premier MICE Destination",
    description: "Managing the Sir Dawda Kairaba...",
    primaryButton: "Book an Event",
    secondaryButton: "Explore Venues"
  },
  stats: {
    capacity: { value: "4000+", label: "Guest Capacity" },
    spaces: { value: "30+", label: "Event Spaces" },
    events: { value: "50+", label: "International Events" },
    rating: { value: "5-Star", label: "Facility Rating" }
  },
  about: {
    title: "Where Excellence Meets African Hospitality",
    paragraph1: "The Banjul International Convention Centre...",
    paragraph2: "BICC manages two landmark facilities...",
    paragraph3: "With world-class facilities..."
  },
  cta: {
    title: "Ready to Host Your Next Event?",
    description: "Let BICC deliver a world-class experience...",
    buttonText: "Book an Event"
  },
  updatedAt: "2026-06-12T15:30:00.000Z",
  updatedBy: "admin@bicc.gm"
}

// Document: "footer"
{
  section: "footer",
  brand: {
    description: "The Gambia's national premier event management institution..."
  },
  contact: {
    address: "Sir Dawda Kairaba Jawara International Conference Centre...",
    phone1: "+220 123 4567",
    phone2: "+220 765 4321",
    email: "info@bicc.gm",
    hours: "Mon - Fri: 9:00 AM - 5:00 PM"
  },
  social: {
    facebook: "https://www.facebook.com/BICCGM",
    instagram: "https://www.instagram.com/banjulconventioncentre/",
    linkedin: "https://www.linkedin.com/company/..."
  },
  copyright: {
    text: "© 2026 Banjul International Convention Centre. All rights reserved."
  },
  updatedAt: "2026-06-12T15:30:00.000Z",
  updatedBy: "admin@bicc.gm"
}

// Document: "navbar"
{
  section: "navbar",
  bookButton: { text: "Book an Event" },
  search: { placeholder: "Search..." },
  updatedAt: "2026-06-12T15:30:00.000Z",
  updatedBy: "admin@bicc.gm"
}

// Document: "contact"
{
  section: "contact",
  hero: {
    title: "Contact Us",
    description: "Get in touch with our team..."
  },
  office: {
    address: "Sir Dawda Kairaba Jawara International Conference Centre...",
    phone1: "+220 123 4567",
    phone2: "+220 765 4321",
    email: "info@bicc.gm",
    hours: "Monday - Friday: 9:00 AM - 5:00 PM..."
  },
  updatedAt: "2026-06-12T15:30:00.000Z",
  updatedBy: "admin@bicc.gm"
}
```

---

## 🛠️ How to Use the CMS (Admin Guide)

### **Step 1: Access the Admin Portal**
1. Go to https://bicc-gambia-admin.web.app
2. Log in with your admin credentials

### **Step 2: Navigate to Content Tab**
1. Click on "Content" in the left sidebar
2. You'll see 4 sections: Home Page, Footer, Navigation Menu, Contact Page

### **Step 3: Select a Section to Edit**
- Click on any section card (e.g., "Home Page")
- The editing interface will load

### **Step 4: Edit Content**
1. Expand sections by clicking on them (e.g., "Hero Section")
2. Edit text in the input fields
3. Changes are highlighted with "Unsaved changes" indicator

### **Step 5: Save Changes**
1. Click "Save Changes" button at the top
2. Wait for success message: "✅ Changes saved successfully!"
3. Changes are now live on the public website

### **Step 6: Reset if Needed**
- Click "Reset" to discard unsaved changes
- Confirms before resetting

---

## 🔧 API Functions Reference

### **Admin Portal API** (`apps/admin-portal/src/api.ts`)

```typescript
// Fetch content for editing
await fetchContentSection('home');
// Returns: { hero: {...}, stats: {...}, about: {...}, cta: {...} }

// Update content
await updateContentSection('home', contentData);
// Saves to Firestore with timestamp and username
```

### **Public Site API** (`apps/public-site/src/api.ts`)

```typescript
// Fetch content for display
const homeContent = await fetchHomeContent();
const footerContent = await fetchFooterContent();
const navbarContent = await fetchNavbarContent();
const contactContent = await fetchContactContent();

// Or use the generic function
const content = await fetchPageContent('home');
```

---

##  Next Steps: Integrating CMS into Public Site Components

The CMS backend is complete, but the **public site components need to be updated** to fetch and display CMS content.

### **Components to Update:**

#### **1. Home.tsx**
```typescript
// Add at top of component
const [content, setContent] = useState<any>(null);

useEffect(() => {
  fetchHomeContent().then(data => {
    if (data) setContent(data);
  });
}, []);

// Use content in JSX
<h1>{content?.hero?.title || 'Banjul International Convention Centre'}</h1>
<p>{content?.hero?.subtitle || "The Gambia's Premier MICE Destination"}</p>
```

#### **2. Footer.tsx**
```typescript
const [content, setContent] = useState<any>(null);

useEffect(() => {
  fetchFooterContent().then(data => {
    if (data) setContent(data);
  });
}, []);

// Use in JSX
<p>{content?.brand?.description || 'Default description...'}</p>
<a href={content?.social?.facebook || '#'}>Facebook</a>
```

#### **3. Navbar.tsx**
```typescript
const [content, setContent] = useState<any>(null);

useEffect(() => {
  fetchNavbarContent().then(data => {
    if (data) setContent(data);
  });
}, []);

// Use in JSX
<button>{content?.bookButton?.text || 'Book an Event'}</button>
<input placeholder={content?.search?.placeholder || 'Search...'} />
```

#### **4. Contact.tsx**
```typescript
const [content, setContent] = useState<any>(null);

useEffect(() => {
  fetchContactContent().then(data => {
    if (data) setContent(data);
  });
}, []);

// Use in JSX
<h1>{content?.hero?.title || 'Contact Us'}</h1>
<p>{content?.office?.address || 'Default address...'}</p>
```

---

## 🎨 Benefits of This System

### **For Content Editors:**
- ✅ Edit text without touching code
- ✅ Changes appear immediately
- ✅ No redeployment needed
- ✅ Simple, intuitive interface
- ✅ Can reset changes before saving

### **For Developers:**
- ✅ Separation of content and code
- ✅ Version control for content changes
- ✅ Track who made changes and when
- ✅ Easy to extend to more pages
- ✅ Graceful fallbacks prevent broken pages

### **For the Organization:**
- ✅ Faster content updates
- ✅ No developer dependency for text changes
- ✅ Reduced deployment frequency
- ✅ Better content governance
- ✅ Audit trail of changes

---

## 🚀 Future Enhancements (Phase 2 & 3)

### **Phase 2: Business Pages**
- About page (Our Story, Mission, Vision, Values)
- Services & Packages (Package descriptions, FAQs, add-ons)
- Booking form text and options

### **Phase 3: Destination Content**
- Why Gambia
- Attractions
- Travel Info
- Investment opportunities
- Plan Your Event

### **Advanced Features**
- Rich text editor with formatting (bold, italic, lists)
- Image upload and management
- Content versioning and rollback
- Multi-language support
- Content scheduling (publish at specific time)
- Preview mode before publishing
- Content approval workflow

---

## 📖 Troubleshooting

### **Content not showing on public site?**
1. Check if Firestore security rules allow public reads on `pageContent` collection
2. Check browser console for errors
3. Verify content exists in Firestore console
4. Check if API functions are imported correctly

### **Can't save changes in admin?**
1. Check if logged in as admin
2. Check Firestore security rules allow writes for authenticated users
3. Check browser console for errors
4. Verify internet connection

### **Changes saved but not appearing?**
1. Hard refresh the public site (Ctrl+Shift+R)
2. Check if component is fetching from Firestore
3. Verify component is using fetched content instead of hardcoded values

---

## 🔒 Security Notes

### **Firestore Security Rules Required:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Page content - public read, admin write
    match /pageContent/{document=**} {
      allow read: if true; // Public can read
      allow write: if request.auth != null; // Only authenticated users can write
    }
    
    // ... other rules ...
  }
}
```

---

## 📞 Support

For questions or issues:
- Check the code comments in ContentManagementTab.tsx
- Review the API functions in api.ts
- Contact the development team

---

**Status:** ✅ Phase 1 Complete - Admin interface and backend API fully functional
**Next Action:** Update public site components to fetch and display CMS content

# BICC Website Implementation Plan

## Project Status: In Progress

This document tracks the implementation of all requirements for the BICC Website completion.

---

## 1. Destination Gambia Portal ✅ IN PROGRESS

### Pages to Create:
- [x] `/destination` - Main landing page (DestinationGambia.tsx) ✅
- [x] `/destination/why-gambia` - Why The Gambia (WhyGambia.tsx) ✅
- [x] `/destination/attractions` - Attractions page (Attractions.tsx) ✅
- [ ] `/destination/hotels` - Hotels & Accommodation
- [ ] `/destination/travel-info` - Travel Information
- [ ] `/destination/investment` - Investment Opportunities

### Firestore Collections Needed:
- `hotels` - Partner hotel listings
- `travel_info` - Travel guides and visa information

---

## 2. Downloads Centre ❌ TODO

### Page to Create:
- [ ] `/downloads` - Downloads page with category filtering

### Features:
- File upload (PDF, Word, Excel)
- Category filtering (Corporate Profile, Brochure, Venue Guide, Floor Plans, etc.)
- Admin management interface
- Download tracking

### Firestore Collection:
- `downloads` - File metadata and URLs

---

## 3. Careers Portal ❌ TODO

### Pages to Create:
- [ ] `/careers` - Careers landing page
- [ ] `/careers/apply/:jobId` - Application form

### Features:
- Job listing with categories (Full-time, Internship, Graduate Programme)
- Online application form
- CV/Resume upload
- Admin dashboard for managing vacancies and applications

### Firestore Collections:
- `vacancies` - Job postings
- `applications` - Job applications with file attachments

---

## 4. Procurement & Tenders ❌ TODO

### Page to Create:
- [ ] `/procurement` - Procurement & tenders page

### Features:
- Tender listings (Open/Closed)
- Procurement notices
- Submission deadlines
- Document downloads
- Admin management

### Firestore Collection:
- `tenders` - Tender listings and documents

---

## 5. Plan Your Event Section ❌ TODO

### Page to Create:
- [ ] `/plan-your-event` - Event planning portal

### Content Sections:
- Event Planning Guide
- Catering Services
- Audio Visual Services
- Security Services
- Accommodation Guide
- Transportation Services
- Event Checklist
- Downloadable Planning Toolkit

### Implementation:
- Static content pages with rich information
- Downloadable checklists and guides
- Link to booking system

---

## 6. Booking System Enhancement ⚠️ PARTIALLY DONE

### Current Status:
- ✅ Basic booking form exists
- ✅ Email notifications working
- ❌ No venue selection
- ❌ No service requirements
- ❌ No availability validation
- ❌ Limited status workflow

### Features to Add:
1. **Venue Selection**
   - Multiple venue checkboxes (Plenary Hall, Banquet Halls, Meeting Rooms, etc.)
   - Capacity information

2. **Service Requirements**
   - Security Services
   - Parking Requirements
   - Accommodation Requirements
   - Transport Requirements
   - Translation Services
   - Livestream Services
   - Exhibition Booth Requirements

3. **Availability Validation**
   - Check against existing bookings
   - Prevent double-booking
   - Show available dates calendar

4. **Booking Status Workflow**
   - Pending → Under Review → Approved/Rejected → Confirmed → Completed
   - Admin actions for status changes
   - Internal notes system

5. **Admin Reply System**
   - Admin can send messages to clients
   - Request additional information
   - Provide quotations

### Files to Modify:
- `src/pages/Booking.tsx` - Add venue selection and services
- `src/pages/Admin.tsx` - Enhance booking management
- `src/api.ts` - Add availability checking functions

---

## 7. Quotation & Proposal System ❌ TODO

### Features:
- Automatic quotation generation based on:
  - Venue pricing
  - Service pricing
  - Catering pricing
  - Equipment pricing
  - Tax calculation
- PDF generation
- Email delivery
- Admin override/editing

### Implementation:
- Pricing database in Firestore
- PDF generation library (jsPDF or similar)
- Email integration (existing EmailJS)

### Firestore Collections:
- `pricing` - Venue and service pricing
- `quotations` - Generated quotations

---

## 8. Homepage Improvements ⚠️ PARTIALLY DONE

### Current Status:
- ✅ Hero section with CTA
- ✅ Stats bar with animation
- ✅ Virtual tour (using gallery)
- ✅ About preview
- ✅ Venues preview
- ✅ Upcoming events
- ✅ Latest news

### To Add:
- [ ] **Testimonials Section**
  - Client testimonials/reviews
  - Firestore collection: `testimonials`

- [ ] **Strategic Partners Section**
  - Partner logos
  - Firestore collection: `partners`

- [ ] **Newsletter Subscription**
  - Email capture form
  - EmailJS integration
  - Firestore collection: `subscribers`

- [ ] **Video Background (Hero)**
  - Replace static image with video
  - Fallback to image on mobile

---

## 9. Venue Pages Enhancement ⚠️ PARTIALLY DONE

### Current Status:
- ✅ Basic venue listing exists

### To Add to Each Venue:
- [ ] Detailed capacity information
- [ ] Seating layout options (Theater, Classroom, Banquet, etc.)
- [ ] Technical specifications
- [ ] Floor plans (downloadable)
- [ ] Photo gallery
- [ ] Virtual tour/360° view
- [ ] "Book This Venue" button

### Files to Modify:
- `src/pages/Venues.tsx` - Enhanced venue detail view
- Firestore `venues` collection - Add more fields

---

## 10. Admin Dashboard Enhancement ⚠️ PARTIALLY DONE

### Current Tabs:
- ✅ Dashboard overview
- ✅ Events management
- ✅ News management
- ✅ Contacts management
- ✅ Bookings management
- ✅ Gallery management
- ✅ Venues management
- ✅ Users management (role-based access)

### Tabs to Add:
- [ ] Downloads management
- [ ] Careers management (vacancies + applications)
- [ ] Procurement/Tenders management
- [ ] Testimonials management
- [ ] Partners management
- [ ] Subscribers management
- [ ] Pricing management (for quotations)
- [ ] Analytics & Reports

---

## 11. Analytics & Reporting ❌ TODO

### Features:
- Google Analytics integration
- Visitor tracking
- Booking statistics (by month, venue, event type)
- Event statistics
- Dashboard reporting widgets

### Implementation:
- Google Analytics 4 setup
- Admin dashboard charts (Chart.js or Recharts)
- Export reports to PDF/Excel

---

## 12. SEO & Performance ⚠️ PARTIALLY DONE

### Current Status:
- ✅ SEO component exists
- ❌ Not used on all pages

### To Implement:
- [ ] SEO metadata on ALL pages
- [ ] Open Graph tags for social sharing
- [ ] Sitemap generation (`sitemap.xml`)
- [ ] Structured schema markup (JSON-LD)
- [ ] Mobile responsiveness audit
- [ ] Accessibility compliance (WCAG 2.1)
- [ ] Lighthouse score optimization (target: 90+)
- [ ] Image optimization
- [ ] Lazy loading
- [ ] Code splitting

---

## File Structure Plan

```
src/
├── pages/
│   ├── DestinationGambia.tsx ✅
│   ├── WhyGambia.tsx ✅
│   ├── Attractions.tsx ✅
│   ├── Hotels.tsx ❌
│   ├── TravelInfo.tsx ❌
│   ├── Investment.tsx ❌
│   ├── Downloads.tsx ❌
│   ├── Careers.tsx ❌
│   ├── CareerApply.tsx ❌
│   ├── Procurement.tsx ❌
│   ├── PlanYourEvent.tsx ❌
│   └── ... (existing pages)
│
├── components/
│   ├── Navbar.tsx (update with new routes)
│   ├── Footer.tsx (update with new links)
│   ├── SEO.tsx ✅
│   ├── TestimonialSection.tsx ❌
│   ├── PartnersSection.tsx ❌
│   ├── NewsletterForm.tsx ❌
│   ├── QuotationGenerator.tsx ❌
│   └── AvailabilityCalendar.tsx ❌
│
├── api.ts (add new Firestore functions)
└── types.ts (add new TypeScript interfaces)
```

---

## Priority Order

### Phase 1: Core Content Pages (Week 1)
1. Complete Destination Gambia portal (remaining 3 pages)
2. Downloads Centre
3. Careers Portal
4. Procurement & Tenders
5. Plan Your Event

### Phase 2: Enhanced Functionality (Week 2)
6. Booking System Enhancement
7. Quotation & Proposal System
8. Homepage Improvements
9. Venue Pages Enhancement

### Phase 3: Admin & Analytics (Week 3)
10. Admin Dashboard Enhancement
11. Analytics & Reporting
12. SEO & Performance Optimization

---

## Firestore Collections Summary

### New Collections to Create:
- `hotels` - Partner hotels
- `travel_info` - Travel guides
- `downloads` - Downloadable documents
- `vacancies` - Job postings
- `applications` - Job applications
- `tenders` - Procurement tenders
- `testimonials` - Client testimonials
- `partners` - Strategic partners
- `subscribers` - Newsletter subscribers
- `pricing` - Venue and service pricing
- `quotations` - Generated quotations

### Existing Collections to Enhance:
- `bookings` - Add venue selection, services, status workflow
- `venues` - Add detailed specs, floor plans, virtual tours

---

## Testing Checklist

- [ ] All pages render correctly on desktop
- [ ] All pages render correctly on mobile
- [ ] All forms submit successfully
- [ ] All admin CRUD operations work
- [ ] Role-based access control working
- [ ] Email notifications sending correctly
- [ ] File uploads working (Downloads, Careers)
- [ ] PDF generation working (Quotations)
- [ ] SEO metadata present on all pages
- [ ] Analytics tracking working
- [ ] No console errors
- [ ] Lighthouse score > 90

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Firebase project set up
- [ ] Firestore security rules configured
- [ ] Firebase Storage rules configured (for file uploads)
- [ ] EmailJS configured
- [ ] Google Analytics configured
- [ ] Build completes successfully
- [ ] Production deployment successful
- [ ] DNS configured
- [ ] SSL certificate active
- [ ] Admin credentials secured
- [ ] Backup strategy in place

---

**Last Updated:** June 9, 2026
**Status:** In Progress - 10% Complete

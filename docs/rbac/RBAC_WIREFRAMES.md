# 🎨 RBAC System - UI Wireframes & Visual Design

**Project:** BICC Admin Portal User Management  
**Date:** June 10, 2026

---

## 📱 SCREEN LAYOUTS

### 1. User Management Main Screen

```
┌────────────────────────────────────────────────────────────────────────┐
│ BICC Admin  [🔍]  [🔔 3]  [👤 Super Admin ▼]  [🌓]                   │ HEADER
├──────────┬─────────────────────────────────────────────────────────────┤
│          │                                                             │
│ 🏠 Dash  │ 👥 User Management                     [+ Create User]     │
│ 📅 Event │                                                             │
│ 📰 News  │ STATISTICS:                                                │
│ 💬 Msgs  │ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐         │
│ 📋 Book  │ │   145   │ │   132   │ │    13   │ │    8    │         │
│ 🖼️ Gal   │ │  Total  │ │ Active  │ │Disabled │ │  Today  │         │
│ 🏢 Venue │ │  Users  │ │  Users  │ │  Users  │ │ Created │         │
│ 👥 Users │ └─────────┘ └─────────┘ └─────────┘ └─────────┘         │ ACTIVE
│ 📊 Audit │                                                             │
│          │ SEARCH & FILTERS:                                          │
│ [<]      │ [🔍 Search by name, email...    ]  [Role ▼] [Dept ▼]     │
│COLLAPSE  │ [Status: All ▼]  [Export CSV]                             │
│          │                                                             │
└──────────┤ USER LIST:                                                 │
           │ ┌──────────────────────────────────────────────────────┐  │
           │ │ Name / Email      Role      Dept    Status  Actions  │  │
           │ ├──────────────────────────────────────────────────────┤  │
           │ │ 👤 John Mensah     Finance   Finance [Active]  [⋮]   │  │
           │ │    john@bicc.gm    Team                              │  │
           │ │    +220 301 2345                                     │  │
           │ │    Last login: 2 hours ago                           │  │
           │ ├──────────────────────────────────────────────────────┤  │
           │ │ 👤 Fatou Jallow   Events    Events  [Active]  [⋮]   │  │
           │ │    fatou@bicc.gm   Team                              │  │
           │ │    +220 456 7890                                     │  │
           │ │    Last login: 1 day ago                             │  │
           │ ├──────────────────────────────────────────────────────┤  │
           │ │ 👤 Sarah Johnson  HR Team   HR      [Active]  [⋮]   │  │
           │ │    sarah@bicc.gm                                     │  │
           │ │    +220 789 0123                                     │  │
           │ │    Last login: 5 hours ago                           │  │
           │ └──────────────────────────────────────────────────────┘  │
           │                                                             │
           │ Showing 1-20 of 145 users    [← Previous] [1][2][3] [Next→]│
           └─────────────────────────────────────────────────────────────┘
```


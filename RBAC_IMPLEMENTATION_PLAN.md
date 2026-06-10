# 🔐 Enterprise User Management & RBAC Implementation Plan

**Project:** BICC Admin Portal User Management System  
**Date:** June 10, 2026  
**Status:** Planning Phase

---

## 📋 EXECUTIVE SUMMARY

This document outlines the complete implementation plan for an Enterprise-grade User Management and Role-Based Access Control (RBAC) system for the BICC Admin Portal.

**Goals:**
1. Allow Super Admins to create and manage staff accounts from the admin portal
2. Implement granular role-based permissions
3. Create dynamic sidebar based on user roles
4. Add audit logging for all user actions
5. Prepare for Firebase Security Rules enforcement

**Timeline:** 5-7 days  
**Risk Level:** Medium (requires careful permission implementation)

---

## 🏗️ ARCHITECTURE OVERVIEW

### System Components

```
User Management System
├── Authentication Layer (Firebase Auth)
├── User Profile Management (Firestore)
├── Role-Based Permissions (Custom Logic)
├── Route Protection (React Router Guards)
├── UI Component Guards (Conditional Rendering)
├── Audit Logging (Firestore)
└── Security Rules Preparation (Firestore Rules)
```

---

## 📂 FOLDER STRUCTURE

```
apps/admin-portal/src/
├── components/
│   └── admin/
│       ├── layout/
│       │   ├── AdminLayout.tsx         (existing)
│       │   ├── AdminHeader.tsx         (existing)
│       │   ├── AdminSidebar.tsx        (existing - to be updated)
│       │   └── DynamicSidebar.tsx      (NEW - role-based)
│       ├── dashboard/
│       │   ├── EnhancedDashboard.tsx   (existing)
│       │   └── UserStatsCards.tsx      (NEW)
│       ├── users/                      (NEW MODULE)
│       │   ├── UserManagementTab.tsx
│       │   ├── UserList.tsx
│       │   ├── UserTable.tsx
│       │   ├── UserCard.tsx
│       │   ├── CreateUserForm.tsx
│       │   ├── EditUserForm.tsx
│       │   ├── UserDetailsModal.tsx
│       │   ├── UserStatusBadge.tsx
│       │   ├── UserFilters.tsx
│       │   ├── UserSearchBar.tsx
│       │   ├── ResetPasswordModal.tsx
│       │   ├── ChangeRoleModal.tsx
│       │   ├── DisableUserModal.tsx
│       │   └── index.ts
│       └── audit/                      (NEW MODULE)
│           ├── AuditLogTab.tsx
│           ├── AuditLogList.tsx
│           ├── AuditLogItem.tsx
│           └── index.ts
├── utils/
│   ├── rbac.ts                         (NEW - Role permissions)
│   ├── permissions.ts                  (NEW - Permission checks)
│   ├── roleConfig.ts                   (NEW - Role definitions)
│   ├── auditLogger.ts                  (NEW - Audit logging)
│   └── passwordGenerator.ts            (NEW - Temp password)
├── guards/                             (NEW)
│   ├── ProtectedRoute.tsx
│   ├── RoleGuard.tsx
│   └── PermissionGuard.tsx
├── hooks/                              (NEW)
│   ├── useCurrentUser.ts
│   ├── usePermissions.ts
│   ├── useRoleCheck.ts
│   └── useAuditLog.ts
├── types/
│   ├── user.ts                         (NEW)
│   ├── role.ts                         (NEW)
│   ├── permission.ts                   (NEW)
│   └── auditLog.ts                     (NEW)
└── api.ts                              (UPDATE - add user mgmt functions)
```



---

## 📊 FIRESTORE SCHEMA

### Collection: `users`

```typescript
{
  uid: string;                    // Firebase Auth UID
  fullName: string;               // "John Doe"
  email: string;                  // "john@bicc.gm"
  phone: string;                  // "+220 123 4567"
  department: string;             // "Finance"
  role: string;                   // "finance"
  status: string;                 // "active" | "disabled" | "pending"
  createdBy: string;              // UID of creator
  createdAt: Timestamp;           // Creation timestamp
  updatedAt: Timestamp;           // Last update timestamp
  updatedBy: string;              // UID of last updater
  lastLogin: Timestamp | null;    // Last login time
  passwordResetRequired: boolean; // Force password change
  permissions: string[];          // Custom permissions (optional)
  metadata: {
    ipAddress?: string;
    userAgent?: string;
    loginCount: number;
  };
}
```

**Example Document:**
```json
{
  "uid": "abc123xyz789",
  "fullName": "John Mensah",
  "email": "john.mensah@bicc.gm",
  "phone": "+220 301 2345",
  "department": "Finance",
  "role": "finance",
  "status": "active",
  "createdBy": "superadmin_uid_123",
  "createdAt": "2026-06-10T10:30:00Z",
  "updatedAt": "2026-06-10T10:30:00Z",
  "updatedBy": "superadmin_uid_123",
  "lastLogin": "2026-06-10T14:25:00Z",
  "passwordResetRequired": false,
  "permissions": [],
  "metadata": {
    "ipAddress": "41.76.xxx.xxx",
    "userAgent": "Mozilla/5.0...",
    "loginCount": 5
  }
}
```

### Collection: `audit_logs`

```typescript
{
  id: string;                     // Auto-generated
  action: string;                 // "user_created", "user_updated", etc.
  performedBy: string;            // UID of admin who performed action
  performedByName: string;        // Name of admin (denormalized)
  performedByRole: string;        // Role of admin
  targetUser: string | null;      // UID of affected user (if applicable)
  targetUserName: string | null;  // Name of affected user
  timestamp: Timestamp;           // When action occurred
  details: {                      // Action-specific details
    field?: string;               // Changed field
    oldValue?: any;               // Previous value
    newValue?: any;               // New value
    reason?: string;              // Reason for action
  };
  ipAddress: string;              // IP address
  userAgent: string;              // Browser info
  module: string;                 // Which module (users, events, etc.)
}
```

**Example Document:**
```json
{
  "id": "log_xyz789",
  "action": "user_role_changed",
  "performedBy": "superadmin_uid_123",
  "performedByName": "Admin User",
  "performedByRole": "superadmin",
  "targetUser": "user_abc456",
  "targetUserName": "John Mensah",
  "timestamp": "2026-06-10T15:30:00Z",
  "details": {
    "field": "role",
    "oldValue": "staff",
    "newValue": "finance",
    "reason": "Promoted to Finance Team"
  },
  "ipAddress": "41.76.xxx.xxx",
  "userAgent": "Mozilla/5.0...",
  "module": "users"
}
```



---

## 🎭 ROLE DEFINITIONS

### Role Hierarchy & Permissions

```typescript
// Role levels (higher number = more access)
const ROLE_LEVELS = {
  superadmin: 100,
  management: 80,
  events: 60,
  hr: 60,
  finance: 60,
  reception: 40,
};

// Role display names
const ROLE_NAMES = {
  superadmin: "Super Admin",
  management: "Management",
  events: "Events Team",
  hr: "HR Team",
  finance: "Finance Team",
  reception: "Reception",
};

// Department options
const DEPARTMENTS = [
  "Administration",
  "Events",
  "Human Resources",
  "Finance",
  "Reception",
  "Marketing",
  "Operations",
  "IT",
];
```

### Permission Matrix

| Module | Super Admin | Management | Events | HR | Finance | Reception |
|--------|------------|-----------|--------|----|---------|-----------||
| **Dashboard** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Events** | ✅ Edit | ✅ Edit | ✅ Edit | ❌ View | ❌ | ❌ View |
| **News** | ✅ Edit | ✅ Edit | ✅ Edit | ❌ | ❌ | ❌ View |
| **Messages** | ✅ | ✅ | ✅ View | ✅ View | ❌ | ✅ View |
| **Bookings** | ✅ Edit | ✅ Edit | ✅ Edit | ❌ | ✅ View | ✅ Edit |
| **Gallery** | ✅ Edit | ✅ Edit | ✅ Edit | ❌ | ❌ | ❌ |
| **Venues** | ✅ Edit | ✅ Edit | ✅ Edit | ❌ | ❌ | ❌ View |
| **Quotations** | ✅ Edit | ✅ Edit | ✅ Edit | ❌ | ✅ Edit | ✅ View |
| **Pricing** | ✅ Edit | ✅ Edit | ✅ View | ❌ | ✅ Edit | ❌ View |
| **Downloads** | ✅ Edit | ✅ Edit | ✅ Edit | ❌ | ❌ | ❌ View |
| **Careers** | ✅ Edit | ✅ Edit | ❌ | ✅ Edit | ❌ | ❌ View |
| **Tenders** | ✅ Edit | ✅ Edit | ❌ | ❌ | ✅ Edit | ❌ |
| **Testimonials** | ✅ Edit | ✅ Edit | ✅ Edit | ❌ | ❌ | ❌ |
| **Partners** | ✅ Edit | ✅ Edit | ✅ Edit | ❌ | ❌ | ❌ |
| **Subscribers** | ✅ Edit | ✅ Edit | ✅ View | ✅ View | ❌ | ❌ |
| **Reports** | ✅ | ✅ | ✅ View | ✅ View | ✅ | ❌ |
| **Users** | ✅ Edit | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Audit Logs** | ✅ View | ✅ View | ❌ | ❌ | ❌ | ❌ |

**Legend:**
- ✅ Edit = Full access (create, read, update, delete)
- ✅ View = Read-only access
- ❌ = No access



---

## 🔒 PERMISSION SYSTEM DESIGN

### Permission Structure

```typescript
// Permission types
type Permission = {
  module: string;      // "events", "users", etc.
  action: string;      // "view", "create", "edit", "delete"
  resource?: string;   // Optional specific resource
  condition?: (user: User, resource?: any) => boolean;
};

// Role permissions configuration
const ROLE_PERMISSIONS = {
  superadmin: {
    dashboard: { view: true, edit: true },
    events: { view: true, create: true, edit: true, delete: true },
    news: { view: true, create: true, edit: true, delete: true },
    contacts: { view: true, edit: true, delete: true },
    bookings: { view: true, create: true, edit: true, delete: true },
    gallery: { view: true, create: true, edit: true, delete: true },
    venues: { view: true, create: true, edit: true, delete: true },
    quotations: { view: true, create: true, edit: true, delete: true },
    pricing: { view: true, create: true, edit: true, delete: true },
    downloads: { view: true, create: true, edit: true, delete: true },
    careers: { view: true, create: true, edit: true, delete: true },
    tenders: { view: true, create: true, edit: true, delete: true },
    testimonials: { view: true, create: true, edit: true, delete: true },
    partners: { view: true, create: true, edit: true, delete: true },
    subscribers: { view: true, delete: true },
    users: { view: true, create: true, edit: true, delete: true },
    auditLogs: { view: true },
    reports: { view: true, export: true },
  },
  
  management: {
    dashboard: { view: true, edit: true },
    events: { view: true, create: true, edit: true, delete: true },
    news: { view: true, create: true, edit: true, delete: true },
    contacts: { view: true, edit: true, delete: true },
    bookings: { view: true, create: true, edit: true, delete: true },
    gallery: { view: true, create: true, edit: true, delete: true },
    venues: { view: true, create: true, edit: true, delete: true },
    quotations: { view: true, create: true, edit: true, delete: true },
    pricing: { view: true },
    downloads: { view: true, create: true, edit: true, delete: true },
    testimonials: { view: true, create: true, edit: true, delete: true },
    partners: { view: true, create: true, edit: true, delete: true },
    subscribers: { view: true },
    auditLogs: { view: true },
    reports: { view: true, export: true },
  },
  
  events: {
    dashboard: { view: true },
    events: { view: true, create: true, edit: true, delete: true },
    news: { view: true, create: true, edit: true, delete: true },
    contacts: { view: true },
    bookings: { view: true, create: true, edit: true },
    gallery: { view: true, create: true, edit: true, delete: true },
    venues: { view: true, create: true, edit: true },
    quotations: { view: true, create: true, edit: true },
    downloads: { view: true, create: true },
    testimonials: { view: true, create: true, edit: true },
    partners: { view: true, create: true, edit: true },
    subscribers: { view: true },
    reports: { view: true },
  },
  
  hr: {
    dashboard: { view: true },
    contacts: { view: true },
    careers: { view: true, create: true, edit: true, delete: true },
    subscribers: { view: true },
    reports: { view: true },
  },
  
  finance: {
    dashboard: { view: true },
    bookings: { view: true },
    quotations: { view: true, create: true, edit: true },
    pricing: { view: true, create: true, edit: true, delete: true },
    tenders: { view: true, create: true, edit: true, delete: true },
    reports: { view: true, export: true },
  },
  
  reception: {
    dashboard: { view: true },
    events: { view: true },
    contacts: { view: true },
    bookings: { view: true, create: true, edit: true },
    venues: { view: true },
    quotations: { view: true },
    pricing: { view: true },
    downloads: { view: true },
    careers: { view: true },
  },
};
```



---

## 🛡️ ROUTE PROTECTION STRATEGY

### Implementation Approach

```typescript
// 1. ProtectedRoute Component
// Protects entire routes from unauthorized access

<ProtectedRoute
  component={AdminDashboard}
  requiredRole="any"           // any authenticated user
  requiredPermission={null}
/>

<ProtectedRoute
  component={UserManagement}
  requiredRole="superadmin"    // only super admins
  fallback="/dashboard"        // redirect if unauthorized
/>

// 2. RoleGuard Component
// Protects UI elements based on role

<RoleGuard allowedRoles={["superadmin", "management"]}>
  <button>Edit Event</button>
</RoleGuard>

// 3. PermissionGuard Component
// Protects UI elements based on specific permission

<PermissionGuard module="events" action="edit">
  <button>Edit Event</button>
</PermissionGuard>

// 4. Hooks for permission checks

const { hasPermission } = usePermissions();
const { isRole, isMinRole } = useRoleCheck();

if (hasPermission("events", "edit")) {
  // Show edit button
}

if (isRole("superadmin")) {
  // Show super admin features
}

if (isMinRole("management")) {
  // Show features for management and above
}
```

### Route Configuration

```typescript
// App.tsx route protection example

<Routes>
  <Route path="/" element={
    <ProtectedRoute>
      <Admin />
    </ProtectedRoute>
  } />
  
  <Route path="/users" element={
    <ProtectedRoute requiredRole="superadmin">
      <UserManagementTab />
    </ProtectedRoute>
  } />
  
  <Route path="/audit-logs" element={
    <ProtectedRoute 
      requiredRoles={["superadmin", "management"]}
    >
      <AuditLogTab />
    </ProtectedRoute>
  } />
</Routes>
```



---

## 🎨 COMPONENT ARCHITECTURE

### User Management Components

#### 1. UserManagementTab.tsx (Main Container)
```typescript
- State management for users list
- Handles create, edit, delete operations
- Coordinates between UserList and forms
- Shows loading states and errors
```

#### 2. UserList.tsx (List View)
```typescript
- Displays users in table/card format
- Implements search, filter, pagination
- Shows user status badges
- Handles bulk actions
```

#### 3. CreateUserForm.tsx (Create Form)
```typescript
- Form inputs: name, email, phone, department, role
- Validates email format
- Generates temporary password
- Creates Firebase Auth account
- Saves to Firestore
- Logs audit trail
```

#### 4. EditUserForm.tsx (Edit Form)
```typescript
- Pre-fills existing user data
- Updates user profile
- Tracks changes for audit log
- Restricts role changes (can't demote yourself)
```

#### 5. UserDetailsModal.tsx (View Modal)
```typescript
- Shows complete user profile
- Displays login history
- Shows created/updated info
- Action buttons: Edit, Disable, Reset Password
```

#### 6. UserStatusBadge.tsx (Status Display)
```typescript
- Color-coded badges
- Active: Green
- Disabled: Red
- Pending: Yellow
```

### Guard Components

#### 1. ProtectedRoute.tsx
```typescript
interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string | string[];
  requiredPermission?: { module: string; action: string };
  fallback?: string;
}
```

#### 2. RoleGuard.tsx
```typescript
interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
}
```

#### 3. PermissionGuard.tsx
```typescript
interface PermissionGuardProps {
  children: ReactNode;
  module: string;
  action: string;
  fallback?: ReactNode;
}
```



---

## 🔧 API FUNCTIONS

### New User Management Functions

```typescript
// In apps/admin-portal/src/api.ts

// 1. Fetch all users (Super Admin only)
export async function fetchUsers(): Promise<User[]>;

// 2. Fetch single user by UID
export async function fetchUserByUid(uid: string): Promise<User | null>;

// 3. Create new user
export async function createUser(userData: CreateUserData): Promise<User>;
// - Creates Firebase Auth account
// - Saves profile to Firestore
// - Sends welcome email with temp password
// - Logs audit trail

// 4. Update user profile
export async function updateUser(uid: string, updates: Partial<User>): Promise<void>;

// 5. Delete user
export async function deleteUser(uid: string): Promise<void>;
// - Deletes from Firebase Auth
// - Deletes from Firestore
// - Logs audit trail

// 6. Disable/Enable user
export async function toggleUserStatus(uid: string, status: 'active' | 'disabled'): Promise<void>;

// 7. Change user role
export async function changeUserRole(uid: string, newRole: string, reason: string): Promise<void>;

// 8. Reset user password
export async function resetUserPassword(uid: string): Promise<string>;
// - Generates new temporary password
// - Updates Firebase Auth
// - Sets passwordResetRequired = true
// - Sends email with new password

// 9. Get users by role
export async function getUsersByRole(role: string): Promise<User[]>;

// 10. Get users by department
export async function getUsersByDepartment(department: string): Promise<User[]>;

// 11. Search users
export async function searchUsers(query: string): Promise<User[]>;

// 12. Get user statistics
export async function getUserStats(): Promise<{
  totalUsers: number;
  activeUsers: number;
  disabledUsers: number;
  usersByRole: Record<string, number>;
  usersByDepartment: Record<string, number>;
  recentLogins: User[];
}>;
```

### Audit Logging Functions

```typescript
// In apps/admin-portal/src/utils/auditLogger.ts

// 1. Log user action
export async function logAudit(params: {
  action: string;
  performedBy: string;
  targetUser?: string;
  details?: Record<string, any>;
  module: string;
}): Promise<void>;

// 2. Fetch audit logs
export async function fetchAuditLogs(options?: {
  limit?: number;
  startAfter?: any;
  filterBy?: {
    action?: string;
    performedBy?: string;
    targetUser?: string;
    module?: string;
    startDate?: Date;
    endDate?: Date;
  };
}): Promise<AuditLog[]>;

// 3. Get user activity history
export async function getUserActivityHistory(uid: string): Promise<AuditLog[]>;
```



---

## 📱 UI/UX DESIGN SPECIFICATIONS

### User Management Page Layout

```
┌────────────────────────────────────────────────────────────┐
│ User Management                           [+ Create User]  │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ STATS CARDS:                                               │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│ │   145    │ │   132    │ │    13    │ │    8     │     │
│ │Total Users│ │  Active  │ │ Disabled │ │  Today   │     │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
│                                                            │
│ FILTERS & SEARCH:                                          │
│ [🔍 Search users...]  [Role ▼]  [Dept ▼]  [Status ▼]     │
│                                                            │
│ USER TABLE:                                                │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ Name          Email         Dept    Role    Status   │  │
│ ├──────────────────────────────────────────────────────┤  │
│ │ 👤 John Doe   john@bicc.gm  Finance Finance [Active] │  │
│ │    +220...    Last login: 2h ago               [⋮]   │  │
│ ├──────────────────────────────────────────────────────┤  │
│ │ 👤 Jane Smith jane@bicc.gm  HR      HR     [Active]  │  │
│ │    +220...    Last login: 1d ago               [⋮]   │  │
│ └──────────────────────────────────────────────────────┘  │
│                                                            │
│ [← Previous]  Page 1 of 8  [Next →]                       │
└────────────────────────────────────────────────────────────┘
```

### Create User Modal

```
┌────────────────────────────────────┐
│ Create New User               [×]  │
├────────────────────────────────────┤
│                                    │
│ Full Name *                        │
│ [_____________________________]    │
│                                    │
│ Email Address *                    │
│ [_____________________________]    │
│                                    │
│ Phone Number                       │
│ [_____________________________]    │
│                                    │
│ Department *                       │
│ [Administration ▼]                 │
│                                    │
│ Role *                             │
│ [Finance Team ▼]                   │
│                                    │
│ ℹ️ A temporary password will be    │
│   generated and sent via email    │
│                                    │
│ [Cancel]        [Create User]      │
└────────────────────────────────────┘
```

### User Details Modal

```
┌──────────────────────────────────────────┐
│ User Details                        [×]  │
├──────────────────────────────────────────┤
│                                          │
│ 👤 John Mensah                           │
│    john.mensah@bicc.gm                   │
│    +220 301 2345                         │
│                                          │
│ DETAILS:                                 │
│ Department:    Finance                   │
│ Role:          Finance Team              │
│ Status:        [Active 🟢]              │
│ Created:       Jun 1, 2026 by Admin     │
│ Last Updated:  Jun 10, 2026             │
│ Last Login:    2 hours ago              │
│ Login Count:   45 times                 │
│                                          │
│ ACTIONS:                                 │
│ [✏️ Edit User]  [🔄 Reset Password]    │
│ [🚫 Disable Account]                    │
│                                          │
│ RECENT ACTIVITY:                         │
│ • Jun 10 - Logged in                    │
│ • Jun 10 - Updated booking #142         │
│ • Jun 9  - Created quotation            │
│                                          │
│ [Close]                                  │
└──────────────────────────────────────────┘
```

### Status Badges

```typescript
// Status badge colors and styles

Active:    [Active]     Green bg-green-100 text-green-800
Disabled:  [Disabled]   Red bg-red-100 text-red-800
Pending:   [Pending]    Yellow bg-yellow-100 text-yellow-800
```

### Role Badges

```typescript
// Role badge colors

Super Admin:  Purple bg-purple-100 text-purple-800
Management:   Blue bg-blue-100 text-blue-800
Events Team:  Green bg-green-100 text-green-800
HR Team:      Pink bg-pink-100 text-pink-800
Finance Team: Yellow bg-yellow-100 text-yellow-800
Reception:    Gray bg-gray-100 text-gray-800
```



---

## 🔐 FIREBASE SECURITY RULES PREPARATION

### Firestore Rules Structure (for future implementation)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    
    function isSuperAdmin() {
      return isAuthenticated() && getUserRole() == 'superadmin';
    }
    
    function isManagement() {
      return isAuthenticated() && (getUserRole() == 'superadmin' || getUserRole() == 'management');
    }
    
    function hasPermission(module, action) {
      let role = getUserRole();
      let permissions = get(/databases/$(database)/documents/role_permissions/$(role)).data;
      return permissions[module][action] == true;
    }
    
    // Users collection - Only Super Admins can manage
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isSuperAdmin();
      allow update: if isSuperAdmin() || request.auth.uid == userId; // Can update own profile
      allow delete: if isSuperAdmin();
    }
    
    // Audit logs - Super Admin and Management can read, system writes
    match /audit_logs/{logId} {
      allow read: if isManagement();
      allow write: if isAuthenticated(); // System writes via admin SDK
    }
    
    // Events - Role-based access
    match /events/{eventId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if hasPermission('events', 'edit');
    }
    
    // Bookings - Multiple roles can access
    match /bookings/{bookingId} {
      allow read: if isAuthenticated();
      allow create, update: if hasPermission('bookings', 'edit');
      allow delete: if isSuperAdmin();
    }
    
    // ... other collections with role-based rules
  }
}
```

### Storage Rules (for image uploads)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function getUserRole() {
      return firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role;
    }
    
    function canUpload() {
      let role = getUserRole();
      return role == 'superadmin' 
        || role == 'management' 
        || role == 'events' 
        || role == 'hr';
    }
    
    // User uploads
    match /users/{userId}/{allPaths=**} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && request.auth.uid == userId;
    }
    
    // Gallery images
    match /gallery/{imageId} {
      allow read: if true; // Public read
      allow write: if canUpload();
    }
    
    // Event images
    match /events/{eventId} {
      allow read: if true;
      allow write: if canUpload();
    }
    
    // Documents
    match /documents/{docId} {
      allow read: if isAuthenticated();
      allow write: if canUpload();
    }
  }
}
```



---

## 📅 IMPLEMENTATION TIMELINE

### Phase 1: Foundation (Day 1-2)

**Day 1: Types & Utilities**
- [ ] Create TypeScript types (user.ts, role.ts, permission.ts, auditLog.ts)
- [ ] Implement roleConfig.ts with role definitions
- [ ] Implement permissions.ts with permission checks
- [ ] Implement rbac.ts with RBAC logic
- [ ] Create passwordGenerator.ts utility
- [ ] Create auditLogger.ts utility

**Day 2: Hooks & Guards**
- [ ] Create useCurrentUser hook
- [ ] Create usePermissions hook
- [ ] Create useRoleCheck hook
- [ ] Create useAuditLog hook
- [ ] Implement ProtectedRoute component
- [ ] Implement RoleGuard component
- [ ] Implement PermissionGuard component

### Phase 2: User Management UI (Day 3-4)

**Day 3: Core Components**
- [ ] Create UserManagementTab.tsx (main container)
- [ ] Create UserList.tsx (list view)
- [ ] Create UserTable.tsx (table display)
- [ ] Create UserCard.tsx (card view)
- [ ] Create UserStatusBadge.tsx
- [ ] Create UserFilters.tsx
- [ ] Create UserSearchBar.tsx

**Day 4: Forms & Modals**
- [ ] Create CreateUserForm.tsx
- [ ] Create EditUserForm.tsx
- [ ] Create UserDetailsModal.tsx
- [ ] Create ResetPasswordModal.tsx
- [ ] Create ChangeRoleModal.tsx
- [ ] Create DisableUserModal.tsx

### Phase 3: API Integration (Day 5)

**Day 5: Backend Functions**
- [ ] Implement fetchUsers()
- [ ] Implement createUser()
- [ ] Implement updateUser()
- [ ] Implement deleteUser()
- [ ] Implement toggleUserStatus()
- [ ] Implement changeUserRole()
- [ ] Implement resetUserPassword()
- [ ] Implement searchUsers()
- [ ] Implement getUserStats()
- [ ] Test all API functions

### Phase 4: Audit Logging (Day 6)

**Day 6: Audit System**
- [ ] Create AuditLogTab.tsx
- [ ] Create AuditLogList.tsx
- [ ] Create AuditLogItem.tsx
- [ ] Implement audit logging in all user operations
- [ ] Add audit log filtering
- [ ] Add audit log export (optional)
- [ ] Test audit trail

### Phase 5: Dashboard & Integration (Day 7)

**Day 7: Final Integration**
- [ ] Create UserStatsCards for dashboard
- [ ] Update AdminSidebar with role-based navigation
- [ ] Update existing tabs with permission guards
- [ ] Add user management to sidebar (Super Admin only)
- [ ] Test all roles and permissions
- [ ] Fix bugs and polish UI
- [ ] Update documentation

### Phase 6: Testing & Deployment

**Testing Checklist:**
- [ ] Test Super Admin can create users
- [ ] Test user creation flow end-to-end
- [ ] Test role permissions work correctly
- [ ] Test each role sees correct sidebar
- [ ] Test route protection works
- [ ] Test UI guards work
- [ ] Test password reset flow
- [ ] Test disable/enable users
- [ ] Test change role functionality
- [ ] Test audit logging captures all actions
- [ ] Test search and filters
- [ ] Test pagination
- [ ] Test mobile responsiveness



---

## ⚠️ IMPORTANT CONSIDERATIONS

### 1. Password Security
- Generate strong temporary passwords (min 12 chars, mixed case, numbers, symbols)
- Force password reset on first login
- Store hashed passwords only (Firebase Auth handles this)
- Send passwords via secure email (not stored in plain text)

### 2. Self-Service Restrictions
- Users cannot change their own role
- Users cannot disable their own account
- Super Admins cannot demote themselves
- At least one Super Admin must always exist

### 3. Audit Trail Requirements
- Log all user creations
- Log all user updates (track what changed)
- Log all role changes (with reason)
- Log all password resets
- Log all enable/disable actions
- Log all deletions
- Store IP address and user agent

### 4. Performance Optimization
- Paginate user lists (20 per page)
- Index Firestore queries (role, status, department)
- Cache current user permissions
- Lazy load audit logs
- Optimize search with algolia/typesense (future)

### 5. Data Validation
- Email must be valid format and unique
- Phone number must be valid (E.164 format preferred)
- Role must be from predefined list
- Department must be from predefined list
- Status must be: active, disabled, or pending

### 6. Error Handling
- Handle Firebase Auth errors gracefully
- Show user-friendly error messages
- Log errors to console for debugging
- Retry failed operations with exponential backoff
- Show toast notifications for all actions

### 7. Accessibility
- All forms must be keyboard navigable
- All buttons must have proper ARIA labels
- Error messages must be announced to screen readers
- Color contrast must meet WCAG 2.1 AA standards
- Focus management in modals

### 8. Testing Strategy
- Unit tests for permission utilities
- Integration tests for API functions
- E2E tests for user creation flow
- Test all roles can access only their permitted modules
- Test edge cases (last super admin, self-demotion, etc.)



---

## 🎯 SUCCESS CRITERIA

### Functional Requirements
- ✅ Super Admins can create new users from admin portal
- ✅ Users receive welcome email with temporary password
- ✅ Users must reset password on first login
- ✅ Super Admins can edit user profiles
- ✅ Super Admins can disable/enable users
- ✅ Super Admins can change user roles
- ✅ Super Admins can reset user passwords
- ✅ Super Admins can delete users
- ✅ Each role sees only permitted modules in sidebar
- ✅ Route protection prevents unauthorized access
- ✅ UI guards hide unauthorized buttons/features
- ✅ All user operations are logged in audit trail
- ✅ Audit logs are searchable and filterable
- ✅ Dashboard shows user statistics
- ✅ User list supports search and filters
- ✅ User list is paginated

### Non-Functional Requirements
- ✅ Page load time < 2 seconds
- ✅ User creation completes < 3 seconds
- ✅ All forms validate in real-time
- ✅ Mobile responsive on all screen sizes
- ✅ Works on Chrome, Firefox, Safari, Edge
- ✅ Accessible (WCAG 2.1 AA)
- ✅ No console errors or warnings
- ✅ Code follows existing style conventions
- ✅ All components properly typed (TypeScript)
- ✅ Comprehensive error handling

### Security Requirements
- ✅ Only Super Admins can access user management
- ✅ Users cannot elevate their own permissions
- ✅ Firebase Security Rules prepared for deployment
- ✅ Passwords never stored in plain text
- ✅ All operations audit logged
- ✅ IP addresses and user agents captured
- ✅ Session timeout implemented
- ✅ CSRF protection via Firebase

---

## 📚 DELIVERABLES SUMMARY

### Documentation
1. ✅ This implementation plan
2. ⏳ Component documentation (JSDoc comments)
3. ⏳ API function documentation
4. ⏳ User guide for Super Admins
5. ⏳ Updated Firestore rules (ready for deployment)

### Code Artifacts
1. ⏳ Types (4 files)
2. ⏳ Utilities (4 files)
3. ⏳ Hooks (4 files)
4. ⏳ Guards (3 components)
5. ⏳ User Management Components (13 components)
6. ⏳ Audit Log Components (3 components)
7. ⏳ API Functions (15+ functions)
8. ⏳ Updated existing components for RBAC

### Testing
1. ⏳ Unit tests for utilities
2. ⏳ Integration tests for API
3. ⏳ Manual testing checklist completed
4. ⏳ Bug fixes and polish

---

## 🚀 NEXT STEPS

### Immediate (Now)
1. **Review this plan** - Confirm architecture and approach
2. **Get approval** - Ensure stakeholders agree with design
3. **Prepare environment** - Ensure Firebase project ready

### Development (Day 1-7)
1. **Phase 1**: Build foundation (types, utils, guards)
2. **Phase 2**: Build UI components
3. **Phase 3**: Implement API functions
4. **Phase 4**: Add audit logging
5. **Phase 5**: Integrate into existing admin portal
6. **Phase 6**: Test thoroughly

### Deployment (Day 8+)
1. **Deploy to staging** - Test in near-production environment
2. **User acceptance testing** - Have real users test
3. **Fix any issues** - Address feedback
4. **Deploy to production** - Roll out to live site
5. **Monitor** - Watch for errors and issues
6. **Deploy Firebase rules** - Enforce security at database level

---

**Status:** Ready for implementation  
**Estimated Time:** 7 days  
**Risk Level:** Medium  
**Confidence:** High

---

*Plan created: June 10, 2026*  
*By: Kiro AI Assistant*  
*For: BICC Admin Portal RBAC System*


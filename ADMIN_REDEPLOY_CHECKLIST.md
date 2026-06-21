# Admin redeploy checklist

## Exact commands

### 1. Deploy Firestore rules to the live data project
Run this from `apps/public-site` because that folder targets the `bicc-gambia` Firebase project used by the live Firestore database.

```powershell
cd 'c:\Users\user\Desktop\website\website bicc\apps\public-site'
firebase deploy --only firestore:rules
```

### 2. Build and deploy the public site

```powershell
cd 'c:\Users\user\Desktop\website\website bicc\apps\public-site'
npm run build
firebase deploy --only hosting
```

### 3. Build and deploy the admin site
Run this from `apps/admin-portal` because that folder targets the admin hosting project.

```powershell
cd 'c:\Users\user\Desktop\website\website bicc\apps\admin-portal'
npm run build
firebase deploy --only hosting
```

## Important note

- Do **not** deploy Firestore rules from `apps/admin-portal` only and assume the live site is covered.
- `apps/admin-portal` deploys to the `bicc-gambia-admin` hosting project.
- The app code reads Firestore from the `bicc-gambia` project, so the live database rules must be deployed from `apps/public-site` or another folder targeting `bicc-gambia`.

## Quick checks after deploy

- Open `https://bicc-gambia-admin.web.app`
- Log in with your admin account
- Test adding or editing one item in:
  - Events
  - Downloads
  - Careers
  - Page Content
- Open `https://bicc-gambia.web.app/careers`
- Click `View Details` on a vacancy and confirm requirements/responsibilities expand
- Click `Apply Now` and confirm the apply page opens for the same job
- Refresh the public page after an admin content change and confirm the update appears

## What was just redeployed

- Firestore rules on `bicc-gambia`
- Public site hosting on `bicc-gambia`
- Admin site hosting on `bicc-gambia-admin`

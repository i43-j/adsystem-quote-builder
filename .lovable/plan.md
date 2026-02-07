

# Add Adsystems Logo to Sidebar

## Overview
Copy the uploaded ASMC logo into the project and update the sidebar header to display it, move the branch badge next to the username, and ensure the Google profile picture shows properly.

## Changes

### 1. Copy logo asset
- Copy `user-uploads://cropped_adsys_logo.png` to `src/assets/adsystems-logo.png`

### 2. Update Sidebar Header (`src/components/AppSidebar.tsx`)
**Replace the current brand header** (the generic blue icon + "Adsystem" text) with:
- The ASMC logo image (imported as an ES module from `src/assets`)
- "Adsystems" text beside it (hidden when collapsed)
- Remove the branch text from the header entirely

**When expanded:** Logo (around 40x40) + "Adsystems" title  
**When collapsed:** Just the logo (smaller, centered)

### 3. Update Sidebar Footer (`src/components/AppSidebar.tsx`)
- Keep the Google profile picture (already wired via `user.picture`)
- Add a small uppercase branch badge (e.g., "TEST") next to the user's name
- When collapsed, show the user's avatar instead of just a logout icon

### Files Modified
- **New file:** `src/assets/adsystems-logo.png` (copied from upload)
- **Modified:** `src/components/AppSidebar.tsx` -- header and footer sections updated




# Create Project Documentation

## Summary
Create a comprehensive `docs/README.md` file that covers the full project: file structure, styling system, endpoints, how to add/edit sidebar items, form patterns, authentication flow, and development conventions.

## File to Create

**`docs/README.md`** -- a single documentation file covering everything:

### Sections

**1. Project Overview**
- What the app does (internal tool for generating quotations, invoices, purchase orders for Adsystems)
- Tech stack: React 18, Vite, TypeScript, Tailwind CSS, Framer Motion

**2. File Structure**
- Full tree of `src/` with one-line descriptions of every file
- Organized by folder: `pages/`, `lib/`, `components/ui/`, `assets/`
- Explain the "fully minimal" philosophy: no extra folders, sub-components inlined into pages

**3. Styling & Layout**
- CSS variables defined in `index.css` (color tokens like `--primary`, `--background`, etc.)
- How to use them: `hsl(var(--primary))` or Tailwind classes like `bg-primary`, `text-muted-foreground`
- Custom utility classes: `glass-card`, `gradient-primary`, `gradient-sidebar`, `text-gradient`
- Tailwind config highlights: custom animations (`fade-in`, `slide-in-right`, `scale-in`, `pulse-soft`), `success` color palette, `sidebar` color palette
- Layout structure: `SidebarProvider` wrapping a flex container, sticky header with `SidebarTrigger`, main content area with responsive padding

**4. Endpoints / API**
- n8n webhook URL (from `lib/constants.ts`)
- Payload shape sent by `submitQuotation()` in `lib/api.ts` (all fields documented)
- Expected response shape (`{ documentUrl: string }` or `{ body: { documentUrl } }`)
- Note about test vs production webhook URLs

**5. How to Add/Edit Sidebar Items**
- Step-by-step: edit the `navItems` array in `App.tsx` (line ~78)
- Each item has: `title`, `url`, `icon` (from lucide-react), `enabled` (boolean)
- Setting `enabled: false` shows the item grayed out with a "Soon" badge
- Setting `enabled: true` makes it a clickable nav link
- Must also add the corresponding `<Route>` in the `<Routes>` block
- Must create the page file in `src/pages/`

**6. How to Add a New Form Page**
- Create a new file in `src/pages/` (e.g., `DeliveryReceiptPage.tsx`)
- Follow the pattern from `QuotationPage.tsx`: local sub-components, state with `useState`, submit via `lib/api.ts`
- Add the route in `App.tsx`
- Add the sidebar entry in `navItems`

**7. Authentication**
- Google Sign-In via GSI library (loaded in `index.html`)
- Allowed users whitelist in `lib/constants.ts` (`ALLOWED_USERS` map of email to branch)
- Auth flow: JWT decoded client-side, email checked against whitelist, session stored in localStorage
- `useAuth()` hook provides `user`, `isLoading`, `error`, `logout`, `loginAsDemo`
- Protected routes: `AppLayout` redirects to `/login` if no user

**8. Constants & Configuration**
- `GOOGLE_CLIENT_ID` -- Google OAuth client ID
- `N8N_WEBHOOK_URL` -- webhook endpoint
- `ALLOWED_USERS` -- email-to-branch mapping
- `SALUTATION_OPTIONS` and `DOWNPAYMENT_OPTIONS` -- dropdown data

**9. Type Definitions**
- All types from `lib/types.ts`: `QuotationItem`, `QuotationFormData`, `AuthUser`, `SubmissionResult`

**10. Development Notes**
- How to run locally (`npm run dev`)
- UI components from shadcn/ui (15 kept in `components/ui/`)
- Icons from `lucide-react`
- Animations via `framer-motion`

## Technical Details

- Single file: `docs/README.md`
- Written in Markdown with clear headings, code blocks, and tables
- Includes copy-pasteable code snippets for common tasks (adding sidebar items, adding new pages)
- No changes to any existing source files

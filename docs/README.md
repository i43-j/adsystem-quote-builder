# Adsystem Tools — Project Documentation

## 1. Project Overview

**Adsystem Tools** is an internal web application for generating quotations, invoices, and purchase orders for **Adsystems**. Users authenticate via Google Sign-In, fill in a form, and submit data to an n8n webhook that generates a Google Doc.

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS + CSS custom properties |
| Animations | Framer Motion |
| Routing | React Router v6 |
| UI Components | shadcn/ui (15 components kept) |
| Icons | lucide-react |
| Auth | Google Sign-In (GSI client library) |
| Backend | n8n webhook (no server) |

---

## 2. File Structure

The project follows a **"fully minimal"** philosophy: no extra folders, sub-components inlined directly into their parent pages, and all shared utilities consolidated in a single `lib/` folder.

```
src/
├── assets/
│   └── adsystems-logo.png              # Company logo (used in sidebar + login)
│
├── components/
│   └── ui/                             # shadcn/ui primitives (15 files)
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── sidebar.tsx                 # Sidebar provider, trigger, menu components
│       ├── skeleton.tsx
│       ├── sonner.tsx                  # Sonner toast wrapper
│       ├── textarea.tsx
│       ├── toast.tsx
│       ├── toaster.tsx                 # Renders toast notifications
│       └── tooltip.tsx
│
├── lib/
│   ├── api.ts                          # submitQuotation() — sends data to n8n
│   ├── auth.tsx                        # AuthProvider, useAuth() hook
│   ├── constants.ts                    # Google client ID, webhook URL, allowed users, dropdown options
│   ├── google-auth.ts                  # Type-safe wrapper for window.google.accounts.id
│   ├── types.ts                        # All shared TypeScript interfaces
│   ├── use-mobile.tsx                  # useIsMobile() hook
│   ├── use-toast.ts                    # useToast() hook + toast state
│   └── utils.ts                        # cn() — clsx + tailwind-merge helper
│
├── pages/
│   ├── InvoicePage.tsx                 # Invoice form (placeholder)
│   ├── LoginPage.tsx                   # Google Sign-In screen
│   ├── NotFound.tsx                    # 404 page
│   ├── PurchaseOrderPage.tsx           # Purchase order form (placeholder)
│   └── QuotationPage.tsx              # Main form — inlines ItemCard + TotalsPanel
│
├── App.tsx                             # Routes, sidebar, layout — inlines AppLayout, AppSidebar, NavLink
├── index.css                           # Tailwind directives + CSS custom properties + utility classes
├── main.tsx                            # ReactDOM entry point
└── vite-env.d.ts                       # Vite type declarations
```

### Key principle

Instead of creating folders for `contexts/`, `hooks/`, `types/`, or small component files, everything is either:

- In **`lib/`** (shared utilities, hooks, types, API logic)
- **Inlined** into the page that uses it (e.g., `ItemCard` lives inside `QuotationPage.tsx`)

---

## 3. Styling & Layout

### 3.1 CSS Custom Properties

All colors are defined as HSL values (without the `hsl()` wrapper) in `src/index.css`:

```css
:root {
  --primary: 217 82% 51%;        /* Blue */
  --background: 210 40% 98%;     /* Light gray-blue */
  --foreground: 222 33% 17%;     /* Dark blue-gray */
  --success: 160 84% 39%;        /* Green */
  --sidebar-background: 222 33% 14%;  /* Dark navy */
  /* ... see index.css for full list */
}
```

**Usage in code:**

| Method | Example |
|--------|---------|
| Tailwind class | `bg-primary`, `text-muted-foreground`, `border-border/50` |
| Raw CSS | `hsl(var(--primary))` |
| With opacity | `hsl(var(--primary) / 0.1)` or Tailwind `bg-primary/10` |

### 3.2 Custom Utility Classes

Defined in `index.css` under `@layer utilities`:

| Class | What it does |
|-------|-------------|
| `glass-card` | Semi-transparent card with backdrop blur: `bg-card/80 backdrop-blur-sm border border-border/50 shadow-sm` |
| `gradient-primary` | 135° gradient from primary to accent blue |
| `gradient-sidebar` | Vertical gradient for sidebar background |
| `text-gradient` | Gradient text effect using background-clip |

### 3.3 Custom Animations

Defined in `tailwind.config.ts`:

| Animation Class | Effect |
|----------------|--------|
| `animate-fade-in` | Fade in + slide up 8px (0.3s) |
| `animate-slide-in-right` | Fade in + slide left 16px (0.3s) |
| `animate-scale-in` | Fade in + scale from 95% (0.2s) |
| `animate-pulse-soft` | Gentle opacity pulse (2s infinite) |

### 3.4 Color Palettes

Beyond the standard shadcn tokens, two custom palettes are defined:

**`success`** — for success states:
- `bg-success`, `text-success-foreground`
- `bg-success-muted`, `text-success-muted-foreground`

**`sidebar`** — for the sidebar component:
- `bg-sidebar`, `text-sidebar-foreground`
- `bg-sidebar-primary`, `text-sidebar-primary-foreground`
- `bg-sidebar-accent`, `text-sidebar-accent-foreground`
- `border-sidebar-border`

### 3.5 Layout Structure

```
<SidebarProvider>
  <div className="min-h-screen flex w-full">
    <AppSidebar />                          ← Collapsible sidebar
    <div className="flex-1 flex flex-col">
      <header>                              ← Sticky top bar with SidebarTrigger
        <SidebarTrigger />
      </header>
      <main className="p-4 md:p-6 lg:p-8"> ← Responsive content area
        <Outlet />                          ← Route content renders here
      </main>
    </div>
  </div>
</SidebarProvider>
```

---

## 4. Endpoints / API

### 4.1 Webhook URL

Configured in `src/lib/constants.ts`:

```ts
export const N8N_WEBHOOK_URL =
  "https://i43-j.app.n8n.cloud/webhook-test/local-host-test";
```

> **Note:** `webhook-test` URLs are for development only — they only work when the n8n workflow is in test/listening mode. For production, change to a `webhook` URL (without `-test`).

### 4.2 Request Shape

`POST` to `N8N_WEBHOOK_URL` with `Content-Type: application/json`:

```json
{
  "userEmail": "user@example.com",
  "branch": "main",
  "creationDate": "2025-01-15",
  "clientName": "Juan Dela Cruz",
  "companyName": "ABC Corp",
  "address": "123 Rizal Ave, Makati",
  "salutation": "Sir",
  "timetable": "14-21",
  "downpayment": "50",
  "items": [
    {
      "name": "WAREHOUSE LABELS",
      "size": "4 x 6 inches",
      "specifications": "ACRYLIC 3MM, UV PRINTED",
      "qty": "50",
      "unitPrice": "125.00"
    }
  ],
  "timestamp": "2025-01-15T08:30:00.000Z"
}
```

| Field | Type | Notes |
|-------|------|-------|
| `userEmail` | string | From auth session |
| `branch` | string | From `ALLOWED_USERS` mapping |
| `creationDate` | string | `YYYY-MM-DD` format |
| `clientName` | string | Required |
| `companyName` | string | Optional |
| `address` | string | Optional |
| `salutation` | string | One of: `Sir`, `Ma'am`, `Mr.`, `Mrs.`, `Ms.` |
| `timetable` | string | Working days range, e.g. `"14-21"` |
| `downpayment` | string | Percentage value, e.g. `"50"` or custom value |
| `items[]` | array | At least one item required |
| `items[].qty` | string | Stringified integer |
| `items[].unitPrice` | string | Stringified decimal with 2 places |
| `timestamp` | string | ISO 8601 |

### 4.3 Response Shape

The API expects one of these shapes:

```json
{ "documentUrl": "https://docs.google.com/..." }
```

or:

```json
{ "body": { "documentUrl": "https://docs.google.com/..." } }
```

If the response body is empty or not valid JSON, the submission still counts as successful — it just won't show a "View Document" link.

---

## 5. How to Add/Edit Sidebar Items

### Step 1: Edit the `navItems` array

In `src/App.tsx` (around line 78):

```ts
const navItems = [
  { title: "Quotation",      url: "/quotation",      icon: FileText,     enabled: true  },
  { title: "Invoice",        url: "/invoice",         icon: Receipt,      enabled: false },
  { title: "Purchase Order", url: "/purchase-order",  icon: ShoppingCart,  enabled: false },
  // ↓ Add your new item here
  { title: "Delivery Receipt", url: "/delivery-receipt", icon: Truck, enabled: true },
];
```

Each item has:

| Property | Type | Description |
|----------|------|-------------|
| `title` | string | Display name in sidebar |
| `url` | string | Route path (must match `<Route path="...">`) |
| `icon` | LucideIcon | Any icon from `lucide-react` |
| `enabled` | boolean | `true` = clickable link, `false` = grayed out with "Soon" badge |

### Step 2: Add the route

In the same `App.tsx` file, inside the `<Routes>` block (around line 285):

```tsx
<Route element={<AppLayout />}>
  <Route path="/" element={<Navigate to="/quotation" replace />} />
  <Route path="/quotation" element={<QuotationPage />} />
  <Route path="/invoice" element={<InvoicePage />} />
  <Route path="/purchase-order" element={<PurchaseOrderPage />} />
  {/* ↓ Add your new route */}
  <Route path="/delivery-receipt" element={<DeliveryReceiptPage />} />
</Route>
```

### Step 3: Create the page file

Create `src/pages/DeliveryReceiptPage.tsx` — see Section 6 below.

### Step 4: Import the icon and page

At the top of `App.tsx`, add:

```ts
import { Truck } from "lucide-react";
import DeliveryReceiptPage from "@/pages/DeliveryReceiptPage";
```

---

## 6. How to Add a New Form Page

Follow the pattern from `QuotationPage.tsx`:

```tsx
// src/pages/DeliveryReceiptPage.tsx

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export default function DeliveryReceiptPage() {
  const { user } = useAuth();
  const [clientName, setClientName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!user || !clientName.trim()) return;
    setIsSubmitting(true);

    try {
      // Call your API here (see lib/api.ts for the pattern)
      console.log("Submitting:", { clientName, userEmail: user.email });
    } finally {
      setIsSubmitting(false);
    }
  }, [clientName, user]);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
          Delivery Receipt
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Generate a delivery receipt document.
        </p>
      </div>

      <section className="bg-card rounded-xl border border-border/50 p-5 md:p-6 shadow-sm">
        {/* Add your form fields here */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Client Name *
            </Label>
            <Input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Full name"
              className="bg-background"
            />
          </div>
        </div>
      </section>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Send className="w-4 h-4 mr-2" />
          )}
          Generate
        </Button>
      </div>
    </div>
  );
}
```

### Checklist for a new page

- [ ] Create `src/pages/YourPage.tsx`
- [ ] Add route in `App.tsx` → `<Route path="/your-path" element={<YourPage />} />`
- [ ] Add sidebar entry in `navItems` array in `App.tsx`
- [ ] Import the page and icon at the top of `App.tsx`
- [ ] (Optional) Add a submit function in `lib/api.ts` if it hits a different webhook

---

## 7. Authentication

### 7.1 Flow

1. Google's GSI library is loaded via `<script>` tag in `index.html`
2. `AuthProvider` (in `lib/auth.tsx`) initializes `google.accounts.id` with the client ID
3. On successful sign-in, Google returns a JWT credential
4. The JWT is decoded client-side to extract `email`, `name`, `picture`
5. Email is checked against the `ALLOWED_USERS` whitelist in `lib/constants.ts`
6. If authorized, the session is stored in `localStorage`
7. On next visit, session is restored from `localStorage`

### 7.2 `useAuth()` Hook

```ts
const { user, isLoading, error, logout, loginAsDemo } = useAuth();
```

| Property | Type | Description |
|----------|------|-------------|
| `user` | `AuthUser \| null` | Current authenticated user |
| `isLoading` | `boolean` | `true` while restoring session |
| `error` | `string \| null` | Auth error message |
| `logout()` | function | Clears session + localStorage |
| `loginAsDemo()` | function | Logs in as demo user (for testing) |

### 7.3 Protected Routes

`AppLayout` checks `useAuth()` — if no user is found, it renders `<Navigate to="/login" />`. All routes nested under `<AppLayout />` are therefore protected.

### 7.4 Adding a new authorized user

Edit `ALLOWED_USERS` in `src/lib/constants.ts`:

```ts
export const ALLOWED_USERS: Record<string, string> = {
  "existing@email.com": "branch-name",
  "new.user@company.com": "manila",   // ← add here
};
```

The value is the **branch** name, which gets sent with every API payload.

---

## 8. Constants & Configuration

All configurable values live in `src/lib/constants.ts`:

| Constant | Purpose |
|----------|---------|
| `GOOGLE_CLIENT_ID` | OAuth client ID for Google Sign-In |
| `N8N_WEBHOOK_URL` | Endpoint for document generation |
| `ALLOWED_USERS` | `Record<string, string>` — email-to-branch whitelist |
| `SALUTATION_OPTIONS` | Dropdown options: `Sir`, `Ma'am`, `Mr.`, `Mrs.`, `Ms.` |
| `DOWNPAYMENT_OPTIONS` | Dropdown options: `30%`, `50%`, `60%`, `70%`, `80%`, `Custom` |

---

## 9. Type Definitions

All types are in `src/lib/types.ts`:

```ts
interface QuotationItem {
  id: string;
  name: string;
  size: string;
  specifications: string;
  qty: number;
  unitPrice: number;
}

interface QuotationFormData {
  date: string;            // YYYY-MM-DD
  salutation: string;
  clientName: string;
  companyName: string;
  address: string;
  timetable: string;
  downpayment: string;     // "30", "50", etc. or "custom"
  customDownpayment: string;
  items: QuotationItem[];
}

interface AuthUser {
  email: string;
  name: string;
  picture: string;
  branch: string;
}

interface SubmissionResult {
  success: boolean;
  documentUrl?: string;
  error?: string;
}
```

---

## 10. Development Notes

### Running locally

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` by default (Vite).

### UI Components

15 shadcn/ui components are kept in `src/components/ui/`. These are the base primitives — they should rarely need editing. To add a new shadcn component, use:

```bash
npx shadcn-ui@latest add <component-name>
```

### Icons

All icons come from `lucide-react`. Browse available icons at [lucide.dev](https://lucide.dev/icons/).

```tsx
import { FileText, Receipt, ShoppingCart } from "lucide-react";
```

### Animations

- **Tailwind animations** (`animate-fade-in`, etc.) for simple CSS transitions
- **Framer Motion** (`motion.div`, `AnimatePresence`) for complex animations like item list reordering, page transitions, and staggered reveals

### Scrollbar

Custom thin scrollbar styling is applied globally via `index.css` (webkit only):
- 6px wide
- Transparent track
- Semi-transparent thumb with hover effect

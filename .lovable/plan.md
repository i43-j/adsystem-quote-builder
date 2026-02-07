

# Restructure: Fully Minimal File System

## Summary
Flatten the project from ~70 files across 8+ folders down to ~25 files in 3 main folders. Inline sub-components into their parent pages, delete 33 unused UI component files, and consolidate scattered single-file folders into `lib/`.

## Final File Structure

```text
src/
  assets/
    adsystems-logo.png          (unchanged)
  components/
    ui/
      avatar.tsx                (kept)
      badge.tsx                 (kept)
      button.tsx                (kept)
      input.tsx                 (kept)
      label.tsx                 (kept)
      select.tsx                (kept)
      separator.tsx             (kept)
      sheet.tsx                 (kept)
      sidebar.tsx               (kept)
      skeleton.tsx              (kept)
      sonner.tsx                (kept)
      textarea.tsx              (kept)
      toast.tsx                 (kept)
      toaster.tsx               (kept, import path updated)
      tooltip.tsx               (kept)
  lib/
    api.ts                      (unchanged)
    auth.tsx                    (moved from contexts/AuthContext.tsx)
    constants.ts                (unchanged)
    google-auth.ts              (unchanged)
    types.ts                    (moved from types/quotation.ts)
    use-mobile.tsx              (moved from hooks/use-mobile.tsx)
    use-toast.ts                (moved from hooks/use-toast.ts)
    utils.ts                    (unchanged)
  pages/
    InvoicePage.tsx             (unchanged)
    LoginPage.tsx               (moved from components/LoginScreen.tsx)
    NotFound.tsx                (unchanged)
    PurchaseOrderPage.tsx       (unchanged)
    QuotationPage.tsx           (rewritten: inlines QuotationForm, ItemCard, TotalsPanel)
  App.tsx                       (rewritten: inlines AppLayout, NavLink, AppSidebar)
  index.css                     (unchanged)
  main.tsx                      (unchanged)
```

## Detailed Changes

### 1. Delete 33 unused UI components
Remove from `src/components/ui/`:
accordion, alert, alert-dialog, aspect-ratio, breadcrumb, calendar, card, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, form, hover-card, input-otp, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, slider, switch, table, tabs, toggle, toggle-group

Also delete:
- `src/components/ui/use-toast.ts` (a re-export shim, no longer needed)
- `src/App.css` (Vite boilerplate, not used)

### 2. Delete files that will be inlined or moved
- `src/components/quotation/QuotationForm.tsx`
- `src/components/quotation/QuotationItemCard.tsx`
- `src/components/quotation/TotalsPanel.tsx`
- `src/components/AppLayout.tsx`
- `src/components/AppSidebar.tsx`
- `src/components/NavLink.tsx`
- `src/components/LoginScreen.tsx`
- `src/contexts/AuthContext.tsx`
- `src/types/quotation.ts`
- `src/hooks/use-mobile.tsx`
- `src/hooks/use-toast.ts`
- `src/pages/Index.tsx` (just a redirect, will be inlined into App.tsx)
- `src/pages/QuotationPage.tsx` (will be recreated with inlined content)

### 3. Move files with updated imports
- `contexts/AuthContext.tsx` -> `lib/auth.tsx` (same code, export path changes)
- `types/quotation.ts` -> `lib/types.ts` (same code)
- `hooks/use-mobile.tsx` -> `lib/use-mobile.tsx` (same code)
- `hooks/use-toast.ts` -> `lib/use-toast.ts` (same code, import path for toast types updated)

### 4. Rewrite `pages/QuotationPage.tsx`
Merge the three quotation files into one:
- All `QuotationForm` logic (state, handlers, form layout)
- `QuotationItemCard` component defined locally in the same file
- `TotalsPanel` component defined locally in the same file
- Updated imports to point to `@/lib/types`, `@/lib/auth`, etc.

### 5. Create `pages/LoginPage.tsx`
Same content as current `LoginScreen.tsx`, just moved and with updated import for auth context (`@/lib/auth`).

### 6. Rewrite `App.tsx`
Inline three small components:
- `AppLayout` (the sidebar + outlet wrapper, ~35 lines)
- `NavLink` (a thin wrapper around React Router's NavLink, ~15 lines)
- `AppSidebar` (the sidebar component, ~120 lines)
- The `Index` redirect (`/` -> `/quotation`) becomes a direct `Navigate` in the route config
- All imports updated to new paths

### 7. Update `toaster.tsx` import
Change `import { useToast } from "@/hooks/use-toast"` to `import { useToast } from "@/lib/use-toast"`.

## What stays exactly the same
- All backend logic (n8n webhook calls, Google OAuth flow)
- All styling, animations, and visual design
- All routing paths (`/login`, `/quotation`, `/invoice`, `/purchase-order`)
- `lib/api.ts`, `lib/constants.ts`, `lib/google-auth.ts`, `lib/utils.ts`
- `main.tsx`, `index.css`
- All 15 kept UI components (same code, just fewer neighbors)


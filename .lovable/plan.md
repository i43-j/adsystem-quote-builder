

# Add Acknowledgement Receipt Form

## Summary
Create a new Acknowledgement Receipt page, add it to the sidebar and routes, and update the API to include a `docType` field in all webhook payloads so n8n can distinguish between document types.

## Changes

### 1. Update `src/lib/constants.ts`
Add two new dropdown option arrays:
- `PAYMENT_TYPE_OPTIONS`: Down Payment, Partial Payment, Full Payment
- `MODE_OF_PAYMENT_OPTIONS`: Cash, GCash, Check, Bank Transfer - BDO, Bank Transfer - BPI

### 2. Update `src/lib/types.ts`
Add a new interface:
```
AcknowledgementReceiptFormData {
  date: string
  receivedDate: string
  clientName: string
  phoneNumber: string
  companyName: string
  address: string
  amount: string
  paymentType: string
  projectType: string
  modeOfPayment: string
  referenceNumber: string
}
```

### 3. Update `src/lib/api.ts`
- Add `docType: "quotation"` to the existing `submitQuotation` payload so n8n can identify it
- Add a new `submitAcknowledgementReceipt()` function that posts form data to the same webhook with `docType: "acknowledgement_receipt"`
- Both functions share the same response-handling logic (parse documentUrl, handle empty bodies)

### 4. Create `src/pages/AcknowledgementReceiptPage.tsx`
A self-contained form page following the QuotationPage pattern:
- Branch displayed as read-only text (from the logged-in user)
- Date and Received Date default to today
- Client Name, Phone Number (required); Company, Address (optional)
- Amount as a text input (e.g. "20000.00")
- Payment Type and Mode of Payment as select dropdowns
- Project Type as a text input
- Reference Number -- conditionally shown only when mode of payment is GCash, Check, or Bank Transfer (hidden for Cash)
- Submit button posts via `submitAcknowledgementReceipt()` with success/error feedback matching the quotation page

### 5. Update `src/App.tsx`
- Import `ClipboardCheck` icon from lucide-react
- Import `AcknowledgementReceiptPage`
- Add to `navItems`: `{ title: "Acknowledgement Receipt", url: "/acknowledgement-receipt", icon: ClipboardCheck, enabled: true }`
- Add route: `<Route path="/acknowledgement-receipt" element={<AcknowledgementReceiptPage />} />`

### 6. Update `docs/README.md`
Add Acknowledgement Receipt to the documentation -- new types, constants, API function, and sidebar entry.

## Technical Details

**Conditional reference number logic:**
```ts
const showRef = !["Cash", ""].includes(formData.modeOfPayment);
```
When mode switches back to Cash, the reference number value is cleared automatically.

**Webhook payload shape for Acknowledgement Receipt:**
```json
{
  "docType": "acknowledgement_receipt",
  "userEmail": "user@example.com",
  "branch": "manila",
  "date": "2026-02-17",
  "receivedDate": "2026-02-17",
  "clientName": "Juan Dela Cruz",
  "phoneNumber": "09171234567",
  "companyName": "ABC Corp",
  "address": "123 Rizal Ave",
  "amount": "20000.00",
  "paymentType": "Down Payment",
  "projectType": "Signage Installation",
  "modeOfPayment": "GCash",
  "referenceNumber": "1234567890",
  "timestamp": "2026-02-17T08:30:00.000Z"
}
```

The existing quotation payload will also gain `"docType": "quotation"` so both document types can be routed in n8n.

import { N8N_WEBHOOK_URL } from "./constants";
import type { QuotationFormData, SubmissionResult } from "@/lib/types";

export async function submitQuotation(
  formData: QuotationFormData,
  userEmail: string,
  branch: string
): Promise<SubmissionResult> {
  const dpValue =
    formData.downpayment === "custom"
      ? formData.customDownpayment
      : formData.downpayment;

  const payload = {
    userEmail,
    branch,
    creationDate: formData.date,
    clientName: formData.clientName,
    companyName: formData.companyName,
    address: formData.address,
    salutation: formData.salutation,
    timetable: formData.timetable,
    downpayment: dpValue,
    items: formData.items.map((item) => ({
      name: item.name,
      size: item.size,
      specifications: item.specifications,
      qty: String(item.qty),
      unitPrice: item.unitPrice.toFixed(2),
    })),
    timestamp: new Date().toISOString(),
  };

  const response = await fetch(N8N_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Server responded with ${response.status}`);
  }

  const data = await response.json();
  const documentUrl = data.documentUrl || data.body?.documentUrl;

  if (documentUrl) {
    return { success: true, documentUrl };
  }

  return { success: true };
}

import { N8N_WEBHOOK_URL } from "./constants";
import type { QuotationFormData, AcknowledgementReceiptFormData, SubmissionResult } from "@/lib/types";

async function postToWebhook(payload: Record<string, unknown>): Promise<SubmissionResult> {
  const response = await fetch(N8N_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Server responded with ${response.status}`);
  }

  const text = await response.text();
  if (!text) return { success: true };

  try {
    const data = JSON.parse(text);
    const documentUrl = data.documentUrl || data.body?.documentUrl;
    return documentUrl ? { success: true, documentUrl } : { success: true };
  } catch {
    return { success: true };
  }
}

export async function submitQuotation(
  formData: QuotationFormData,
  userEmail: string,
  branch: string
): Promise<SubmissionResult> {
  const dpValue =
    formData.downpayment === "custom"
      ? formData.customDownpayment
      : formData.downpayment;

  return postToWebhook({
    docType: "quotation",
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
  });
}

export async function submitAcknowledgementReceipt(
  formData: AcknowledgementReceiptFormData,
  userEmail: string,
  branch: string
): Promise<SubmissionResult> {
  return postToWebhook({
    docType: "acknowledgement_receipt",
    userEmail,
    branch,
    date: formData.date,
    receivedDate: formData.receivedDate,
    clientName: formData.clientName,
    phoneNumber: formData.phoneNumber,
    companyName: formData.companyName,
    address: formData.address,
    amount: formData.amount,
    paymentType: formData.paymentType,
    projectType: formData.projectType,
    modeOfPayment: formData.modeOfPayment,
    referenceNumber: formData.referenceNumber,
    timestamp: new Date().toISOString(),
  });
}

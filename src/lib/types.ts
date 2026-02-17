export interface QuotationItem {
  id: string;
  name: string;
  size: string;
  specifications: string;
  qty: number;
  unitPrice: number;
}

export interface QuotationFormData {
  date: string;
  salutation: string;
  clientName: string;
  companyName: string;
  address: string;
  timetable: string;
  downpayment: string;
  customDownpayment: string;
  items: QuotationItem[];
}

export interface AuthUser {
  email: string;
  name: string;
  picture: string;
  branch: string;
}

export interface AcknowledgementReceiptFormData {
  date: string;
  receivedDate: string;
  clientName: string;
  phoneNumber: string;
  companyName: string;
  address: string;
  amount: string;
  paymentType: string;
  projectType: string;
  modeOfPayment: string;
  referenceNumber: string;
}

export interface SubmissionResult {
  success: boolean;
  documentUrl?: string;
  error?: string;
}

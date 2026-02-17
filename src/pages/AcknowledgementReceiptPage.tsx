import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  CalendarDays,
  User,
  Building2,
  MapPin,
  Phone,
  DollarSign,
  CreditCard,
  Wallet,
  Hash,
  Briefcase,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { submitAcknowledgementReceipt } from "@/lib/api";
import { PAYMENT_TYPE_OPTIONS, MODE_OF_PAYMENT_OPTIONS } from "@/lib/constants";
import type { AcknowledgementReceiptFormData, SubmissionResult } from "@/lib/types";

const today = () => new Date().toISOString().split("T")[0];

const initialFormData: AcknowledgementReceiptFormData = {
  date: today(),
  receivedDate: today(),
  clientName: "",
  phoneNumber: "",
  companyName: "",
  address: "",
  amount: "",
  paymentType: "Down Payment",
  projectType: "",
  modeOfPayment: "Cash",
  referenceNumber: "",
};

export default function AcknowledgementReceiptPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState<AcknowledgementReceiptFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);

  const updateField = useCallback(
    <K extends keyof AcknowledgementReceiptFormData>(field: K, value: AcknowledgementReceiptFormData[K]) => {
      setFormData((prev) => {
        const next = { ...prev, [field]: value };
        // Clear reference number when switching to Cash
        if (field === "modeOfPayment" && value === "Cash") {
          next.referenceNumber = "";
        }
        return next;
      });
    },
    []
  );

  const showReferenceNumber = !["Cash", ""].includes(formData.modeOfPayment);

  const handleSubmit = useCallback(async () => {
    if (!user) return;

    if (!formData.clientName.trim()) {
      setResult({ success: false, error: "Client name is required." });
      return;
    }
    if (!formData.phoneNumber.trim()) {
      setResult({ success: false, error: "Phone number is required." });
      return;
    }
    if (!formData.amount.trim()) {
      setResult({ success: false, error: "Amount is required." });
      return;
    }
    if (!formData.projectType.trim()) {
      setResult({ success: false, error: "Project type is required." });
      return;
    }
    if (showReferenceNumber && !formData.referenceNumber.trim()) {
      setResult({ success: false, error: "Reference number is required for this payment mode." });
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      const res = await submitAcknowledgementReceipt(formData, user.email, user.branch);
      setResult(res);
      if (res.success) {
        setFormData(initialFormData);
      }
    } catch (err) {
      setResult({
        success: false,
        error: err instanceof Error ? err.message : "Submission failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, user, showReferenceNumber]);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Page header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
          Acknowledgement Receipt
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Fill in the details below to generate an acknowledgement receipt.
        </p>
      </div>

      <div className="space-y-6">
        {/* Branch & Date Section */}
        <section className="bg-card rounded-xl border border-border/50 p-5 md:p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-primary" />
            Receipt Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Building2 className="w-3 h-3" />
                Branch
              </Label>
              <div className="flex h-10 items-center px-3 rounded-md border border-input bg-muted">
                <Badge variant="secondary" className="text-xs uppercase tracking-wider">
                  {user?.branch}
                </Badge>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <CalendarDays className="w-3 h-3" />
                Date *
              </Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => updateField("date", e.target.value)}
                className="bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <CalendarDays className="w-3 h-3" />
                Received Date of Payment *
              </Label>
              <Input
                type="date"
                value={formData.receivedDate}
                onChange={(e) => updateField("receivedDate", e.target.value)}
                className="bg-background"
              />
            </div>
          </div>
        </section>

        {/* Client Details Section */}
        <section className="bg-card rounded-xl border border-border/50 p-5 md:p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Client Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                Client Name *
              </Label>
              <Input
                value={formData.clientName}
                onChange={(e) => updateField("clientName", e.target.value)}
                placeholder="Full name"
                className="bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Phone className="w-3 h-3" />
                Phone Number *
              </Label>
              <Input
                value={formData.phoneNumber}
                onChange={(e) => updateField("phoneNumber", e.target.value)}
                placeholder="e.g., 09171234567"
                className="bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Building2 className="w-3 h-3" />
                Company Name
              </Label>
              <Input
                value={formData.companyName}
                onChange={(e) => updateField("companyName", e.target.value)}
                placeholder="Optional"
                className="bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <MapPin className="w-3 h-3" />
                Address
              </Label>
              <Input
                value={formData.address}
                onChange={(e) => updateField("address", e.target.value)}
                placeholder="Optional"
                className="bg-background"
              />
            </div>
          </div>
        </section>

        {/* Payment Details Section */}
        <section className="bg-card rounded-xl border border-border/50 p-5 md:p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-primary" />
            Payment Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <DollarSign className="w-3 h-3" />
                Amount *
              </Label>
              <Input
                value={formData.amount}
                onChange={(e) => updateField("amount", e.target.value)}
                placeholder="e.g., 20000.00"
                className="bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <CreditCard className="w-3 h-3" />
                Payment Type *
              </Label>
              <Select
                value={formData.paymentType}
                onValueChange={(val) => updateField("paymentType", val)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Briefcase className="w-3 h-3" />
                Project Type *
              </Label>
              <Input
                value={formData.projectType}
                onChange={(e) => updateField("projectType", e.target.value)}
                placeholder="e.g., Signage Installation"
                className="bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Wallet className="w-3 h-3" />
                Mode of Payment *
              </Label>
              <Select
                value={formData.modeOfPayment}
                onValueChange={(val) => updateField("modeOfPayment", val)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MODE_OF_PAYMENT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {showReferenceNumber && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1.5 md:col-span-2"
              >
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Hash className="w-3 h-3" />
                  Reference Number *
                </Label>
                <Input
                  value={formData.referenceNumber}
                  onChange={(e) => updateField("referenceNumber", e.target.value)}
                  placeholder="Enter reference number"
                  className="bg-background max-w-sm"
                />
              </motion.div>
            )}
          </div>
        </section>

        {/* Result message */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={`rounded-xl border p-4 flex items-start gap-3 ${
                result.success
                  ? "bg-success-muted border-success/30"
                  : "bg-destructive/10 border-destructive/20"
              }`}
            >
              {result.success ? (
                <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium ${
                    result.success ? "text-success-muted-foreground" : "text-destructive"
                  }`}
                >
                  {result.success
                    ? "Acknowledgement receipt generated successfully!"
                    : result.error}
                </p>
                {result.documentUrl && (
                  <a
                    href={result.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mt-1"
                  >
                    Open Document
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit button */}
        <div className="flex justify-end pb-8">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gradient-primary text-primary-foreground hover:opacity-90 transition-opacity"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Generate Receipt
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

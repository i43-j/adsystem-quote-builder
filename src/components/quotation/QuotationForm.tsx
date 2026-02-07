import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  CalendarDays,
  User,
  Building2,
  MapPin,
  Clock,
  Percent,
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
import { useAuth } from "@/contexts/AuthContext";
import { submitQuotation } from "@/lib/api";
import { SALUTATION_OPTIONS, DOWNPAYMENT_OPTIONS } from "@/lib/constants";
import { QuotationItemCard } from "./QuotationItemCard";
import { TotalsPanel } from "./TotalsPanel";
import type { QuotationFormData, QuotationItem, SubmissionResult } from "@/types/quotation";

function generateId() {
  return Math.random().toString(36).slice(2, 11);
}

function createEmptyItem(): QuotationItem {
  return {
    id: generateId(),
    name: "",
    size: "",
    specifications: "",
    qty: 0,
    unitPrice: 0,
  };
}

const initialFormData: QuotationFormData = {
  date: new Date().toISOString().split("T")[0],
  salutation: "Sir",
  clientName: "",
  companyName: "",
  address: "",
  timetable: "",
  downpayment: "50",
  customDownpayment: "",
  items: [createEmptyItem()],
};

export function QuotationForm() {
  const { user } = useAuth();
  const [formData, setFormData] = useState<QuotationFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);

  const updateField = useCallback(
    <K extends keyof QuotationFormData>(field: K, value: QuotationFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const updateItem = useCallback(
    (id: string, field: keyof QuotationItem, value: string | number) => {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      }));
    },
    []
  );

  const addItem = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, createEmptyItem()],
    }));
  }, []);

  const removeItem = useCallback((id: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  }, []);

  const downpaymentPercent = useMemo(() => {
    if (formData.downpayment === "custom") {
      return parseFloat(formData.customDownpayment) || 0;
    }
    return parseInt(formData.downpayment) || 0;
  }, [formData.downpayment, formData.customDownpayment]);

  const generateMockData = useCallback(() => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      salutation: "Sir",
      clientName: "Juan Dela Cruz",
      companyName: "ABC Marketing Corp",
      address: "123 Rizal Avenue, Makati City",
      timetable: "14-21",
      downpayment: "50",
      customDownpayment: "",
      items: [
        {
          id: generateId(),
          name: "WAREHOUSE LABELS",
          size: "4 x 6 inches",
          specifications:
            "ACRYLIC 3MM THICKNESS, UV PRINTED, WITH DOUBLE-SIDED TAPE",
          qty: 50,
          unitPrice: 125,
        },
        {
          id: generateId(),
          name: "OFFICE SIGNAGE",
          size: "24 x 36 inches",
          specifications: "SINTRA BOARD 5MM, FULL COLOR PRINT, MATTE LAMINATED",
          qty: 10,
          unitPrice: 450,
        },
      ],
    });
    setResult(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!user) return;

    // Basic validation
    if (!formData.clientName.trim()) {
      setResult({ success: false, error: "Client name is required." });
      return;
    }

    const validItems = formData.items.filter(
      (item) => item.name.trim() && item.qty > 0 && item.unitPrice > 0
    );

    if (validItems.length === 0) {
      setResult({
        success: false,
        error: "At least one complete item is required (name, quantity, and price).",
      });
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      const res = await submitQuotation(
        { ...formData, items: validItems },
        user.email,
        user.branch
      );
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
  }, [formData, user]);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Page header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
          New Quotation
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Fill in the details below to generate a quotation document.
        </p>
      </div>

      <div className="space-y-6">
        {/* Client Details Section */}
        <section className="bg-card rounded-xl border border-border/50 p-5 md:p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Client Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date */}
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

            {/* Salutation */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <User className="w-3 h-3" />
                Salutation *
              </Label>
              <Select
                value={formData.salutation}
                onValueChange={(val) => updateField("salutation", val)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SALUTATION_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Client Name */}
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

            {/* Company */}
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

            {/* Address */}
            <div className="space-y-1.5 md:col-span-2">
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

            {/* Timetable */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                Timetable (working days)
              </Label>
              <Input
                value={formData.timetable}
                onChange={(e) => updateField("timetable", e.target.value)}
                placeholder="e.g., 14-21"
                className="bg-background"
              />
            </div>

            {/* Downpayment */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Percent className="w-3 h-3" />
                Downpayment %
              </Label>
              <Select
                value={formData.downpayment}
                onValueChange={(val) => updateField("downpayment", val)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOWNPAYMENT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Custom downpayment */}
            {formData.downpayment === "custom" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1.5 md:col-span-2"
              >
                <Label className="text-xs font-medium text-muted-foreground">
                  Custom Downpayment (%)
                </Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.customDownpayment}
                  onChange={(e) =>
                    updateField("customDownpayment", e.target.value)
                  }
                  placeholder="Enter percentage"
                  className="bg-background max-w-[200px]"
                />
              </motion.div>
            )}
          </div>
        </section>

        {/* Items Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                {formData.items.length}
              </span>
              Quotation Items
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={addItem}
              className="text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Add Item
            </Button>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {formData.items.map((item, idx) => (
                <QuotationItemCard
                  key={item.id}
                  item={item}
                  index={idx}
                  canRemove={formData.items.length > 1}
                  onChange={updateItem}
                  onRemove={removeItem}
                />
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Totals */}
        <TotalsPanel
          items={formData.items}
          downpaymentPercent={downpaymentPercent}
        />

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
                    result.success
                      ? "text-success-muted-foreground"
                      : "text-destructive"
                  }`}
                >
                  {result.success
                    ? "Quotation generated successfully!"
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

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pb-8">
          {user?.branch === "test" && (
            <Button
              variant="outline"
              onClick={generateMockData}
              disabled={isSubmitting}
              className="order-2 sm:order-1"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Fill Mock Data
            </Button>
          )}

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gradient-primary text-primary-foreground hover:opacity-90 transition-opacity order-1 sm:order-2 sm:ml-auto"
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
                Generate Quotation
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

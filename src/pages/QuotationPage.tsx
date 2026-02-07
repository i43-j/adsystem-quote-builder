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
  Trash2,
  Package,
  Calculator,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import { submitQuotation } from "@/lib/api";
import { SALUTATION_OPTIONS, DOWNPAYMENT_OPTIONS } from "@/lib/constants";
import type { QuotationFormData, QuotationItem, SubmissionResult } from "@/lib/types";

/* ── Helpers ──────────────────────────────────────────── */

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

/* ── ItemCard (local component) ───────────────────────── */

interface ItemCardProps {
  item: QuotationItem;
  index: number;
  canRemove: boolean;
  onChange: (id: string, field: keyof QuotationItem, value: string | number) => void;
  onRemove: (id: string) => void;
}

function ItemCard({ item, index, canRemove, onChange, onRemove }: ItemCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="bg-card rounded-xl border border-border/50 p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Package className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">
            Item {index + 1}
          </span>
        </div>
        {canRemove && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(item.id)}
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Fields */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Item Name *
            </Label>
            <Input
              value={item.name}
              onChange={(e) => onChange(item.id, "name", e.target.value)}
              placeholder="e.g., Warehouse Labels"
              className="bg-background"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Size
            </Label>
            <Input
              value={item.size}
              onChange={(e) => onChange(item.id, "size", e.target.value)}
              placeholder="e.g., 4 x 6 inches"
              className="bg-background"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Specifications
          </Label>
          <Textarea
            value={item.specifications}
            onChange={(e) => onChange(item.id, "specifications", e.target.value)}
            placeholder="Material, finish, color, and other details..."
            rows={2}
            className="bg-background resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Quantity *
            </Label>
            <Input
              type="number"
              min={1}
              value={item.qty || ""}
              onChange={(e) =>
                onChange(item.id, "qty", parseInt(e.target.value) || 0)
              }
              placeholder="0"
              className="bg-background"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Unit Price (₱) *
            </Label>
            <Input
              type="number"
              min={0}
              step={0.01}
              value={item.unitPrice || ""}
              onChange={(e) =>
                onChange(item.id, "unitPrice", parseFloat(e.target.value) || 0)
              }
              placeholder="0.00"
              className="bg-background"
            />
          </div>
        </div>

        {/* Line total */}
        {item.qty > 0 && item.unitPrice > 0 && (
          <div className="flex justify-end pt-2 border-t border-border/50">
            <div className="text-sm">
              <span className="text-muted-foreground">Line Total: </span>
              <span className="font-semibold text-foreground">
                ₱{(item.qty * item.unitPrice).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ── TotalsPanel (local component) ────────────────────── */

interface TotalsPanelProps {
  items: QuotationItem[];
  downpaymentPercent: number;
}

function TotalsPanel({ items, downpaymentPercent }: TotalsPanelProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.qty * item.unitPrice,
    0
  );
  const downpaymentAmount = subtotal * (downpaymentPercent / 100);

  const fmt = (n: number) =>
    n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl border border-border/50 p-5 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Summary</h3>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium text-foreground">₱{fmt(subtotal)}</span>
        </div>

        {downpaymentPercent > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Downpayment ({downpaymentPercent}%)
            </span>
            <span className="font-medium text-primary">
              ₱{fmt(downpaymentAmount)}
            </span>
          </div>
        )}

        <div className="border-t border-border/50 pt-3">
          <div className="flex justify-between">
            <span className="text-sm font-semibold text-foreground">Total</span>
            <span className="text-lg font-bold text-foreground">
              ₱{fmt(subtotal)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── QuotationPage (main export) ──────────────────────── */

export default function QuotationPage() {
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
                <ItemCard
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

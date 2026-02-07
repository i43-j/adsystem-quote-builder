import { motion } from "framer-motion";
import { Calculator } from "lucide-react";
import type { QuotationItem } from "@/types/quotation";

interface TotalsPanelProps {
  items: QuotationItem[];
  downpaymentPercent: number;
}

export function TotalsPanel({ items, downpaymentPercent }: TotalsPanelProps) {
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

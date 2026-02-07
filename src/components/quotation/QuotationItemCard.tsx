import { motion } from "framer-motion";
import { Trash2, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { QuotationItem } from "@/types/quotation";

interface QuotationItemCardProps {
  item: QuotationItem;
  index: number;
  canRemove: boolean;
  onChange: (id: string, field: keyof QuotationItem, value: string | number) => void;
  onRemove: (id: string) => void;
}

export function QuotationItemCard({
  item,
  index,
  canRemove,
  onChange,
  onRemove,
}: QuotationItemCardProps) {
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

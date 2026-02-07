import { motion } from "framer-motion";
import { ShoppingCart, Clock } from "lucide-react";

export default function PurchaseOrderPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <ShoppingCart className="w-8 h-8 text-muted-foreground" />
      </div>
      <h1 className="text-xl font-bold text-foreground mb-2">Purchase Order</h1>
      <p className="text-muted-foreground text-sm max-w-sm">
        Purchase order management is coming soon. This feature is currently under
        development.
      </p>
      <div className="flex items-center gap-1.5 mt-4 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
        <Clock className="w-3 h-3" />
        Coming Soon
      </div>
    </motion.div>
  );
}

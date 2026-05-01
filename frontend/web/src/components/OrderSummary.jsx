import { useCartStore } from "../store/cartStore";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function OrderSummary() {
  const { pricing } = useCartStore();

  const {
    baseAmount = 0,
    discountAmount = 0,
    cgst = 0,
    sgst = 0,
    totalTax = 0,
    grandTotal = 0,
  } = pricing || {};

  return (
    <div className="theme-card rounded-[24px] p-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Order Summary
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Pricing and tax breakdown for this order.
        </p>
      </div>

      <div className="space-y-3">
        <Row label="Price (incl. GST)" value={grandTotal} />
        <Row label="Taxable value" value={baseAmount} subtle />

        {discountAmount > 0 && (
          <Row label="Coupon discount" value={-discountAmount} highlight />
        )}

        <Row label="CGST @ 9%" value={cgst} />
        <Row label="SGST @ 9%" value={sgst} />

        <div className="border-t border-slate-200/80 pt-3 dark:border-slate-800">
          <Row label="Total tax" value={totalTax} />
        </div>

        <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white dark:bg-cyan-950/55">
          <Row label="Amount payable" value={grandTotal} primary />
        </div>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        GST is calculated as per Indian tax regulations.
      </p>
    </div>
  );
}

function Row({ label, value, highlight, primary, subtle }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span
        className={
          primary
            ? "font-medium text-white"
            : highlight
              ? "text-emerald-600 dark:text-emerald-300"
              : subtle
                ? "text-slate-400 dark:text-slate-500"
                : "text-slate-600 dark:text-slate-300"
        }
      >
        {label}
      </span>
      <span className={primary ? "font-semibold text-white" : "font-medium text-slate-900 dark:text-white"}>
        {currencyFormatter.format(typeof value === "number" && !Number.isNaN(value) ? value : 0)}
      </span>
    </div>
  );
}

import { useCartStore } from "../store/cartStore";

export default function OrderSummary() {
  const { pricing } = useCartStore();

  const {
    baseAmount,
    discountAmount, 
    cgst,
    sgst,
    totalTax,
    grandTotal,
  } = pricing;

  

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-3">
      <h3 className="text-lg font-semibold">Order Summary</h3>

      <Row label="Price (Incl. GST)" value={grandTotal} />
      <Row label="Taxable Value (Included)" value={baseAmount} subtle />


      {discountAmount > 0 && (
        <Row
          label="Coupon Discount"
          value={-discountAmount}
          highlight
        />
      )}

      <Row label="CGST @9% (Included)" value={cgst} />
      <Row label="SGST @9% (Included)" value={sgst} />

      <div className="border-t pt-2">
        <Row label="Total Tax" value={totalTax} />
      </div>

      <div className="border-t pt-3 text-lg font-semibold">
      <Row label="Amount Payable" value={grandTotal} primary />
     </div>

      <p className="text-xs text-slate-500 pt-2">
        * GST charged as per Indian tax regulations.
      </p>
    </div>
  );
}

function Row({ label, value, highlight, primary, subtle }) {
  return (
    <div className="flex justify-between text-sm">
      <span
        className={
          primary
            ? "text-indigo-600 font-semibold"
            : highlight
            ? "text-green-600"
            : subtle
            ? "text-slate-400"
            : "text-slate-600"
        }
      >
        {label}
      </span>
      <span className="font-medium">
        ₹{typeof value === "number" && !isNaN(value)
          ? value.toFixed(2)
          : "0.00"}
      </span>
    </div>
  );
}
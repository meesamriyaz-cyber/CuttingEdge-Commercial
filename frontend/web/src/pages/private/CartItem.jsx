import { Plus, Minus, Trash, AlertTriangle, Package } from "lucide-react";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const { product, quantity } = item;
  const lowStock =
    typeof product?.stock === "number" &&
    product.stock > 0 &&
    product.stock <= 5;

  const outOfStock = typeof product?.stock === "number" && product.stock === 0;

  return (
    <div className="theme-card rounded-[24px] p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100/90 dark:bg-slate-900/60">
            {product?.images?.[0]?.url ? (
              <img
                src={product.images[0].url}
                alt={product.name}
                className="h-full w-full object-contain p-3"
              />
            ) : (
              <Package className="h-10 w-10 text-slate-300 dark:text-slate-600" />
            )}
          </div>

          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {product.name}
            </h3>
            <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
              {currencyFormatter.format(product.price || 0)}
            </p>

            {lowStock && (
              <p className="mt-2 flex items-center gap-1 text-xs text-orange-600 dark:text-orange-300">
                <AlertTriangle size={12} />
                Only {product.stock} left in stock
              </p>
            )}

            {outOfStock && (
              <p className="mt-2 flex items-center gap-1 text-xs text-red-600 dark:text-red-300">
                <AlertTriangle size={12} />
                Out of stock
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:justify-end">
          <div className="panel-muted flex items-center gap-3 p-2">
            <button
              onClick={onDecrease}
              disabled={quantity <= 1}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white/85 text-slate-700 transition-colors hover:border-cyan-300 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950/45 dark:text-slate-200 dark:hover:border-cyan-900 dark:hover:text-cyan-300"
            >
              <Minus size={14} />
            </button>

            <span className="min-w-[2rem] text-center font-semibold text-slate-900 dark:text-white">
              {quantity}
            </span>

            <button
              onClick={onIncrease}
              disabled={outOfStock}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white/85 text-slate-700 transition-colors hover:border-cyan-300 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950/45 dark:text-slate-200 dark:hover:border-cyan-900 dark:hover:text-cyan-300"
            >
              <Plus size={14} />
            </button>
          </div>

          <button
            onClick={onRemove}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300 dark:hover:bg-red-950/30"
          >
            <Trash size={14} />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

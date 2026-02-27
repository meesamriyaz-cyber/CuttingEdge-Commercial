import { Plus, Minus, Trash, AlertTriangle } from "lucide-react";

export default function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const { product, quantity } = item;
  const lowStock =
    typeof product?.stock === "number" &&
    product.stock > 0 &&
    product.stock <= 5;

  const outOfStock = typeof product?.stock === "number" && product.stock === 0;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-sm text-slate-500">₹{product.price}</p>
        <img
          src={product?.images?.[0].url}
          alt={product.name}
          width="70"
          height="70"
        />
        {lowStock && (
          <p className="text-xs text-orange-600 flex items-center gap-1 mt-1">
            <AlertTriangle size={12} />
            Only {product.stock} left in stock
          </p>
        )}

        {outOfStock && (
          <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
            <AlertTriangle size={12} />
            Out of stock
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onDecrease}
          disabled={quantity <= 1}
          className="h-8 w-8 rounded-lg border"
        >
          <Minus size={14} />
        </button>

        <span className="font-semibold min-w-[32px] text-center">
          {quantity}
        </span>

        <button
          onClick={onIncrease}
          disabled={outOfStock}
          className="h-8 w-8 rounded-lg border disabled:opacity-50"
        >
          <Plus size={14} />
        </button>
      </div>

      <button
        onClick={onRemove}
        className="text-sm text-red-600 flex items-center gap-1"
      >
        <Trash size={14} />
        Remove
      </button>
    </div>
  );
}

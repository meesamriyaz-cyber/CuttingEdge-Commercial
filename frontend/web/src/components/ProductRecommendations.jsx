import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingCart, Sparkles } from "lucide-react";

import { getProducts } from "../api/products";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { getProductPrimaryImage } from "../utils/productImages";
import { Button } from "./ui";

const PRICE_FORMATTER = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function scoreProduct(product) {
  const rating = product.rating?.average || 0;
  const reviews = product.rating?.count || 0;
  const createdAt = product.createdAt ? new Date(product.createdAt).getTime() : 0;

  return rating * 100 + reviews * 8 + createdAt / 100000000000;
}

function shuffleSeed(product) {
  return [...String(product._id || product.name || "")]
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function getRecommendedProducts(products, excludeIds, limit) {
  return [...products]
    .filter((product) => product?._id && !excludeIds.has(product._id))
    .sort((a, b) => {
      const scoreDelta = scoreProduct(b) - scoreProduct(a);
      if (scoreDelta !== 0) return scoreDelta;
      return shuffleSeed(a) - shuffleSeed(b);
    })
    .slice(0, limit);
}

export default function ProductRecommendations({
  title = "Popular picks",
  description = "Useful products to keep the workflow moving.",
  relatedCategory = "",
  excludeProductIds = [],
  limit = 4,
  className = "",
}) {
  const user = useAuthStore((state) => state.user);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState("");
  const [actionError, setActionError] = useState("");

  const excludeIds = useMemo(
    () => new Set(excludeProductIds.filter(Boolean)),
    [excludeProductIds],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadRecommendations() {
      setLoading(true);

      try {
        const primary = relatedCategory ? await getProducts(relatedCategory) : [];
        const needsFallback = !relatedCategory || primary.length < limit;
        const fallback = needsFallback ? await getProducts() : [];

        if (!isMounted) return;

        const merged = [...primary, ...fallback];
        const unique = Array.from(
          new Map(merged.map((product) => [product._id, product])).values(),
        );

        setProducts(unique);
      } catch {
        if (isMounted) {
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadRecommendations();

    return () => {
      isMounted = false;
    };
  }, [limit, relatedCategory]);

  const recommendedProducts = useMemo(
    () => getRecommendedProducts(products, excludeIds, limit),
    [excludeIds, limit, products],
  );

  async function handleAddToCart(productId) {
    setAddingId(productId);
    setActionError("");

    try {
      await updateQuantity(productId, 1);
    } catch {
      setActionError("Could not add that item right now.");
    } finally {
      setAddingId("");
    }
  }

  if (!loading && recommendedProducts.length === 0) {
    return null;
  }

  const isGovt = user?.clientType === "PUBLIC";

  return (
    <section className={`hero-shell rounded-lg p-5 sm:p-6 lg:p-7 ${className}`}>
      <div className="relative z-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="signal-chip inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide">
              <Sparkles className="h-3.5 w-3.5" />
              Recommended
            </span>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              {title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {description}
            </p>
          </div>

          <Button variant="secondary" to="/products/all" className="gap-2">
            View all products
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: limit }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-slate-200/80 bg-white/72 p-4 shadow-sm dark:border-cyan-950/50 dark:bg-slate-950/35"
                >
                  <div className="h-32 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-900" />
                  <div className="mt-4 h-4 w-20 animate-pulse rounded bg-slate-100 dark:bg-slate-900" />
                  <div className="mt-3 h-5 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-900" />
                  <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-slate-100 dark:bg-slate-900" />
                </div>
              ))
            : recommendedProducts.map((product) => (
                <article
                  key={product._id}
                  className="group flex h-full min-h-[300px] flex-col overflow-hidden rounded-lg border border-slate-200/80 bg-white/72 p-4 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-white/88 dark:border-cyan-950/50 dark:bg-slate-950/35 dark:hover:border-cyan-800"
                >
                  <Link
                    to={`/products/${product._id}`}
                    className="flex h-32 items-center justify-center overflow-hidden rounded-lg bg-slate-100 p-3 dark:bg-slate-900"
                  >
                    <img
                      src={getProductPrimaryImage(product)}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </Link>

                  <div className="mt-4 min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold uppercase tracking-wide text-orange-600 dark:text-orange-300">
                      {product.category || "Catalogue item"}
                    </p>
                    <Link to={`/products/${product._id}`}>
                      <h3 className="mt-1 line-clamp-2 text-base font-bold text-slate-950 group-hover:text-cyan-700 dark:text-white dark:group-hover:text-cyan-300">
                        {product.name}
                      </h3>
                    </Link>
                    {product.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {product.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-bold text-slate-950 dark:text-white">
                      {isGovt
                        ? "Pricing via quotation"
                        : PRICE_FORMATTER.format(product.price || 0)}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" className="flex-1 gap-2" to={`/products/${product._id}`}>
                        Details
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      {!isGovt && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="px-3"
                          onClick={() => handleAddToCart(product._id)}
                          disabled={addingId === product._id}
                          aria-label={`Add ${product.name} to cart`}
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
        </div>

        {actionError && (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300">
            {actionError}
          </p>
        )}
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  LogIn,
  Package,
  ShieldCheck,
  Star,
} from "lucide-react";
import { API_URL } from "../../api/client";
import { Button } from "../../components/ui";
import { getCategoryFallbackImage, getProductImages } from "../../utils/productImages";

export default function ProductDetailsGuest() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewSort, setReviewSort] = useState("newest");

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`${API_URL}/public/products/${id}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load product");
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  useEffect(() => {
    async function loadReviews() {
      setReviewsLoading(true);
      try {
        const res = await fetch(
          `${API_URL}/public/products/${id}/reviews?page=${reviewPage}&limit=5&sort=${reviewSort}`,
          { cache: "no-store" },
        );
        const data = await res.json();
        if (res.ok) {
          setReviews(data.reviews || []);
          setReviewSummary(data.summary || null);
        }
      } catch (err) {
        console.error("Failed to load reviews:", err);
      } finally {
        setReviewsLoading(false);
      }
    }

    loadReviews();
  }, [id, reviewPage, reviewSort]);

  const productImageUrls = product ? getProductImages(product) : [];
  const displayImages = product
    ? productImageUrls.length > 0
      ? productImageUrls
      : [getCategoryFallbackImage(product.category || product.name)]
    : [];
  const hasImages = displayImages.length > 0;
  const currentImage = displayImages[currentImageIndex] || displayImages[0];

  const nextImage = () =>
    setCurrentImageIndex((index) =>
      index === displayImages.length - 1 ? 0 : index + 1,
    );

  const prevImage = () =>
    setCurrentImageIndex((index) =>
      index === 0 ? displayImages.length - 1 : index - 1,
    );

  const renderStars = (rating) =>
    [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.round(rating || 0)
            ? "fill-amber-400 text-amber-400"
            : "text-slate-200 dark:text-slate-700"
        }`}
      />
    ));

  if (loading) {
    return (
      <div className="min-h-screen bg-page px-4 py-12">
        <div className="mx-auto flex max-w-xl items-center justify-center">
          <div className="theme-card w-full rounded-[24px] p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#08101d_0%,#0f4c61_62%,#ea580c_100%)] text-white">
              <Package className="h-8 w-8 animate-pulse" />
            </div>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Loading product details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-page px-4 py-12">
        <div className="mx-auto max-w-xl">
          <div className="theme-card rounded-[24px] p-8 text-center">
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
              Error loading product
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{error}</p>
            <Button onClick={() => navigate(-1)} className="mt-6 gap-2">
              <ArrowLeft size={16} />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-page px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl min-w-0">
        <section className="hero-shell mb-8 min-w-0 rounded-[28px] p-5 sm:p-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/75 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-cyan-300 hover:text-cyan-700 dark:border-slate-800 dark:bg-slate-950/35 dark:text-slate-200 dark:hover:border-cyan-900 dark:hover:text-cyan-300"
          >
            <ArrowLeft size={16} />
            Back to products
          </button>

          <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end">
            <div className="min-w-0">
              {product.category && (
                <span className="signal-chip inline-flex max-w-full break-words rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide [overflow-wrap:anywhere]">
                  {product.category}
                </span>
              )}

              <h1 className="mt-4 break-words text-3xl font-bold tracking-tight text-slate-900 [overflow-wrap:anywhere] dark:text-white sm:text-4xl">
                {product.name}
              </h1>

              <p className="mt-3 max-w-3xl break-words text-sm leading-relaxed text-slate-600 [overflow-wrap:anywhere] dark:text-slate-300 sm:text-base">
                {product.description || "No description available."}
              </p>
            </div>

            <div className="grid min-w-0 gap-3 sm:grid-cols-2">
              <div className="panel-muted min-w-0 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Public browsing
                </p>
                <p className="mt-2 break-words text-sm text-slate-600 [overflow-wrap:anywhere] dark:text-slate-300">
                  Browse products, compare fit, and continue after sign-in.
                </p>
              </div>
              <div className="panel-muted min-w-0 p-4">
                <div className="flex min-w-0 items-start gap-2 break-words text-sm text-slate-600 [overflow-wrap:anywhere] dark:text-slate-300">
                  <ShieldCheck size={16} className="mt-0.5 text-cyan-600 dark:text-cyan-300" />
                  Listing information is available publicly. Pricing and order workflow begin after login.
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="theme-card min-w-0 rounded-[24px] p-4 sm:p-6">
            <div className="relative aspect-square overflow-hidden rounded-[20px] bg-slate-100/90 dark:bg-slate-900/60">
              {hasImages ? (
                <img
                  src={currentImage}
                  alt={product.name}
                  className="h-full w-full object-contain p-6"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Package className="h-24 w-24 text-slate-300 dark:text-slate-600" />
                </div>
              )}

              {hasImages && displayImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/80 bg-white/90 text-slate-700 transition-colors hover:border-cyan-300 hover:text-cyan-700 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-200 dark:hover:border-cyan-900 dark:hover:text-cyan-300"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/80 bg-white/90 text-slate-700 transition-colors hover:border-cyan-300 hover:text-cyan-700 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-200 dark:hover:border-cyan-900 dark:hover:text-cyan-300"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            {hasImages && displayImages.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                {displayImages.map((img, index) => (
                  <button
                    key={img || index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border transition-all ${
                      index === currentImageIndex
                        ? "border-cyan-400 bg-cyan-50/70 dark:border-cyan-700 dark:bg-cyan-950/20"
                        : "border-slate-200/80 bg-white/70 hover:border-cyan-200 dark:border-slate-800 dark:bg-slate-950/35"
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="min-w-0 space-y-6">
            <div className="theme-card min-w-0 rounded-[24px] p-5 sm:p-8">
              {(product.rating?.count > 0 || reviewSummary?.totalReviews > 0) && (
                <div className="mb-5 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1">
                    {renderStars(product.rating?.average || reviewSummary?.averageRating)}
                  </div>
                  <span className="text-lg font-semibold text-slate-900 dark:text-white">
                    {(product.rating?.average || reviewSummary?.averageRating || 0).toFixed(1)}
                  </span>
                  <span className="break-words text-sm text-slate-500 [overflow-wrap:anywhere] dark:text-slate-400">
                    {(product.rating?.count || reviewSummary?.totalReviews || 0)} review
                    {(product.rating?.count || reviewSummary?.totalReviews || 0) !== 1 ? "s" : ""}
                  </span>
                </div>
              )}

              <div className="grid min-w-0 gap-3 sm:grid-cols-2">
                {product.sku && (
                  <div className="panel-muted min-w-0 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      SKU
                    </p>
                    <p className="mt-2 break-words text-sm font-medium text-slate-900 [overflow-wrap:anywhere] dark:text-white">
                      {product.sku}
                    </p>
                  </div>
                )}
                {product.category && (
                  <div className="panel-muted min-w-0 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Category
                    </p>
                    <p className="mt-2 break-words text-sm font-medium text-slate-900 [overflow-wrap:anywhere] dark:text-white">
                      {product.category}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="theme-card min-w-0 rounded-[24px] p-5 sm:p-8">
              <div className="panel-muted min-w-0 p-5">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Sign in to continue
                </h2>
                <p className="mt-2 break-words text-sm leading-relaxed text-slate-500 [overflow-wrap:anywhere] dark:text-slate-400">
                  Private customers unlock cart and checkout. Government customers unlock enquiry and quotation workflow after registration and sign-in.
                </p>
              </div>

              <Button onClick={() => navigate("/login")} className="mt-5 w-full gap-2" size="lg">
                <LogIn size={18} />
                Login to Continue
              </Button>
            </div>
          </div>
        </div>

        <section className="theme-card mt-10 min-w-0 rounded-[24px] p-5 sm:p-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Customer reviews
              </h2>
              <p className="mt-1 break-words text-sm text-slate-500 [overflow-wrap:anywhere] dark:text-slate-400">
                Public review history from verified buyers.
              </p>
            </div>

            <select
              value={reviewSort}
              onChange={(e) => setReviewSort(e.target.value)}
              className="theme-input w-full max-w-[220px] text-sm sm:w-auto"
            >
              <option value="newest">Newest</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>

          {reviewSummary && reviewSummary.totalReviews > 0 && (
            <div className="panel-muted mb-6 grid min-w-0 gap-6 p-5 md:grid-cols-[minmax(0,0.34fr)_minmax(0,1fr)]">
              <div className="min-w-0">
                <div className="text-4xl font-bold text-slate-900 dark:text-white">
                  {reviewSummary.averageRating.toFixed(1)}
                </div>
                <div className="mt-2 flex items-center gap-1">
                  {renderStars(reviewSummary.averageRating)}
                </div>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Based on {reviewSummary.totalReviews} reviews
                </p>
              </div>

              <div className="min-w-0 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviewSummary.distribution?.[star] || 0;
                  const percentage =
                    reviewSummary.totalReviews > 0
                      ? (count / reviewSummary.totalReviews) * 100
                      : 0;
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <span className="w-4 text-sm text-slate-600 dark:text-slate-300">{star}</span>
                      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-orange-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-sm text-slate-500 dark:text-slate-400">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {reviewsLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-600 border-t-transparent" />
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="panel-muted min-w-0 p-5">
                  <div className="flex min-w-0 items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-300">
                        <span className="font-semibold">
                          {review.user?.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="break-words font-medium text-slate-900 [overflow-wrap:anywhere] dark:text-white">
                          {review.user?.name || "Anonymous"}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-1">
                          {renderStars(review.rating)}
                          <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
                            {new Date(review.createdAt).toLocaleDateString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {review.title && (
                    <div className="mt-3 break-words font-semibold text-slate-900 [overflow-wrap:anywhere] dark:text-white">
                      {review.title}
                    </div>
                  )}
                  <p className="mt-2 break-words text-sm text-slate-600 [overflow-wrap:anywhere] dark:text-slate-300">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-500 dark:text-slate-400">
              No reviews yet. Be the first to review this product after purchase.
            </div>
          )}

          {reviewSummary && reviewSummary.totalReviews > 5 && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setReviewPage((page) => page + 1)}
                className="btn-theme-primary rounded-xl px-6 py-2.5"
              >
                Load More Reviews
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

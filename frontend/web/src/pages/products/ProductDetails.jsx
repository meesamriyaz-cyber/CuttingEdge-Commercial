import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Star,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ShoppingCart,
  Package,
  Minus,
  Plus,
  X,
  Building2,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import RoleGate from "../../components/RoleGate";
import { API_URL } from "../../api/client";
import { getProductReviews, canReviewProduct } from "../../api/reviews";
import ReviewsList from "../../components/ReviewsList";
import ReviewForm from "../../components/ReviewForm";
import { Button } from "../../components/ui";
import { getCategoryFallbackImage, getProductImages } from "../../utils/productImages";
import toast from "react-hot-toast";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken, user } = useAuthStore();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [canReview, setCanReview] = useState({ canReview: false });
  const [editingReview, setEditingReview] = useState(null);

  const isGovtClient = user?.clientType === "PUBLIC";
  const productImageUrls = product ? getProductImages(product) : [];
  const displayImages = product
    ? productImageUrls.length > 0
      ? productImageUrls
      : [getCategoryFallbackImage(product.category || product.name)]
    : [];
  const hasImages = displayImages.length > 0;
  const currentImage = displayImages[currentImageIndex] || displayImages[0];
  const availableStock = Number(product?.stock || 0);
  const outOfStock = availableStock < 1;

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`${API_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
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
  }, [id, accessToken]);

  useEffect(() => {
    async function loadReviews() {
      try {
        const data = await getProductReviews(id, { limit: 10 });
        setReviews(data.reviews || []);
        setReviewSummary(data.summary || null);
      } catch (err) {
        console.error("Failed to load reviews:", err);
      } finally {
        setReviewsLoading(false);
      }
    }

    if (id) loadReviews();
  }, [id]);

  useEffect(() => {
    async function checkCanReview() {
      if (!user || isGovtClient) return;
      try {
        const data = await canReviewProduct(id);
        setCanReview(data);
      } catch (err) {
        console.error("Failed to check review eligibility:", err);
      }
    }

    if (id && user) checkCanReview();
  }, [id, user, isGovtClient]);

  const nextImage = () =>
    setCurrentImageIndex((index) =>
      index === displayImages.length - 1 ? 0 : index + 1,
    );

  const prevImage = () =>
    setCurrentImageIndex((index) =>
      index === 0 ? displayImages.length - 1 : index - 1,
    );

  async function handleAddToCart() {
    if (outOfStock) {
      toast.error("This product is out of stock");
      return;
    }

    if (quantity > availableStock) {
      toast.error(`Only ${availableStock} left in stock`);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          productId: product._id,
          quantity,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Added to cart");
      navigate("/cart");
    } catch (err) {
      toast.error(err.message || "Could not add item to cart");
    }
  }

  function handleSubmitEnquiry() {
    navigate("/enquiry", {
      state: { productId: product._id, productName: product.name },
    });
  }

  const handleReviewSuccess = async () => {
    const data = await getProductReviews(id, { limit: 10 });
    setReviews(data.reviews || []);
    setReviewSummary(data.summary || null);
    const canReviewData = await canReviewProduct(id);
    setCanReview(canReviewData);
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (_reviewId, isRefresh = false) => {
    if (isRefresh) {
      const data = await getProductReviews(id, { limit: 10 });
      setReviews(data.reviews || []);
      setReviewSummary(data.summary || null);
    }
  };

  const renderStars = (rating) =>
    [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating
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
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-950/20">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h1 className="mt-5 text-xl font-semibold text-slate-900 dark:text-white">
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
        <motion.section
          className="hero-shell relative mb-8 min-w-0 overflow-hidden rounded-[28px] p-5 sm:p-8"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="accent-orbit hidden lg:block" />

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/75 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-cyan-300 hover:text-cyan-700 dark:border-slate-800 dark:bg-slate-950/35 dark:text-slate-200 dark:hover:border-cyan-900 dark:hover:text-cyan-300"
          >
            <ArrowLeft size={16} />
            Back to products
          </button>

          <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                {product.category && (
                  <span className="signal-chip inline-flex max-w-full items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    <Package size={12} />
                    <span className="min-w-0 break-words [overflow-wrap:anywhere]">
                      {product.category}
                    </span>
                  </span>
                )}
                {product.sku && (
                  <span className="max-w-full break-words rounded-full border border-slate-200/85 bg-white/65 px-3 py-1 text-xs font-medium text-slate-600 [overflow-wrap:anywhere] dark:border-slate-800 dark:bg-slate-950/35 dark:text-slate-300">
                    SKU {product.sku}
                  </span>
                )}
                {!isGovtClient && (
                  <div className="panel-muted min-w-0 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Stock
                    </p>
                    <p
                      className={`mt-2 break-words text-sm font-medium [overflow-wrap:anywhere] ${
                        outOfStock
                          ? "text-red-600 dark:text-red-300"
                          : "text-emerald-700 dark:text-emerald-300"
                      }`}
                    >
                      {outOfStock ? "Out of stock" : `${availableStock} available`}
                    </p>
                  </div>
                )}
              </div>

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
                  Product workflow
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900 dark:text-white">
                  {isGovtClient ? "Quotation-driven procurement" : "Direct retail purchase"}
                </p>
                <p className="mt-1 break-words text-sm text-slate-500 [overflow-wrap:anywhere] dark:text-slate-400">
                  {isGovtClient
                    ? "Submit an enquiry to receive pricing and supply confirmation."
                    : "Select quantity, add to cart, and complete checkout online."}
                </p>
              </div>

              <div className="panel-muted min-w-0 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Trust signal
                </p>
                <div className="mt-2 flex min-w-0 items-start gap-2 break-words text-sm text-slate-600 [overflow-wrap:anywhere] dark:text-slate-300">
                  <ShieldCheck size={16} className="mt-0.5 text-cyan-600 dark:text-cyan-300" />
                  Listing managed through verified customer and service workflows.
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <motion.div
            className="theme-card min-w-0 rounded-[24px] p-4 sm:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative aspect-square overflow-hidden rounded-[20px] bg-slate-100/90 dark:bg-slate-900/60">
              {hasImages ? (
                <motion.img
                  key={currentImageIndex}
                  src={currentImage}
                  alt={product.name}
                  className="h-full w-full object-contain p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
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
                    className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/80 bg-white/90 text-slate-700 shadow-sm transition-colors hover:border-cyan-300 hover:text-cyan-700 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-200 dark:hover:border-cyan-900 dark:hover:text-cyan-300"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/80 bg-white/90 text-slate-700 shadow-sm transition-colors hover:border-cyan-300 hover:text-cyan-700 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-200 dark:hover:border-cyan-900 dark:hover:text-cyan-300"
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
          </motion.div>

          <motion.div
            className="theme-card min-w-0 rounded-[24px] p-5 sm:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex min-w-0 flex-col gap-6">
              <div className="panel-muted min-w-0 p-5">
                <div className="flex flex-wrap items-center gap-3">
                  {product.rating?.count > 0 ? (
                    <>
                      <div className="flex items-center gap-1">
                        {renderStars(Math.round(product.rating.average))}
                      </div>
                      <span className="text-lg font-semibold text-slate-900 dark:text-white">
                        {product.rating.average.toFixed(1)}
                      </span>
                      <span className="break-words text-sm text-slate-500 [overflow-wrap:anywhere] dark:text-slate-400">
                        {product.rating.count} review{product.rating.count !== 1 ? "s" : ""}
                      </span>
                    </>
                  ) : (
                    <span className="break-words text-sm text-slate-500 [overflow-wrap:anywhere] dark:text-slate-400">
                      Customer review data will appear here after verified purchases.
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setShowDetailsModal(true)}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 transition-colors hover:text-orange-600 dark:text-cyan-300 dark:hover:text-orange-300"
                >
                  View full details
                  <ChevronRight size={16} />
                </button>
              </div>

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

              <RoleGate allow={["PRIVATE"]}>
                {product.segment === "CONSUMER" && (
                  <div className="space-y-4">
                    <div className="panel-muted min-w-0 p-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Price
                      </p>
                      <div className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                        {currencyFormatter.format(product.price || 0)}
                      </div>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Inclusive of applicable taxes.
                      </p>
                    </div>

                    <div className="panel-muted min-w-0 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          Quantity
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/85 text-slate-700 transition-colors hover:border-cyan-300 hover:text-cyan-700 dark:border-slate-800 dark:bg-slate-950/45 dark:text-slate-200 dark:hover:border-cyan-900 dark:hover:text-cyan-300"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="min-w-[2.5rem] text-center text-lg font-semibold text-slate-900 dark:text-white">
                            {quantity}
                          </span>
                          <button
                            onClick={() =>
                              setQuantity(Math.min(availableStock, quantity + 1))
                            }
                            disabled={quantity >= availableStock}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/85 text-slate-700 transition-colors hover:border-cyan-300 hover:text-cyan-700 dark:border-slate-800 dark:bg-slate-950/45 dark:text-slate-200 dark:hover:border-cyan-900 dark:hover:text-cyan-300"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleAddToCart}
                      disabled={outOfStock}
                      className="w-full gap-2"
                      size="lg"
                    >
                      <ShoppingCart size={18} />
                      {outOfStock ? "Out of Stock" : "Add to Cart"}
                    </Button>
                  </div>
                )}
              </RoleGate>

              <RoleGate allow={["PUBLIC"]}>
                {product.segment === "COMMERCIAL" && (
                  <div className="space-y-4">
                    <div className="panel-muted min-w-0 p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-300">
                          <Building2 size={20} />
                        </div>
                        <div className="min-w-0">
                          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                            Government procurement workflow
                          </h2>
                          <p className="mt-1 break-words text-sm leading-relaxed text-slate-500 [overflow-wrap:anywhere] dark:text-slate-400">
                            Submit your requirement and quantity details to receive a managed quote from the team.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button onClick={handleSubmitEnquiry} className="w-full" size="lg">
                      Submit Enquiry
                    </Button>
                  </div>
                )}
              </RoleGate>
            </div>
          </motion.div>
        </div>

        <motion.section
          className="theme-card mt-10 min-w-0 rounded-[24px] p-5 sm:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Customer reviews
              </h2>
              <p className="mt-1 break-words text-sm text-slate-500 [overflow-wrap:anywhere] dark:text-slate-400">
                Verified purchase feedback and product impressions.
              </p>
            </div>

            {canReview.canReview && (
              <Button
                onClick={() => {
                  setEditingReview(null);
                  setShowReviewForm(true);
                }}
                className="gap-2"
              >
                <MessageSquare size={18} />
                Write a Review
              </Button>
            )}

            {canReview.reason === "already_reviewed" && (
              <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-300">
                <CheckCircle2 size={18} />
                <span className="min-w-0 break-words [overflow-wrap:anywhere]">
                  You have already reviewed this product
                </span>
              </span>
            )}
          </div>

          {reviewsLoading ? (
            <div className="flex justify-center py-12">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-600 border-t-transparent" />
            </div>
          ) : (
            <ReviewsList
              reviews={reviews}
              summary={reviewSummary}
              currentUserId={user?._id}
              onEditReview={handleEditReview}
              onDeleteReview={handleDeleteReview}
            />
          )}
        </motion.section>
      </div>

      <AnimatePresence>
        {showDetailsModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              className="theme-card max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-[24px]"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-4 dark:border-slate-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Product details
                </h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/80 text-slate-500 transition-colors hover:border-cyan-300 hover:text-cyan-700 dark:border-slate-800 dark:text-slate-300 dark:hover:border-cyan-900 dark:hover:text-cyan-300"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="max-h-[calc(90vh-88px)] overflow-y-auto px-6 py-6">
                <p className="break-words text-sm leading-relaxed text-slate-600 [overflow-wrap:anywhere] dark:text-slate-300">
                  {product.description || "No detailed description available."}
                </p>

                <div className="mt-6 grid min-w-0 gap-4 sm:grid-cols-2">
                  {product.sku && (
                    <div className="panel-muted min-w-0 p-4">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        SKU
                      </span>
                      <p className="mt-2 break-words text-sm font-medium text-slate-900 [overflow-wrap:anywhere] dark:text-white">
                        {product.sku}
                      </p>
                    </div>
                  )}
                  {product.category && (
                    <div className="panel-muted min-w-0 p-4">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Category
                      </span>
                      <p className="mt-2 break-words text-sm font-medium text-slate-900 [overflow-wrap:anywhere] dark:text-white">
                        {product.category}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReviewForm && (
          <ReviewForm
            productId={id}
            orderId={canReview.orderId}
            existingReview={editingReview}
            onClose={() => {
              setShowReviewForm(false);
              setEditingReview(null);
            }}
            onSuccess={handleReviewSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

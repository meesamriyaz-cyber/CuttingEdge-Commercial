import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import RoleGate from "../../components/RoleGate";
import { API_URL } from "../../api/client";
import { getProductReviews, canReviewProduct } from "../../api/reviews";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReviewsList from "../../components/ReviewsList";
import ReviewForm from "../../components/ReviewForm";

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

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [canReview, setCanReview] = useState({ canReview: false });
  const [editingReview, setEditingReview] = useState(null);

  const isGovtClient = user?.clientType === "PUBLIC";

  /* ================= LOAD PRODUCT ================= */
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

  /* ================= LOAD REVIEWS ================= */
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

  /* ================= CHECK IF CAN REVIEW ================= */
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

  /* ================= IMAGE CONTROLS ================= */
  const hasImages = product?.images?.length > 0;
  const currentImage = hasImages ? product.images[currentImageIndex] : null;

  const nextImage = () =>
    setCurrentImageIndex((i) => (i === product.images.length - 1 ? 0 : i + 1));

  const prevImage = () =>
    setCurrentImageIndex((i) => (i === 0 ? product.images.length - 1 : i - 1));

  /* ================= ACTIONS ================= */
  async function handleAddToCart() {
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
      navigate("/cart");
    } catch (err) {
      alert(err.message);
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

  const handleDeleteReview = async (reviewId, isRefresh = false) => {
    if (isRefresh) {
      const data = await getProductReviews(id, { limit: 10 });
      setReviews(data.reviews || []);
      setReviewSummary(data.summary || null);
    }
  };

  /* ================= RENDER STARS ================= */
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? "fill-amber-400 text-amber-400"
            : "text-slate-200 dark:text-slate-600"
        }`}
      />
    ));
  };

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-kashmiri-dal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-kashmiri-dal-500 via-kashmiri-pashmina-500 to-kashmiri-saffron-500 flex items-center justify-center animate-pulse">
            <Package className="w-8 h-8 text-white" />
          </div>
          <p className="text-slate-500 dark:text-slate-400">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  /* ================= ERROR STATE ================= */
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-kashmiri-dal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 text-center max-w-md shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-red-600 dark:text-red-400 font-semibold mb-2">
            Error Loading Product
          </p>
          <p className="text-slate-500 dark:text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-kashmiri-dal-500 to-kashmiri-pashmina-500 text-white font-semibold shadow-lg shadow-kashmiri-dal-500/25 hover:shadow-xl transition-all duration-200"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  /* ================= PAGE ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-kashmiri-dal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Products</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* ================= IMAGE GALLERY ================= */}
          <motion.div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Main Image */}
            <div className="relative aspect-square bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden">
              {hasImages ? (
                <motion.img
                  key={currentImageIndex}
                  src={currentImage.url}
                  alt={product.name}
                  className="w-full h-full object-contain"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-24 h-24 text-slate-300 dark:text-slate-600" />
                </div>
              )}

              {/* Navigation Arrows */}
              {hasImages && product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {hasImages && product.images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      i === currentImageIndex
                        ? "border-blue-500 shadow-lg shadow-blue-500/20"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ================= PRODUCT INFO ================= */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Product Header */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-xl p-6 sm:p-8">
              {/* Category Badge */}
              {product.category && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-kashmiri-dal-100 to-kashmiri-pashmina-100 dark:from-kashmiri-dal-950/50 dark:to-kashmiri-pashmina-950/50 text-kashmiri-dal-700 dark:text-kashmiri-dal-300 mb-4">
                  <Package size={12} />
                  {product.category}
                </span>
              )}

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                {product.name}
              </h1>

              {/* Rating Display */}
              {product.rating?.count > 0 && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    {renderStars(Math.round(product.rating.average))}
                  </div>
                  <span className="text-lg font-semibold text-slate-900 dark:text-white">
                    {product.rating.average.toFixed(1)}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    ({product.rating.count} reviews)
                  </span>
                </div>
              )}

              <p className="text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                {product.description || "No description available."}
              </p>

              <button
                onClick={() => setShowDetailsModal(true)}
                className="mt-4 text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center gap-1"
              >
                View Full Details
                <ChevronRight size={16} />
              </button>

              {/* Price - Private Users */}
              <RoleGate allow={["PRIVATE"]}>
                {product.segment === "CONSUMER" && (
                  <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <div className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                      ₹{product.price?.toLocaleString()}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Inclusive of all taxes
                    </p>
                  </div>
                )}
              </RoleGate>
            </div>

            {/* Actions Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-xl p-6 sm:p-8">
              {/* Private User Actions */}
              <RoleGate allow={["PRIVATE"]}>
                {product.segment === "CONSUMER" && (
                  <>
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Quantity:
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                          <Minus size={18} />
                        </button>
                        <span className="w-12 text-center font-semibold text-lg text-slate-900 dark:text-white">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <motion.button
                      onClick={handleAddToCart}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <ShoppingCart size={20} />
                      Add to Cart
                    </motion.button>
                  </>
                )}
              </RoleGate>

              {/* Government User Actions */}
              <RoleGate allow={["PUBLIC"]}>
                {product.segment === "COMMERCIAL" && (
                  <>
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border border-purple-200 dark:border-purple-800 rounded-2xl p-5 mb-6">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            Government Procurement
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            This product is available through enquiry for
                            government clients. Submit an enquiry to receive a
                            quotation.
                          </p>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      onClick={handleSubmitEnquiry}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      Submit Enquiry
                    </motion.button>
                  </>
                )}
              </RoleGate>
            </div>
          </motion.div>
        </div>

        {/* ================= REVIEWS SECTION ================= */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Customer Reviews
              </h2>

              {canReview.canReview && (
                <motion.button
                  onClick={() => {
                    setEditingReview(null);
                    setShowReviewForm(true);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageSquare size={18} />
                  Write a Review
                </motion.button>
              )}

              {canReview.reason === "already_reviewed" && (
                <span className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 size={18} />
                  You've reviewed this product
                </span>
              )}
            </div>

            {reviewsLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-10 h-10 rounded-xl border-2 border-blue-500 border-t-transparent animate-spin" />
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
          </div>
        </motion.div>
      </div>

      {/* ================= DETAILS MODAL ================= */}
      <AnimatePresence>
        {showDetailsModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Product Details
                </h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {product.description || "No detailed description available."}
                </p>

                {/* Additional Details */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {product.sku && (
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                        SKU
                      </span>
                      <p className="text-slate-900 dark:text-white font-medium mt-1">
                        {product.sku}
                      </p>
                    </div>
                  )}
                  {product.category && (
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                        Category
                      </span>
                      <p className="text-slate-900 dark:text-white font-medium mt-1">
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

      {/* ================= REVIEW FORM MODAL ================= */}
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

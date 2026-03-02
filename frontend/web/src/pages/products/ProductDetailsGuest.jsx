// src/pages/products/ProductDetailsGuest.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../../api/client";

export default function ProductDetailsGuest() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Reviews state
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

  // Load reviews
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

  /* ================= IMAGE CONTROLS ================= */
  const hasImages = product?.images?.length > 0;
  const currentImage = hasImages ? product.images[currentImageIndex] : null;

  const nextImage = () =>
    setCurrentImageIndex((i) => (i === product.images.length - 1 ? 0 : i + 1));

  const prevImage = () =>
    setCurrentImageIndex((i) => (i === 0 ? product.images.length - 1 : i - 1));

  /* ================= RENDER STARS ================= */
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${
          i < Math.round(rating || 0)
            ? "fill-amber-400 text-amber-400"
            : "fill-slate-200 text-slate-200"
        }`}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (loading)
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-emerald-500 rounded-full" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="theme-card bg-surface rounded-3xl p-6 text-center">
          <p className="text-red-600 font-semibold mb-2">
            Error Loading Product
          </p>
          <p className="text-slate-600">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 btn-theme-primary px-4 py-2 rounded-xl"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-surface px-4 sm:px-6 py-10 sm:py-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-teal-100 to-emerald-100 dark:from-teal-900/20 dark:from-emerald-900/20 rounded-full blur-3xl opacity-50"></div>
      </div>
      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="btn-theme-primary px-6 py-3 rounded-xl font-semibold"
        >
          ← Back to Products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {/* ================= IMAGES ================= */}
          {product.images?.length > 0 && (
            <div className="theme-card bg-surface rounded-3xl shadow-2xl p-6">
              <div className="relative">
                <div className="aspect-square bg-surface-alt rounded-2xl overflow-hidden flex items-center justify-center">
                  <img
                    src={currentImage.url}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain transition-transform duration-500 hover:scale-110"
                  />
                </div>

                {hasImages && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 btn-theme-primary px-3 py-1 rounded-xl"
                    >
                      ‹
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 btn-theme-primary px-3 py-1 rounded-xl"
                    >
                      ›
                    </button>
                  </>
                )}

                {hasImages && product.images.length > 1 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto">
                    {product.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImageIndex(i)}
                        className={`w-20 h-20 rounded-xl overflow-hidden border-2 ${
                          i === currentImageIndex
                            ? "border-emerald-500"
                            : "border-white/30"
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
              </div>
            </div>
          )}

          {/* ================= DETAILS ================= */}
          <div className="space-y-6">
            <div className="theme-card bg-surface rounded-3xl shadow-2xl p-6">
              <h1 className="text-3xl font-bold hero-gradient-text mb-2">
                {product.name}
              </h1>
              {product.category && (
                <span className="inline-block text-xs font-semibold bg-surface-alt text-slate-700 px-3 py-1 rounded-full mb-2">
                  {product.category}
                </span>
              )}

              {/* Rating Display */}
              {(product.rating?.count > 0 ||
                reviewSummary?.totalReviews > 0) && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    {renderStars(
                      product.rating?.average || reviewSummary?.averageRating,
                    )}
                  </div>
                  <span className="text-lg font-semibold text-slate-900">
                    {(
                      product.rating?.average ||
                      reviewSummary?.averageRating ||
                      0
                    ).toFixed(1)}
                  </span>
                  <span className="text-slate-500">
                    ({product.rating?.count || reviewSummary?.totalReviews || 0}{" "}
                    reviews)
                  </span>
                </div>
              )}

              <p className="text-slate-600 leading-relaxed">
                {product.description || "No description available."}
              </p>
            </div>

            {/* ================= ACTIONS ================= */}
            <div className="theme-card bg-surface rounded-3xl shadow-xl p-6">
              <div className="bg-surface-alt border border-white/30 rounded-2xl p-4 mb-4">
                <p className="text-sm text-slate-600">
                  For pricing and purchase, please login or submit an enquiry.
                </p>
              </div>

              <button
                onClick={() => navigate("/login")}
                className="w-full btn-theme-primary py-3 rounded-xl font-semibold"
              >
                Login to Continue
              </button>
            </div>
          </div>
        </div>

        {/* ================= REVIEWS SECTION ================= */}
        <div className="theme-card bg-surface rounded-3xl shadow-2xl p-6">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

          {/* Review Summary */}
          {reviewSummary && reviewSummary.totalReviews > 0 && (
            <div className="flex flex-col md:flex-row gap-8 mb-8 p-4 bg-surface-alt rounded-2xl">
              {/* Average Rating */}
              <div className="text-center md:text-left">
                <div className="text-4xl font-bold text-slate-900">
                  {reviewSummary.averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center md:justify-start gap-1 my-2">
                  {renderStars(reviewSummary.averageRating)}
                </div>
                <div className="text-sm text-slate-500">
                  Based on {reviewSummary.totalReviews} reviews
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="flex-1 space-y-1">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviewSummary.distribution?.[star] || 0;
                  const percentage =
                    reviewSummary.totalReviews > 0
                      ? (count / reviewSummary.totalReviews) * 100
                      : 0;
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-sm text-slate-600 w-8">{star}</span>
                      <svg
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 w-8">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sort Reviews */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-slate-600">Sort by:</span>
            <select
              value={reviewSort}
              onChange={(e) => setReviewSort(e.target.value)}
              className="theme-input px-3 py-2 rounded-lg text-sm"
            >
              <option value="newest">Newest</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>

          {/* Reviews List */}
          {reviewsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-b-2 border-emerald-500 rounded-full" />
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="border-b border-white/30 pb-4 last:border-0"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <span className="text-emerald-700 font-semibold">
                          {review.user?.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">
                          {review.user?.name || "Anonymous"}
                        </div>
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                          <span className="text-xs text-slate-500 ml-1">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {review.title && (
                    <div className="font-semibold mt-2 text-slate-900">
                      {review.title}
                    </div>
                  )}
                  <p className="text-sm text-slate-600 mt-2">
                    {review.comment}
                  </p>
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {review.images.map((img, i) => (
                        <img
                          key={i}
                          src={img.url}
                          alt="Review"
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              No reviews yet. Be the first to review this product!
            </div>
          )}

          {/* Load More Reviews */}
          {reviewSummary && reviewSummary.totalReviews > 5 && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setReviewPage((p) => p + 1)}
                className="btn-theme-primary px-6 py-2 rounded-xl"
              >
                Load More Reviews
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

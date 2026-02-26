import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ThumbsUp, Flag, MoreVertical, Edit, Trash2 } from "lucide-react";
import { markReviewHelpful, deleteReview } from "../api/reviews";
import toast from "react-hot-toast";

export default function ReviewsList({
  reviews,
  summary,
  currentUserId = null,
  onEditReview,
  onDeleteReview,
}) {
  const [helpfulLoading, setHelpfulLoading] = useState(null);

  const handleHelpful = async (reviewId, isHelpful) => {
    setHelpfulLoading(reviewId);
    try {
      await markReviewHelpful(reviewId, isHelpful);
      // The parent component should refresh reviews
      if (onDeleteReview) {
        // Reuse callback to trigger refresh
        onDeleteReview(null, true);
      }
    } catch (err) {
      toast.error("Failed to mark review as helpful");
    } finally {
      setHelpfulLoading(null);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await deleteReview(reviewId);
      toast.success("Review deleted");
      onDeleteReview?.(reviewId);
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
        }`}
      />
    ));
  };

  // Calculate percentage for rating bars
  const getPercentage = (count) => {
    if (!summary?.totalReviews) return 0;
    return Math.round((count / summary.totalReviews) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      {summary && summary.totalReviews > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Average Rating */}
            <div className="text-center md:text-left">
              <div className="text-5xl font-bold text-slate-900 mb-2">
                {summary.averageRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
                {renderStars(Math.round(summary.averageRating))}
              </div>
              <p className="text-sm text-slate-500">
                Based on {summary.totalReviews} review
                {summary.totalReviews !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-3 mb-2">
                  <span className="text-sm text-slate-600 w-8">{star} ★</span>
                  <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${getPercentage(summary.distribution[star])}%`,
                      }}
                      transition={{ duration: 0.5, delay: star * 0.1 }}
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                    />
                  </div>
                  <span className="text-sm text-slate-500 w-10 text-right">
                    {summary.distribution[star]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {reviews.map((review, index) => {
            const isOwner = currentUserId && review.user?._id === currentUserId;

            return (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-kashmiri-dal-100 to-kashmiri-pashmina-100 
                      flex items-center justify-center text-kashmiri-dal-600 font-semibold"
                    >
                      {review.user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {review.user?.name || "Anonymous"}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Verified Purchase Badge */}
                  {review.isVerifiedPurchase && (
                    <span
                      className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 
                      rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      Verified Purchase
                    </span>
                  )}

                  {/* Owner Actions */}
                  {isOwner && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditReview?.(review)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit review"
                      >
                        <Edit className="w-4 h-4 text-slate-500" />
                      </button>
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete review"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Title */}
                {review.title && (
                  <h4 className="font-semibold text-slate-900 mb-2">
                    {review.title}
                  </h4>
                )}

                {/* Comment */}
                <p className="text-slate-600 leading-relaxed mb-4">
                  {review.comment}
                </p>

                {/* Review Images */}
                {review.images?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {review.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img.url}
                        alt={`Review image ${idx + 1}`}
                        className="w-20 h-20 object-cover rounded-lg border border-slate-200 
                          cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(img.url, "_blank")}
                      />
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleHelpful(review._id, true)}
                    disabled={helpfulLoading === review._id}
                    className="flex items-center gap-2 text-sm text-slate-600 
                      hover:text-kashmiri-dal-600 transition-colors disabled:opacity-50"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    Helpful ({review.helpfulVotes || 0})
                  </button>
                  <button
                    className="flex items-center gap-2 text-sm text-slate-500 
                      hover:text-slate-700 transition-colors"
                  >
                    <Flag className="w-4 h-4" />
                    Report
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {reviews.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No reviews yet
            </h3>
            <p className="text-slate-600">
              Be the first to review this product!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

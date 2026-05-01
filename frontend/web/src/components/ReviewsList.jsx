import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ThumbsUp, Flag, Edit, Trash2 } from "lucide-react";
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
      if (onDeleteReview) {
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

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const renderStars = (rating) =>
    [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-700"
        }`}
      />
    ));

  const getPercentage = (count) => {
    if (!summary?.totalReviews) return 0;
    return Math.round((count / summary.totalReviews) * 100);
  };

  return (
    <div className="space-y-6">
      {summary && summary.totalReviews > 0 && (
        <div className="panel-muted p-6">
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="text-center md:text-left">
              <div className="mb-2 text-5xl font-bold text-slate-900 dark:text-white">
                {summary.averageRating.toFixed(1)}
              </div>
              <div className="mb-2 flex items-center justify-center gap-1 md:justify-start">
                {renderStars(Math.round(summary.averageRating))}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Based on {summary.totalReviews} review{summary.totalReviews !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="mb-2 flex items-center gap-3">
                  <span className="w-8 text-sm text-slate-600 dark:text-slate-300">
                    {star}
                  </span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${getPercentage(summary.distribution[star])}%` }}
                      transition={{ duration: 0.5, delay: star * 0.08 }}
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-orange-500"
                    />
                  </div>
                  <span className="w-10 text-right text-sm text-slate-500 dark:text-slate-400">
                    {summary.distribution[star]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
                className="panel-muted p-5 sm:p-6"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 font-semibold text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-300">
                      {review.user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {review.user?.name || "Anonymous"}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-xs text-slate-400">/</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {review.isVerifiedPurchase && (
                    <span className="hidden items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700 dark:bg-orange-950/20 dark:text-orange-300 sm:inline-flex">
                      <ThumbsUp className="h-3 w-3" />
                      Verified Purchase
                    </span>
                  )}

                  {isOwner && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditReview?.(review)}
                        className="rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-900"
                        title="Edit review"
                      >
                        <Edit className="h-4 w-4 text-slate-500" />
                      </button>
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="rounded-lg p-2 transition-colors hover:bg-red-50 dark:hover:bg-red-950/20"
                        title="Delete review"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  )}
                </div>

                {review.title && (
                  <h4 className="mb-2 font-semibold text-slate-900 dark:text-white">
                    {review.title}
                  </h4>
                )}

                <p className="mb-4 leading-relaxed text-slate-600 dark:text-slate-300">
                  {review.comment}
                </p>

                {review.images?.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {review.images.map((img, index) => (
                      <img
                        key={index}
                        src={img.url}
                        alt={`Review image ${index + 1}`}
                        className="h-20 w-20 cursor-pointer rounded-lg border border-slate-200 object-cover transition-opacity hover:opacity-90 dark:border-slate-800"
                        onClick={() => window.open(img.url, "_blank")}
                      />
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-slate-200/80 pt-4 dark:border-slate-800">
                  <button
                    onClick={() => handleHelpful(review._id, true)}
                    disabled={helpfulLoading === review._id}
                    className="flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-cyan-700 disabled:opacity-50 dark:text-slate-300 dark:hover:text-cyan-300"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    Helpful ({review.helpfulVotes || 0})
                  </button>
                  <button className="flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                    <Flag className="h-4 w-4" />
                    Report
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {reviews.length === 0 && (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900">
              <Star className="h-8 w-8 text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
              No reviews yet
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Be the first to review this product.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Star, X, Loader2, Camera, Check } from "lucide-react";
import { createReview, updateReview } from "../api/reviews";

export default function ReviewForm({
  productId,
  orderId,
  existingReview = null,
  onClose,
  onSuccess,
}) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState(existingReview?.title || "");
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState(
    existingReview?.images?.map((img) => img.url) || [],
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const isEditing = !!existingReview;

  const validateForm = () => {
    const newErrors = {};
    if (rating === 0) newErrors.rating = "Please select a rating";
    if (!comment.trim()) newErrors.comment = "Please write a review";
    if (comment.trim().length < 10) {
      newErrors.comment = "Review must be at least 10 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result]);
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const reviewData = {
        productId,
        orderId,
        rating,
        title: title.trim(),
        comment: comment.trim(),
        images,
      };

      let result;
      if (isEditing) {
        result = await updateReview(existingReview._id, reviewData);
        toast.success("Review updated successfully");
      } else {
        result = await createReview(reviewData);
        toast.success("Review submitted successfully");
      }

      onSuccess?.(result);
      onClose?.();
    } catch (err) {
      console.error("Submit review error:", err);
      toast.error(err.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="theme-card max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[24px]"
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200/80 bg-white/85 px-6 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isEditing ? "Edit Review" : "Write a Review"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Rating *
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-200 dark:text-slate-700"
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                  {rating === 1 && "Poor"}
                  {rating === 2 && "Fair"}
                  {rating === 3 && "Good"}
                  {rating === 4 && "Very Good"}
                  {rating === 5 && "Excellent"}
                </span>
              )}
            </div>
            {errors.rating && (
              <p className="mt-1 text-sm text-red-500">{errors.rating}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Title (optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your review"
              className="theme-input"
              maxLength={100}
            />
            <p className="mt-1 text-xs text-slate-400">{title.length}/100</p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Review *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={4}
              className="theme-input resize-none"
              maxLength={1000}
            />
            <div className="mt-1 flex justify-between">
              {errors.comment && (
                <p className="text-xs text-red-500">{errors.comment}</p>
              )}
              <p className="ml-auto text-xs text-slate-400">{comment.length}/1000</p>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Photos (optional, max 5)
            </label>
            <div className="flex flex-wrap gap-3">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="group relative">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="h-20 w-20 rounded-lg border border-slate-200 object-cover dark:border-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {imagePreviews.length < 5 && (
                <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 transition-colors hover:border-cyan-400 hover:bg-cyan-50/60 dark:border-slate-800 dark:hover:border-cyan-800 dark:hover:bg-cyan-950/20">
                  <Camera className="h-6 w-6 text-slate-400" />
                  <span className="mt-1 text-xs text-slate-400">Add</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 px-6 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#08101d_0%,#0f4c61_62%,#ea580c_100%)] px-6 py-3 font-semibold text-white shadow-[0_18px_40px_-26px_rgba(8,16,29,0.78)] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  {isEditing ? "Update Review" : "Submit Review"}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

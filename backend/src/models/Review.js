import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      // Ensures review is linked to actual purchase
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: "Rating must be an integer between 1 and 5",
      },
    },
    title: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
      minlength: 10,
    },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    isVerifiedPurchase: {
      type: Boolean,
      default: true,
      // Always true since review requires order reference
    },
    isApproved: {
      type: Boolean,
      default: true,
      // Can be set to false for moderation
    },
    helpfulVotes: {
      type: Number,
      default: 0,
    },
    votedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        isHelpful: Boolean,
      },
    ],
  },
  { timestamps: true },
);

// Compound index to ensure one review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Static method to calculate average rating for a product
reviewSchema.statics.calculateAverageRating = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: { 
        product: new mongoose.Types.ObjectId(productId), 
        isApproved: true 
      },
    },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: "$rating",
        },
      },
    },
  ]);

  if (stats.length > 0) {
    // Calculate rating distribution
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    stats[0].ratingDistribution.forEach((rating) => {
      distribution[rating]++;
    });

    await mongoose.model("Product").findByIdAndUpdate(productId, {
      "rating.average": Math.round(stats[0].averageRating * 10) / 10,
      "rating.count": stats[0].totalReviews,
      "rating.distribution": distribution,
    });
  } else {
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      "rating.average": 0,
      "rating.count": 0,
      "rating.distribution": { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    });
  }
};

// Call calculateAverageRating after save
reviewSchema.post("save", function () {
  this.constructor.calculateAverageRating(this.product);
});

// Call calculateAverageRating after remove
reviewSchema.post("findOneAndDelete", function (doc) {
  if (doc) {
    doc.constructor.calculateAverageRating(doc.product);
  }
});

export default mongoose.model("Review", reviewSchema);

import Review from "../models/Review.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import cloudinary from "../utils/cloudinary.js";
import mongoose from "mongoose";

/**
 * Check if user has purchased the product and can review it
 */
export const canReviewProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      user: userId,
    });

    if (existingReview) {
      return res.json({
        canReview: false,
        reason: "already_reviewed",
        review: existingReview,
      });
    }

    // Check if user has purchased this product (delivered order)
    const order = await Order.findOne({
      user: userId,
      "items.product": productId,
      status: "DELIVERED",
    });

    if (!order) {
      return res.json({
        canReview: false,
        reason: "not_purchased",
      });
    }

    // Find the specific order item for this product
    const orderItem = order.items.find(
      (item) => item.product.toString() === productId,
    );

    res.json({
      canReview: true,
      orderId: order._id,
      orderItem,
    });
  } catch (err) {
    console.error("Can review check error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get products that user can review (purchased but not yet reviewed)
 */
export const getReviewableProducts = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all delivered orders for the user
    const orders = await Order.find({
      user: userId,
      status: "DELIVERED",
    }).populate("items.product", "name images price");

    // Get all products the user has already reviewed
    const reviewedProducts = await Review.find({ user: userId }).distinct(
      "product",
    );

    // Extract unique products from orders that haven't been reviewed
    const reviewableProducts = [];
    const seenProducts = new Set();

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const productId = item.product?._id?.toString();
        if (
          productId &&
          !seenProducts.has(productId) &&
          !reviewedProducts.includes(productId) &&
          item.product // Ensure product exists
        ) {
          seenProducts.add(productId);
          reviewableProducts.push({
            product: item.product,
            orderId: order._id,
            orderDate: order.createdAt,
          });
        }
      });
    });

    res.json(reviewableProducts);
  } catch (err) {
    console.error("Get reviewable products error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Create a new review
 */
export const createReview = async (req, res) => {
  try {
    const {
      productId,
      orderId,
      rating,
      title,
      comment,
      images = [],
    } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!productId || !orderId || !rating || !comment) {
      return res.status(400).json({
        message: "Product, order, rating, and comment are required",
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      user: userId,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this product",
      });
    }

    // Verify the order belongs to the user and contains this product
    const order = await Order.findOne({
      _id: orderId,
      user: userId,
      "items.product": productId,
      status: "DELIVERED",
    });

    if (!order) {
      return res.status(403).json({
        message: "You can only review products you have purchased and received",
      });
    }

    // Upload review images if provided
    let uploadedImages = [];
    if (images.length > 0) {
      for (const base64Img of images) {
        try {
          const upload = await cloudinary.uploader.upload(base64Img, {
            folder: "reviews",
          });
          uploadedImages.push({
            url: upload.secure_url,
            publicId: upload.public_id,
          });
        } catch (uploadErr) {
          console.error("Image upload error:", uploadErr);
        }
      }
    }

    // Create the review
    const review = await Review.create({
      product: productId,
      user: userId,
      order: orderId,
      rating,
      title: title?.trim(),
      comment: comment.trim(),
      images: uploadedImages,
    });

    // Populate user info for response
    await review.populate("user", "name");

    res.status(201).json(review);
  } catch (err) {
    console.error("Create review error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get reviews for a product (public)
 */
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sort = "newest" } = req.query;

    let sortOption = { createdAt: -1 }; // default: newest
    if (sort === "highest") sortOption = { rating: -1, createdAt: -1 };
    if (sort === "lowest") sortOption = { rating: 1, createdAt: -1 };
    if (sort === "helpful") sortOption = { helpfulVotes: -1, createdAt: -1 };

    const reviews = await Review.find({
      product: productId,
      isApproved: true,
    })
      .populate("user", "name")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({
      product: productId,
      isApproved: true,
    });

    // Get rating summary
    const ratingSummary = await Review.aggregate([
      {
        $match: {
          product: new mongoose.Types.ObjectId(productId),
          isApproved: true,
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          distribution: {
            $push: "$rating",
          },
        },
      },
    ]);

    let summary = {
      averageRating: 0,
      totalReviews: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };

    if (ratingSummary.length > 0) {
      summary.averageRating =
        Math.round(ratingSummary[0].averageRating * 10) / 10;
      summary.totalReviews = ratingSummary[0].totalReviews;
      ratingSummary[0].distribution.forEach((r) => {
        summary.distribution[r]++;
      });
    }

    res.json({
      reviews,
      summary,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Get product reviews error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get reviews for a product (protected - requires auth)
 */
export const getProtectedProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sort = "newest" } = req.query;

    let sortOption = { createdAt: -1 }; // default: newest
    if (sort === "highest") sortOption = { rating: -1, createdAt: -1 };
    if (sort === "lowest") sortOption = { rating: 1, createdAt: -1 };
    if (sort === "helpful") sortOption = { helpfulVotes: -1, createdAt: -1 };

    const reviews = await Review.find({
      product: productId,
      isApproved: true,
    })
      .populate("user", "name")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({
      product: productId,
      isApproved: true,
    });

    // Get rating summary
    const ratingSummary = await Review.aggregate([
      {
        $match: {
          product: new mongoose.Types.ObjectId(productId),
          isApproved: true,
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          distribution: {
            $push: "$rating",
          },
        },
      },
    ]);

    let summary = {
      averageRating: 0,
      totalReviews: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };

    if (ratingSummary.length > 0) {
      summary.averageRating =
        Math.round(ratingSummary[0].averageRating * 10) / 10;
      summary.totalReviews = ratingSummary[0].totalReviews;
      ratingSummary[0].distribution.forEach((r) => {
        summary.distribution[r]++;
      });
    }

    res.json({
      reviews,
      summary,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Get product reviews error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update a review
 */
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, title, comment, images = [] } = req.body;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check ownership
    if (review.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this review" });
    }

    // Update fields
    if (rating) {
      if (rating < 1 || rating > 5) {
        return res
          .status(400)
          .json({ message: "Rating must be between 1 and 5" });
      }
      review.rating = rating;
    }
    if (title !== undefined) review.title = title?.trim();
    if (comment) review.comment = comment.trim();

    // Handle new images
    if (images.length > 0) {
      let uploadedImages = [...(review.images || [])];
      for (const base64Img of images) {
        try {
          const upload = await cloudinary.uploader.upload(base64Img, {
            folder: "reviews",
          });
          uploadedImages.push({
            url: upload.secure_url,
            publicId: upload.public_id,
          });
        } catch (uploadErr) {
          console.error("Image upload error:", uploadErr);
        }
      }
      review.images = uploadedImages;
    }

    await review.save();
    await review.populate("user", "name");

    res.json(review);
  } catch (err) {
    console.error("Update review error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete a review
 */
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check ownership or admin
    if (
      review.user.toString() !== userId.toString() &&
      !req.user.roles?.includes("admin")
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this review" });
    }

    await Review.findByIdAndDelete(reviewId);

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("Delete review error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Mark review as helpful
 */
export const markReviewHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { isHelpful } = req.body;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user already voted
    const existingVote = review.votedBy.find(
      (v) => v.user.toString() === userId.toString(),
    );

    if (existingVote) {
      // Update existing vote
      if (existingVote.isHelpful !== isHelpful) {
        review.helpfulVotes += isHelpful ? 2 : -2;
        existingVote.isHelpful = isHelpful;
      }
    } else {
      // Add new vote
      review.votedBy.push({ user: userId, isHelpful });
      if (isHelpful) {
        review.helpfulVotes += 1;
      }
    }

    await review.save();

    res.json({ helpfulVotes: review.helpfulVotes });
  } catch (err) {
    console.error("Mark helpful error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get user's reviews
 */
export const getUserReviews = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ user: userId })
      .populate("product", "name images price")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ user: userId });

    res.json({
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Get user reviews error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

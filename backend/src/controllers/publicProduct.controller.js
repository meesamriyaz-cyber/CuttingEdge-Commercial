import Product from "../models/Product.js";
import Review from "../models/Review.js";
import mongoose from "mongoose";

const getProductImageUrl = (product) => {
  const images = Array.isArray(product?.images)
    ? product.images
    : [product?.images].filter(Boolean);

  for (const image of images) {
    if (typeof image === "string" && image.trim()) {
      return image.trim();
    }

    if (typeof image?.url === "string" && image.url.trim()) {
      return image.url.trim();
    }

    if (typeof image?.secure_url === "string" && image.secure_url.trim()) {
      return image.secure_url.trim();
    }

    if (typeof image?.src === "string" && image.src.trim()) {
      return image.src.trim();
    }
  }

  return "";
};

/**
 * PUBLIC PRODUCT CATALOG
 * - No auth
 * - No price
 * - No segmentation
 * - Only active products
 */
export const getPublicProducts = async (req, res) => {
  try {
    const { category } = req.query;
    let query = { isActive: true };
    if (category) {
      query.category = category;
    }
    const products = await Product.find(query)
      .select("name description sku images createdAt category rating")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    console.error("Public products error", err);
    res.status(500).json({ message: "Could not fetch products" });
  }
};

export const getPublicProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true,
    }).select("name description sku images category rating");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error("Public product error", err);
    res.status(500).json({ message: "Could not fetch product" });
  }
};

/**
 * Get all product categories with product counts
 */
export const getPublicCategories = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .select("category images rating createdAt")
      .sort({ createdAt: -1 })
      .lean();

    const categoryMap = new Map();

    products.forEach((product) => {
      const name =
        typeof product.category === "string"
          ? product.category.trim().replace(/\s+/g, " ")
          : "";
      if (!name) return;

      const current = categoryMap.get(name) || {
        name,
        count: 0,
        image: "",
        ratingTotal: 0,
      };

      current.count += 1;
      current.ratingTotal += Number(product.rating?.average || 0);
      current.image = current.image || getProductImageUrl(product);
      categoryMap.set(name, current);
    });

    const categories = Array.from(categoryMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    res.json(
      categories.map(({ name, count, ratingTotal, image }) => ({
        name,
        count,
        image,
        averageRating: count ? Math.round((ratingTotal / count) * 10) / 10 : 0,
      })),
    );
  } catch (err) {
    console.error("Public categories error", err);
    res.status(500).json({ message: "Could not fetch categories" });
  }
};

export const getPublicProductReviews = async (req, res) => {
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
    console.error("Public product reviews error", err);
    res.status(500).json({ message: "Could not fetch reviews" });
  }
};

export const getPublicReviewSummary = async (req, res) => {
  try {
    const { productId } = req.params;

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

    res.json(summary);
  } catch (err) {
    console.error("Public review summary error", err);
    res.status(500).json({ message: "Could not fetch review summary" });
  }
};

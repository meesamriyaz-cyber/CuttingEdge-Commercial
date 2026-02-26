import Product from "../models/Product.js";
import cloudinary from "../utils/cloudinary.js";

/**
 * ROLE BASED SEGMENT FILTER
 *
 * PRIVATE  -> sees only CONSUMER products
 * PUBLIC   -> sees only COMMERCIAL products
 */
const getSegmentForUser = (user) => {
  if (!user) return null;

  return user.clientType === "PRIVATE" ? "CONSUMER" : "COMMERCIAL";
};

/* -------------------------------------------
   GET CATEGORIES (filtered by user segment)
-------------------------------------------- */
export const getCategories = async (req, res) => {
  try {
    const user = req.user;
    let query = { isActive: true };

    // Admin sees all categories
    if (!user?.roles?.includes("admin")) {
      // Apply segment filter for non-admin users
      const segment = getSegmentForUser(user);
      if (segment) {
        query.segment = segment;
      }
    }

    // Get distinct categories with product count
    const categories = await Product.aggregate([
      { $match: query },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $project: { name: "$_id", count: 1, _id: 0 } },
      { $sort: { name: 1 } },
    ]);

    res.json(categories);
  } catch (err) {
    console.error("Get categories error", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------------------------------
   LIST PRODUCTS (auto-filtered by client)
-------------------------------------------- */
export const getProducts = async (req, res) => {
  try {
    const user = req.user;
    const { category } = req.query;
    let query = { isActive: true };

    // 🟢 Apply category filter if provided
    if (category) {
      query.category = category;
    }

    // ✅ Admin sees full catalog
    if (user?.roles?.includes("admin")) {
      const products = await Product.find(query).sort({ createdAt: -1 });
      return res.json(products);
    }

    // 🟢 Private Customers → Consumer Products
    if (user.clientType === "PRIVATE") {
      query.segment = "CONSUMER";
    }

    // 🟣 Govt Clients → Commercial Products
    if (user.clientType === "PUBLIC") {
      query.segment = "COMMERCIAL";
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    console.error("Get products error", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------------------------------
   GET PRODUCT BY ID (access restricted)
-------------------------------------------- */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || !product.isActive)
      return res.status(404).json({ message: "Product not found" });

    // ✅ Admin has full access
    if (req.user?.roles?.includes("admin")) {
      return res.json(product);
    }

    // 🔹 Determine allowed segment for normal users
    const allowedSegment = getSegmentForUser(req.user);

    // 🚫 Block cross-segment access
    if (product.segment !== allowedSegment) {
      return res.status(403).json({
        message: "You are not allowed to view this product",
      });
    }

    return res.json(product);
  } catch (err) {
    console.error("Get product error", err);
    return res.status(500).json({ message: "Could not fetch product" });
  }
};

/* -------------------------------------------
   ADMIN — CREATE PRODUCT
-------------------------------------------- */

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      sku,
      segment,
      images = [],
    } = req.body;

    let uploadedImages = [];

    // Only upload if images were sent base64
    if (images.length > 0) {
      for (const base64Img of images) {
        const upload = await cloudinary.uploader.upload(base64Img, {
          folder: "products",
        });

        uploadedImages.push({
          url: upload.secure_url,
          publicId: upload.public_id,
        });
      }
    }

    const product = await Product.create({
      name,
      description,
      price,
      sku,
      category,
      segment,
      images: uploadedImages,
    });

    res.json(product);
  } catch (err) {
    console.error("Create product error", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------------------------------
   ADMIN — UPDATE PRODUCT
-------------------------------------------- */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    const { images = [], existingImages = [], ...updates } = req.body;

    let uploadedImages = [];

    // Handle existing images (from edit mode)
    if (existingImages && existingImages.length > 0) {
      uploadedImages = [...existingImages];
    }

    // Upload new images if provided
    if (images && images.length > 0) {
      for (const base64Img of images) {
        const upload = await cloudinary.uploader.upload(base64Img, {
          folder: "products",
        });

        uploadedImages.push({
          url: upload.secure_url,
          publicId: upload.public_id,
        });
      }
    }

    product.set({ ...updates, images: uploadedImages });

    await product.save();

    res.json(product);
  } catch (err) {
    console.error("Update product error", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------------------------------
   ADMIN — SOFT DELETE PRODUCT
-------------------------------------------- */
export const deactivateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    );

    if (!product) return res.status(404).json({ message: "Product not found" });

    return res.json({ message: "Product deactivated" });
  } catch (err) {
    console.error("Deactivate product error", err);
    return res.status(500).json({ message: "Could not deactivate product" });
  }
};

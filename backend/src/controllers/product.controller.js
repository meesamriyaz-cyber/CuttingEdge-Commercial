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

const normalizeText = (value) =>
  typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";

const normalizeStock = (value) => {
  const stock = Number(value);
  return Number.isFinite(stock) && stock >= 0 ? Math.floor(stock) : 0;
};

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

    const products = await Product.find(query)
      .select("category images createdAt")
      .sort({ createdAt: -1 })
      .lean();

    const categoryMap = new Map();

    products.forEach((product) => {
      const name = normalizeText(product.category);
      if (!name) return;

      const current = categoryMap.get(name) || {
        name,
        count: 0,
        image: "",
      };

      current.count += 1;
      current.image = current.image || getProductImageUrl(product);
      categoryMap.set(name, current);
    });

    const categories = Array.from(categoryMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );

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
    const categoryFilter = normalizeText(category);
    if (categoryFilter) {
      query.category = categoryFilter;
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
      stock = 0,
      category,
      sku,
      segment,
      images = [],
    } = req.body;

    const normalizedCategory = normalizeText(category);

    if (!normalizedCategory) {
      return res.status(400).json({ message: "Category is required" });
    }

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
      stock: normalizeStock(stock),
      sku,
      category: normalizedCategory,
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

    const hasImagePayload =
      Object.prototype.hasOwnProperty.call(req.body, "images") ||
      Object.prototype.hasOwnProperty.call(req.body, "existingImages");
    const { images, existingImages, ...updates } = req.body;

    if (Object.prototype.hasOwnProperty.call(updates, "stock")) {
      updates.stock = normalizeStock(updates.stock);
    }

    if (Object.prototype.hasOwnProperty.call(updates, "category")) {
      const normalizedCategory = normalizeText(updates.category);

      if (!normalizedCategory) {
        return res.status(400).json({ message: "Category is required" });
      }

      updates.category = normalizedCategory;
    }

    let nextImages = product.images || [];

    if (hasImagePayload) {
      nextImages = [];

      // Handle existing images (from edit mode)
      if (Array.isArray(existingImages) && existingImages.length > 0) {
        nextImages = [...existingImages];
      }

      // Upload new images if provided
      if (Array.isArray(images) && images.length > 0) {
        for (const base64Img of images) {
          const upload = await cloudinary.uploader.upload(base64Img, {
            folder: "products",
          });

          nextImages.push({
            url: upload.secure_url,
            publicId: upload.public_id,
          });
        }
      }
    }

    product.set(
      hasImagePayload ? { ...updates, images: nextImages } : updates,
    );

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

import User from "../models/User.js";

// Get user's wishlist
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate(
      "wishlist.product",
      "name price images category description",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ wishlist: user.wishlist });
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({ message: "Failed to get wishlist" });
  }
};

// Add product to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if product is already in wishlist
    const isAlreadyInWishlist = user.wishlist.some(
      (item) => item.product.toString() === productId,
    );

    if (isAlreadyInWishlist) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    // Add product to wishlist
    user.wishlist.push({ product: productId, addedAt: new Date() });
    await user.save();

    // Populate the product details before sending response
    await user.populate(
      "wishlist.product",
      "name price images category description",
    );

    res.json({
      message: "Product added to wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Add to wishlist error:", error);
    res.status(500).json({ message: "Failed to add to wishlist" });
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove product from wishlist
    user.wishlist = user.wishlist.filter(
      (item) => item.product.toString() !== productId,
    );
    await user.save();

    res.json({
      message: "Product removed from wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    res.status(500).json({ message: "Failed to remove from wishlist" });
  }
};

// Check if product is in wishlist
export const checkWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isInWishlist = user.wishlist.some(
      (item) => item.product.toString() === productId,
    );

    res.json({ inWishlist: isInWishlist });
  } catch (error) {
    console.error("Check wishlist error:", error);
    res.status(500).json({ message: "Failed to check wishlist" });
  }
};

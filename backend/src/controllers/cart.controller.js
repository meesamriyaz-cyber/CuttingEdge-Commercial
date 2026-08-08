import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const getMyCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product", "name price sku stock images");

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json({ cart });

  } catch (err) {
    console.error("Get cart error", err);
    res.status(500).json({ message: "Server error" });
  }
};



export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const quantityDelta = Number(quantity);

    if (!productId) {
      return res.status(400).json({ message: "Product is required" });
    }

    if (!Number.isInteger(quantityDelta) || quantityDelta === 0) {
      return res.status(400).json({ message: "Quantity change must be a non-zero whole number" });
    }

    // Fetch product
    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 🔒 ENFORCE BUSINESS RULE
    // Private customers can buy ONLY CONSUMER products
    if (product.segment !== "CONSUMER") {
      return res.status(403).json({
        message: "This product is only available for government procurement (commercial product)"
      });
    }

    // (Safety check) ensure only private users reach here
    if (req.user.clientType !== "PRIVATE") {
      return res.status(403).json({
        message: "Only private customers can add items to cart"
      });
    }

    // ---------------- CART LOGIC ----------------

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: []
      });
    }

    const existingItem = cart.items.find(
      item => item.product.toString() === productId
    );

    if (!existingItem && quantityDelta < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const nextQuantity = (existingItem?.quantity || 0) + quantityDelta;

    if (nextQuantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const availableStock = Number(product.stock || 0);

    if (nextQuantity > availableStock) {
      return res.status(400).json({
        message:
          availableStock > 0
            ? `Only ${availableStock} left in stock for ${product.name}`
            : `${product.name} is out of stock`,
      });
    }

    if (existingItem) {
      existingItem.quantity = nextQuantity;
    } else {
      cart.items.push({ product: productId, quantity: quantityDelta });
    }

    await cart.save();

    const populatedCart = await Cart.findOne({ user: req.user._id })
  .populate("items.product", "name price sku stock images");

return res.json({
  message: "Item added to cart",
  cart: populatedCart
});

  } catch (err) {
    console.error("Add to cart error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID required" });
    }

    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { items: { product: productId } } },
      { new: true }
    );

    const populatedCart = await Cart.findOne({ user: req.user._id })
      .populate("items.product", "name price sku stock images");

    return res.json({
      message: "Item removed",
      cart: populatedCart
    });

  } catch (err) {
    console.error("Remove cart item error", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] }
    );

    return res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not clear cart" });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body; 
    const requestedQuantity = Number(quantity);
    if (!productId || quantity == null) {
      return res.status(400).json({ message: "Product ID and quantity are required" });
    }
    if (!Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }     
    const item = cart.items.find(item => item.product.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Product not found" });
    }

    const availableStock = Number(product.stock || 0);

    if (requestedQuantity > availableStock) {
      return res.status(400).json({
        message:
          availableStock > 0
            ? `Only ${availableStock} left in stock for ${product.name}`
            : `${product.name} is out of stock`,
      });
    }

    item.quantity = requestedQuantity;
    await cart.save();
    const populatedCart = await Cart.findOne({ user: req.user._id })
   .populate("items.product", "name price sku stock images");

    return res.json({ message: "Cart updated", cart: populatedCart });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not update cart" });
  }
};

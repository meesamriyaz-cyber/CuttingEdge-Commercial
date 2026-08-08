import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { sendOrderConfirmationEmail } from "../utils/orderEmail.js";
import mongoose from "mongoose";

// ---------- CREATE ORDER FROM CART ----------
// ---------- CREATE ORDER FROM CART ----------
export const placeOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { shippingAddress } = req.body;

    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product")
      .session(session);

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    const GST_RATE = 18;

    // Build order items (GST-inclusive snapshot)
    const orderItems = cart.items.map((item) => {
      const availableStock = Number(item.product.stock || 0);
      if (item.quantity > availableStock) {
        throw {
          status: 400,
          message:
            availableStock > 0
              ? `Only ${availableStock} left in stock for ${item.product.name}`
              : `${item.product.name} is out of stock`,
        };
      }

      return {
        product: item.product._id,
        quantity: item.quantity,
        priceAtOrder: item.product.price, // inclusive price
      };
    });

    // Total (inclusive of GST)
    const inclusiveTotal = orderItems.reduce(
      (sum, item) => sum + item.priceAtOrder * item.quantity,
      0,
    );

    // 🔑 Reverse GST calculation
    const taxableAmount = (inclusiveTotal * 100) / (100 + GST_RATE);
    const totalTax = inclusiveTotal - taxableAmount;
    const cgst = totalTax / 2;
    const sgst = totalTax / 2;

    const pricing = {
      baseAmount: taxableAmount,
      discountAmount: 0,
      taxableAmount,
      cgst,
      sgst,
      totalTax,
      grandTotal: inclusiveTotal,
    };

    const [order] = await Order.create(
      [
        {
          user: req.user._id,
          items: orderItems,
          totalAmount: inclusiveTotal,
          pricing, // ✅ backend-authoritative
          shippingAddress,
        },
      ],
      { session },
    );

    // decrement stock atomically so concurrent orders cannot oversell
    for (const item of cart.items) {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: item.product._id, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { session, new: true },
      );

      if (!updatedProduct) {
        throw {
          status: 400,
          message: `Not enough stock for ${item.product.name}`,
        };
      }
    }

    // clear cart
    cart.items = [];
    await cart.save({ session });

    await session.commitTransaction();
    session.endSession();

    const emailOrder = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("items.product", "name price sku");

    // send mail after the transaction so email failures do not block checkout
    try {
      await sendOrderConfirmationEmail({ order: emailOrder, user: req.user });
    } catch (mailErr) {
      console.error("Order confirmation email failed:", mailErr.message);
    }

    return res.status(201).json({
      message: "Order placed successfully",
      orderId: order._id,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    if (err.status) {
      return res.status(err.status).json({ message: err.message });
    }

    console.error(err);
    return res.status(500).json({ message: "Could not place order" });
  }
};

// ---------- VIEW ORDER HISTORY ----------
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("user", "name email clientType")
      .populate("items.product", "name price images")
      .sort({ createdAt: -1 });

    return res.json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not fetch orders" });
  }
};

// ---------- VIEW ORDER DETAILS ----------
// in order.controller.js (replace existing getOrderById)
export const getOrderById = async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: id };

    // allow admins to fetch any order; normal users only their own
    // Check if user has admin role in the roles array
    const isAdmin = req.user?.roles?.includes("admin");
    if (!req.user || !isAdmin) {
      query.user = req.user._id;
    }

    const order = await Order.findOne(query)
      .populate("user", "name email clientType")
      .populate("items.product", "name price images");

    if (!order) return res.status(404).json({ message: "Order not found" });

    return res.json(order);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not fetch order" });
  }
};

// ---------- ADMIN: VIEW ALL ORDERS ----------
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email clientType")
      .populate("items.product", "name price images")
      .sort({ createdAt: -1 });

    return res.json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not fetch orders" });
  }
};

// ---------- ADMIN: UPDATE ORDER STATUS ----------
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      {
        status,
        updatedAt: new Date(),
      },
      { new: true },
    )
      .populate("user", "name email clientType")
      .populate("items.product", "name price images");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json({
      message: "Order status updated successfully",
      order,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not update order status" });
  }
};

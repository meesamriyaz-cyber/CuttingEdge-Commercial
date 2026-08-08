import { instance, getRazorpayKey, keySecret } from "../utils/razorpay.js";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";
import crypto from "crypto";
import { sendOrderConfirmationEmail } from "../utils/orderEmail.js";
export const createRazorpayOrderFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    for (const item of cart.items) {
      const availableStock = Number(item.product.stock || 0);
      if (item.quantity > availableStock) {
        return res.status(400).json({
          message:
            availableStock > 0
              ? `Only ${availableStock} left in stock for ${item.product.name}`
              : `${item.product.name} is out of stock`,
        });
      }
    }

    const GST_RATE = 18;

    // Snapshot items
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      priceAtOrder: item.product.price,
    }));

    // Total (GST-inclusive)
    const inclusiveTotal = orderItems.reduce(
      (sum, item) => sum + item.priceAtOrder * item.quantity,
      0,
    );

    // GST breakdown (same logic as order.controller.js)
    const taxableAmount = (inclusiveTotal * 100) / (100 + GST_RATE);
    const totalTax = inclusiveTotal - taxableAmount;

    const pricing = {
      baseAmount: taxableAmount,
      discountAmount: 0,
      taxableAmount,
      cgst: totalTax / 2,
      sgst: totalTax / 2,
      totalTax,
      grandTotal: inclusiveTotal,
    };

    // 🔑 Create Razorpay order
    const razorpayOrder = await instance.orders.create({
      amount: Math.round(inclusiveTotal * 100), // paise
      currency: "INR",
      receipt: `order_${Date.now()}`,
      payment_capture: 1,
    });

    // 🧾 Create DB order (PENDING payment)
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount: inclusiveTotal,
      pricing,
      status: "PLACED",
      paymentStatus: "PENDING",
      razorpayOrderId: razorpayOrder.id,
    });

    return res.json({
      key: getRazorpayKey(),
      razorpayOrderId: razorpayOrder.id,
      orderId: order._id,
      amount: razorpayOrder.amount,
    });
  } catch (err) {
    console.error("Create Razorpay order error:", err);
    return res.status(500).json({ message: "Could not create payment order" });
  }
};
export const verifyRazorpayPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, shippingAddress } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw { status: 400, message: "Invalid payment payload" };
    }

    // 🔐 Verify Razorpay signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      throw { status: 400, message: "Payment verification failed" };
    }

    // 🔍 Fetch existing PENDING order
    const order = await Order.findOne({
      razorpayOrderId: razorpay_order_id,
    }).session(session);

    if (!order) {
      throw { status: 404, message: "Order not found" };
    }

    if (order.paymentStatus === "PAID") {
      // Idempotency guard
      await session.abortTransaction();
      session.endSession();
      return res.json({ success: true, orderId: order._id });
    }

    // ✅ Mark payment successful
    order.paymentStatus = "PAID";
    order.status = "PROCESSING";
    order.razorpayPaymentId = razorpay_payment_id;
    if (shippingAddress) {
      order.shippingAddress = shippingAddress;
    }
    await order.save({ session });

    // 🔻 Reduce stock atomically so concurrent paid orders cannot oversell
    for (const item of order.items) {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { session, new: true },
      );

      if (!updatedProduct) {
        throw {
          status: 409,
          message: "Stock changed before payment could be finalized. Please contact support.",
        };
      }
    }

    // 🧹 Clear cart
    await Cart.findOneAndUpdate(
      { user: order.user },
      { items: [] },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    const emailOrder = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("items.product", "name price sku");

    try {
      await sendOrderConfirmationEmail({ order: emailOrder, user: emailOrder?.user });
    } catch (mailErr) {
      console.error("Order confirmation email failed:", mailErr.message);
    }

    return res.json({
      success: true,
      message: "Payment verified and order finalized",
      orderId: order._id,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("verifyRazorpayPayment error:", err);
    return res.status(err.status || 500).json({
      message: err.message || "Payment verification failed",
    });
  }
};
export const getKey = async (req, res) => {
  try {
    res.status(200).json({ key: getRazorpayKey() });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch Razorpay key" });
  }
};

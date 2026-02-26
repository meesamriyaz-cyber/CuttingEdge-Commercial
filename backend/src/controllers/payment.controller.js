import { instance, getRazorpayKey } from "../utils/razorpay.js";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";
import crypto from "crypto";
export const createRazorpayOrderFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
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
      return res.status(400).json({ message: "Invalid payment payload" });
    }

    // 🔐 Verify Razorpay signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const keySecret =
      process.env.NODE_ENV === "production"
        ? process.env.RAZORPAY_KEY_SECRET_LIVE
        : process.env.RAZORPAY_KEY_SECRET_TEST;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // 🔍 Fetch existing PENDING order
    const order = await Order.findOne({
      razorpayOrderId: razorpay_order_id,
    }).session(session);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.paymentStatus === "PAID") {
      // Idempotency guard
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

    // 🔻 Reduce stock (reuse existing pattern)
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } },
        { session },
      );
    }

    // 🧹 Clear cart
    await Cart.findOneAndUpdate(
      { user: order.user },
      { items: [] },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return res.json({
      success: true,
      message: "Payment verified and order finalized",
      orderId: order._id,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("verifyRazorpayPayment error:", err);
    return res.status(500).json({ message: "Payment verification failed" });
  }
};
export const getKey = async (req, res) => {
  try {
    res.status(200).json({ key: getRazorpayKey() });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch Razorpay key" });
  }
};

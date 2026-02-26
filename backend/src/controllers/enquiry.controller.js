import Enquiry from "../models/Enquiry.js";
import { sendMail } from "../utils/email.js";
import mongoose from "mongoose";

export const submitEnquiry = async (req, res) => {
  try {
    const { productId, quantity, requirements } = req.body;

    const enquiry = await Enquiry.create({
      user: req.user._id,
      product: productId,
      quantity: quantity || 1,
      requirements,
    });
    await sendMail({
      to: req.user.email,
      subject: "Your enquiry has been received",
      text: `Thank you. Your enquiry ID is ${enquiry._id}. Our team will respond soon.`,
    });

    res.status(201).json({
      message: "Enquiry submitted successfully",
      enquiry,
    });
  } catch (err) {
    console.error("Submit enquiry error", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyEnquiries = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      startDate,
      endDate,
    } = req.query;

    // Build filter object
    const filter = { user: req.user._id };

    // Add search filter
    if (search) {
      filter.$or = [
        { "product.name": { $regex: search, $options: "i" } },
        { "product.sku": { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } },
      ];
    }

    // Add status filter
    if (status && status !== "ALL") {
      filter.status = status;
    }

    // Add date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Get total count for pagination
    const total = await Enquiry.countDocuments(filter);

    // Get enquiries with pagination
    const enquiries = await Enquiry.find(filter)
      .populate("product", "name sku price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      enquiries,
      total,
      page: parseInt(page),
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    console.error("Get enquiries error", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getEnquiryById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid enquiry id" });
    }

    const enquiry = await Enquiry.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("product", "name price description");

    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });

    return res.json(enquiry);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not fetch enquiry" });
  }
};

export const getEnquiryByIdAdmin = async (req, res) => {
  try {
    console.log("getEnquiryByIdAdmin called with ID:", req.params.id);

    // Validate ID format before querying
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log("Invalid ObjectId format:", req.params.id);
      return res.status(400).json({ message: "Invalid enquiry id format" });
    }

    const enquiry = await Enquiry.findById(req.params.id)
      .populate("product", "name price description")
      .populate(
        "user",
        "name email officialEmail organizationName departmentName clientType",
      );

    if (!enquiry) {
      console.log("Enquiry not found in database for ID:", req.params.id);
      return res.status(404).json({ message: "Enquiry not found" });
    }

    console.log("Enquiry found:", enquiry._id.toString());
    console.log("Enquiry data:", JSON.stringify(enquiry, null, 2));
    return res.json(enquiry);
  } catch (err) {
    console.error("getEnquiryByIdAdmin error:", err);
    return res
      .status(500)
      .json({ message: "Could not fetch enquiry", error: err.message });
  }
};

export const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .populate("product", "name sku price")
      .populate(
        "user",
        "name email officialEmail organizationName departmentName clientType",
      );

    res.json({
      enquiries,
    });
  } catch (err) {
    console.error("Get enquiries error", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminRemark } = req.body;

    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      {
        status,
        adminRemark,
        updatedAt: new Date(),
      },
      { new: true },
    )
      .populate("product", "name price")
      .populate("user", "name email");

    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    res.json({
      message: "Enquiry status updated successfully",
      enquiry,
    });
  } catch (err) {
    console.error("Update enquiry status error", err);
    res.status(500).json({ message: "Server error" });
  }
};

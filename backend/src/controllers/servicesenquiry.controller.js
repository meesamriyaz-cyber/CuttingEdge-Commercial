import Service from "../models/Service.js";
import ServiceEnquiry from "../models/ServiceEnquiry.js";
import ServiceQuote from "../models/ServiceQuote.js";
import { sendMail } from "../utils/email.js";
import { buildServiceQuotePDFBuffer } from "../utils/serviceQuotePdf.js";

export const submitServiceEnquiry = async (req, res) => {
  try {
    const { serviceId, requirementDetails } = req.body;

    if (!serviceId || !requirementDetails) {
      return res.status(400).json({
        message: "Service and requirement details are required",
      });
    }

    const service = await Service.findOne({
      _id: serviceId,
      isActive: true,
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found or inactive" });
    }

    const enquiry = await ServiceEnquiry.create({
      user: req.user._id,
      service: service._id,
      serviceNameSnapshot: service.name,
      requirementDetails,
    });

    return res.status(201).json({
      message: "Service enquiry submitted successfully",
      enquiryId: enquiry._id,
    });
  } catch (err) {
    console.error("Service enquiry error:", err);
    return res.status(500).json({ message: "Could not submit enquiry" });
  }
};

export const getMyServiceEnquiries = async (req, res) => {
  try {
    const enquiries = await ServiceEnquiry.find({
      user: req.user._id,
    })
      .populate("service", "name slug")
      .sort({ createdAt: -1 });

    return res.json(enquiries);
  } catch (err) {
    console.error("Fetch enquiries error:", err);
    return res.status(500).json({ message: "Could not fetch enquiries" });
  }
};

// ==================== ADMIN FUNCTIONS ====================

export const getAllServiceEnquiriesAdmin = async (req, res) => {
  try {
    const enquiries = await ServiceEnquiry.find()
      .populate("service", "name slug category")
      .populate("user", "name email officialEmail organizationName")
      .sort({ createdAt: -1 });

    return res.json({ enquiries });
  } catch (err) {
    console.error("Admin fetch enquiries error:", err);
    return res.status(500).json({ message: "Could not fetch enquiries" });
  }
};

export const getServiceEnquiryByIdAdmin = async (req, res) => {
  try {
    const enquiry = await ServiceEnquiry.findById(req.params.id)
      .populate("service", "name slug category description")
      .populate("user", "name email officialEmail organizationName phone");

    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    return res.json(enquiry);
  } catch (err) {
    console.error("Admin fetch enquiry error:", err);
    return res.status(500).json({ message: "Could not fetch enquiry" });
  }
};

export const updateServiceEnquiryStatus = async (req, res) => {
  try {
    const { status, adminRemark } = req.body;

    const enquiry = await ServiceEnquiry.findByIdAndUpdate(
      req.params.id,
      { status, adminRemark },
      { new: true },
    );

    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    return res.json({
      message: "Enquiry updated successfully",
      enquiry,
    });
  } catch (err) {
    console.error("Update enquiry error:", err);
    return res.status(500).json({ message: "Could not update enquiry" });
  }
};

export const createServiceQuoteAdmin = async (req, res) => {
  try {
    const { enquiryId } = req.params;
    const { estimatedAmount, validityDate, notes } = req.body;

    const enquiry = await ServiceEnquiry.findById(enquiryId)
      .populate("user", "name email officialEmail")
      .populate("service", "name category");

    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    // Check if quote already exists
    const existingQuote = await ServiceQuote.findOne({ enquiry: enquiryId });
    if (existingQuote) {
      return res.status(400).json({
        message: "Quote already exists for this enquiry",
        quoteId: existingQuote._id,
      });
    }

    // Create the quote
    const quote = await ServiceQuote.create({
      enquiry: enquiryId,
      user: enquiry.user._id,
      estimatedAmount,
      validityDate,
      notes,
      status: "SENT",
    });

    // Update enquiry status
    enquiry.status = "QUOTED";
    await enquiry.save();

    // Generate PDF buffer
    const pdfBuffer = await buildServiceQuotePDFBuffer({
      ...quote.toObject(),
      enquiry,
      user: enquiry.user,
    });

    // Send email to customer with PDF attachment
    try {
      await sendMail({
        to: enquiry.user.officialEmail || enquiry.user.email,
        subject: "Service Quotation for Your Enquiry",
        text: `Dear ${enquiry.user.name},

Please find attached the service quotation for your enquiry.

Quote ID: ${quote._id}
Service: ${enquiry.serviceNameSnapshot}
Amount: ₹${estimatedAmount}
Valid Until: ${new Date(validityDate).toLocaleDateString()}

Please log in to your account to view and accept/reject the quote.

Regards,
Admin Team`,
        attachments: [
          {
            filename: `ServiceQuote-${quote._id.toString().slice(-6)}.pdf`,
            content: pdfBuffer,
          },
        ],
      });
    } catch (emailErr) {
      console.error("Email failed:", emailErr);
    }

    return res.status(201).json({
      message: "Quote created successfully",
      quote,
    });
  } catch (err) {
    console.error("Create quote error:", err);
    return res.status(500).json({ message: "Could not create quote" });
  }
};

export const getAllServiceQuotesAdmin = async (req, res) => {
  try {
    const quotes = await ServiceQuote.find()
      .populate({
        path: "enquiry",
        populate: { path: "service", select: "name category" },
      })
      .populate("user", "name email officialEmail organizationName")
      .sort({ createdAt: -1 });

    return res.json({ quotes });
  } catch (err) {
    console.error("Admin fetch quotes error:", err);
    return res.status(500).json({ message: "Could not fetch quotes" });
  }
};

export const getServiceQuoteByIdAdmin = async (req, res) => {
  try {
    const quote = await ServiceQuote.findById(req.params.id)
      .populate({
        path: "enquiry",
        populate: { path: "service", select: "name category description" },
      })
      .populate("user", "name email officialEmail organizationName phone");

    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    return res.json(quote);
  } catch (err) {
    console.error("Admin fetch quote error:", err);
    return res.status(500).json({ message: "Could not fetch quote" });
  }
};

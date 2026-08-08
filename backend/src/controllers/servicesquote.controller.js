import ServiceEnquiry from "../models/ServiceEnquiry.js";
import ServiceQuote from "../models/ServiceQuote.js";
import { buildServiceQuotePDFBuffer } from "../utils/serviceQuotePdf.js";
import { sendMail } from "../utils/email.js";

export const createServiceQuote = async (req, res) => {
  try {
    const { enquiryId, estimatedAmount, validityDate, notes } = req.body;

    const enquiry = await ServiceEnquiry.findById(enquiryId)
      .populate("user", "name email officialEmail")
      .populate("service", "name category");

    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });

    // Prevent duplicates
    const existingQuote = await ServiceQuote.findOne({ enquiry: enquiryId });
    if (existingQuote) {
      return res.status(400).json({
        message: "Service quote already exists for this enquiry",
        quoteId: existingQuote._id,
      });
    }

    const quote = await ServiceQuote.create({
      enquiry: enquiryId,
      user: enquiry.user._id,
      estimatedAmount,
      validityDate,
      notes,
      status: "SENT",
    });

    // Generate PDF buffer
    const pdfBuffer = await buildServiceQuotePDFBuffer({
      ...quote.toObject(),
      enquiry,
      user: enquiry.user,
    });

    // Attach PDF for audit
    if (!quote.attachments) {
      quote.attachments = [];
    }
    quote.attachments.push({
      name: `ServiceQuote-${quote._id}.pdf`,
      url: `/services/quote/${quote._id}/pdf`,
    });
    await quote.save();

    // Update enquiry status
    enquiry.status = "QUOTED";
    await enquiry.save();

    // Email client
    await sendMail({
      to: enquiry.user.officialEmail || enquiry.user.email,
      subject: "Service Quotation for Your Enquiry",
      text: `Dear ${enquiry.user.name},

Please find attached the service quotation for your enquiry.

Quote ID: ${quote._id}
Validity: ${new Date(validityDate).toLocaleDateString()}

Regards,
Admin Team`,
      attachments: [
        {
          filename: `ServiceQuote-${quote._id}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    return res.status(201).json({
      message: "Service quote created and emailed successfully",
      quoteId: quote._id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not create quote" });
  }
};

export const getMyServiceQuotes = async (req, res) => {
  try {
    const quotes = await ServiceQuote.find({ user: req.user._id }).populate({
      path: "enquiry",
      populate: { path: "service", select: "name category" },
    });

    return res.json(quotes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not fetch quotes" });
  }
};

export const getServiceQuoteById = async (req, res) => {
  try {
    const quote = await ServiceQuote.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate({
      path: "enquiry",
      populate: { path: "service", select: "name category" },
    });

    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    return res.json(quote);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not fetch quote" });
  }
};

export const getServiceQuoteByEnquiryId = async (req, res) => {
  try {
    const quote = await ServiceQuote.findOne({
      enquiry: req.params.enquiryId,
      user: req.user._id,
    }).populate({
      path: "enquiry",
      populate: { path: "service", select: "name category" },
    });

    if (!quote) {
      return res
        .status(404)
        .json({ message: "Quote not found for this enquiry" });
    }

    return res.json(quote);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not fetch quote" });
  }
};

export const makeDecisionOnServiceQuote = async (req, res) => {
  try {
    const { decision } = req.body;

    if (!["APPROVED", "REJECTED"].includes(decision)) {
      return res
        .status(400)
        .json({ message: "Invalid decision. Must be APPROVED or REJECTED" });
    }

    const quote = await ServiceQuote.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    if (quote.status !== "SENT") {
      return res
        .status(400)
        .json({ message: "Quote has already been processed" });
    }

    if (new Date(quote.validityDate) < new Date()) {
      return res.status(400).json({ message: "Quote has expired" });
    }

    quote.status = decision;
    await quote.save();

    // Update enquiry status based on decision
    const enquiry = await ServiceEnquiry.findById(quote.enquiry);
    if (enquiry) {
      enquiry.status = decision === "APPROVED" ? "COMPLETED" : "CLOSED";
      await enquiry.save();
    }

    // Send email notification
    try {
      const user = req.user;
      const subject =
        decision === "APPROVED"
          ? "Service Quotation Accepted"
          : "Service Quotation Rejected";

      await sendMail({
        to: user.officialEmail || user.email,
        subject,
        text: `Dear ${user.name},

Your service quotation has been ${decision.toLowerCase()}.

Quote ID: ${quote._id}
Service: ${enquiry?.serviceNameSnapshot || "N/A"}
Amount: ₹${quote.estimatedAmount}

${
  decision === "APPROVED"
    ? "Our team will contact you shortly to proceed with the service."
    : "If you have any questions, please contact our support team."
}

Regards,
Admin Team`,
      });
    } catch (emailErr) {
      console.error("Email notification failed:", emailErr);
    }

    return res.json({
      message: `Quote ${decision.toLowerCase()} successfully`,
      quote,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not process decision" });
  }
};

export const downloadServiceQuotePDF = async (req, res) => {
  try {
    const quote = await ServiceQuote.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate({
      path: "enquiry",
      populate: { path: "service", select: "name category" },
    });

    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    const pdfBuffer = await buildServiceQuotePDFBuffer({
      ...quote.toObject(),
      enquiry: quote.enquiry,
      user: req.user,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="ServiceQuote-${quote._id.toString().slice(-6)}.pdf"`,
    );
    return res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not generate PDF" });
  }
};

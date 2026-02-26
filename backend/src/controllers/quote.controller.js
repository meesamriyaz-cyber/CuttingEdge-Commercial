import Quote from "../models/Quote.js";
import Enquiry from "../models/Enquiry.js";
import PDFDocument from "pdfkit";
import { buildQuotePDFBuffer } from "../utils/quotePdf.js";
import { sendMail } from "../utils/email.js";
import { generateQuotePdfFromHtml } from "../utils/generateQuotePdf.js";
import puppeteer from "puppeteer";
/* =========================================================
   ADMIN: CREATE QUOTE FROM ENQUIRY
   ========================================================= */
export const createQuoteFromEnquiry = async (req, res) => {
  try {
    const { enquiryId } = req.params;
    const { price, validityDate, notes } = req.body;

    const enquiry = await Enquiry.findById(enquiryId)
      .populate("user", "name email officialEmail")
      .populate("product", "name sku");

    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    // Prevent duplicates
    const existingQuote = await Quote.findOne({ enquiry: enquiryId });
    if (existingQuote) {
      return res.status(400).json({
        message: "Quote already exists for this enquiry",
        quoteId: existingQuote._id,
      });
    }

    // 1️⃣ Create quote
    const quote = await Quote.create({
      enquiry: enquiry._id,
      user: enquiry.user._id,
      price,
      validityDate,
      notes,
      status: "SENT",
    });

    // 2️⃣ Generate PDF buffer - ensure proper data structure
    const quoteData = quote.toObject();
    const pdfBuffer = await buildQuotePDFBuffer({
      ...quoteData,
      enquiry: {
        ...enquiry.toObject(),
        product: enquiry.product,
      },
      user: enquiry.user,
    });
    console.log(
      "Quote PDF generated, buffer size:",
      pdfBuffer?.length,
      "bytes",
    );
    console.log("PDF buffer is Buffer:", Buffer.isBuffer(pdfBuffer));

    // 3️⃣ Attach PDF for audit
    quote.attachments.push({
      name: `Quote-${quote._id}.pdf`,
      url: `/quotes/${quote._id}/pdf`,
    });
    await quote.save();

    // 4️⃣ Update enquiry status
    enquiry.status = "QUOTED";
    await enquiry.save();

    // 5️⃣ Email client (continue even if email fails)
    let emailSent = false;
    let emailError = null;
    try {
      await sendMail({
        to: enquiry.user.officialEmail || enquiry.user.email,
        subject: "Quotation for Your Enquiry",
        text: `Dear ${enquiry.user.name},

Please find attached the quotation for your enquiry.

Quote ID: ${quote._id}
Validity: ${new Date(validityDate).toLocaleDateString()}

Regards,
Admin Team`,
        attachments: [
          {
            filename: `Quote-${quote._id}.pdf`,
            content: pdfBuffer,
          },
        ],
      });
      emailSent = true;
    } catch (err) {
      console.error("Failed to send quote email:", err.message);
      emailError = err.message;
      // Continue - quote is still created even if email fails
    }

    return res.status(201).json({
      message: emailSent
        ? "Quote created and emailed successfully"
        : "Quote created but email failed to send",
      quoteId: quote._id,
      emailSent,
      emailError,
    });
  } catch (err) {
    console.error("Create quote error:", err);
    return res.status(500).json({ message: "Could not create quote" });
  }
};

/* =========================================================
   GOVT USER: VIEW MY QUOTES (OPTIONAL DASHBOARD)
   ========================================================= */
export const getMyQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find({ user: req.user._id })
      .populate({
        path: "enquiry",
        populate: { path: "product", select: "name sku" },
      })
      .sort({ createdAt: -1 });

    return res.json(quotes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not fetch quotes" });
  }
};

/* =========================================================
   GOVT USER: VIEW QUOTE BY ENQUIRY (PRIMARY FLOW)
   ========================================================= */
export const getQuoteByEnquiry = async (req, res) => {
  try {
    const quote = await Quote.findOne({
      enquiry: req.params.enquiryId,
      user: req.user._id,
    }).populate({
      path: "enquiry",
      populate: { path: "product", select: "name description sku" },
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

/* =========================================================
   GOVT USER: ACCEPT / REJECT QUOTE (FINAL DECISION)
   ========================================================= */
export const decideQuote = async (req, res) => {
  try {
    const { decision } = req.body; // ACCEPTED | REJECTED

    if (!["ACCEPTED", "REJECTED"].includes(decision)) {
      return res.status(400).json({ message: "Invalid decision" });
    }

    const quote = await Quote.findOne({
      enquiry: req.params.enquiryId,
      user: req.user._id,
    });

    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    // 🔒 Lock after decision
    if (quote.status !== "SENT") {
      return res.status(400).json({
        message: "Quote already decided and locked",
      });
    }

    quote.status = decision;
    quote.decisionAt = new Date();
    quote.decisionBy = req.user._id;
    if (decision === "ACCEPTED") {
      const fullQuote = await Quote.findById(quote._id)
        .populate("user", "name email")
        .populate({
          path: "enquiry",
          populate: { path: "product", select: "name sku" },
        });
      const pdfBuffer = await buildQuotePDFBuffer(fullQuote);

      try {
        await sendMail({
          to: req.user.email,
          subject: "Quotation Accepted",
          text: "Your quotation has been accepted. Please find attached PDF.",
          attachments: [
            {
              filename: `Quote-${quote._id}.pdf`,
              content: pdfBuffer,
            },
          ],
        });
      } catch (err) {
        console.log(
          "Acceptance notification email failed, but quote was processed:",
          err.message,
        );
      }
    }

    await quote.save();

    return res.json({
      message: `Quote ${decision.toLowerCase()} successfully`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not update quote decision" });
  }
};

/* =========================================================
   ADMIN: VIEW ALL QUOTES
   ========================================================= */
export const getAllQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find()
      .populate("user", "name email clientType")
      .populate({
        path: "enquiry",
        populate: { path: "product", select: "name sku" },
      })
      .sort({ createdAt: -1 });

    return res.json(quotes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not fetch quotes" });
  }
};

/* =========================================================
   ADMIN: VIEW SINGLE QUOTE (READ-ONLY)
   ========================================================= */
export const getQuoteById = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id)
      .populate("user", "name email")
      .populate({
        path: "enquiry",
        populate: { path: "product", select: "name description sku" },
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

/* =========================================================
   ADMIN: VIEW QUOTE BY ENQUIRY ID (for admin enquiry details)
   ========================================================= */
export const getQuoteByEnquiryAdmin = async (req, res) => {
  try {
    const quote = await Quote.findOne({
      enquiry: req.params.enquiryId,
    }).populate({
      path: "enquiry",
      populate: { path: "product", select: "name description sku" },
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

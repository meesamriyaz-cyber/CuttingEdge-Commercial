import ServiceQuote from "../models/ServiceQuote.js";
import PDFDocument from "pdfkit";
import { buildServiceQuotePDFBuffer } from "../utils/serviceQuotePdf.js";

export const generateServiceQuotePDF = async (req, res) => {
  try {
    const quote = await ServiceQuote.findById(req.params.id)
      .populate("user", "name email")
      .populate({
        path: "enquiry",
        populate: { path: "service", select: "name category" },
      });

    if (!quote) {
      return res.status(404).json({ message: "Service quote not found" });
    }

    const isAdmin = req.user?.roles?.includes("admin");
    const isOwner = quote.user?._id?.toString() === req.user?._id?.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        message: "Not authorized to access this service quote",
      });
    }

    const pdfBuffer = await buildServiceQuotePDFBuffer(quote);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=ServiceQuote-${quote._id}.pdf`,
    );

    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not generate PDF" });
  }
};

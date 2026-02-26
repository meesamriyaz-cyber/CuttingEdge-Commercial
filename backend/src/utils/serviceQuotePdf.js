import PDFDocument from "pdfkit";

export function buildServiceQuotePDFBuffer(quote) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on("data", (chunk) => buffers.push(chunk));

      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      doc.on("error", (err) => {
        reject(err);
      });

      // ---------- PDF CONTENT ----------
      doc.fontSize(18).text("Service Quotation", { align: "center" });
      doc.moveDown();

      doc.fontSize(12).text(`Quote ID: ${quote._id}`);
      doc.text(`Customer: ${quote.user?.name || "-"}`);
      doc.text(`Email: ${quote.user?.email || "-"}`);
      
      // Add service and enquiry details if available
      if (quote.enquiry && quote.enquiry.service) {
        doc.text(`Service: ${quote.enquiry.service.name || "-"}`);
        doc.text(`Category: ${quote.enquiry.service.category || "-"}`);
      }
      
      doc.moveDown();

      doc.text(`Estimated Amount: ₹${quote.estimatedAmount}`);
      doc.text(
        `Valid till: ${new Date(quote.validityDate).toLocaleDateString()}`
      );

      if (quote.notes) {
        doc.moveDown();
        doc.text("Notes:");
        doc.text(quote.notes);
      }

      doc.end();
    } catch (err) {
      console.error("Service quote PDF generation error:", err);
      reject(err);
    }
  });
}

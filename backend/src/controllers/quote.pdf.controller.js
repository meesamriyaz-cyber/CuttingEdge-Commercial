import Quote from "../models/Quote.js";
import PDFDocument from "pdfkit";

// Helper function to convert number to words
function numberToWords(num) {
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  const scales = ["", "Thousand", "Lakh", "Crore"];

  if (num === 0) return "Zero";

  let words = "";
  let scaleIndex = 0;

  while (num > 0) {
    const chunk = num % 1000;
    if (chunk > 0) {
      const chunkWords = convertChunk(chunk);
      words =
        chunkWords +
        (scales[scaleIndex] ? " " + scales[scaleIndex] : "") +
        " " +
        words;
    }
    num = Math.floor(num / 1000);
    scaleIndex++;
  }

  return words.trim();

  function convertChunk(n) {
    let result = "";

    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }

    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + " ";
      n %= 10;
    }

    if (n > 0) {
      result += ones[n] + " ";
    }

    return result.trim();
  }
}

export const generateQuotePDF = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id)
      .populate("user", "name email")
      .populate({
        path: "enquiry",
        populate: { path: "product", select: "name description sku hsn" },
      });

    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    const doc = new PDFDocument({ margin: 50, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=Quote-${quote._id.toString().slice(-8).toUpperCase()}.pdf`,
    );

    doc.pipe(res);

    // Company details
    const seller = {
      name: "Cutting Edge Enterprises",
      address: "Srinagar, Jammu & Kashmir",
      gstin: "01ABCDE1234F1Z5",
    };

    // Buyer details
    const buyer = {
      name:
        quote.enquiry?.organizationName ||
        quote.enquiry?.name ||
        quote.user?.name ||
        "Government Client",
      address: quote.enquiry?.address || "Government Office",
    };

    // Calculate pricing
    const baseAmount = parseFloat(quote.price) || 0;
    const cgst = baseAmount * 0.09;
    const sgst = baseAmount * 0.09;
    const grandTotal = baseAmount + cgst + sgst;

    // Page dimensions
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const leftMargin = 50;
    const rightMargin = 50;
    const contentWidth = pageWidth - leftMargin - rightMargin;

    // ---- HEADER SECTION ----
    doc.rect(0, 0, pageWidth, 85).fill("#4F46E5");

    doc.fill("#FFFFFF");
    doc.fontSize(26).font("Helvetica-Bold").text("QUOTATION", leftMargin, 20);
    doc
      .fontSize(10)
      .font("Helvetica")
      .fill("#E0E7FF")
      .text("Official Government Quotation", leftMargin, 50);

    const rightStartX = leftMargin + 280;
    const rightWidth = contentWidth - 280;

    doc
      .fontSize(18)
      .font("Helvetica-Bold")
      .fill("#FFFFFF")
      .text(seller.name, rightStartX, 20, {
        width: rightWidth,
        align: "right",
      });
    doc
      .fontSize(9)
      .font("Helvetica")
      .fill("#E0E7FF")
      .text(seller.address, rightStartX, 42, {
        width: rightWidth,
        align: "right",
      });
    doc
      .fontSize(9)
      .font("Helvetica")
      .fill("#E0E7FF")
      .text(`GSTIN: ${seller.gstin}`, rightStartX, 55, {
        width: rightWidth,
        align: "right",
      });

    // ---- QUOTE DETAILS SECTION ----
    let currentY = 100;

    doc
      .fill("#374151")
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("QUOTATION FOR", leftMargin, currentY);
    currentY += 15;

    // Bill To box
    const boxWidth = 220;
    doc.rect(leftMargin, currentY, boxWidth, 70).fill("#F9FAFB");
    doc.stroke("#E5E7EB");
    doc.rect(leftMargin, currentY, boxWidth, 70).stroke();

    doc
      .fill("#111827")
      .fontSize(15)
      .font("Helvetica-Bold")
      .text(buyer.name, leftMargin + 8, currentY + 15, {
        width: boxWidth - 16,
      });
    doc
      .fill("#6B7280")
      .fontSize(10)
      .font("Helvetica")
      .text(buyer.address, leftMargin + 8, currentY + 38, {
        width: boxWidth - 16,
      });
    currentY += 85;

    // Quote Details box
    const infoBoxX = leftMargin + 270;
    const infoBoxWidth = contentWidth - 270;
    doc
      .fill("#374151")
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("QUOTE DETAILS", infoBoxX, currentY - 85);

    doc.rect(infoBoxX, currentY - 70, infoBoxWidth, 80).fill("#F9FAFB");
    doc.stroke("#E5E7EB");
    doc.rect(infoBoxX, currentY - 70, infoBoxWidth, 80).stroke();

    const infoTextX = infoBoxX + 10;
    doc
      .fill("#6B7280")
      .fontSize(10)
      .font("Helvetica")
      .text("Quote Number:", infoTextX, currentY - 55);
    doc
      .fill("#111827")
      .fontSize(10)
      .font("Helvetica-Bold")
      .text(
        quote._id.toString().slice(-8).toUpperCase(),
        infoTextX + 100,
        currentY - 55,
      );

    doc
      .fill("#6B7280")
      .fontSize(10)
      .font("Helvetica")
      .text("Quote Date:", infoTextX, currentY - 30);
    doc
      .fill("#111827")
      .fontSize(10)
      .font("Helvetica-Bold")
      .text(
        new Date(quote.createdAt).toLocaleDateString("en-IN"),
        infoTextX + 100,
        currentY - 30,
      );

    doc
      .fill("#6B7280")
      .fontSize(10)
      .font("Helvetica")
      .text("Valid Until:", infoTextX, currentY - 5);
    doc
      .fill("#111827")
      .fontSize(10)
      .font("Helvetica-Bold")
      .text(
        new Date(quote.validityDate).toLocaleDateString("en-IN"),
        infoTextX + 100,
        currentY - 5,
      );

    doc
      .fill("#6B7280")
      .fontSize(10)
      .font("Helvetica")
      .text("Status:", infoTextX, currentY + 20);
    const statusColor =
      quote.status === "ACCEPTED"
        ? "#059669"
        : quote.status === "REJECTED"
          ? "#DC2626"
          : "#2563EB";
    doc
      .fill(statusColor)
      .fontSize(10)
      .font("Helvetica-Bold")
      .text(quote.status, infoTextX + 100, currentY + 20);

    // ---- ITEMS TABLE ----
    currentY += 30;

    // Table header
    doc.rect(leftMargin, currentY, contentWidth, 30).fill("#F3F4F6");
    doc.stroke("#D1D5DB");
    doc.rect(leftMargin, currentY, contentWidth, 30).stroke();

    doc.fill("#4B5563").fontSize(10).font("Helvetica-Bold");
    const col1 = leftMargin + 5;
    const col2 = col1 + 30;
    const col3 = col2 + 250;
    const col4 = col3 + 50;
    const col5 = col4 + 45;
    const col6 = col5 + 55;
    const col7 = col6 + 60;

    doc.text("#", col1, currentY + 10, { width: 25, align: "center" });
    doc.text("Item Description", col2, currentY + 10, { width: 245 });
    doc.text("HSN", col3, currentY + 10, { width: 45, align: "center" });
    doc.text("Qty", col4, currentY + 10, { width: 40, align: "center" });
    doc.text("Rate (Rs)", col5, currentY + 10, { width: 50, align: "right" });
    doc.text("Amount (Rs)", col6, currentY + 10, { width: 55, align: "right" });

    // Table row
    currentY += 30;
    doc.rect(leftMargin, currentY, contentWidth, 30).fill("#FFFFFF");
    doc.stroke("#E5E7EB");
    doc.rect(leftMargin, currentY, contentWidth, 30).stroke();

    doc.fill("#111827").fontSize(10).font("Helvetica");
    const rowY = currentY + 10;
    doc.text("1", col1, rowY, { width: 25, align: "center" });

    const itemName =
      quote.enquiry?.product?.name ||
      quote.enquiry?.requirements ||
      "Product / Service";
    doc.text(itemName, col2, rowY, { width: 245 });

    const hsn = quote.enquiry?.product?.hsn || "N/A";
    doc.text(hsn, col3, rowY, { width: 45, align: "center" });

    const quantity = quote.enquiry?.quantity || 1;
    doc.text(quantity.toString(), col4, rowY, { width: 40, align: "center" });

    const rateStr = baseAmount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
    });
    doc.text(rateStr, col5, rowY, { width: 50, align: "right" });

    const amountStr = baseAmount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
    });
    doc.text(amountStr, col6, rowY, { width: 55, align: "right" });

    currentY += 40;

    // ---- REQUIREMENTS SECTION ----
    if (quote.enquiry?.requirements) {
      doc.rect(leftMargin, currentY, contentWidth, 50).fill("#F9FAFB");
      doc.stroke("#E5E7EB");
      doc.rect(leftMargin, currentY, contentWidth, 50).stroke();

      doc
        .fill("#111827")
        .fontSize(11)
        .font("Helvetica-Bold")
        .text("Requirements / Specifications", leftMargin + 8, currentY + 10);
      doc
        .fill("#6B7280")
        .fontSize(9)
        .font("Helvetica")
        .text(quote.enquiry.requirements, leftMargin + 8, currentY + 28, {
          width: contentWidth - 16,
        });
      currentY += 60;
    }

    // ---- REMARKS SECTION ----
    if (quote.notes) {
      doc.rect(leftMargin, currentY, contentWidth, 42).fill("#FFFBEB");
      doc.stroke("#FCD34D");
      doc.rect(leftMargin, currentY, contentWidth, 42).stroke();

      doc
        .fill("#111827")
        .fontSize(11)
        .font("Helvetica-Bold")
        .text("Remarks", leftMargin + 8, currentY + 10);
      doc
        .fill("#6B7280")
        .fontSize(9)
        .font("Helvetica")
        .text(quote.notes, leftMargin + 8, currentY + 28, {
          width: contentWidth - 16,
        });
      currentY += 52;
    }

    // ---- TOTALS SECTION ----
    const totalsWidth = 280;
    const totalsX = leftMargin + contentWidth - totalsWidth;
    
    doc.rect(totalsX, currentY, totalsWidth, 150).fill("#F9FAFB");
    doc.stroke("#E5E7EB");
    doc.rect(totalsX, currentY, totalsWidth, 150).stroke();

    doc.fill("#6B7280").fontSize(10).font("Helvetica");
    let totalsY = currentY + 15;
    
    const taxableStr = baseAmount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
    });
    doc.text("Taxable Amount", totalsX + 15, totalsY);
    doc.text(`Rs ${taxableStr}`, totalsX + totalsWidth - 15, totalsY, {
      align: "right",
    });
    totalsY += 20;
    
    const cgstStr = cgst.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
    });
    doc.text("CGST (9%)", totalsX + 15, totalsY);
    doc.text(`Rs ${cgstStr}`, totalsX + totalsWidth - 15, totalsY, {
      align: "right",
    });
    totalsY += 20;
    
    const sgstStr = sgst.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
    });
    doc.text("SGST (9%)", totalsX + 15, totalsY);
    doc.text(`Rs ${sgstStr}`, totalsX + totalsWidth - 15, totalsY, {
      align: "right",
    });
    totalsY += 25;
    
    doc
      .moveTo(totalsX, totalsY)
      .lineTo(totalsX + totalsWidth, totalsY)
      .stroke("#9CA3AF");
    totalsY += 12;
    
    const grandTotalStr = grandTotal.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
    });
    doc
      .fill("#111827")
      .fontSize(16)
      .font("Helvetica-Bold")
      .text("Grand Total", totalsX + 15, totalsY);
    doc.text(`Rs ${grandTotalStr}`, totalsX + totalsWidth - 15, totalsY, {
      align: "right",
    });
    totalsY += 22;
    
    doc
      .fill("#6B7280")
      .fontSize(9)
      .font("Helvetica")
      .text(
        `Amount in Words: ${numberToWords(Math.round(grandTotal))} Rupees Only`,
        totalsX + 15,
        totalsY,
        { width: totalsWidth - 30 },
      );

    currentY += 165;

    // ---- BANK DETAILS & AUTHORIZATION ----
    const bankWidth = 200;
    doc.rect(leftMargin, currentY, bankWidth, 80).fill("#F9FAFB");
    doc.stroke("#E5E7EB");
    doc.rect(leftMargin, currentY, bankWidth, 80).stroke();

    doc
      .fill("#111827")
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Bank Details", leftMargin + 8, currentY + 12);
    doc.fill("#6B7280").fontSize(10).font("Helvetica");
    doc.text("Bank: UCO Bank", leftMargin + 8, currentY + 32);
    doc.text("Account No: 01230210004975", leftMargin + 8, currentY + 46);
    doc.text("IFSC: UCBA0000123", leftMargin + 8, currentY + 60);
    doc.text("Branch: Srinagar", leftMargin + 8, currentY + 74);

    const authX = leftMargin + 300;
    doc
      .fill("#6B7280")
      .fontSize(10)
      .font("Helvetica")
      .text("Authorized Signatory", authX, currentY + 12);
    doc
      .moveTo(authX, currentY + 45)
      .lineTo(leftMargin + contentWidth, currentY + 45)
      .stroke("#9CA3AF");
    doc
      .fill("#111827")
      .fontSize(10)
      .font("Helvetica-Bold")
      .text(`For ${seller.name}`, authX, currentY + 55, {
        width: contentWidth - 300,
        align: "right",
      });

    currentY += 100;

    // ---- TERMS & FOOTER ----
    doc.rect(0, currentY, pageWidth, 90).fill("#F9FAFB");
    doc.moveTo(0, currentY).lineTo(pageWidth, currentY).stroke("#E5E7EB");

    doc
      .fill("#6B7280")
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Terms & Conditions:", leftMargin, currentY + 12);
    doc.fill("#6B7280").fontSize(9).font("Helvetica");
    const terms = [
      "1. This quotation is valid until the expiry date mentioned above.",
      "2. Prices are inclusive of all taxes as applicable.",
      "3. Delivery timeline will be confirmed upon order confirmation.",
      "4. Subject to Srinagar jurisdiction only.",
      "5. This is a computer generated quotation and does not require signature.",
    ];
    terms.forEach((term, i) => {
      doc.text(term, leftMargin, currentY + 30 + i * 12);
    });

    doc
      .moveTo(leftMargin, currentY + 90)
      .lineTo(leftMargin + contentWidth, currentY + 90)
      .stroke("#E5E7EB");
    doc
      .fill("#4B5563")
      .fontSize(10)
      .font("Helvetica")
      .text(
        "Thank you for your interest! For any queries, contact us at enquiry@cuttingedge-enterprises.in",
        leftMargin,
        currentY + 100,
        { align: "center" },
      );

    doc.end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not generate PDF" });
  }
};

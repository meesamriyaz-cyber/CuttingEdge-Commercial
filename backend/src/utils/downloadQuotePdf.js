import jwt from "jsonwebtoken";
import puppeteer from "puppeteer";
import dotenv from "dotenv/config";

export const downloadQuotePdf = async (req, res) => {
  try {
    const orderId = req.params.id;

    // 🔐 1️⃣ CREATE SHORT-LIVED PRINT TOKEN (HERE)
    const printToken = jwt.sign(
      { orderId },
      process.env.PRINT_SECRET,
      { expiresIn: "5m" }
    );

    // 🔗 2️⃣ BUILD PRINT URL (HERE)
    const printUrl =
      `${process.env.FRONTEND_URL}/orders/${orderId}/invoice/print?token=${printToken}`;

    console.log("Printing URL:", printUrl);

    // 🖨️ 3️⃣ OPEN FRONTEND PRINT PAGE
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.goto(printUrl, {
      waitUntil: "networkidle0",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${orderId}.pdf`
    );

    res.send(pdfBuffer);
  } catch (err) {
    console.error("PDF generation failed", err);
    res.status(500).json({ message: "Failed to generate PDF" });
  }
};

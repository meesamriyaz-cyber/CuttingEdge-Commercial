const PDFDocument = require("pdfkit");
require("dotenv").config({ path: "./backend/.env" });

// Copy of buildQuotePDFBuffer from quotePdf.js
function buildQuotePDFBuffer(quote) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on("data", (chunk) => buffers.push(chunk));

      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(buffers);
        console.log(
          "PDF generated successfully, buffer length:",
          pdfBuffer.length,
        );
        resolve(pdfBuffer);
      });

      doc.on("error", (err) => {
        console.error("PDF generation error event:", err);
        reject(err);
      });

      // ---------- PDF CONTENT ----------
      doc.fontSize(18).text("Quotation", { align: "center" });
      doc.moveDown();

      doc.fontSize(12).text(`Quote ID: ${quote._id}`);
      doc.text(`Customer: ${quote.user?.name || "-"}`);
      doc.text(`Email: ${quote.user?.email || "-"}`);

      // Add product and enquiry details if available
      if (quote.enquiry && quote.enquiry.product) {
        doc.text(`Product: ${quote.enquiry.product.name || "-"}`);
        doc.text(`Product SKU: ${quote.enquiry.product.sku || "-"}`);
      }

      doc.moveDown();

      doc.text(`Amount: ₹${quote.price}`);
      doc.text(
        `Valid till: ${new Date(quote.validityDate).toLocaleDateString()}`,
      );

      if (quote.notes) {
        doc.moveDown();
        doc.text("Notes:");
        doc.text(quote.notes);
      }

      doc.end();
    } catch (err) {
      console.error("PDF generation try-catch error:", err);
      reject(err);
    }
  });
}

// Test data similar to what quote.controller.js provides
const testQuote = {
  _id: "679a1b2c3d4e5f6789012345",
  user: {
    name: "Test Government Organization",
    email: "test@government.in",
    officialEmail: "official@government.in",
  },
  enquiry: {
    product: {
      name: "Test Product",
      sku: "TP-1234",
    },
  },
  price: 15000,
  validityDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  notes: "This is a test quote",
};

// Test PDF generation
async function testPDFGeneration() {
  console.log("Testing PDF generation...");
  try {
    const pdfBuffer = await buildQuotePDFBuffer(testQuote);
    console.log("PDF Buffer type:", typeof pdfBuffer);
    console.log("PDF Buffer instance:", pdfBuffer instanceof Buffer);
    console.log("PDF Buffer length:", pdfBuffer.length);
    return pdfBuffer;
  } catch (error) {
    console.error("PDF generation failed:", error);
    return null;
  }
}

// Copy of sendMail from email.js
const nodemailer = require("nodemailer");
const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: process.env.SMTP_SECURE === "true", // true = SSL
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendMail = async ({ to, subject, text, attachments }) => {
  console.log("Preparing to send email to:", to);
  console.log("Email subject:", subject);
  console.log("Number of attachments:", attachments.length);
  console.log("Attachments details:", attachments);

  return mailer.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject: subject || "Greeting from CuttingEdge",
    text: text || "Thank you — we will connect soon.",
    attachments: attachments || [],
  });
};

// Test sending email with attachment
async function testEmailWithAttachment(pdfBuffer) {
  console.log("\nTesting email with attachment...");
  try {
    const info = await sendMail({
      to: process.env.TEST_EMAIL || "test@example.com",
      subject: "Test Quotation Email",
      text: "Please find attached the quotation for your enquiry.",
      attachments: [
        {
          filename: `Quote-${testQuote._id}.pdf`,
          content: pdfBuffer,
        },
      ],
    });
    console.log("Email sent successfully!");
    console.log("Message ID:", info.messageId);
    console.log("Envelope:", info.envelope);
  } catch (error) {
    console.error("Email sending failed:", error);
  }
}

// Run the test
async function runTest() {
  const pdfBuffer = await testPDFGeneration();
  if (pdfBuffer) {
    await testEmailWithAttachment(pdfBuffer);
  } else {
    console.log("\nSkipping email test because PDF generation failed.");
  }
}

runTest();

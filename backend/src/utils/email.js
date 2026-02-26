import nodemailer from "nodemailer";
import "dotenv/config";

export const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendMail = async ({ to, subject, text, attachments }) => {
  try {
    // Try to verify, but don't block if it fails
    await mailer.verify().catch((err) => {
      console.error("SMTP verify warning:", err.message);
    });

    const mailOptions = {
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to,
      subject: subject || "Greeting from CuttingEdge",
      text: text || "Thank you — we will connect soon.",
    };

    // Only add attachments if provided and not empty
    if (attachments && attachments.length > 0) {
      mailOptions.attachments = attachments.map((att) => {
        // Ensure content is a Buffer and convert to base64 for Gmail compatibility
        const content = Buffer.isBuffer(att.content)
          ? att.content
          : Buffer.from(att.content);
        console.log(
          `Attaching file: ${att.filename}, size: ${content.length} bytes`,
        );
        return {
          filename: att.filename,
          content: content.toString("base64"),
          contentType: att.contentType || "application/pdf",
          encoding: "base64",
        };
      });
    }

    const result = await mailer.sendMail(mailOptions);
    console.log("Email sent successfully:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (err) {
    console.error("SendMail Error:", err.message);
    console.error("Error code:", err.code);

    // Log what we tried to send
    console.log("\n========== EMAIL FAILED ==========");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("Attachments:", attachments?.length || 0);
    console.log("==================================\n");

    // Re-throw so caller knows it failed
    throw err;
  }
};

export async function sendQuoteIssuedEmail({
  to,
  organizationName,
  quoteNumber,
  amount,
  validityDays,
}) {
  return mailer.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: `Quotation Issued — Ref #${quoteNumber}`,
    html: `
      <h2>Government Quotation Issued</h2>

      <p>Dear ${organizationName},</p>

      <p>A quotation has been issued for your enquiry.</p>

      <p><strong>Quote Reference:</strong> ${quoteNumber}<br/>
      <strong>Amount:</strong> ₹ ${amount}<br/>
      <strong>Validity:</strong> ${validityDays} days</p>

      <p>Please log in to your account to review the quotation.</p>

      <p>
        <a href="${process.env.APP_URL}/quotes"
           style="padding:10px 14px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none">
           View My Quotes
        </a>
      </p>

      <p>Regards,<br/>Cutting Edge Enterprises</p>
    `,
  });
}

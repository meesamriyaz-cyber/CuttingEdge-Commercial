import fetch from "node-fetch";
import nodemailer from "nodemailer";
import "dotenv/config";

const env = (key, fallback = "") => String(process.env[key] || fallback).trim();

const extractEmail = (value = "") => {
  const match = value.match(/<([^>]+)>/);
  return (match ? match[1] : value).trim().toLowerCase();
};

const smtpHost = env("SMTP_HOST");
const smtpUser = env("SMTP_USER");
const configuredFrom = env("SMTP_FROM") || env("MAIL_FROM");
const resendApiKey = env("RESEND_API_KEY");
const resendFrom = env("RESEND_FROM");
const explicitEmailProvider = env("EMAIL_PROVIDER").toLowerCase();
const isProductionRuntime =
  env("NODE_ENV").toLowerCase() === "production" || env("RENDER") === "true";
const emailProvider =
  explicitEmailProvider || (isProductionRuntime ? "resend" : "smtp");

const getSenderFields = () => {
  const from = configuredFrom || smtpUser;
  const fromEmail = extractEmail(from);
  const smtpEmail = extractEmail(smtpUser);
  const usingGmail = smtpHost.toLowerCase().includes("gmail");

  if (usingGmail && smtpEmail && fromEmail && fromEmail !== smtpEmail) {
    return {
      from: `Cutting Edge Enterprises <${smtpUser}>`,
      replyTo: from,
    };
  }

  return { from };
};

export const mailer = nodemailer.createTransport({
  host: smtpHost,
  port: Number(env("SMTP_PORT", 465)),
  secure: env("SMTP_SECURE") === "true",
  auth: {
    user: smtpUser,
    pass: env("SMTP_PASS"),
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const normalizeRecipients = (to) => (Array.isArray(to) ? to : [to]).filter(Boolean);

const buildSmtpAttachments = (attachments = []) =>
  attachments.map((att) => {
    const content = Buffer.isBuffer(att.content)
      ? att.content
      : Buffer.from(att.content);

    return {
      filename: att.filename,
      content: content.toString("base64"),
      contentType: att.contentType || "application/pdf",
      encoding: "base64",
    };
  });

const buildResendAttachments = (attachments = []) =>
  buildSmtpAttachments(attachments).map((att) => ({
    filename: att.filename,
    content: att.content,
    content_type: att.contentType || "application/pdf",
  }));

const sendViaResend = async ({ to, subject, text, html, attachments }) => {
  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  if (!resendFrom) {
    throw new Error(
      "RESEND_FROM is required when using Resend. Use a sender from your verified Resend domain.",
    );
  }

  const recipients = normalizeRecipients(to);
  if (recipients.length === 0) {
    throw new Error("Email recipient is missing");
  }

  const body = {
    from: resendFrom,
    to: recipients,
    subject: subject || "Greeting from CuttingEdge",
    text: text || undefined,
    html: html || undefined,
  };

  const replyTo = env("RESEND_REPLY_TO") || env("MAIL_REPLY_TO");
  if (replyTo) {
    body.reply_to = replyTo;
  }

  if (!body.text && !body.html) {
    body.text = "Thank you - we will connect soon.";
  }

  if (attachments && attachments.length > 0) {
    body.attachments = buildResendAttachments(attachments);
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const rawPayload = await response.text();
  let payload;
  try {
    payload = rawPayload ? JSON.parse(rawPayload) : {};
  } catch {
    payload = { message: rawPayload };
  }

  if (!response.ok) {
    console.error("Resend API rejected email:", {
      status: response.status,
      from: body.from,
      to: recipients,
      error: payload?.message || payload?.error || payload,
    });

    throw new Error(
      payload?.message ||
        payload?.error ||
        `Resend API failed with status ${response.status}`,
    );
  }

  console.log("Email accepted by Resend:", {
    messageId: payload.id,
    accepted: recipients,
  });

  return {
    success: true,
    provider: "resend",
    messageId: payload.id,
    accepted: recipients,
    rejected: [],
    response: `Resend API accepted message ${payload.id}`,
  };
};

const sendViaSmtp = async ({ to, subject, text, html, attachments }) => {
  try {
    // Try to verify, but don't block if it fails
    await mailer.verify().catch((err) => {
      console.error("SMTP verify warning:", err.message);
    });

    const mailOptions = {
      ...getSenderFields(),
      to,
      subject: subject || "Greeting from CuttingEdge",
      text: text || "Thank you — we will connect soon.",
    };

    if (html) {
      mailOptions.html = html;
    }

    // Only add attachments if provided and not empty
    if (attachments && attachments.length > 0) {
      mailOptions.attachments = buildSmtpAttachments(attachments).map((att) => {
        console.log(
          `Attaching file: ${att.filename}, base64 size: ${att.content.length} chars`,
        );
        return att;
      });
    }

    const result = await mailer.sendMail(mailOptions);
    console.log("Email sent successfully:", {
      messageId: result.messageId,
      accepted: result.accepted,
      rejected: result.rejected,
      response: result.response,
    });
    return {
      success: true,
      messageId: result.messageId,
      accepted: result.accepted,
      rejected: result.rejected,
      response: result.response,
    };
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

export const sendMail = async (payload) => {
  if (emailProvider === "resend") {
    try {
      return await sendViaResend(payload);
    } catch (err) {
      console.error("Resend Error:", err.message);
      throw err;
    }
  }

  return sendViaSmtp(payload);
};

export const getEmailProvider = () => emailProvider;

export const getEmailConfigStatus = () => ({
  provider: emailProvider,
  runtime: isProductionRuntime ? "production" : "development",
  hasResendApiKey: Boolean(resendApiKey),
  hasResendFrom: Boolean(resendFrom),
  hasSmtpHost: Boolean(smtpHost),
  hasSmtpUser: Boolean(smtpUser),
});

export async function sendQuoteIssuedEmail({
  to,
  organizationName,
  quoteNumber,
  amount,
  validityDays,
}) {
  return sendMail({
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

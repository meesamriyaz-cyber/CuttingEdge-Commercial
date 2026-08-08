import "dotenv/config";
import { getEmailConfigStatus, sendMail } from "../src/utils/email.js";

const recipient = process.argv[2] || process.env.TEST_EMAIL;

if (!recipient) {
  console.error("Usage: node scripts/check-email.js recipient@example.com");
  process.exit(1);
}

console.log("Email config:", getEmailConfigStatus());
console.log("Sending diagnostic email to:", recipient);

try {
  const result = await sendMail({
    to: recipient,
    subject: "Cutting Edge email delivery test",
    text: "This is a diagnostic email from the Cutting Edge backend.",
    html: "<p>This is a diagnostic email from the Cutting Edge backend.</p>",
  });

  console.log("Email sent:", {
    provider: result.provider || getEmailConfigStatus().provider,
    messageId: result.messageId,
    accepted: result.accepted,
    rejected: result.rejected,
    response: result.response,
  });
} catch (err) {
  console.error("Email diagnostic failed:", err.message);
  process.exit(1);
}

import { sendQuoteIssuedEmail } from "../utils/email.js";

await sendQuoteIssuedEmail({
  to: enquiry.officialEmail,
  organizationName: enquiry.organizationName,
  quoteNumber: quote.quoteNumber || quote._id.toString().slice(-6),
  amount: quote.totalAmount,
  validityDays: quote.validityDays
});

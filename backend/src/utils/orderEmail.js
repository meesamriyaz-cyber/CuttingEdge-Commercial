import { sendMail } from "./email.js";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatCurrency = (value = 0) => currencyFormatter.format(Number(value) || 0);

export async function sendOrderConfirmationEmail({ order, user }) {
  const recipient = user?.email || order?.user?.email;

  if (!recipient || !order) {
    return null;
  }

  const customerName = user?.name || order?.user?.name || "Customer";
  const rows = (order.items || [])
    .map((item) => {
      const productName = item.product?.name || "Product";
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.priceAtOrder) || 0;
      const lineTotal = quantity * unitPrice;

      return `
        <tr>
          <td style="padding:10px;border-bottom:1px solid #e5e7eb;">${escapeHtml(productName)}</td>
          <td style="padding:10px;border-bottom:1px solid #e5e7eb;text-align:center;">${quantity}</td>
          <td style="padding:10px;border-bottom:1px solid #e5e7eb;text-align:right;">${formatCurrency(unitPrice)}</td>
          <td style="padding:10px;border-bottom:1px solid #e5e7eb;text-align:right;">${formatCurrency(lineTotal)}</td>
        </tr>
      `;
    })
    .join("");

  const textItems = (order.items || [])
    .map((item) => {
      const productName = item.product?.name || "Product";
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.priceAtOrder) || 0;
      return `${productName} - Qty: ${quantity} - Unit: ${formatCurrency(unitPrice)} - Total: ${formatCurrency(quantity * unitPrice)}`;
    })
    .join("\n");

  const pricing = order.pricing || {};
  const grandTotal = pricing.grandTotal ?? order.totalAmount ?? 0;

  return sendMail({
    to: recipient,
    subject: `Order Confirmation - ${order._id}`,
    text: `Dear ${customerName},

Thank you for your order. Your order ${order._id} has been placed successfully.

Items:
${textItems}

Subtotal: ${formatCurrency(pricing.taxableAmount ?? order.totalAmount)}
CGST: ${formatCurrency(pricing.cgst)}
SGST: ${formatCurrency(pricing.sgst)}
Grand Total: ${formatCurrency(grandTotal)}

Shipping Address:
${order.shippingAddress || "Not provided"}

You can also view this order from your account.

Regards,
Cutting Edge Enterprises`,
    html: `
      <div style="font-family:Arial,sans-serif;color:#111827;line-height:1.5;">
        <h2 style="margin:0 0 12px;">Order placed successfully</h2>
        <p>Dear ${escapeHtml(customerName)},</p>
        <p>Thank you for your order. Please keep this email as a record of your purchase.</p>

        <div style="margin:18px 0;padding:14px;border:1px solid #e5e7eb;border-radius:8px;background:#f9fafb;">
          <p style="margin:0;"><strong>Order ID:</strong> ${order._id}</p>
          <p style="margin:6px 0 0;"><strong>Status:</strong> ${escapeHtml(order.status)}</p>
          <p style="margin:6px 0 0;"><strong>Payment:</strong> ${escapeHtml(order.paymentStatus)}</p>
        </div>

        <table style="width:100%;border-collapse:collapse;margin-top:16px;">
          <thead>
            <tr style="background:#f3f4f6;">
              <th style="padding:10px;text-align:left;">Product</th>
              <th style="padding:10px;text-align:center;">Qty</th>
              <th style="padding:10px;text-align:right;">Unit Price</th>
              <th style="padding:10px;text-align:right;">Total</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>

        <div style="margin-top:18px;text-align:right;">
          <p style="margin:4px 0;">Taxable Amount: <strong>${formatCurrency(pricing.taxableAmount ?? order.totalAmount)}</strong></p>
          <p style="margin:4px 0;">CGST: <strong>${formatCurrency(pricing.cgst)}</strong></p>
          <p style="margin:4px 0;">SGST: <strong>${formatCurrency(pricing.sgst)}</strong></p>
          <p style="margin:8px 0;font-size:18px;">Grand Total: <strong>${formatCurrency(grandTotal)}</strong></p>
        </div>

        <div style="margin-top:18px;">
          <p style="margin:0 0 6px;"><strong>Shipping Address</strong></p>
          <p style="margin:0;">${escapeHtml(order.shippingAddress || "Not provided")}</p>
        </div>

        <p style="margin-top:22px;">Regards,<br/>Cutting Edge Enterprises</p>
      </div>
    `,
  });
}

export async function sendPaymentFailedEmail({ order, user, error }) {
  const recipient = user?.email || order?.user?.email;

  if (!recipient || !order) {
    return null;
  }

  const customerName = user?.name || order?.user?.name || "Customer";
  const errorDescription = typeof error === "string" ? error : error?.description || "Payment could not be processed";

  const textItems = (order.items || [])
    .map((item) => {
      const productName = item.product?.name || "Product";
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.priceAtOrder) || 0;
      return `${productName} - Qty: ${quantity} - Unit: ${formatCurrency(unitPrice)} - Total: ${formatCurrency(quantity * unitPrice)}`;
    })
    .join("\n");

  const pricing = order.pricing || {};
  const grandTotal = pricing.grandTotal ?? order.totalAmount ?? 0;

  return sendMail({
    to: recipient,
    subject: `Payment Failed - Order ${order._id}`,
    text: `Dear ${customerName},

We regret to inform you that your payment for order ${order._id} could not be processed.

Reason: ${errorDescription}

Order Details:
${textItems}

Grand Total: ${formatCurrency(grandTotal)}

Your order has not been confirmed. Please try again or choose a different payment method.

If you believe this is an error, please contact our support team.

Regards,
Cutting Edge Enterprises`,
    html: `
      <div style="font-family:Arial,sans-serif;color:#111827;line-height:1.5;">
        <h2 style="margin:0 0 12px;color:#dc2626;">Payment Failed</h2>
        <p>Dear ${escapeHtml(customerName)},</p>
        <p>We regret to inform you that your payment for the following order could not be processed.</p>

        <div style="margin:18px 0;padding:14px;border:1px solid #e5e7eb;border-radius:8px;background:#f9fafb;">
          <p style="margin:0;"><strong>Order ID:</strong> ${order._id}</p>
          <p style="margin:6px 0 0;"><strong>Failure Reason:</strong> ${escapeHtml(errorDescription)}</p>
        </div>

        <table style="width:100%;border-collapse:collapse;margin-top:16px;">
          <thead>
            <tr style="background:#f3f4f6;">
              <th style="padding:10px;text-align:left;">Product</th>
              <th style="padding:10px;text-align:center;">Qty</th>
              <th style="padding:10px;text-align:right;">Unit Price</th>
              <th style="padding:10px;text-align:right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${(order.items || [])
              .map(
                (item) => {
                  const productName = item.product?.name || "Product";
                  const quantity = Number(item.quantity) || 0;
                  const unitPrice = Number(item.priceAtOrder) || 0;
                  const lineTotal = quantity * unitPrice;
                  return `
                    <tr>
                      <td style="padding:10px;border-bottom:1px solid #e5e7eb;">${escapeHtml(productName)}</td>
                      <td style="padding:10px;border-bottom:1px solid #e5e7eb;text-align:center;">${quantity}</td>
                      <td style="padding:10px;border-bottom:1px solid #e5e7eb;text-align:right;">${formatCurrency(unitPrice)}</td>
                      <td style="padding:10px;border-bottom:1px solid #e5e7eb;text-align:right;">${formatCurrency(lineTotal)}</td>
                    </tr>
                  `;
                },
              )
              .join("")}
          </tbody>
        </table>

        <div style="margin-top:18px;text-align:right;">
          <p style="margin:8px 0;font-size:18px;">Grand Total: <strong>${formatCurrency(grandTotal)}</strong></p>
        </div>

        <p style="margin-top:22px;">Your order has <strong>not</strong> been confirmed. Please try again or choose a different payment method. If you believe this is an error, please contact our support team.</p>

        <p style="margin-top:22px;">Regards,<br/>Cutting Edge Enterprises</p>
      </div>
    `,
  });
}

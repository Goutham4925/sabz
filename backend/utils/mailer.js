const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send enquiry notification email to admin.
 */
async function sendEnquiryMail({ name, email, phone, address, subject, message, products }) {
  const isCart = Array.isArray(products) && products.length > 0;

  const productRows = isCart
    ? products
        .map(
          (p) =>
            `<tr>
              <td style="padding:6px 12px;border-bottom:1px solid #f0e8dc;">${p.name}</td>
              <td style="padding:6px 12px;border-bottom:1px solid #f0e8dc;text-align:center;">${p.quantity}</td>
              <td style="padding:6px 12px;border-bottom:1px solid #f0e8dc;text-align:right;">
                ${p.price ? `₹${(p.price * p.quantity).toFixed(2)}` : "—"}
              </td>
            </tr>`
        )
        .join("")
    : "";

  const total = isCart
    ? products.reduce((s, p) => s + (p.price ?? 0) * p.quantity, 0)
    : 0;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#fdf8f3;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

    <!-- HEADER -->
    <div style="background:linear-gradient(135deg,#8B1A1A,#c0392b);padding:28px 32px;">
      <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700;">
        ${isCart ? "🛒 New Cart Enquiry" : "📩 New Enquiry"}
      </h1>
      <p style="margin:6px 0 0;color:#ffd6d6;font-size:14px;">Saabz Kitchen · ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
    </div>

    <!-- CUSTOMER INFO -->
    <div style="padding:24px 32px;border-bottom:1px solid #f0e8dc;">
      <h2 style="margin:0 0 16px;font-size:15px;color:#5a2a2a;text-transform:uppercase;letter-spacing:.05em;">Customer Details</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:4px 0;color:#888;width:110px;">Name</td><td style="padding:4px 0;font-weight:600;">${name}</td></tr>
        ${email ? `<tr><td style="padding:4px 0;color:#888;">Email</td><td style="padding:4px 0;">${email}</td></tr>` : ""}
        ${phone ? `<tr><td style="padding:4px 0;color:#888;">Phone</td><td style="padding:4px 0;">${phone}</td></tr>` : ""}
        ${address ? `<tr><td style="padding:4px 0;color:#888;vertical-align:top;">Address</td><td style="padding:4px 0;">${address}</td></tr>` : ""}
      </table>
    </div>

    ${
      isCart
        ? `<!-- CART ITEMS -->
    <div style="padding:24px 32px;border-bottom:1px solid #f0e8dc;">
      <h2 style="margin:0 0 16px;font-size:15px;color:#5a2a2a;text-transform:uppercase;letter-spacing:.05em;">Products Ordered</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <thead>
          <tr style="background:#fdf8f3;">
            <th style="padding:8px 12px;text-align:left;color:#888;font-weight:600;">Product</th>
            <th style="padding:8px 12px;text-align:center;color:#888;font-weight:600;">Qty</th>
            <th style="padding:8px 12px;text-align:right;color:#888;font-weight:600;">Price</th>
          </tr>
        </thead>
        <tbody>${productRows}</tbody>
        ${
          total > 0
            ? `<tfoot>
          <tr style="background:#fdf8f3;">
            <td colspan="2" style="padding:10px 12px;font-weight:700;color:#5a2a2a;">Total</td>
            <td style="padding:10px 12px;font-weight:700;color:#8B1A1A;text-align:right;">₹${total.toFixed(2)}</td>
          </tr>
        </tfoot>`
            : ""
        }
      </table>
    </div>`
        : ""
    }

    <!-- MESSAGE -->
    ${
      message && message !== "Customer sent a cart enquiry."
        ? `<div style="padding:24px 32px;border-bottom:1px solid #f0e8dc;">
      <h2 style="margin:0 0 12px;font-size:15px;color:#5a2a2a;text-transform:uppercase;letter-spacing:.05em;">Message</h2>
      <p style="margin:0;font-size:14px;color:#444;white-space:pre-wrap;line-height:1.6;">${message}</p>
    </div>`
        : ""
    }

    <!-- FOOTER -->
    <div style="padding:20px 32px;background:#fdf8f3;text-align:center;">
      <p style="margin:0;font-size:12px;color:#aaa;">Reply directly to this email to respond to the customer.</p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"Saabz Kitchen Enquiry" <${process.env.MAIL_FROM}>`,
    to: process.env.MAIL_TO,
    replyTo: email || undefined,
    subject: subject || "New Enquiry — Saabz Kitchen",
    html,
  });
}

module.exports = { sendEnquiryMail };

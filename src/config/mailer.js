const nodemailer = require("nodemailer");

// Transporter SMTP (Gmail)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true, // 465 = SSL
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

/**
 * Enviar email genérico
 * @param {Object} params
 * @param {string} params.to
 * @param {string} params.subject
 * @param {string} params.html
 */
async function sendMail({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: `"CIFO CRM" <${process.env.MAIL_USERNAME}>`,
      to,
      subject,
      html,
    });

    return info;
  } catch (error) {
    console.error("[MAIL ERROR]", error.message);
    return error; // no rompe la request
  }
}

module.exports = {
  sendMail,
};
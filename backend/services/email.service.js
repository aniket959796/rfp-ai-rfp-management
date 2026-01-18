const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendRfpEmail = async ({
  to,
  subject,
  rfpId,
  vendorId,
  text,
}) => {
  const safeText = text || "RFP details are provided below.";

  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text: `
RFP REQUEST

RFP_ID: ${rfpId}
VENDOR_ID: ${vendorId}

${safeText}

Please reply to this email with your proposal.
Do NOT remove the RFP_ID and VENDOR_ID from your reply.
`,
  });
};

module.exports = { sendRfpEmail };

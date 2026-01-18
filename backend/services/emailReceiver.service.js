const imaps = require('imap-simple');
const { simpleParser } = require("mailparser");
const emailConfig = require('../config/email.config');
const { parseVendorReply } = require('./ai.service');
const Proposal = require('../models/Proposal');

async function checkInbox() {
  let connection;

  try {
    connection = await imaps.connect({ imap: emailConfig.imap });
    await connection.openBox("INBOX");

    const searchCriteria = ["UNSEEN"];
    const fetchOptions = { bodies: [""] };

    const messages = await connection.search(searchCriteria, fetchOptions);

    for (const msg of messages) {
      const parsed = await simpleParser(msg.parts[0].body);

      const emailText = parsed.text || "";
      const subject = parsed.subject || "";
      const from = parsed.from?.text || "Unknown sender";

      if (!subject.toLowerCase().includes("rfp")) {
        continue;
      }

      const rfpId = emailText.match(/RFP_ID:\s*([a-f\d]{24})/i)?.[1];
      const vendorId = emailText.match(/VENDOR_ID:\s*([a-f\d]{24})/i)?.[1];

      if (!rfpId || !vendorId) {
        continue;
      }

      console.log("Processing vendor reply from:", from);
      console.log("RFP ID:", rfpId);
      console.log("Vendor ID:", vendorId);

      const structured = await parseVendorReply(emailText);

      await Proposal.create({
        rfpId,
        vendorId,
        rawResponse: emailText,
        structuredData: structured,
      });

      console.log("✅ Proposal saved for RFP:", rfpId);
    }
  } catch (error) {
    console.error("❌ Email inbox processing failed:", error.message);
  } finally {
    if (connection) {
      connection.end();
    }
  }
}

module.exports = { checkInbox };

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

    // ✅ Fetch unread emails with subject containing "RFP"
    const messages = await connection.search(
      [
        "UNSEEN",
        ["SUBJECT", "RFP"]
      ],
      { bodies: [""], markSeen: false }
    );

    console.log(`📥 Found ${messages.length} unread emails`);

    if (!messages.length) {
      return;
    }

    for (const msg of messages) {
      try {
        const parsed = await simpleParser(msg.parts[0].body);

        // ✅ Combine subject + text + html
        const combinedText = `
${parsed.subject || ""}
${parsed.text || ""}
${parsed.html || ""}
`;

        // ✅ Extract IDs (PRIMARY IDENTIFIER)
        const rfpMatch = combinedText.match(/RFP_ID[=:]\s*([a-f0-9]{24})/i);
        const vendorMatch = combinedText.match(/VENDOR_ID[=:]\s*([a-f0-9]{24})/i);

        if (!rfpMatch || !vendorMatch) {
          console.log("⏭️ Skipping email: no RFP_ID / VENDOR_ID");
          continue;
        }

        const rfpId = rfpMatch[1];
        const vendorId = vendorMatch[1];

        console.log("📨 Processing RFP reply");
        console.log("RFP ID:", rfpId);
        console.log("Vendor ID:", vendorId);

        // 🚫 Prevent duplicate proposals
        const alreadyProcessed = await Proposal.findOne({ rfpId, vendorId });
        if (alreadyProcessed) {
          console.warn("⚠️ Duplicate proposal detected");
          await connection.addFlags(msg.attributes.uid, ["\\Seen"]);
          continue;
        }

        // 🤖 Parse vendor reply
        const structured = await parseVendorReply(combinedText);

        // 💾 Save proposal
        await Proposal.create({
          rfpId,
          vendorId,
          rawResponse: combinedText,
          structuredData: structured,
        });

        console.log("✅ Proposal saved successfully");

        // ✅ Mark SEEN only after successful save
        await connection.addFlags(msg.attributes.uid, ["\\Seen"]);
      } catch (innerErr) {
        console.error("❌ Failed to process email:", innerErr.message);
        // leave UNSEEN for retry
      }
    }
  } catch (error) {
    console.error("❌ Inbox processing failed:", error.message);
  } finally {
    if (connection) {
      connection.end();
    }
  }
}

module.exports = { checkInbox };

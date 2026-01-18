const Rfp = require('../models/Rfp');
const Vendor = require('../models/Vendor');
const { sendRfpEmail } = require('../services/email.service');

const sendRfpToVendors = async (req, res) => {
  try {
    const { rfpId, vendorIds } = req.body;

    if (!rfpId || !Array.isArray(vendorIds) || vendorIds.length === 0) {
      return res.status(400).json({
        error: "rfpId and vendorIds array are required",
      });
    }

    const rfp = await Rfp.findById(rfpId);
    if (!rfp) {
      return res.status(404).json({ error: "RFP not found" });
    }

    const vendors = await Vendor.find({
      _id: { $in: vendorIds },
    });

    for (const vendor of vendors) {
      await sendRfpEmail({
        to: vendor.email,
        subject: "RFP Request – Please Respond",
        rfpId: rfp._id,
        vendorId: vendor._id,
        text: `
Request for Proposal

Details:
${JSON.stringify(rfp.structuredData, null, 2)}

Please include:
- Total price
- Delivery timeline
- Warranty details
- Payment terms
`,
      });
    }

    res.status(200).json({
      message: "RFP emails sent successfully",
      vendorsNotified: vendors.length,
    });
  } catch (error) {
    console.error("Send RFP failed:", error.message);
    res.status(500).json({ error: "Failed to send RFP emails" });
  }
};

module.exports = { sendRfpToVendors };

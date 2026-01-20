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
      const emailText = buildNaturalLanguageRfp(rfp);
      
      await sendRfpEmail({
        to: vendor.email,
        subject: "RFP Request – Please Respond",
        rfpId: rfp._id,
        vendorId: vendor._id,
        text: buildNaturalLanguageRfp(rfp),

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

const buildNaturalLanguageRfp = (rfp) => {
  const d = rfp.structuredData || {};
  let text = "Request for Proposal\n\n";

  if (d.items?.length) {
    text += "We require the following items:\n\n";

    d.items.forEach((item, i) => {
      text += `${i + 1}. ${item.quantity} ${item.name}`;

      if (item.specs) {
        if (typeof item.specs === "string") {
          text += ` (${item.specs})`;
        } else {
          const specsText = Object.entries(item.specs)
            .map(([k, v]) => `${k}: ${v}`)
            .join(", ");
          text += ` (${specsText})`;
        }
      }

      text += "\n";
    });

    text += "\n";
  }

  if (d.budget) text += `The total budget is $${d.budget}.\n`;
  if (d.deliveryDays)
    text += `Delivery should be completed within ${d.deliveryDays} days.\n`;
  if (d.warranty)
    text += `A minimum warranty of ${d.warranty} is required.\n`;

  text += "\nPlease include in your proposal:\n";
  text += "- Total price\n";
  text += "- Delivery timeline\n";
  text += "- Warranty details\n";
  text += "- Payment terms\n";

  return text;
};

module.exports = { sendRfpToVendors };

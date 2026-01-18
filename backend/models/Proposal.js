const mongoose = require("mongoose");

const ProposalSchema = new mongoose.Schema(
  {
    rfpId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rfp",
      required: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    rawResponse: {
      type: String,
      required: true,
    },
    structuredData: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Proposal", ProposalSchema);

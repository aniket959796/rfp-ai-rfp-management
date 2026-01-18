const mongoose = require("mongoose");

const RfpSchema = new mongoose.Schema(
  {
    rawInput: {
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

module.exports = mongoose.model("Rfp", RfpSchema);
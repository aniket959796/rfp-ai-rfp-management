const { generateStructuredRfp } = require("../services/ai.service");
const Rfp = require('../models/Rfp');

const createRfp = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }

    const structuredRfp = await generateStructuredRfp(description);

    const rfp = await Rfp.create({
      rawInput: description,
      structuredData: structuredRfp,
    });

    res.status(201).json(rfp);
  } catch (error) {
    console.error("RFP creation failed:", error.message);
    res.status(500).json({ error: "Failed to create RFP" });
  }
};

const getRfps = async (req, res) => {
  const rfps = await Rfp.find().sort({ createdAt: -1 }).limit(2);             
;
  res.status(200).json(rfps);
};

module.exports = { createRfp, getRfps };

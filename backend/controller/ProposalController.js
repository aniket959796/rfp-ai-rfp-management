const mongoose = require("mongoose");
const Proposal = require('../models/Proposal');
const { parseVendorReply, generateProposalRecommendation} = require('../services/ai.service');

const submitProposal = async (req, res) => {
  try {
    const { rfpId, vendorId, replyText } = req.body;

    if (!rfpId || !vendorId || !replyText) {
      return res.status(400).json({
        error: "rfpId, vendorId and replyText are required",
      });
    }

    const structured = await parseVendorReply(replyText);

    const proposal = await Proposal.create({
      rfpId,
      vendorId,
      rawResponse: replyText,
      structuredData: structured,
    });

    res.status(201).json(proposal);
  } catch (error) {
    console.error("Proposal parsing failed:", error.message);
    res.status(500).json({ error: "Failed to parse vendor proposal" });
  }
};

const getProposalsByRfp  = async (req, res) => {
  const { rfpId } = req.params;

  const proposals = await Proposal.aggregate([
    { $match: { rfpId: new mongoose.Types.ObjectId(rfpId) } },

    { $sort: { createdAt: -1 } },

    {
      $group: {
        _id: "$vendorId",
        latestProposal: { $first: "$$ROOT" }
      }
    },

    { $replaceRoot: { newRoot: "$latestProposal" } }
  ]);

  await Proposal.populate(proposals, {
    path: "vendorId",
    select: "name email"
  });

  res.status(200).json(proposals);
};

const getAiRecommendation = async (req, res) => {
  try {
    const { rfpId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(rfpId)) {
      return res.status(400).json({ error: "Invalid RFP ID" });
    }

    const proposals = await Proposal.find({
      rfpId: new mongoose.Types.ObjectId(rfpId),
    })
      .populate("vendorId", "name email")
      .sort({ createdAt: 1 });

    if (!proposals.length) {
      return res.status(404).json({
        error: "No proposals found for this RFP",
      });
    }

    const proposalData = proposals.map((p) => ({
      vendor: p.vendorId.name,
      totalPrice: p.structuredData?.totalPrice,
      deliveryDays: p.structuredData?.deliveryDays,
      warranty: p.structuredData?.warranty,
      paymentTerms: p.structuredData?.paymentTerms,
    }));

    const recommendation = await generateProposalRecommendation(proposalData);

    res.status(200).json({ recommendation });
  } catch (error) {
    console.error("AI recommendation failed:", error.message);
    res.status(500).json({
      error: "Failed to generate AI recommendation",
    });
  }
};

module.exports = {getAiRecommendation, submitProposal, getProposalsByRfp  };

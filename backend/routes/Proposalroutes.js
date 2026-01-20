const express = require("express");
const router = express.Router();

const {
  submitProposal,
  getProposalsByRfp,
  getAiRecommendation,
} = require('../controller/ProposalController');

// 1️⃣ Get proposals for an RFP
router.get("/:rfpId", getProposalsByRfp);

// 2️⃣ AI recommendation for an RFP
router.get("/recommendation/:rfpId", getAiRecommendation);

// 3️⃣ (optional) manual proposal submit
router.post("/", submitProposal);

module.exports = router;

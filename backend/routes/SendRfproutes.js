const express = require("express");
const router = express.Router();

const { sendRfpToVendors } = require('../controller/SendRfpController');

router.post("/", sendRfpToVendors);

module.exports = router;
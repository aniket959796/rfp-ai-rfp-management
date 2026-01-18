const express = require("express");
const router = express.Router();
const {
  createVendor,
  getVendors,
} = require('../controller/vendorController');

// Create vendor
router.post("/", createVendor);

// Get all vendors
router.get("/", getVendors);

module.exports = router;
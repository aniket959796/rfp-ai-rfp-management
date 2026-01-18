const Vendor = require("../models/Vendor");

const createVendor = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        error: "Vendor name and email are required",
      });
    }

    const vendor = await Vendor.create({ name, email });
    res.status(201).json(vendor);
  } catch (error) {
    console.error("Create vendor failed:", error.message);
    res.status(500).json({ error: "Failed to create vendor" });
  }
};

const getVendors = async (req, res) => {
  const vendors = await Vendor.find().sort({ createdAt: -1 });
  res.status(200).json(vendors);
};

module.exports = { createVendor, getVendors };

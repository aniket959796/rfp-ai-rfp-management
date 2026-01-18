const express = require("express");
const router = express.Router();
const {
  createRfp,
  getRfps,
} = require('../controller/RfpController');

router.post("/", createRfp);
router.get("/", getRfps);

module.exports = router;

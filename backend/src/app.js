const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('../config/dbconfig');
const { checkInbox } = require("../services/emailReceiver.service");

//  IMPORT ROUTES (IMPORTANT)
const proposalRoutes = require('../routes/Proposalroutes');
const rfpRoutes = require('../routes/Rfproutes');
const vendorRoutes = require('../routes/Vendorroutes');
const sendRfpRoutes = require('../routes/SendRfproutes');

const app = express();

// DB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Email inbox polling


let inboxRunning = false;

setInterval(async () => {
  if (inboxRunning) {
    console.log("⏭️ Inbox check skipped (already running)");
    return;
  }

  inboxRunning = true;

  try {
    await checkInbox();
  } catch (err) {
    console.error("Inbox error:", err.message);
  } finally {
    inboxRunning = false;
  }
}, 10 * 1000);
//  ROUTES (ONLY ONCE)
app.use("/proposals", proposalRoutes);
app.use("/rfps", rfpRoutes);
app.use("/vendors", vendorRoutes);
app.use("/send-rfp", sendRfpRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

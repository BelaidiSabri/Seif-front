const express = require("express");
const { getDonationCount } = require("../controllers/DonationCtrl");
const { getExchangeCount } = require("../controllers/ExchangeCtrl");
const { getTransactionStats } = require("../controllers/TransactionCtrl");
const { getUserCounts } = require("../controllers/userCtrl");
const { getProductCount } = require("../controllers/ProductCtrl");
const router = express.Router();


// Unified stats route for admin dashboard
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await getUserCounts();
    const totalProducts = await getProductCount();
    const totalDonations = await getDonationCount();
    const totalExchanges = await getExchangeCount();
    const transactionStats = await getTransactionStats();


    res.json({
      totalUsers,
      totalProducts,
      totalDonations,
      totalExchanges,
      transactionStats
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats", msg:`${error}` });
  }
});

module.exports = router;

const express = require("express");
const {
  createTransaction,
  getSellerEarnings,
  getBuyerPurchases,
} = require("../controllers/TransactionCtrl");
const auth = require("../middleware/auth");
const {
  getSellerOrders,
  getSellerPurchases,
  updatePaymentStatus,
} = require("../controllers/SellerHistoryCtrl");
const {
  getBuyerPurchaseHistory,
  getBuyerOrderDetails,
  createPurchaseReview,
} = require("../controllers/BuyerHistoryCtrl");

const router = express.Router();

router.post("/", auth, createTransaction);

router.get("/seller/:sellerId", getSellerEarnings);

router.patch("/:transactionId/payment-status",auth,updatePaymentStatus);

router.get("/buyer/:buyerId", getBuyerPurchases);

router.get("/:sellerId/orders", getSellerOrders);

// Route to get seller's purchase history
router.get("/:sellerId/purchases", getSellerPurchases);

// Get buyer's purchase history
router.get("/:buyerId/purchases", getBuyerPurchaseHistory);

// Get detailed information about a specific order
router.get("/:buyerId/orders/:orderId", getBuyerOrderDetails);

// Create a review for a purchase
router.post("/:buyerId/orders/:orderId/reviews", createPurchaseReview);

module.exports = router;

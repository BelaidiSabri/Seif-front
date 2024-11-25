const { default: mongoose } = require("mongoose");
const Product = require("../models/Product.model");
const Transaction = require("../models/Transaction.model");

// Helper functions
const validateTransactionData = (data) => {
  const { buyer, products, totalAmount, paymentMethod, paymentStatus } = data;
  
  if (!buyer || !Array.isArray(products) || products.length === 0) {
    throw new Error("Invalid transaction data");
  }

  if (totalAmount < 0) {
    throw new Error("Total amount cannot be negative");
  }

  if (!['online', 'cash'].includes(paymentMethod)) {
    throw new Error("Invalid payment method");
  }

  if (!['pending', 'completed', 'failed', 'refunded'].includes(paymentStatus)) {
    throw new Error("Invalid payment status");
  }

  return true;
};

const createTransaction = async (req, res) => {
  let session = null;
  
  try {
    // Validate basic transaction data
    validateTransactionData(req.body);
    
    const { 
      buyer, 
      products, 
      totalAmount, 
      paymentMethod, 
      paymentStatus,
      status = 'pending' 
    } = req.body;

    // Start session for transaction
    session = await mongoose.startSession();
    await session.startTransaction();

    try {
      // Create the transaction - product quantity updates will be handled by the schema middleware
      const transaction = await Transaction.create([{
        buyer,
        products,
        totalAmount,
        paymentMethod,
        paymentStatus,
        status: paymentStatus === 'completed' ? 'processing' : status
      }], { session });

      await session.commitTransaction();

      // Populate the transaction data
      const populatedTransaction = await Transaction.findById(transaction[0]._id)
        .populate([
          { path: 'buyer', select: 'name email' },
          { path: 'products.product', select: 'nom prix images' },
          { path: 'products.seller', select: 'name email' }
        ]);

      return res.status(201).json({
        success: true,
        transaction: populatedTransaction
      });

    } catch (error) {
      await session.abortTransaction();
      throw error;
    }

  } catch (error) {
    console.error('Transaction creation error:', error);
    return res.status(400).json({
      success: false,
      message: error.message
    });
  } finally {
    if (session) {
      await session.endSession();
    }
  }
};

const getSellerEarnings = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { startDate, endDate, status } = req.query;

    // Build query conditions
    const query = { 'products.seller': sellerId };
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    if (status) {
      query.status = status;
    }

    const transactions = await Transaction.find(query)
      .populate([
        { path: 'buyer', select: 'name email' },
        { path: 'products.product', select: 'nom prix images' }
      ]);

    const processedTransactions = transactions.map(transaction => ({
      ...transaction.toObject(),
      sellerAmount: transaction.getSellerTotal(sellerId)
    }));

    const totalEarnings = processedTransactions.reduce(
      (sum, t) => sum + t.sellerAmount,
      0
    );

    return res.status(200).json({
      success: true,
      totalEarnings,
      transactions: processedTransactions
    });

  } catch (error) {
    console.error('Seller earnings error:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch earnings"
    });
  }
};

const getBuyerPurchases = async (req, res) => {
  try {
    const { buyerId } = req.params;
    const { status, startDate, endDate } = req.query;

    // Build query conditions
    const query = { buyer: buyerId };
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    if (status) {
      query.status = status;
    }

    const transactions = await Transaction.find(query)
      .populate([
        { path: 'products.product', select: 'nom prix images' },
        { path: 'products.seller', select: 'name email' }
      ]);

    const totalSpent = transactions.reduce(
      (sum, t) => sum + t.totalAmount,
      0
    );

    return res.status(200).json({
      success: true,
      totalSpent,
      transactions
    });

  } catch (error) {
    console.error('Buyer purchases error:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch purchases"
    });
  }
};

// New endpoints to handle status updates
const updateTransactionStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    const transaction = await Transaction.findByIdAndUpdate(
      transactionId,
      { status },
      { new: true, runValidators: true }
    ).populate([
      { path: 'buyer', select: 'name email' },
      { path: 'products.product', select: 'nom prix images' },
      { path: 'products.seller', select: 'name email' }
    ]);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      });
    }

    return res.status(200).json({
      success: true,
      transaction
    });

  } catch (error) {
    console.error('Update transaction status error:', error);
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createTransaction,
  getSellerEarnings,
  getBuyerPurchases,
  updateTransactionStatus
};
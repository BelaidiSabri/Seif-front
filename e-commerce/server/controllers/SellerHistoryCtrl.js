const Transaction = require("../models/Transaction.model");

/**
 * Get seller's order history (orders they need to fulfill)
 */
const getSellerOrders = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { 
      paymentStatus, 
      startDate, 
      endDate, 
      page = 1, 
      limit = 10,
      sort = '-createdAt' 
    } = req.query;

    // Build query conditions
    const query = { 
      'products.seller': sellerId,
      // paymentStatus: 'completed' // Only show paid orders
    };
    
    // Add date range filter if provided
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    // Add status filter if provided
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get orders with pagination
    const orders = await Transaction.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate([
        { path: 'buyer', select: 'name email' },
        { path: 'products.product', select: 'nom prix images' }
      ]);

    // Get total count for pagination
    const totalOrders = await Transaction.countDocuments(query);

    // Process orders to only include seller's products
    const processedOrders = orders.map(order => {
      const sellerProducts = order.products.filter(
        item => item.seller.toString() === sellerId
      );
      
      return {
        ...order.toObject(),
        products: sellerProducts,
        sellerAmount: order.getSellerTotal(sellerId)
      };
    });

    // Calculate statistics
    const statistics = await calculateSellerStatistics(sellerId, query);

    return res.status(200).json({
      success: true,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders,
      statistics,
      orders: processedOrders
    });

  } catch (error) {
    console.error('Get seller orders error:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders"
    });
  }
};

/**
 * Get seller's purchase history (orders they made as a buyer)
 */
const getSellerPurchases = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { 
      paymentStatus, 
      startDate, 
      endDate, 
      page = 1, 
      limit = 10,
      sort = '-createdAt' 
    } = req.query;

    // Build query conditions
    const query = { buyer: sellerId };
    
    // Add date range filter if provided
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    // Add status filter if provided
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get purchases with pagination
    const purchases = await Transaction.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate([
        { path: 'products.product', select: 'nom prix images' },
        { path: 'products.seller', select: 'name email' }
      ]);

    // Get total count for pagination
    const totalPurchases = await Transaction.countDocuments(query);

    // Calculate purchase statistics
    const statistics = await calculatePurchaseStatistics(sellerId, query);

    return res.status(200).json({
      success: true,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalPurchases / limit),
      totalPurchases,
      statistics,
      purchases
    });

  } catch (error) {
    console.error('Get seller purchases error:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch purchases"
    });
  }
};

/**
 * Helper function to calculate seller statistics
 */
const calculateSellerStatistics = async (sellerId, baseQuery = {}) => {
  try {
    const stats = await Transaction.aggregate([
      { $match: { ...baseQuery } },
      { $unwind: '$products' },
      { $match: { 'products.seller': new mongoose.Types.ObjectId(sellerId) } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { 
            $sum: { $multiply: ['$products.price', '$products.quantity'] } 
          },
          totalProducts: { $sum: '$products.quantity' },
          averageOrderValue: { 
            $avg: { $multiply: ['$products.price', '$products.quantity'] } 
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalOrders: 1,
          totalRevenue: { $round: ['$totalRevenue', 2] },
          totalProducts: 1,
          averageOrderValue: { $round: ['$averageOrderValue', 2] }
        }
      }
    ]);

    // Get status breakdown
    const statusBreakdown = await Transaction.aggregate([
      { $match: { ...baseQuery } },
      { $unwind: '$products' },
      { $match: { 'products.seller': new mongoose.Types.ObjectId(sellerId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    return {
      ...stats[0],
      statusBreakdown: statusBreakdown.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {})
    };
  } catch (error) {
    console.error('Calculate seller statistics error:', error);
    return null;
  }
};

/**
 * Helper function to calculate purchase statistics
 */
const calculatePurchaseStatistics = async (buyerId, baseQuery = {}) => {
  try {
    const stats = await Transaction.aggregate([
      { $match: { ...baseQuery, buyer: new mongoose.Types.ObjectId(buyerId) } },
      {
        $group: {
          _id: null,
          totalPurchases: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' },
          averagePurchaseValue: { $avg: '$totalAmount' },
          totalItems: { 
            $sum: { $reduce: {
              input: '$products',
              initialValue: 0,
              in: { $add: ['$$value', '$$this.quantity'] }
            }}
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalPurchases: 1,
          totalSpent: { $round: ['$totalSpent', 2] },
          averagePurchaseValue: { $round: ['$averagePurchaseValue', 2] },
          totalItems: 1
        }
      }
    ]);

    // Get status breakdown
    const statusBreakdown = await Transaction.aggregate([
      { $match: { ...baseQuery, buyer: new mongoose.Types.ObjectId(buyerId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    return {
      ...stats[0],
      statusBreakdown: statusBreakdown.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {})
    };
  } catch (error) {
    console.error('Calculate purchase statistics error:', error);
    return null;
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { paymentStatus } = req.body;
    const sellerId = req.user.id; // Assuming authentication middleware adds user

    // Validate input
    if (!['pending', 'completed'].includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status"
      });
    }

    // Find the transaction and ensure the seller is authorized
    const transaction = await Transaction.findOne({
      _id: transactionId,
      'products.seller': sellerId
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found or unauthorized"
      });
    }

    // Update payment status
    transaction.paymentStatus = paymentStatus;
    await transaction.save();

    return res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      transaction
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to update payment status"
    });
  }
};


module.exports = {
  getSellerOrders,
  getSellerPurchases,
  updatePaymentStatus
};
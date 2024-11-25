const Transaction = require("../models/Transaction.model");
const mongoose = require("mongoose");

/**
 * Get buyer's purchase history with detailed analytics
 */
const getBuyerPurchaseHistory = async (req, res) => {
  try {
    const { buyerId } = req.params;
    const { 
      paymentStatus, 
      startDate, 
      endDate, 
      page = 1, 
      limit = 10,
      sort = '-createdAt',
      seller, // Optional: filter by seller
      minAmount, // Optional: filter by minimum amount
      maxAmount  // Optional: filter by maximum amount
    } = req.query;

    // Build query conditions
    const query = { buyer: buyerId };
    
    // Add date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    // Add status filter
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    // Add seller filter
    if (seller) {
      query['products.seller'] = seller;
    }

    // Add amount range filter
    if (minAmount || maxAmount) {
      query.totalAmount = {};
      if (minAmount) query.totalAmount.$gte = parseFloat(minAmount);
      if (maxAmount) query.totalAmount.$lte = parseFloat(maxAmount);
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get purchases with pagination
    const purchases = await Transaction.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate([
        { 
          path: 'products.product',
          select: 'nom prix images description'
        },
        { 
          path: 'products.seller',
          select: 'name email profileImage'
        }
      ]);

    // Get total count for pagination
    const totalPurchases = await Transaction.countDocuments(query);

    // Calculate purchase analytics
    const analytics = await calculateBuyerAnalytics(buyerId, query);

    return res.status(200).json({
      success: true,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalPurchases / limit),
      totalPurchases,
      analytics,
      purchases
    });

  } catch (error) {
    console.error('Get buyer purchase history error:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch purchase history"
    });
  }
};

/**
 * Get detailed information about a specific order
 */
const getBuyerOrderDetails = async (req, res) => {
  try {
    const { buyerId, orderId } = req.params;

    const order = await Transaction.findOne({
      _id: orderId,
      buyer: buyerId
    }).populate([
      { 
        path: 'products.product',
        select: 'nom prix images description'
      },
      { 
        path: 'products.seller',
        select: 'name email profileImage'
      }
    ]);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Group products by seller
    const productsBySeller = order.products.reduce((acc, item) => {
      const sellerId = item.seller._id.toString();
      if (!acc[sellerId]) {
        acc[sellerId] = {
          seller: item.seller,
          products: [],
          subtotal: 0
        };
      }
      acc[sellerId].products.push(item);
      acc[sellerId].subtotal += item.price * item.quantity;
      return acc;
    }, {});

    return res.status(200).json({
      success: true,
      order: {
        ...order.toObject(),
        productsBySeller: Object.values(productsBySeller)
      }
    });

  } catch (error) {
    console.error('Get buyer order details error:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order details"
    });
  }
};

/**
 * Get buyer's purchase analytics and statistics
 */
const calculateBuyerAnalytics = async (buyerId, baseQuery = {}) => {
  try {
    const stats = await Transaction.aggregate([
      { 
        $match: { 
          ...baseQuery,
          buyer: new mongoose.Types.ObjectId(buyerId) 
        } 
      },
      {
        $group: {
          _id: null,
          totalPurchases: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' },
          averageOrderValue: { $avg: '$totalAmount' },
          totalItems: {
            $sum: {
              $reduce: {
                input: '$products',
                initialValue: 0,
                in: { $add: ['$$value', '$$this.quantity'] }
              }
            }
          },
          minOrderValue: { $min: '$totalAmount' },
          maxOrderValue: { $max: '$totalAmount' }
        }
      },
      {
        $project: {
          _id: 0,
          totalPurchases: 1,
          totalSpent: { $round: ['$totalSpent', 2] },
          averageOrderValue: { $round: ['$averageOrderValue', 2] },
          totalItems: 1,
          minOrderValue: { $round: ['$minOrderValue', 2] },
          maxOrderValue: { $round: ['$maxOrderValue', 2] }
        }
      }
    ]);

    // Get purchase trends by month
    const monthlyTrends = await Transaction.aggregate([
      { 
        $match: { 
          ...baseQuery,
          buyer: new mongoose.Types.ObjectId(buyerId) 
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalSpent: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    // Get favorite sellers
    const favoriteSellers = await Transaction.aggregate([
      { 
        $match: { 
          ...baseQuery,
          buyer: new mongoose.Types.ObjectId(buyerId) 
        } 
      },
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.seller',
          orderCount: { $sum: 1 },
          totalSpent: { 
            $sum: { $multiply: ['$products.price', '$products.quantity'] }
          }
        }
      },
      { $sort: { orderCount: -1 } },
      { $limit: 5 }
    ]);

    // Get status breakdown
    const statusBreakdown = await Transaction.aggregate([
      { 
        $match: { 
          ...baseQuery,
          buyer: new mongoose.Types.ObjectId(buyerId) 
        } 
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    return {
      ...stats[0],
      monthlyTrends: monthlyTrends.map(trend => ({
        year: trend._id.year,
        month: trend._id.month,
        totalSpent: Math.round(trend.totalSpent * 100) / 100,
        orderCount: trend.orderCount
      })),
      favoriteSellers,
      statusBreakdown: statusBreakdown.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {})
    };
  } catch (error) {
    console.error('Calculate buyer analytics error:', error);
    return null;
  }
};

/**
 * Create a review for a purchase
 */
const createPurchaseReview = async (req, res) => {
  try {
    const { buyerId, orderId } = req.params;
    const { productId, rating, comment } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5"
      });
    }

    // Find the order and verify ownership
    const order = await Transaction.findOne({
      _id: orderId,
      buyer: buyerId,
      status: 'delivered' // Only allow reviews for delivered orders
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or not eligible for review"
      });
    }

    // Verify the product was part of the order
    const orderProduct = order.products.find(
      p => p.product.toString() === productId
    );

    if (!orderProduct) {
      return res.status(400).json({
        success: false,
        message: "Product not found in this order"
      });
    }

    // Create the review (assuming you have a Review model)
    const review = await Review.create({
      order: orderId,
      product: productId,
      buyer: buyerId,
      seller: orderProduct.seller,
      rating,
      comment,
      verifiedPurchase: true
    });

    return res.status(201).json({
      success: true,
      review
    });

  } catch (error) {
    console.error('Create purchase review error:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to create review"
    });
  }
};

module.exports = {
  getBuyerPurchaseHistory,
  getBuyerOrderDetails,
  createPurchaseReview
};
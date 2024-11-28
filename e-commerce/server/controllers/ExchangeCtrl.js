const Exchange = require("../models/Exchange.model");
const NotificationModel = require("../models/Notification.model");
const mongoose = require('mongoose');
const Product = require("../models/Product.model");
const { createExchangeNotification } = require("./NotificationCtrl");

// Propose a new exchange
exports.proposeExchange = async (req, res) => {
  const { productOfferedId, productRequestedId } = req.body;

  try {
    // Verify both products exist and are available
    const [offeredProduct, requestedProduct] = await Promise.all([
      Product.findById(productOfferedId),
      Product.findById(productRequestedId)
    ]);
    
    

    if (!offeredProduct || !requestedProduct) {
      return res.status(404).json({ message: "One or both products not found" });
    }

    // Verify products are available for exchange
    if (offeredProduct.status !== "echange" || requestedProduct.status !== "echange") {
      return res.status(400).json({ message: "One or both products are not available for exchange" });
    }

    // Verify user owns the offered product
    if (offeredProduct.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only offer products you own" });
    }

    // Check if there's already a pending exchange between these products
    const existingExchange = await Exchange.findOne({
      productOffered: productOfferedId,
      productRequested: productRequestedId,
      status: "pending"
    });

    if (existingExchange) {
      return res.status(400).json({ message: "An exchange proposal already exists for these products" });
    }

    // Create new exchange proposal
    const exchange = new Exchange({
      productOffered: productOfferedId,
      productRequested: productRequestedId,
      offeredBy: req.user.id,
      requestedTo: requestedProduct.user,
      status: "pending"
    });

    await exchange.save();

    // Create notification for product owner
    await NotificationModel.create({
      user: requestedProduct.user,
      message: `New exchange proposal received for your product "${requestedProduct.nom}"`,
      type: 'exchange_requested', // Use a valid type here
      exchange: exchange._id, // Add the exchange reference here
    });
    

    res.status(201).json({ 
      message: "Exchange proposal created successfully",
      exchange: await exchange.populate([
        'productOffered',
        'productRequested',
        'offeredBy',
        'requestedTo'
      ])
    });

  } catch (error) {
    console.error('Propose Exchange Error:', error);
    res.status(500).json({ 
      message: "Error creating exchange proposal",
      error: error.message 
    });
  }
};

// Get exchanges proposed to the user
exports.getExchanges = async (req, res) => {
  try {
    const exchanges = await Exchange.find({
      $or: [
        { requestedTo: req.user.id },
        { offeredBy: req.user.id }
      ]
    })
    .populate('productOffered')
    .populate('productRequested')
    .populate('offeredBy', 'username email')
    .populate('requestedTo', 'username email');

    // Add role and available actions for each exchange
    const exchangesWithRoles = exchanges.map(exchange => {
      const isRequester = exchange.offeredBy._id.toString() === req.user.id;
      const isRecipient = exchange.requestedTo._id.toString() === req.user.id;
      
      return {
        ...exchange.toObject(),
        userRole: isRequester ? 'requester' : 'recipient',
        // Only allow actions on pending exchanges
        actions: exchange.status === 'pending' ? {
          canAccept: isRecipient,
          canDecline: isRecipient,
          canCancel: isRequester
        } : {
          canAccept: false,
          canDecline: false,
          canCancel: false
        }
      };
    });

    res.status(200).json({ exchanges: exchangesWithRoles });
  } catch (error) {
    console.error('Get Exchanges Error:', error);
    res.status(500).json({ message: 'Error fetching exchanges', error: error.message });
  }
};

// Add cancel exchange functionality
exports.cancelExchange = async (req, res) => {
  const exchangeId = req.params.id;

  try {
    const exchange = await Exchange.findById(exchangeId)
      .populate('productOffered')
      .populate('productRequested')
      .populate('offeredBy')
      .populate('requestedTo');

    if (!exchange) {
      return res.status(404).json({ message: "Exchange not found" });
    }

    // Verify user is the one who proposed the exchange
    if (exchange.offeredBy._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to cancel this exchange" });
    }

    // Verify exchange is still pending
    if (exchange.status !== "pending") {
      return res.status(400).json({ message: "Can only cancel pending exchanges" });
    }

    exchange.status = "cancelled";
    await exchange.save();

    // Notify the recipient
    await NotificationModel.create({
      user: exchange.requestedTo._id,
      message: `Exchange proposal for "${exchange.productRequested.nom}" was cancelled by the requester`,
      type: 'exchange_update'
    });

    res.status(200).json({ 
      message: "Exchange cancelled successfully",
      exchange: exchange.toObject()
    });

  } catch (error) {
    console.error('Cancel Exchange Error:', error);
    res.status(500).json({ 
      message: "Error cancelling exchange",
      error: error.message 
    });
  }
};

exports.updateExchangeStatus = async (req, res) => {
  const { status } = req.body;
  const exchangeId = req.params.id;

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const exchange = await Exchange.findById(exchangeId)
        .populate('productOffered')
        .populate('productRequested')
        .populate('offeredBy')
        .populate('requestedTo');

      if (!exchange) {
        await session.abortTransaction();
        return res.status(404).json({ message: "Exchange not found" });
      }

      if (exchange.requestedTo._id.toString() !== req.user.id) {
        await session.abortTransaction();
        return res.status(403).json({ message: "Not authorized to update this exchange" });
      }

      if (exchange.status !== "pending") {
        await session.abortTransaction();
        return res.status(400).json({ message: "Exchange is no longer pending" });
      }

      const [offeredProduct, requestedProduct] = await Promise.all([
        Product.findById(exchange.productOffered).session(session),
        Product.findById(exchange.productRequested).session(session)
      ]);

      if (!offeredProduct || !requestedProduct) {
        await session.abortTransaction();
        return res.status(404).json({ message: "One or both products no longer exist" });
      }

      if (offeredProduct.status !== "echange" || requestedProduct.status !== "echange") {
        await session.abortTransaction();
        return res.status(400).json({ message: "One or both products are no longer available for exchange" });
      }

      if (status === "accepted") {
        await Promise.all([
          Product.findByIdAndUpdate(
            exchange.productOffered._id,
            { status: "exchanged", user: exchange.requestedTo._id },
            { session }
          ),
          Product.findByIdAndUpdate(
            exchange.productRequested._id,
            { status: "exchanged", user: exchange.offeredBy._id },
            { session }
          ),
          Exchange.updateMany(
            {
              _id: { $ne: exchangeId },
              status: "pending",
              $or: [
                { productOffered: { $in: [exchange.productOffered._id, exchange.productRequested._id] } },
                { productRequested: { $in: [exchange.productOffered._id, exchange.productRequested._id] } }
              ]
            },
            { status: "cancelled" },
            { session }
          )
        ]);
      }

      exchange.status = status;
      await exchange.save({ session });

      // Create notifications based on the status (accepted or rejected)
      const notificationType = status === "accepted" ? 'exchange_accepted' : 'exchange_rejected';
      await Promise.all([
        createExchangeNotification(exchange, notificationType),  // Only accepted or rejected
        status === "cancelled" && createExchangeNotification(exchange, 'exchange_cancelled')  // Cancelled only if status is cancelled
      ]);

      await session.commitTransaction();

      res.status(200).json({
        message: `Exchange ${status} successfully`,
        exchange: exchange.toObject()
      });

    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Update Exchange Status Error:', error);
    res.status(500).json({
      message: "Error updating exchange status",
      error: error.message || "Internal server error"
    });
  }
};



// Update exchange status (accept/reject)
/* exports.updateExchangeStatus = async (req, res) => {
  const { status } = req.body;
  const exchangeId = req.params.id;

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const exchange = await Exchange.findById(exchangeId)
        .populate('productOffered')
        .populate('productRequested')
        .populate('offeredBy')
        .populate('requestedTo');

      if (!exchange) {
        await session.abortTransaction();
        return res.status(404).json({ message: "Exchange not found" });
      }

      if (exchange.requestedTo._id.toString() !== req.user.id) {
        await session.abortTransaction();
        return res.status(403).json({ message: "Not authorized to update this exchange" });
      }

      if (exchange.status !== "pending") {
        await session.abortTransaction();
        return res.status(400).json({ message: "Exchange is no longer pending" });
      }

      const [offeredProduct, requestedProduct] = await Promise.all([
        Product.findById(exchange.productOffered).session(session),
        Product.findById(exchange.productRequested).session(session)
      ]);

      if (!offeredProduct || !requestedProduct) {
        await session.abortTransaction();
        return res.status(404).json({ message: "One or both products no longer exist" });
      }

      if (offeredProduct.status !== "echange" || requestedProduct.status !== "echange") {
        await session.abortTransaction();
        return res.status(400).json({ message: "One or both products are no longer available for exchange" });
      }

      if (status === "accepted") {
        await Promise.all([
          Product.findByIdAndUpdate(
            exchange.productOffered._id,
            { 
              status: "exchanged", 
              user: exchange.requestedTo._id
            },
            { session }
          ),
          Product.findByIdAndUpdate(
            exchange.productRequested._id,
            { 
              status: "exchanged", 
              user: exchange.offeredBy._id
            },
            { session }
          ),
          // Cancel all other pending exchanges involving either product
          Exchange.updateMany(
            {
              _id: { $ne: exchangeId },
              status: "pending",
              $or: [
                { productOffered: { $in: [exchange.productOffered._id, exchange.productRequested._id] } },
                { productRequested: { $in: [exchange.productOffered._id, exchange.productRequested._id] } }
              ]
            },
            { status: "cancelled" },
            { session }
          )
        ]);
      }

      exchange.status = status;
      await exchange.save({ session });

      await NotificationModel.insertMany([
        {
          user: exchange.offeredBy._id,
          message: `Your exchange proposal for "${exchange.productRequested.nom}" was ${status}`,
          type: 'exchange_update'
        },
        {
          user: exchange.requestedTo._id,
          message: `You have ${status} the exchange proposal for "${exchange.productRequested.nom}"`,
          type: 'exchange_update'
        }
      ], { session });

      await session.commitTransaction();
      
      res.status(200).json({ 
        message: `Exchange ${status} successfully`, 
        exchange: exchange.toObject() 
      });

    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

  } catch (error) {
    console.error('Update Exchange Status Error:', error);
    res.status(500).json({ 
      message: "Error updating exchange status", 
      error: error.message || "Internal server error" 
    });
  }
}; */

// Delete all exchanges
exports.deleteAllExchanges = async (req, res) => {
  try {
    await Exchange.deleteMany({});
    res.status(200).json({ message: "All exchanges deleted successfully" });
  } catch (error) {
    console.error('Delete All Exchanges Error:', error);
    res.status(500).json({ 
      message: "Error deleting exchanges",
      error: error.message 
    });
  }
};

// Get the total count of all exchanges
// Get the total count of exchanges and a breakdown by status
exports.getExchangeCount = async () => {
  try {
    // Aggregation pipeline to get the total count and breakdown by status
    const [stats] = await Exchange.aggregate([
      {
        $group: {
          _id: null,
          totalExchanges: { $sum: 1 },
          pendingCount: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
          },
          acceptedCount: {
            $sum: { $cond: [{ $eq: ["$status", "accepted"] }, 1, 0] }
          },
          rejectedCount: {
            $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] }
          }
        }
      }
    ]);

    return {
      totalExchanges: stats?.totalExchanges || 0,
      pendingCount: stats?.pendingCount || 0,
      acceptedCount: stats?.acceptedCount || 0,
      rejectedCount: stats?.rejectedCount || 0
    };
  } catch (error) {
    throw new Error(`Failed to get exchange counts: ${error.message}`);
  }
};



module.exports = exports;
const Exchange = require("../models/Exchange.model");
const NotificationModel = require("../models/Notification.model");
const Product = require("../models/Product.model");

// Propose an exchange
exports.proposeExchange = async (req, res) => {
  const { productOffered, productRequested } = req.body;

  try {
    const requestedProduct = await Product.findById(productRequested);
    const offeredProduct = await Product.findById(productOffered);
    console.log('req',requestedProduct);
    console.log("off", offeredProduct);
    

    if (!requestedProduct || !offeredProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (requestedProduct.status !== "echange" || offeredProduct.status !== "echange") {
      return res.status(400).json({ message: "One or both products are not available for exchange" });
    }

    const exchange = new Exchange({
      productOffered,
      productRequested,
      offeredBy: req.user.id,
      requestedTo: requestedProduct.user,
      status: "pending",
    });

    await exchange.save();

    // Notification for the requested product owner
    const notification = new NotificationModel({
      user: requestedProduct.user,
      message: `User ${req.user.name} has proposed an exchange for your product "${requestedProduct.nom}".`,
    });
    await notification.save();

    res.status(201).json({ message: "Exchange proposed successfully.", exchange });
  } catch (error) {
    console.error("Propose Exchange Error:", error);
    res.status(500).json({ message: "Error proposing exchange", error: error.message || error });
  }
  
};


// Get all exchange proposals for a user
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

    res.status(200).json({ exchanges });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exchanges', error });
  }
};

// Accept or reject an exchange
exports.updateExchangeStatus = async (req, res) => {
  const { status } = req.body; // 'accepted' or 'rejected'
  const exchangeId = req.params.id;

  try {
    const session = await Exchange.startSession();
    session.startTransaction();

    try {
      const exchange = await Exchange.findById(exchangeId)
        .populate("productOffered")
        .populate("productRequested");

      if (!exchange) {
        await session.abortTransaction();
        return res.status(404).json({ message: "Exchange not found" });
      }

      if (exchange.status !== "pending") {
        await session.abortTransaction();
        return res.status(400).json({ message: "Exchange is no longer pending" });
      }

      if (status === "accepted") {
        await Product.findByIdAndUpdate(
          exchange.productOffered,
          { status: "exchanged", user: exchange.requestedTo },
          { session }
        );

        await Product.findByIdAndUpdate(
          exchange.productRequested,
          { status: "exchanged", user: exchange.offeredBy },
          { session }
        );

        await Exchange.updateMany(
          {
            _id: { $ne: exchangeId },
            status: "pending",
            $or: [
              { productOffered: exchange.productOffered },
              { productOffered: exchange.productRequested },
              { productRequested: exchange.productOffered },
              { productRequested: exchange.productRequested },
            ],
          },
          { status: "cancelled" },
          { session }
        );
      }

      exchange.status = status;
      await exchange.save({ session });

      // Notifications for both participants
      const notifications = [
        {
          user: exchange.offeredBy,
          message: `Your exchange proposal for "${exchange.productRequested.name}" was ${status}.`,
        },
        {
          user: exchange.requestedTo,
          message: `You have ${status} the exchange proposal for "${exchange.productRequested.name}".`,
        },
      ];

      await Notification.insertMany(notifications, { session });

      await session.commitTransaction();
      res.status(200).json({ message: `Exchange ${status} successfully`, exchange });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating exchange status", error });
  }
};

// Delete all exchanges
exports.deleteAllExchanges = async (req, res) => {
  try {
    await Exchange.deleteMany({});
    res.status(200).json({ message: "All exchanges deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting exchanges", error });
  }
};


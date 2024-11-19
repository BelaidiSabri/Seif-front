const Exchange = require("../models/Exchange.model");
const Product = require("../models/Product.model");

// Propose an exchange
exports.proposeExchange = async (req, res) => {
  const { productOffered, productRequested } = req.body;

  try {
    const requestedProduct = await Product.findById(productRequested);
    const offeredProduct = await Product.findById(productOffered);
    
    if (!requestedProduct || !offeredProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Verify both products are available for exchange
    if (requestedProduct.status !== 'echange' || offeredProduct.status !== 'echange') {
      return res.status(400).json({ message: 'One or both products are not available for exchange' });
    }

    const exchange = new Exchange({
      productOffered,
      productRequested,
      offeredBy: req.user.id,
      requestedTo: requestedProduct.user,
      status: 'pending'
    });

    await exchange.save();
    res.status(201).json({ message: 'Exchange proposed successfully.', exchange });
  } catch (error) {
    res.status(500).json({ message: 'Error proposing exchange', error });
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
  const { status } = req.body;
  const exchangeId = req.params.id;

  try {
    // Start a session for the transaction
    const session = await Exchange.startSession();
    session.startTransaction();

    try {
      // Find and update the exchange
      const exchange = await Exchange.findById(exchangeId)
        .populate('productOffered')
        .populate('productRequested');

      if (!exchange) {
        await session.abortTransaction();
        return res.status(404).json({ message: 'Exchange not found' });
      }

      if (exchange.status !== 'pending') {
        await session.abortTransaction();
        return res.status(400).json({ message: 'Exchange is no longer pending' });
      }

      // If accepting the exchange
      if (status === 'accepted') {
        // Update both products' status and ownership
        await Product.findByIdAndUpdate(
          exchange.productOffered,
          { 
            status: 'exchanged',
            user: exchange.requestedTo
          },
          { session }
        );

        await Product.findByIdAndUpdate(
          exchange.productRequested,
          { 
            status: 'exchanged',
            user: exchange.offeredBy
          },
          { session }
        );

        // Cancel all other pending exchanges for both products
        await Exchange.updateMany(
          {
            _id: { $ne: exchangeId },
            status: 'pending',
            $or: [
              { productOffered: exchange.productOffered },
              { productOffered: exchange.productRequested },
              { productRequested: exchange.productOffered },
              { productRequested: exchange.productRequested }
            ]
          },
          { status: 'cancelled' },
          { session }
        );
      }

      // Update the exchange status
      exchange.status = status;
      await exchange.save({ session });

      // Commit the transaction
      await session.commitTransaction();
      res.status(200).json({ 
        message: `Exchange ${status} successfully`,
        exchange
      });

    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

  } catch (error) {
    res.status(500).json({ message: 'Error updating exchange status', error });
  }
};
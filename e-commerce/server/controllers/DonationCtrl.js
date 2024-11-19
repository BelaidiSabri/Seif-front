const DonationRequest = require("../models/Donation.model");

// Request a donation
exports.requestDonation = async (req, res) => {
  const { product } = req.body;

  try {
    const donation = new DonationRequest({
      product,
      requestedBy: req.user._id
    });
    await donation.save();
    res.status(201).json({ message: 'Donation request sent.', donation });
  } catch (error) {
    res.status(500).json({ message: 'Error requesting donation', error });
  }
};

// Get donation requests for a user
exports.getDonationRequests = async (req, res) => {
  try {
    const donations = await DonationRequest.find({ product: { $in: req.user.products } })
      .populate('product');
    res.status(200).json({ donations });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donation requests', error });
  }
};

// Accept or reject a donation request
exports.updateDonationStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const donation = await DonationRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!donation) return res.status(404).json({ message: 'Donation request not found' });

    res.status(200).json({ message: 'Donation status updated', donation });
  } catch (error) {
    res.status(500).json({ message: 'Error updating donation request', error });
  }
};

const express = require('express');
const router = express.Router();
const donationController = require('../controllers/DonationCtrl');
const auth = require('../middleware/auth');

// Propose a donation
router.post('/', auth, donationController.requestDonation);

// Get all donation proposals for the current user
router.get('/', auth, donationController.getDonations);

// Update donation status (accept/reject)
router.patch('/:id', auth, donationController.updateDonationStatus);

// Delete all donations (optional for testing or admin purposes)
router.delete('/', donationController.deleteAllDonations);

// Cancel a donation
router.post('/:id/cancel', auth, donationController.cancelDonation);

module.exports = router;

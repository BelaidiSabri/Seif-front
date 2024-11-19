const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const donationController = require('../controllers/DonationCtrl')

// Request a donation
router.post('/donate', auth, donationController.requestDonation);

// Get all donation requests for the current user
router.get('/donate', auth, donationController.getDonationRequests);

// Update donation status (accept/reject)
router.patch('/donate/:id', auth, donationController.updateDonationStatus);

module.exports = router;

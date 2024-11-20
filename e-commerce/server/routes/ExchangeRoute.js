const express = require('express');
const router = express.Router();
const exchangeController = require('../controllers/ExchangeCtrl');
const auth = require('../middleware/auth');

// Propose an exchange
router.post('/exchange', auth, exchangeController.proposeExchange);

// Get all exchange proposals for the current user
router.get('/exchange', auth, exchangeController.getExchanges);

// Update exchange status (accept/reject)
router.patch('/exchange/:id', auth, exchangeController.updateExchangeStatus);

router.delete('/exchange', exchangeController.deleteAllExchanges);

router.post('/exchange/:id/cancel', auth, exchangeController.cancelExchange);


module.exports = router;

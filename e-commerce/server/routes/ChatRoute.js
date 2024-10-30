const router = require("express").Router();
const chatCtrl = require('../controllers/ChatCtrl');
const auth = require('../middleware/auth');

router.post('/send', auth, chatCtrl.sendMessage);
router.get('/messages', chatCtrl.getMessages);

module.exports = router;

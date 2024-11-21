const router = require("express").Router();
const userCtrl = require("../controllers/userCtrl");
const auth = require('../middleware/auth');

// User registration and login
router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.delete('/delete-all', userCtrl.deleteAllUsers);

// Password reset routes
router.post('/forgot-password', userCtrl.forgotPassword);
router.post('/reset-password', userCtrl.resetPassword);

// Get user information
router.get('/infor', auth, userCtrl.getUser);
router.get('/all' , userCtrl.getAllUsers)
// Delete user
router.delete('/deleteusers/:id', userCtrl.deleteUser);

// Update user
router.put('/updateusers/:id', auth, userCtrl.updateUser);

// Cart management
router.post('/cart/add', auth, userCtrl.addToCart);
router.post('/cart/remove', auth, userCtrl.removeFromCart);

// Order management
router.post('/order/place', auth, userCtrl.placeOrder);
router.get('/orders', auth, userCtrl.getAllOrders);
router.get('/contacts/:userId', userCtrl.getContacts);
router.post('/add-contact', userCtrl.addContact);
router.get('/search', userCtrl.searchUser);
module.exports = router;

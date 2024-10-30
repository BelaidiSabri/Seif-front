const router = require('express').Router();
const categoryCtrl = require('../controllers/CategoryCtrl');
const auth = require('../middleware/auth');

router.post('/category', auth, categoryCtrl.createCategory);
router.get('/category/:id', auth, categoryCtrl.getCategory);
router.get('/categories', auth, categoryCtrl.getAllCategories);
router.put('/category/:id', auth, categoryCtrl.updateCategory);
router.delete('/category/:id', auth, categoryCtrl.deleteCategory);
module.exports = router;

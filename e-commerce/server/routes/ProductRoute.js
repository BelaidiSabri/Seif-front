const router = require('express').Router();
const productCtrl = require('../controllers/ProductCtrl');
const auth = require('../middleware/auth');

router.post('/', auth, productCtrl.createProduct);
router.get('/:id', auth, productCtrl.getProduct);
router.get('/', productCtrl.getAllProducts);
router.put('/:id', auth, productCtrl.updateProduct);
router.delete('/:id', auth, productCtrl.deleteProduct);
router.get('/user/getAll', auth, productCtrl.getUserProducts);

module.exports = router;

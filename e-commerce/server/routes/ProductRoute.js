const router = require('express').Router();
const productCtrl = require('../controllers/ProductCtrl');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

/*
 * Public Routes
 * These routes don't require authentication
 */

// Get all products with filtering and pagination
router.get('/products', productCtrl.getAllProducts);

// Get single product details
router.get('/product/:id', productCtrl.getProduct);

// Search products
router.get('/search', productCtrl.searchProducts);

// Get nearby products based on geolocation
router.get('/nearby', productCtrl.getNearbyOffers);

// Filter products by category
router.get('/category/:category', productCtrl.getAllProducts);

// Filter products by city
router.get('/city/:city', productCtrl.getAllProducts);

/*
 * Protected Routes
 * These routes require authentication
 */

// Create new product with images
router.post(
  '/', 
  auth, 
  upload.array('images', 5), // Allow up to 5 images
  productCtrl.createProduct
);

// Update product with optional image updates
router.put(
  '/update/:id', 
  auth, 
  upload.array('images', 5),
  productCtrl.updateProduct
);

// Delete product and its images
router.delete('/delete/:id', auth, productCtrl.deleteProduct);

// Get logged-in user's products
router.get('/user/products', auth, productCtrl.getUserProducts);

/*
 * Alternative URL patterns for the same endpoints
 * These provide flexibility in how you structure your API
 */

// Alternative product routes
router.get('/', productCtrl.getAllProducts);                    // Get all products
router.get('/:id', productCtrl.getProduct);                    // Get single product
router.post('/', auth, upload.array('images', 5), productCtrl.createProduct);    // Create product
router.put('/:id', auth, upload.array('images', 5), productCtrl.updateProduct);  // Update product
router.delete('/:id', auth, productCtrl.deleteProduct);         // Delete product

// Filter routes with query parameters
router.get('/filter/price-range', productCtrl.getAllProducts);  // Filter by price range
router.get('/filter/date-range', productCtrl.getAllProducts);   // Filter by date range
router.get('/filter/status/:status', productCtrl.getAllProducts); // Filter by status

/*
 * Special Routes
 * These routes handle specific features or requirements
 */

// Featured products
router.get('/featured/products', productCtrl.getAllProducts);

// Recently added products
router.get('/recent/products', productCtrl.getAllProducts);

// Popular products
router.get('/popular/products', productCtrl.getAllProducts);

// Products statistics
router.get('/stats/user/:userId', auth, productCtrl.getUserProducts);
router.get('/stats/category/:category', productCtrl.getAllProducts);

/**
 * Batch Operations
 * These routes handle multiple products at once
 */

// Batch update products
router.put('/batch/update', auth, productCtrl.updateProduct);

// Batch delete products
router.delete('/batch/delete', auth, productCtrl.deleteProduct);

module.exports = router;

/*
 * Example Usage:
 *
 * // Get all products
 * GET /api/products?page=1&limit=10
 *
 * // Get products with filters
 * GET /api/products?category=electronics&city=Paris&minPrice=100&maxPrice=1000
 *
 * // Search products
 * GET /api/search?query=smartphone&page=1&limit=10
 *
 * // Get nearby products
 * GET /api/nearby?longitude=2.3522&latitude=48.8566&maxDistance=5000
 *
 * // Create product
 * POST /api/create
 * Headers: 
 *   - Authorization: Bearer <token>
 *   - Content-Type: multipart/form-data
 * Body: FormData with product details and images
 *
 * // Update product
 * PUT /api/update/:id
 * Headers:
 *   - Authorization: Bearer <token>
 *   - Content-Type: multipart/form-data
 * Body: FormData with updated details and/or new images
 *
 * // Delete product
 * DELETE /api/delete/:id
 * Headers:
 *   - Authorization: Bearer <token>
 *
 * // Get user products
 * GET /api/user/products?page=1&limit=10
 * Headers:
 *   - Authorization: Bearer <token>
 */
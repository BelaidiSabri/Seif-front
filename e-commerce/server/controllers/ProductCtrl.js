const Donation = require('../models/Donation.model');
const Exchange = require('../models/Exchange.model');
const Product = require('../models/Product.model');
const User = require('../models/User.model');
const fs = require('fs').promises;
const path = require('path');

const productCtrl = {
  createProduct: async (req, res) => {
    try {
      const { 
        nom, description, prix, quantityDispo, communauté, adresse, 
        status, numtel, categorie, ville, coordinates 
      } = req.body;
      
      const userId = req.user.id;

      // Handle uploaded files
      let images = [];
      if (req.files) {
        images = req.files.map(file => `/uploads/products/${file.filename}`);
      }

      // Transform coordinates if they exist
      let transformedCoordinates = [];

      // Ensure coordinates is a proper object, not a string
      let coordsObj = coordinates;
      if (typeof coordinates === 'string') {
          try {
              coordsObj = JSON.parse(coordinates);
          } catch (e) {
              return res.status(400).json({ msg: "Invalid coordinates format" });
          }
      }
      
      if (coordsObj && typeof coordsObj.lat === 'number' && typeof coordsObj.lng === 'number') {
          transformedCoordinates = [coordsObj.lng, coordsObj.lat];
      } else {
          return res.status(400).json({ msg: "Coordinates are required and must include both latitude and longitude." });
      }
      
      
    

      // Create a new product with transformed coordinates and images
      const newProduct = new Product({ 
        nom,
        description,
        prix,
        quantityDispo,
        communauté,
        adresse,
        images,
        status,
        numtel,
        categorie,
        ville,
        coordinates: transformedCoordinates,
        user: userId // Associate the product with the user
      });
      
      await newProduct.save();

      // Update the user's product list
      await User.findByIdAndUpdate(userId, { $push: { products: newProduct._id } });

      res.json({ msg: "Product created", newProduct });
    } catch (error) {
      // Delete uploaded files if product creation fails
      if (req.files) {
        req.files.forEach(file => {
          fs.unlink(file.path, err => {
            if (err) console.error('Error deleting file:', err);
          });
        });
      }
      return res.status(500).json({ msg: error.message });
    }
  },

  getProduct: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id)
        .populate('user', 'username email'); // Populate user details if needed

      if (!product) {
        return res.status(404).json({ msg: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  getAllProducts: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 12,
        category,
        ville,
        minPrice,
        maxPrice,
        search,
        status,
        userProducts,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;
  
      // Build query filter
      const filter = {
        // Exclude 'exchanged' products by default
        status: { $ne: 'exchanged' }
      };
  
      // Category filter
      if (category) filter.categorie = category;
  
      // City filter
      if (ville) filter.ville = ville;
  
      // Status filter
      if (status) {
        switch(status) {
          case 'exchanged':
            filter.status = 'exchanged';
            break;
          case 'vente':
            filter.status = 'vente';
            break;
          case 'don':
            filter.status = 'don';
            break;
          default:
            filter.status = status;
        }
      }
  
      // Price range filter
if (minPrice || maxPrice) {
  filter.$or = [
    // Price within specified range
    {
      prix: {
        ...(minPrice && { $gte: Number(minPrice) }),
        ...(maxPrice && { $lte: Number(maxPrice) })
      }
    },
    // Include products with no price (exchange or donation)
    ...(minPrice === '0' ? [
      { prix: { $exists: false } },
      { prix: null },
      { status: { $in: ['echange', 'don'] } }
    ] : [])
  ];
}
  
      // User products filter
      if (userProducts !== undefined && req.user) {
        if (userProducts === 'false') {
          // Exclude user's own products
          filter.user = { $ne: req.user.id };
        }
        // If userProducts is not 'false', it will show all products (including user's)
      }
  
      // Search filter with advanced matching
      if (search) {
        filter.$or = [
          { nom: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { categorie: { $regex: search, $options: 'i' } }
        ];
  
        // Combine search with other filters if category is specified
        if (category) {
          filter.$and = [
            { $or: [
              { nom: { $regex: search, $options: 'i' } },
              { description: { $regex: search, $options: 'i' } },
              { categorie: { $regex: search, $options: 'i' } }
            ]},
            { categorie: category }
          ];
        }
      }
  
      // Sorting options
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
  
      // Execute query with pagination and population
      const products = await Product.find(filter)
        .populate('user', 'username email')
        .limit(Number(limit))
        .skip((page - 1) * Number(limit))
        .sort(sort);
  
      // Get total documents count
      const totalProducts = await Product.countDocuments(filter);
  
      res.json({
        products,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: Number(page),
        totalProducts,
        pageSize: Number(limit)
      });
    } catch (error) {
      return res.status(500).json({ 
        msg: 'Error fetching products', 
        error: error.message 
      });
    }
  },
  getProductCount: async () => {
    try {
      const venteCount = await Product.countDocuments({ status: 'vente' });
      const donCount = await Product.countDocuments({ status: 'don' });
      const echangeCount = await Product.countDocuments({ status: 'echange' });
  
      return {
        venteCount,
        donCount,
        echangeCount,
        total: venteCount + donCount + echangeCount
      };
    } catch (error) {
      throw new Error(`Failed to get product counts: ${error.message}`);
    }
  },
  

  getMaxPrice: async (req, res) => {
    try {
        const maxPrice = await Product.find().sort({ prix: -1 }).limit(1).select('prix');
        res.json({ maxPrice: maxPrice[0]?.prix || 0 });
    } catch (error) {
        return res.status(500).json({
            msg: 'Error fetching maximum price',
            error: error.message,
        });
    }
},

  updateProduct: async (req, res) => {
    try {
      const { 
        nom, description, prix, quantityDispo, communauté, 
        adresse, status, numtel, categorie, ville, coordinates 
      } = req.body;

      // Verify product ownership
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ msg: "Product not found" });
      }
      
      if (product.user.toString() !== req.user.id) {
        return res.status(403).json({ msg: "Not authorized to update this product" });
      }

      const updateFields = {};
      
      // Update basic fields if provided
      if (nom) updateFields.nom = nom;
      if (description) updateFields.description = description;
      // if (prix) updateFields.prix = prix;
      // if (quantityDispo) updateFields.quantityDispo = quantityDispo;
      if (communauté) updateFields.communauté = communauté;
      if (adresse) updateFields.adresse = adresse;
      if (status) updateFields.status = status;
      if (numtel) updateFields.numtel = numtel;
      if (categorie) updateFields.categorie = categorie;
      if (ville) updateFields.ville = ville;

      // Update coordinates if provided
      if (coordinates && coordinates.lat !== undefined && coordinates.lng !== undefined) {
        updateFields.coordinates = [coordinates.lng, coordinates.lat];
      }

      // Handle new images if uploaded
      if (req.files && req.files.length > 0) {
        // Delete old images from filesystem
        if (product.images && product.images.length > 0) {
          product.images.forEach(imagePath => {
            const fullPath = path.join(__dirname, '..', imagePath);
            fs.unlink(fullPath, err => {
              if (err) console.error('Error deleting old image:', err);
            });
          });
        }
        
        // Add new image paths
        updateFields.images = req.files.map(file => `/uploads/products/${file.filename}`);
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        updateFields,
        { new: true }
      ).populate('user', 'username email');
      
      res.json({ msg: "Product updated", updatedProduct });
    } catch (error) {
      // Delete newly uploaded files if update fails
      if (req.files) {
        req.files.forEach(file => {
          fs.unlink(file.path, err => {
            if (err) console.error('Error deleting file:', err);
          });
        });
      }
      return res.status(500).json({ msg: error.message });
    }
  },

  deleteProduct : async (req, res) => {
    try {
      // Start a session for transaction
      const session = await Product.startSession();
      session.startTransaction();
  
      try {
        const product = await Product.findById(req.params.id);
  
        if (!product) {
          await session.abortTransaction();
          return res.status(404).json({ msg: "Product not found" });
        }
  
        // Verify product ownership
        if (!req.user || product.user.toString() !== req.user.id) {
          await session.abortTransaction();
          return res.status(403).json({ msg: "Not authorized to delete this product" });
        }
  
        // Delete associated images from filesystem
        if (Array.isArray(product.images) && product.images.length > 0) {
          await Promise.all(product.images.map(async (imagePath) => {
            try {
              const fullPath = path.join(__dirname, '..', imagePath);
              await fs.unlink(fullPath);
            } catch (err) {
              console.error(`Error deleting image ${imagePath}:`, err);
              // Continue with deletion even if image removal fails
            }
          }));
        }
  
        // Delete related exchanges
        const deletedExchanges = await Exchange.deleteMany({
          $or: [
            { productOffered: product._id },
            { productRequested: product._id }
          ]
        }).session(session);

        // Delete related donations
      const deletedDonations = await Donation.deleteMany({
        product: product._id
      }).session(session);
  
        // Remove product from user's products array
        await User.findByIdAndUpdate(req.user.id, {
          $pull: { products: req.params.id }
        }).session(session);
  
        // Delete the product
        await Product.deleteOne({ _id: product._id }).session(session);
  
        // Commit the transaction
        await session.commitTransaction();
  
        res.json({ 
          msg: "Product deleted successfully",
          deletedExchanges: deletedExchanges.deletedCount
        });
  
      } catch (error) {
        // If any error occurs, abort the transaction
        await session.abortTransaction();
        throw error; // Re-throw to be caught by outer try-catch
      } finally {
        // End the session
        session.endSession();
      }
  
    } catch (error) {
      console.error('Error in deleteProduct:', error);
      return res.status(500).json({ msg: error.message });
    }
  },


  getUserProducts: async (req, res) => {
    try {
      const { page = 1, limit = 10, userId } = req.query;
  
      if (!userId) {
        return res.status(400).json({ msg: "User ID is required" });
      }
  
      const products = await Product.find({ user: userId })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });
  
      const count = await Product.countDocuments({ user: userId });
  
      if (!products || products.length === 0) {
        return res.status(404).json({ msg: "No products found for this user" });
      }
  
      res.json({
        products,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalProducts: count,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  

  getNearbyOffers: async (req, res) => {
    const { longitude, latitude, maxDistance = 10000, limit = 10, page = 1 } = req.query; // maxDistance in meters

    if (!longitude || !latitude) {
      return res.status(400).json({ message: "Longitude and latitude are required" });
    }

    try {
      const nearbyOffers = await Product.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            $maxDistance: parseInt(maxDistance),
          },
        },
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'username email');

      const count = await Product.countDocuments({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            $maxDistance: parseInt(maxDistance),
          },
        },
      });

      res.status(200).json({
        products: nearbyOffers,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalProducts: count
      });
    } catch (error) {
      console.error("Error fetching nearby offers:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Search products
  searchProducts : async (req, res) => {
    try {
      const { query, page = 1, limit = 10, category } = req.query;
  
      const searchQuery = {
        $and: [
          {
            $or: [
              { nom: { $regex: query, $options: 'i' } },
              { description: { $regex: query, $options: 'i' } },
              { categorie: { $regex: query, $options: 'i' } },
              { ville: { $regex: query, $options: 'i' } },
            ],
          },
          category ? { categorie: category } : {},
        ],
      };
  
      const products = await Product.find(searchQuery)
        .populate('user', 'username email')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });
  
      const count = await Product.countDocuments(searchQuery);
  
      res.json({
        products,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalProducts: count,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
   deleteAllProducts: async (req, res) => {
    try {
      // Start a session for transaction
      const session = await Product.startSession();
      session.startTransaction();
  
      try {
        // Fetch all products
        const products = await Product.find().session(session);
  
        // Delete associated images from filesystem
        await Promise.all(products.map(async (product) => {
          if (Array.isArray(product.images) && product.images.length > 0) {
            await Promise.all(product.images.map(async (imagePath) => {
              try {
                const fullPath = path.join(__dirname, '..', imagePath);
                await fs.unlink(fullPath);
              } catch (err) {
                console.error(`Error deleting image ${imagePath}:`, err);
                // Continue with deletion even if image removal fails
              }
            }));
          }
        }));
  
        // Delete related exchanges and donations
        await Exchange.deleteMany({}).session(session);
        await Donation.deleteMany({}).session(session);
  
        // Clear all products from users' products arrays
        await User.updateMany({}, { $set: { products: [] } }).session(session);
  
        // Delete all products
        const deletedProducts = await Product.deleteMany({}).session(session);
  
        // Commit the transaction
        await session.commitTransaction();
  
        res.json({
          msg: "All products deleted successfully",
          deletedCount: deletedProducts.deletedCount
        });
      } catch (error) {
        // If any error occurs, abort the transaction
        await session.abortTransaction();
        throw error; // Re-throw to be caught by outer try-catch
      } finally {
        // End the session
        session.endSession();
      }
    } catch (error) {
      console.error('Error in deleteAllProducts:', error);
      return res.status(500).json({ msg: error.message });
    }
  },
}

module.exports = productCtrl;
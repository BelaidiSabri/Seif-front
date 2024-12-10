const users = require("../models/User.model");
const products = require("../models/Product.model");
const orders = require("../models/Commande.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const crypto = require("crypto");
const nodemailer = require("nodemailer");

const userCtrl = {
  register: async (req, res) => {
    try {
      const { name, role, email, password } = req.body;
      const user = await users.findOne({ email });
      if (user)
        return res.status(400).json({ msg: "L'email existe déjà." });

      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Le mot de passe doit contenir au moins 6 caractères." });

      // Password encryption
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new users({
        name,
        role,
        email,
        password: passwordHash,
      });
      await newUser.save();

      // Create JSON Web Token for authentication
      const accesstoken = createAccessToken({ id: newUser._id });

      res.json({ accesstoken });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await users.findOne({ email });
      if (!user) return res.status(400).json({ msg: "L'utilisateur n'existe pas." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Mot de passe incorrect." });

      // If login is successful, create access token
      const accesstoken = createAccessToken({ id: user._id });

      res.json({ accesstoken, user });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await users.findById(req.user.id).select("-password");
      if (!user) return res.status(400).json({ msg: "User does not exist." });
      res.json(user);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const { page = 1, limit = 10, role, search } = req.query;
      const query = {};
  
      // Exclude users with the 'admin' role
      query.role = { $ne: 'admin' };
  
      // If a specific role is provided, filter by that role
      if (role) query.role = role;
  
      // If search term is provided, apply regex search on username or email
      if (search) {
        query.$or = [
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }
  
      const allUsers = await users.find(query)
        .select('-password')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
  
      const count = await users.countDocuments(query);
  
      res.json({
        allUsers,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  
  getUserCounts: async () => {
    try {
      const fournisseurCount = await users.countDocuments({ role: "fournisseur" });
      const clientCount = await users.countDocuments({ role: "client" });
  
      return {
        fournisseurCount,
        clientCount,
        total: fournisseurCount + clientCount
      };
    } catch (error) {
      throw new Error(`Failed to get user counts: ${error.message}`);
    }
  },
   
  updateUser: async (req, res) => {
    try {
      const { name, email, phone, address } = req.body;
  
      const currentUser = await users.findById(req.params.id);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const updateFields = {};
      if (name && name !== currentUser.name) updateFields.name = name;
      if (email && email !== currentUser.email) updateFields.email = email;
      if (phone && phone !== currentUser.phone) updateFields.phone = phone;
      if (address && address !== currentUser.address) updateFields.address = address;
  
      // Handle image upload
      if (req.file) {
        updateFields.image = `/uploads/products/${req.file.filename}`; // Save the image path
      }
  
      await users.findOneAndUpdate({ _id: req.params.id }, updateFields);
      res.json({ msg: "User updated successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  
  deleteUser: async (req, res) => {
    try {
      await users.findByIdAndDelete(req.params.id);
      res.json({ msg: "Deleted user" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  addToCart: async (req, res) => {
    try {
      const { userId, productId, quantity } = req.body;
      const user = await users.findById(userId);
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      const product = await products.findById(productId);
      if (!product)
        return res.status(400).json({ msg: "Product does not exist." });

      const cartItem = user.cart.find((item) => item.product.equals(productId));
      if (cartItem) {
        cartItem.quantity += quantity;
      } else {
        user.cart.push({ product: productId, quantity });
      }

      await user.save();
      res.json({ msg: "Product added to cart" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  removeFromCart: async (req, res) => {
    try {
      const { userId, productId } = req.body;
      const user = await users.findById(userId);
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      user.cart = user.cart.filter((item) => !item.product.equals(productId));
      await user.save();
      res.json({ msg: "Product removed from cart" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  placeOrder: async (req, res) => {
    try {
      const { userId } = req.body;
      const user = await users.findById(userId).populate("cart.product");
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      const products = user.cart.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      }));

      const totalAmount = user.cart.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );

      const order = new orders({
        user: userId,
        products,
        totalAmount,
      });

      await order.save();

      // Clear user's cart after placing order
      user.cart = [];
      await user.save();

      res.json({ msg: "Order placed", order });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getAllOrders: async (req, res) => {
    try {
      const allOrders = await orders
        .find({})
        .populate("user", "nom prenom email")
        .populate("products.product", "name price");
      res.status(200).send({ response: allOrders });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getContacts: async (req, res) => {
    try {
      const user = await users
        .findById(req.params.userId)
        .populate("contacts", "name _id");
      res.json(user.contacts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  addContact: async (req, res) => {
    try {
      const { userId, contactId } = req.body;
  
      // Fetch both users
      const user = await users.findById(userId);
      const contactUser = await users.findById(contactId);
  
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      if (!contactUser) {
        return res.status(404).json({ message: "Contact user not found." });
      }
  
      // Add contactId to user.contacts if not already present
      if (!user.contacts.includes(contactId)) {
        user.contacts.push(contactId);
        await user.save();
      }
  
      // Add userId to contactUser.contacts if not already present
      if (!contactUser.contacts.includes(userId)) {
        contactUser.contacts.push(userId);
        await contactUser.save();
      }
  
      res.status(200).json({ message: "Contact added successfully for both users." });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
  searchUser: async (req, res) => {
    try {
      const { email } = req.query;
      const user = await users.findOne({ email });

      if (user) {
        res.json({ _id: user._id, name: user.name, email: user.email });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
  
      const user = await users.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ msg: "Aucun utilisateur avec cet email n'existe." });
      }
  
      // If the email is 'maktba178@gmail.com', send the reset email
      if (user.email === "maktba178@gmail.com") {
        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour
  
        // Save reset token and expiry to user document
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();
  
        // Create email transporter
        const transporter = nodemailer.createTransport({
          host: "live.smtp.mailtrap.io",
          port: 587,
          secure: false,
          auth: {
            user: "api",
            pass: "58f9c72bcec16a9532142e3443f6f4ba",
          },
        });
  
        // Reset password URL (frontend URL)
        const resetURL = `http://localhost:3000/user/reset-password/${resetToken}`;
  
        // Email options
        const mailOptions = {
          from: "info@demomailtrap.com",
          to: user.email,
          subject: "Demande de réinitialisation du mot de passe",
          html: `
            <h2>Demande de réinitialisation du mot de passe</h2>
            <p>Vous avez demandé une réinitialisation de votre mot de passe. Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
            <a href="${resetURL}">Réinitialiser le mot de passe</a>
            <p>Ce lien expirera dans 1 heure.</p>
            <p>Si vous n'avez pas fait cette demande, veuillez ignorer cet email.</p>
          `,
        };
  
        // Send email
        await transporter.sendMail(mailOptions);
  
        res.status(200).json({
          msg: "Le lien de réinitialisation du mot de passe a été envoyé à votre email.",
        });
  
      } else {
        // For non-'maktba178@gmail.com' emails, allow direct reset
        res.status(200).json({
          msg: "Vous pouvez maintenant réinitialiser votre mot de passe.",
          email: user.email, // Send email back to frontend
        });
      }
    } catch (error) {
      res.status(500).json({ msg: "Une erreur est survenue. Veuillez réessayer." });
    }
  },
  


    // Method to delete all users
    deleteAllUsers: async (req, res) => {
      try {
        // Deleting all users from the database
        await users.deleteMany({});
        res.json({ msg: "All users have been deleted." });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    },

  resetPassword: async (req, res) => {
    try {
        const { token, newPassword, email } = req.body;

        // Find user by email for non-token reset or with valid token
        const user = await users.findOne({ 
            email, 
            $or: [
                { resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } }, 
                { email: { $ne: "maktba178@gmail.com" } }
            ]
        });

        if (!user) {
            return res.status(400).json({ 
                msg: 'User not found or reset token is invalid.' 
            });
        }

        // Validate new password
        if (newPassword.length < 6) {
            return res.status(400).json({ 
              msg: 'Le mot de passe doit contenir au moins 6 caractères.'
            });
        }

        // Hash new password
        const passwordHash = await bcrypt.hash(newPassword, 10);

        // Update user's password and clear reset token fields
        user.password = passwordHash;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ msg: 'Le mot de passe a été réinitialisé avec succès.' });

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}}

const createAccessToken = (user) => {
  return jwt.sign(user, "ACCESS_TOKEN_SECRET", { expiresIn: "7d" });
};

module.exports = userCtrl;

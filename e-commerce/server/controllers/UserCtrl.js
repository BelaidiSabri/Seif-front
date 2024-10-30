const users = require('../models/User.model');
const products = require('../models/Product.model');
const orders = require('../models/Commande.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userCtrl = {
    register: async (req, res) => {
        try {
            const { name, role, email, password } = req.body;
            const user = await users.findOne({ email });
            if (user)
                return res.status(400).json({ msg: 'The email already exists.' });

            if (password.length < 6)
                return res.status(400).json({ msg: 'Password is at least 6 characters long.' });

            // Password encryption
            const passwordHash = await bcrypt.hash(password, 10);
            const newUser = new users({
                name, role, email, password: passwordHash
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
            if (!user) return res.status(400).json({ msg: 'User does not exist.' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ msg: 'Incorrect password' });

            // If login is successful, create access token
            const accesstoken = createAccessToken({ id: user._id });

            res.json({ accesstoken , user });

        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await users.findById(req.user.id).select('-password');
            if (!user) return res.status(400).json({ msg: 'User does not exist.' });
            res.json(user);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    getAllUsers: async (req, res) => {
        try {
            const allUsers = await users.find();
            res.status(200).send(allUsers);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    updateUser: async (req, res) => {
        try {
            const { nom, prenom, email, password, role } = req.body;

            const currentUser = await users.findById(req.params.id);
            if (!currentUser) {
                return res.status(404).json({ message: "User not found" });
            }

            const updateFields = {};
            if (nom && nom !== currentUser.nom) updateFields.nom = nom;
            if (prenom && prenom !== currentUser.prenom) updateFields.prenom = prenom;
            if (email && email !== currentUser.email) updateFields.email = email;
            if (password) {
                const passwordHash = await bcrypt.hash(password, 10);
                updateFields.password = passwordHash;
            }
            if (role && role !== currentUser.role) updateFields.role = role;

            await users.findOneAndUpdate({ _id: req.params.id }, updateFields);
            res.json({ msg: "Updated user" });
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
            if (!user) return res.status(400).json({ msg: 'User does not exist.' });

            const product = await products.findById(productId);
            if (!product) return res.status(400).json({ msg: 'Product does not exist.' });

            const cartItem = user.cart.find(item => item.product.equals(productId));
            if (cartItem) {
                cartItem.quantity += quantity;
            } else {
                user.cart.push({ product: productId, quantity });
            }

            await user.save();
            res.json({ msg: 'Product added to cart' });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    removeFromCart: async (req, res) => {
        try {
            const { userId, productId } = req.body;
            const user = await users.findById(userId);
            if (!user) return res.status(400).json({ msg: 'User does not exist.' });

            user.cart = user.cart.filter(item => !item.product.equals(productId));
            await user.save();
            res.json({ msg: 'Product removed from cart' });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    placeOrder: async (req, res) => {
        try {
            const { userId } = req.body;
            const user = await users.findById(userId).populate('cart.product');
            if (!user) return res.status(400).json({ msg: 'User does not exist.' });

            const products = user.cart.map(item => ({
                product: item.product._id,
                quantity: item.quantity
            }));

            const totalAmount = user.cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

            const order = new orders({
                user: userId,
                products,
                totalAmount
            });

            await order.save();

            // Clear user's cart after placing order
            user.cart = [];
            await user.save();

            res.json({ msg: 'Order placed', order });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    getAllOrders: async (req, res) => {
        try {
            const allOrders = await orders.find({}).populate('user', 'nom prenom email').populate('products.product', 'name price');
            res.status(200).send({ response: allOrders });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    getContacts: async (req, res) => {
        try {
            const user = await users.findById(req.params.userId).populate('contacts', 'name _id');
            res.json(user.contacts);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    addContact: async (req, res) => {
        try {
            const { userId, contactId } = req.body;
            console.log(req.body)
            const user = await users.findById(userId);
            if (!user.contacts.includes(contactId)) {
                user.contacts.push(contactId);
                await user.save();
            }
            res.status(200).json({ message: "Contact added successfully." });
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
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

const createAccessToken = (user) => {
    return jwt.sign(user, "ACCESS_TOKEN_SECRET", { expiresIn: '7d' });
}

module.exports = userCtrl;

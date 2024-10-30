const Category = require('../models/Category.model');

const categoryCtrl = {
    createCategory: async (req, res) => {
        try {
            const { nom, description } = req.body;
            const newCategory = new Category({ nom, description });
            await newCategory.save();
            res.status(201).json({ msg: 'Category created successfully', category: newCategory });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    getCategory: async (req, res) => {
        try {
            const category = await Category.findById(req.params.id);
            if (!category) return res.status(404).json({ msg: 'Category not found' });
            res.status(200).json(category);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    getAllCategories: async (req, res) => {
        try {
            const categories = await Category.find({});
            res.status(200).json(categories);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    updateCategory: async (req, res) => {
        try {
            const { nom, description } = req.body;
            const updateFields = {};
            
            if (nom) updateFields.nom = nom;
            if (description) updateFields.description = description;

            const updatedCategory = await Category.findByIdAndUpdate(req.params.id, updateFields, { new: true });
            if (!updatedCategory) return res.status(404).json({ msg: 'Category not found' });
            res.status(200).json({ msg: 'Category updated successfully', category: updatedCategory });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    deleteCategory: async (req, res) => {
        try {
            const deletedCategory = await Category.findByIdAndDelete(req.params.id);
            if (!deletedCategory) return res.status(404).json({ msg: 'Category not found' });
            res.status(200).json({ msg: 'Category deleted successfully' });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }
};

module.exports = categoryCtrl;

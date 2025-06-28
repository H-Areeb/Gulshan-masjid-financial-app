const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth');

// 📥 GET all categories
router.get('/', auth(['admin', 'accountant', 'user']), async (req, res) => {
  try {
    const { type } = req.query;
    const query = type ? { type } : {};
    const categories = await Category.find(query).sort({ name: 1 });
    
    res.json({
      success: true,
      message: 'Categories fetched successfully',
      data: categories
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories', error: err.message });
  }
});

// ➕ Create new category
router.post('/', auth(['admin']), async (req, res) => {
  try {
    const { name, type } = req.body;
    const existing = await Category.findOne({ name, type });

    if (existing) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }

    const newCategory = new Category({ name, type });
    await newCategory.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: newCategory
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create category', error: err.message });
  }
});

// 📝 Update category
router.put('/:id', auth(['admin']), async (req, res) => {
  try {
    const { name, type } = req.body;
    const updated = await Category.findByIdAndUpdate(req.params.id, { name, type }, { new: true });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update category', error: err.message });
  }
});

// ❌ Delete category
router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully',
      data: deleted
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete category', error: err.message });
  }
});

module.exports = router;

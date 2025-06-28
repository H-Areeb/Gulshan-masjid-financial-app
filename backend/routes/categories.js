const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth');

// GET /api/categories
router.get('/', auth(['admin', 'accountant', 'user']), async (req, res) => {
  const { type } = req.query;
  const query = type ? { type } : {};
  const categories = await Category.find(query).sort({ name: 1 });
  res.json(categories);
});

// POST /api/categories
router.post('/', auth(['admin']), async (req, res) => {
  const { name, type } = req.body;

  const existing = await Category.findOne({ name, type });
  if (existing) return res.status(400).json({ message: 'Category already exists' });

  const newCategory = new Category({ name, type });
  await newCategory.save();
  res.status(201).json(newCategory);
});

// PUT /api/categories/:id
router.put('/:id', auth(['admin']), async (req, res) => {
  const { name, type } = req.body;
  const category = await Category.findByIdAndUpdate(req.params.id, { name, type }, { new: true });
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json(category);
});

// DELETE /api/categories/:id
router.delete('/:id', auth(['admin']), async (req, res) => {
  const deleted = await Category.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Category not found' });
  res.json({ message: 'Category deleted successfully' });
});

module.exports = router;

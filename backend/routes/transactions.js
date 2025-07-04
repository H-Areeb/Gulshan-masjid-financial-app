const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

// GET all transactions
router.get('/', auth(['admin', 'accountant', 'user']), async (req, res) => {
  try {
    const txns = await Transaction.find().sort({ date: -1 })
    .populate('category', 'name type')        // only fetch name and type
    .populate('createdBy', 'name email');

    res.json({
      success: true,
      message: 'Transactions fetched successfully',
      data: txns
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// GET a transaction by ID
router.get('/:id', auth(['admin', 'accountant', 'user']), async (req, res) => {
  try {
    const txn = await Transaction.findById(req.params.id)
        .populate('category', 'name type')        // only fetch name and type
        .populate('createdBy', 'name email');

    if (!txn) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    res.json({
      success: true,
      message: 'Transaction fetched successfully',
      data: txn
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});



// POST a new transaction
router.post('/', auth(['admin', 'accountant']), upload.single('attachment'), async (req, res) => {
  try {
    const { date, description, type, amount, category } = req.body;

    const today = new Date();
    const yyyyMMdd = today.toISOString().split('T')[0].replace(/-/g, '');
    const txnCount = await Transaction.countDocuments({
      createdAt: {
        $gte: new Date(today.setHours(0, 0, 0, 0)),
        $lte: new Date(today.setHours(23, 59, 59, 999))
      }
    });

    const nextNumber = (txnCount + 1).toString().padStart(4, '0');
    const transactionId = `TXN-${yyyyMMdd}-${nextNumber}`;

    const newTx = new Transaction({
      transactionId,
      date,
      description,
      type,
      amount,
      category,
      createdBy: req.user.id,
      attachmentUrl: req.file ? `/uploads/${req.file.filename}` : ''
    });

    await newTx.save();

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: newTx
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create transaction', error: err.message });
  }
});


// PUT (update) a transaction
router.put('/:id', auth(['admin', 'accountant']), upload.single('attachment'), async (req, res) => {
  try {
    const { date, description, type, amount, category } = req.body;
    const updatedFields = { date, description, type, amount, category };

    if (req.file) {
      updatedFields.attachmentUrl = `/uploads/${req.file.filename}`;
    }

    const updatedTx = await Transaction.findByIdAndUpdate(req.params.id, updatedFields, { new: true });

    if (!updatedTx) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    res.json({
      success: true,
      message: 'Transaction updated successfully',
      data: updatedTx
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update transaction', error: err.message });
  }
});

// DELETE a transaction
router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    const deleted = await Transaction.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    res.json({
      success: true,
      message: 'Transaction deleted successfully',
      data: deleted
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete transaction', error: err.message });
  }
});

module.exports = router;

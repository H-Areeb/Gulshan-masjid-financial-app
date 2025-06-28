const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Transaction = require('../../models/Transaction');

router.get('/', auth(['admin']), async (req, res) => {
  try {
    const txns = await Transaction.find().sort({ date: -1 });

    const data = txns.map(tx => ({
      transactionId: tx.transactionId,
      date: tx.date.toISOString().split('T')[0],
      description: tx.description,
      type: tx.type,
      category: tx.category,
      amount: tx.amount,
      attachmentUrl: tx.attachmentUrl
    }));

    res.json({
      success: true,
      message: 'Exportable report ready',
      data
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Export failed', error: err.message });
  }
});

module.exports = router;

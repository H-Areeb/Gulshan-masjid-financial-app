const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Transaction = require('../../models/Transaction');

router.get('/', auth(['admin', 'accountant', 'user']), async (req, res) => {
  try {
    const { type } = req.query; // income or expense

    const breakdown = await Transaction.aggregate([
      { $match: { type } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    res.json({
      success: true,
      message: `Category breakdown (${type})`,
      data: breakdown
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Category breakdown error', error: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Transaction = require('../../models/Transaction');

router.get('/', auth(['admin', 'accountant', 'user']), async (req, res) => {
  try {
    const { year } = req.query;
    const targetYear = parseInt(year) || new Date().getFullYear();

    const records = await Transaction.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(`${targetYear}-01-01`),
            $lte: new Date(`${targetYear}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }
      }
    ]);

    let income = 0, expense = 0;
    records.forEach(r => {
      if (r._id === 'income') income = r.total;
      if (r._id === 'expense') expense = r.total;
    });

    res.json({
      success: true,
      message: 'Summary report fetched',
      data: { year: targetYear, income, expense, balance: income - expense }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching summary', error: err.message });
  }
});

module.exports = router;

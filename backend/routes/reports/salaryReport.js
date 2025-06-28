const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Transaction = require('../../models/Transaction');

router.get('/', auth(['admin', 'accountant', 'user']), async (req, res) => {
  try {
    const salaries = await Transaction.find({ category: /salary/i });
    res.json({
      success: true,
      message: 'Salary records fetched',
      data: salaries
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Salary fetch failed', error: err.message });
  }
});

module.exports = router;

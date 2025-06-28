const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Transaction = require('../../models/Transaction');

router.get('/', auth(['admin', 'accountant', 'user']), async (req, res) => {
  try {
    const { month, year } = req.query;
    const y = parseInt(year || new Date().getFullYear());
    const m = parseInt(month || new Date().getMonth()) + 1;

    const start = new Date(`${y}-${m.toString().padStart(2, '0')}-01`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const records = await Transaction.find({ date: { $gte: start, $lt: end } });

    res.json({ success: true, message: 'Monthly report fetched', data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching monthly report', error: err.message });
  }
});

module.exports = router;

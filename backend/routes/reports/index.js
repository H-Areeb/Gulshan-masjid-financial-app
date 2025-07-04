const express = require('express');
const router = express.Router();

// Sub-report modules
// router.use('/daily', require('./dailyReport'));
router.use('/monthly', require('./monthlyReport'));
router.use('/summary', require('./summaryReport'));
router.use('/category', require('./categoryBreakdown'));
router.use('/salaries', require('./salaryReport'));
router.use('/export', require('./exportReport'));

module.exports = router;

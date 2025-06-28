const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");

// POST /api/transactions
router.post(
  "/",
  auth(["admin", "accountant"]),
  upload.single("attachment"),
  async (req, res) => {
    const { date, description, type, amount, category } = req.body;

    const today = new Date();
    const yyyyMMdd = today.toISOString().split("T")[0].replace(/-/g, ""); // e.g., 20250628

    // Count existing transactions created today
    const txnCount = await Transaction.countDocuments({
      createdAt: {
        $gte: new Date(today.setHours(0, 0, 0, 0)),
        $lte: new Date(today.setHours(23, 59, 59, 999)),
      },
    });

    // Generate ID: TXN-20250628-0001
    const nextNumber = (txnCount + 1).toString().padStart(4, "0");
    const transactionId = `TXN-${yyyyMMdd}-${nextNumber}`;

    // Include it in the new transaction
    const newTx = new Transaction({
      transactionId,
      date,
      description,
      type,
      amount,
      category,
      createdBy: req.user.id,
      attachmentUrl: req.file ? `/uploads/${req.file.filename}` : "",
    });

    await newTx.save();
    res.json(newTx);
  }
);

// GET /api/transactions
router.get("/", auth(["admin", "accountant", "user"]), async (req, res) => {
  const txns = await Transaction.find().sort({ date: -1 });
  res.json(txns);
});

module.exports = router;

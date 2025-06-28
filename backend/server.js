// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const txnRoutes = require('./routes/transactions');
const categoryRoutes = require('./routes/categories');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // To serve uploaded files

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', txnRoutes);
app.use('/api/categories', categoryRoutes);

// DB Connect
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB Connected");
  app.listen(5000, () => console.log("Server running on port 5000"));
}).catch(err => console.error("DB Connection Error:", err));

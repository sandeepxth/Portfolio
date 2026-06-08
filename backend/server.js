const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB().catch(err => {
  console.warn(`Initial MongoDB connection failed (${err.message}). Server will run in offline/fallback mode.`);
});

// Ensure uploads folder exists (safely wrapped in try-catch for serverless platforms)
const uploadsDir = path.join(__dirname, 'uploads');
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }
} catch (err) {
  console.warn('Note: Uploads folder creation skipped or read-only filesystem:', err.message);
}

const app = express();

// CORS Middleware config
// Enable CORS for all origins in development, customize for production
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json({ limit: '10mb' })); // Support base64 images
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Basic Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Portfolio API is running smoothly.' });
});

// Database connection middleware to ensure connection on all API requests
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    // Let resume status/download bypass connection failures to use offline disk-based fallbacks
    if (req.originalUrl === '/api/resume/download' || req.originalUrl === '/api/resume/status') {
      return next();
    }
    res.status(500).json({
      success: false,
      message: `Database offline: ${err.message}`
    });
  }
});

// API Routes
app.use('/api', apiRoutes);

// Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

module.exports = app;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

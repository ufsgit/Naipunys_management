const express = require('express');
const cors = require('./middleware/cors');
const errorHandler = require('./middleware/errorHandler');
const { error } = require('./utils/responseHelper');

const app = express();

// Global middleware
app.use(cors);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Naipunya API is running', uptime: process.uptime() });
});

// API routes
const base = '/api';
app.use(`${base}/auth`, require('./routes/authRoutes'));
app.use(`${base}/students`, require('./routes/studentRoutes'));
app.use(`${base}/courses`, require('./routes/courseRoutes'));
app.use(`${base}/branches`, require('./routes/branchRoutes'));
app.use(`${base}/departments`, require('./routes/departmentRoutes'));
app.use(`${base}/accounts`, require('./routes/accountRoutes'));
app.use(`${base}/receipts`, require('./routes/receiptRoutes'));
app.use(`${base}/payments`, require('./routes/paymentRoutes'));
app.use(`${base}/users`, require('./routes/userRoutes'));
app.use(`${base}/roles`, require('./routes/roleRoutes'));
app.use(`${base}/follow-ups`, require('./routes/followUpRoutes'));
app.use(`${base}/reports`, require('./routes/reportRoutes'));
app.use(`${base}/company-info`, require('./routes/companyInfoRoutes'));
app.use(`${base}/settings`, require('./routes/settingsRoutes'));

// 404 handler
app.use((req, res) => {
  return error(res, 'Route not found', 404);
});

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;

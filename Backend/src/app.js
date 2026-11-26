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
app.use(`${base}/auth`, require('./modules/auth/authRoutes'));
app.use(`${base}/students`, require('./modules/students/studentRoutes'));
app.use(`${base}/courses`, require('./modules/courses/courseRoutes'));
app.use(`${base}/branches`, require('./modules/branches/branchRoutes'));
app.use(`${base}/departments`, require('./modules/departments/departmentRoutes'));
app.use(`${base}/accounts`, require('./modules/accounts/accountRoutes'));
app.use(`${base}/receipts`, require('./modules/receipts/receiptRoutes'));
app.use(`${base}/payments`, require('./modules/payments/paymentRoutes'));
app.use(`${base}/users`, require('./modules/users/userRoutes'));
app.use(`${base}/roles`, require('./modules/roles/roleRoutes'));
app.use(`${base}/follow-ups`, require('./modules/follow-ups/followUpRoutes'));
app.use(`${base}/reports`, require('./modules/reports/reportRoutes'));
app.use(`${base}/company-info`, require('./modules/company-info/companyInfoRoutes'));
app.use(`${base}/settings`, require('./modules/settings/settingsRoutes'));
app.use(`${base}/permissions`, require('./modules/permissions/permissionRoutes'));

// 404 handler
app.use((req, res) => {
  return error(res, 'Route not found', 404);
});

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;

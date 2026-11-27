const cors = require('cors');
const { env } = require('../config/db');

// Support multiple origins separated by comma or whitespace
const allowedOrigins = (env.CLIENT_URL || '')
  .split(/[\s,]+/)
  .map(url => url.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps, curl, Postman, server-to-server)
    if (!origin) {
      return callback(null, true);
    }
    const normalizedOrigin = origin.trim().replace(/\/+$/, '');
    if (allowedOrigins.length === 0 || allowedOrigins.includes(normalizedOrigin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = cors(corsOptions);

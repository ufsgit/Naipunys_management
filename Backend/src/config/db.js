const mysql = require('mysql2/promise');
const path = require('path');

// Load .env file
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Configuration from .env
const env = {
  PORT: process.env.PORT || 5000,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || 3306,
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'naipunya',
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:4200'
};

// MySQL connection pool
const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true
});

// Test connection on startup
pool.getConnection()
  .then(conn => {
    console.log(`MySQL connected: ${env.DB_NAME} on ${env.DB_HOST}:${env.DB_PORT}`);
    conn.release();
  })
  .catch(err => {
    console.error('MySQL connection failed:', err.message);
  });

/**
 * Execute a stored procedure and return its result rows.
 * @param {string} procedureName - e.g. 'GetStudents'
 * @param {Array} params - parameters in order
 */
async function callProcedure(procedureName, params = []) {
  const placeholders = params.map(() => '?').join(',');
  const [rows] = await pool.query(`CALL ${procedureName}(${placeholders})`, params);
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : [];
}

module.exports = { env, pool, callProcedure };

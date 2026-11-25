/**
 * Global error handler. Must be registered last in app.js.
 */
const errorHandler = (err, req, res, next) => {
  console.error('[ERROR]', err.stack || err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  return res.status(statusCode).json({
    success: false,
    message,
    statusCode
  });
};

module.exports = errorHandler;

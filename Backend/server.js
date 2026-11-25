const app = require('./src/app');
const { env } = require('./src/config/db');

const server = app.listen(env.PORT, () => {
  console.log(`Naipunya backend running on http://localhost:${env.PORT}`);
  console.log(`API base: http://localhost:${env.PORT}/api`);
  console.log(`CORS allowed origin: ${env.CLIENT_URL}`);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled promise rejection:', err);
});

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

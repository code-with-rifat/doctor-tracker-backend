const { port } = require('./config/env');
const { connectDb } = require('./config/db');
const { createApp } = require('./app');

async function start() {
  await connectDb();
  const app = createApp();

  app.listen(port, () => {
    console.log(`API listening on port ${port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

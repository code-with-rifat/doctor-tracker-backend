const { connectDb } = require('../src/config/db');
const { createApp } = require('../src/app');

let app;

module.exports = async (req, res) => {
  await connectDb();
  if (!app) {
    app = createApp();
  }
  return app(req, res);
};

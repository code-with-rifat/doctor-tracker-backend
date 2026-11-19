const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const { clientOrigin, nodeEnv } = require('./config/env');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');
const dns = require('dns');
dns.setServers(["8.8.8.8", "1.1.1.1"]);

function createApp() {
  const app = express();

  app.set('trust proxy', 1);
  app.use(helmet());
  const allowedOrigins = String(clientOrigin)
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin(origin, callback) {
        const isAllowed =
          !origin ||
          allowedOrigins.includes(origin) ||
          /\.vercel\.app$/i.test(origin || '');
        callback(null, isAllowed);
      },
      credentials: true,
    })
  );
  app.use(express.json({ limit: '10kb' }));
  app.use(cookieParser());
  app.use(mongoSanitize());
  if (nodeEnv !== 'test') {
    app.use(morgan(nodeEnv === 'production' ? 'combined' : 'dev'));
  }

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api', routes);

  app.use((_req, _res, next) => {
    next(new AppError('Route not found', 404));
  });

  app.use(errorHandler);

  return app;
}

module.exports = { createApp };

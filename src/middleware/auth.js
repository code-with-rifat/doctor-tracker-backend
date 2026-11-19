const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');
const AppError = require('../utils/AppError');
const Admin = require('../models/Admin');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    throw new AppError('Authentication required', 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(token, jwtSecret);
  } catch {
    throw new AppError('Invalid or expired token', 401);
  }

  const admin = await Admin.findById(decoded.id).lean();
  if (!admin) {
    throw new AppError('Authentication required', 401);
  }

  req.admin = admin;
  next();
});

module.exports = { protect };

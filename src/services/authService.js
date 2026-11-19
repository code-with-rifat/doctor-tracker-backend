const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const AppError = require('../utils/AppError');
const { jwtSecret, jwtExpiresIn } = require('../config/env');

function signToken(adminId) {
  return jwt.sign({ id: adminId }, jwtSecret, { expiresIn: jwtExpiresIn });
}

async function login(email, password) {
  const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');
  if (!admin || !(await admin.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = signToken(admin._id);
  return {
    token,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
    },
  };
}

async function getMe(adminId) {
  const admin = await Admin.findById(adminId).lean();
  if (!admin) {
    throw new AppError('Authentication required', 401);
  }
  return {
    id: admin._id,
    name: admin.name,
    email: admin.email,
  };
}

module.exports = { login, getMe, signToken };

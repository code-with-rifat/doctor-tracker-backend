const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/authService');
const { nodeEnv } = require('../config/env');

const cookieOptions = {
  httpOnly: true,
  secure: nodeEnv === 'production',
  sameSite: nodeEnv === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { token, admin } = await authService.login(email, password);

  res.cookie('token', token, cookieOptions);
  res.json({ message: 'Logged in', data: { admin } });
});

const logout = asyncHandler(async (_req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: nodeEnv === 'production',
    sameSite: nodeEnv === 'production' ? 'none' : 'lax',
  });
  res.json({ message: 'Logged out' });
});

const me = asyncHandler(async (req, res) => {
  const admin = await authService.getMe(req.admin._id);
  res.json({ data: { admin } });
});

module.exports = { login, logout, me };

const asyncHandler = require('../utils/asyncHandler');
const dashboardService = require('../services/dashboardService');

const getStats = asyncHandler(async (_req, res) => {
  const stats = await dashboardService.getStats();
  res.json({ data: stats });
});

module.exports = { getStats };

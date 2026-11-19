const mongoose = require('mongoose');
const { mongoUri } = require('../config/env');
const Admin = require('../models/Admin');

const demoAdmin = {
  name: 'Demo Admin',
  email: 'demo@doctortracker.com',
  password: 'Demo@123',
};

async function ensureDemoAdmin() {
  const admin = await Admin.findOne({ email: demoAdmin.email }).select('+password');
  if (admin) {
    admin.name = demoAdmin.name;
    admin.password = demoAdmin.password;
    await admin.save();
    console.log(`Demo admin updated: ${admin.email}`);
  } else {
    await Admin.create(demoAdmin);
    console.log(`Demo admin created: ${demoAdmin.email}`);
  }
}

async function createDemoAdmin() {
  await mongoose.connect(mongoUri);
  try {
    await ensureDemoAdmin();
  } finally {
    await mongoose.disconnect();
  }
}

if (require.main === module) {
  createDemoAdmin().catch(async (err) => {
    console.error('Demo admin setup failed:', err);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  });
}

module.exports = { ensureDemoAdmin };

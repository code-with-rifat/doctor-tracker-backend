const mongoose = require('mongoose');
const { mongoUri } = require('./env');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDb() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    mongoose.set('strictQuery', true);
    cached.promise = mongoose.connect(mongoUri).then((conn) => {
      console.log('MongoDB connected');
      return conn;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = { connectDb };

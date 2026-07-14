const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URL = process.env.PROD_DATABASE_URL || process.env.DEV_MONGDB_URL;
const NEW_PASSWORD = 'ADMIN1226';

async function resetPassword() {
  await mongoose.connect(MONGO_URL);
  console.log('Connected to MongoDB');

  const hash = await bcrypt.hash(NEW_PASSWORD, 8);
  const result = await mongoose.connection.db.collection('users').updateOne(
    { email: 'ajayk061999@gmail.com' },
    { $set: { password: hash } }
  );

  console.log('Updated:', result.modifiedCount, 'document(s)');
  console.log('Password reset to: ADMIN1226');
  await mongoose.disconnect();
}

resetPassword().catch(console.error);

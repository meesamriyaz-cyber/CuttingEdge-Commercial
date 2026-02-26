import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
dotenv.config({ path: join(__dirname, '.env') });

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('Error: MONGO_URI not found in environment variables');
  console.error('Make sure .env file exists in backend directory with MONGO_URI defined');
  process.exit(1);
}

async function fixClientType() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected successfully');

    const db = mongoose.connection.db;
    
    // Find the user and update clientType
    const result = await db.collection('users').updateOne(
      { email: 'saisujay2014@gmail.com' },
      { $set: { clientType: 'PRIVATE' } }
    );

    if (result.matchedCount === 0) {
      console.log('User with email saisujay2014@gmail.com not found');
    } else {
      console.log('Updated user clientType to PRIVATE');
      console.log('Matched:', result.matchedCount);
      console.log('Modified:', result.modifiedCount);
    }

    // Verify the update
    const user = await db.collection('users').findOne({ email: 'saisujay2014@gmail.com' });
    if (user) {
      console.log('\nUser details:');
      console.log('  Email:', user.email);
      console.log('  Name:', user.name);
      console.log('  Role:', user.role);
      console.log('  Client Type:', user.clientType);
    }

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

fixClientType();

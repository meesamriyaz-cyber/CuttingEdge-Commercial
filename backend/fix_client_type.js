import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

async function fixClientType() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database');

    // Find users without clientType
    const usersWithoutType = await User.find({ clientType: { $exists: false } });
    console.log(`Found ${usersWithoutType.length} users without clientType`);

    if (usersWithoutType.length > 0) {
      console.log('Users without clientType:');
      usersWithoutType.forEach(u => {
        console.log(`  - ${u.email} (roles: ${u.roles.join(', ')})`);
      });

      // Update users with private_client role to PRIVATE
      const result = await User.updateMany(
        { clientType: { $exists: false }, roles: 'private_client' },
        { $set: { clientType: 'PRIVATE' } }
      );
      console.log(`\nUpdated ${result.modifiedCount} users to PRIVATE clientType`);

      // Update govt users to PUBLIC
      const govtResult = await User.updateMany(
        { clientType: { $exists: false }, roles: 'govt_client' },
        { $set: { clientType: 'PUBLIC' } }
      );
      console.log(`Updated ${govtResult.modifiedCount} users to PUBLIC clientType`);
    }

    // Show all users and their client types
    console.log('\n--- All Users ---');
    const allUsers = await User.find({}, 'email name clientType roles');
    allUsers.forEach(u => {
      console.log(`${u.email}: clientType=${u.clientType || 'NOT SET'}, roles=[${u.roles.join(', ')}]`);
    });

    await mongoose.disconnect();
    console.log('\nDone!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixClientType();

.
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Order } from './src/models/Order.js';
import { User } from './src/models/User.js';

dotenv.config();

async function findMarhaba() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully');

    // Find users with "marhaba" in their name (case insensitive)
    console.log('\nSearching for users with "marhaba" in name...');
    const users = await User.find({
      $or: [
        { name: { $regex: 'marhaba', $options: 'i' } },
        { email: { $regex: 'marhaba', $options: 'i' } }
      ]
    });
    
    console.log(`Found ${users.length} users:`);
    users.forEach(u => {
      console.log(`  - ${u.name} (${u.email}) - Role: ${u.role}, ClientType: ${u.clientType}`);
    });

    // Also search in orders for any "marhaba" reference
    console.log('\nSearching for orders with "marhaba"...');
    const orders = await Order.find({
      $or: [
        { 'shippingAddress.fullName': { $regex: 'marhaba', $options: 'i' } },
        { 'user.name': { $regex: 'marhaba', $options: 'i' } }
      ]
    }).populate('user', 'name email clientType role');

    console.log(`Found ${orders.length} orders:`);
    orders.forEach(o => {
      console.log(`  - Order #${o._id.toString().slice(-8).toUpperCase()}`);
      if (o.user) {
        console.log(`    User: ${o.user.name} (${o.user.email}) - ClientType: ${o.user.clientType}`);
      }
    });

    // List all orders and their users to find the right one
    console.log('\nListing all orders with their users:');
    const allOrders = await Order.find().populate('user', 'name email clientType role');
    
    allOrders.forEach(o => {
      if (o.user) {
        console.log(`  - ${o._id.toString().slice(-8).toUpperCase()}: ${o.user.name} (${o.user.email}) - ClientType: ${o.user.clientType || 'NOT SET'}`);
      }
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    console.log('\nDisconnected from MongoDB');
    await mongoose.disconnect();
    process.exit();
  }
}

findMarhaba();

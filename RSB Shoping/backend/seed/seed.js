require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
const Pincode = require('../models/Pincode');
const Order = require('../models/Order');
const connectDB = require('../config/db');

// Sample pincodes data
const pincodes = [
  // Delhi NCR
  { pincode: '110001', city: 'New Delhi', state: 'Delhi', estimatedDays: 2 },
  { pincode: '110003', city: 'New Delhi', state: 'Delhi', estimatedDays: 2 },
  { pincode: '201301', city: 'Noida', state: 'Uttar Pradesh', estimatedDays: 2 },
  // Mumbai
  { pincode: '400001', city: 'Mumbai', state: 'Maharashtra', estimatedDays: 3 },
  { pincode: '400002', city: 'Mumbai', state: 'Maharashtra', estimatedDays: 3 },
  // Bangalore
  { pincode: '560001', city: 'Bengaluru', state: 'Karnataka', estimatedDays: 3 },
  { pincode: '560002', city: 'Bengaluru', state: 'Karnataka', estimatedDays: 3 },
  // Add more pincodes here...
];

// Sample products data (prices in paise)
const products = [
  {
    title: 'Premium Smartphone',
    description: 'High-end Android smartphone with 5G support',
    price: 2999900, // ₹29,999
    category: 'electronics',
    stockQty: 50,
    sku: 'PHONE001',
    images: [{ url: 'https://placeholder.com/electronics1.jpg' }],
    attributes: [
      { name: 'Color', values: ['Black', 'Blue'] },
      { name: 'Storage', values: ['128GB', '256GB'] }
    ]
  },
  {
    title: 'Cotton Kurta',
    description: 'Traditional Indian cotton kurta for men',
    price: 129900, // ₹1,299
    category: 'fashion',
    stockQty: 100,
    sku: 'KURTA001',
    images: [{ url: 'https://placeholder.com/fashion1.jpg' }],
    attributes: [
      { name: 'Size', values: ['S', 'M', 'L', 'XL'] },
      { name: 'Color', values: ['White', 'Blue', 'Beige'] }
    ]
  },
  // Add more products here...
];

// Seed data function
const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Pincode.deleteMany();
    await Order.deleteMany();

    console.log('🗑️ Cleared existing data');

    // Create admin user
    const adminPassword = 'Admin@123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    await User.create({
      name: 'Admin User',
      email: 'admin@rsb.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('👤 Created admin user');

    // Create sample customer
    await User.create({
      name: 'Sample Customer',
      email: 'customer@example.com',
      password: await bcrypt.hash('Customer@123', 10),
      role: 'customer',
      addresses: [{
        name: 'John Doe',
        phone: '9876543210',
        street: '123 Main Street',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001',
        isDefault: true
      }]
    });

    console.log('👥 Created sample customer');

    // Insert pincodes
    await Pincode.insertMany(pincodes);
    console.log('📍 Added pincode data');

    // Insert products
    await Product.insertMany(products);
    console.log('📦 Added product data');

    console.log('✅ Seed data inserted successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
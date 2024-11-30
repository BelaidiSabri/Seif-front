const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const UserModel = require('../models/User.model');


async function createAdminUser() {
  try {
    // You can modify these or pass as command-line arguments
    const adminData = {
      name: 'Admin',
      email: 'admin@admin.com',
      password: 'admin',
      role: 'admin'
    };

    // Check if admin already exists
    const existingAdmin = await UserModel.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      mongoose.connection.close();
      return;
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);

    // Create new admin user
    const newAdmin = new User({
      ...adminData,
      password: hashedPassword
    });

    // Save the admin user
    await newAdmin.save();

    console.log('Admin user created successfully!');
    mongoose.connection.close();

  } catch (error) {
    console.error('Error creating admin user:', error);
    mongoose.connection.close();
  }
}

// Run the function
createAdminUser();
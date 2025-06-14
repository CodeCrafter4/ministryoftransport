#!/usr/bin/env node

const https = require('http');

const adminUserData = {
  firstName: "Admin",
  lastName: "User",
  email: "admin@ministry.gov.sa",
  password: "Admin123",
  phone: "+966501234567",
  nationalId: "1234567890",
  dateOfBirth: "1990-01-01",
  address: {
    street: "Admin Street",
    city: "Riyadh",
    state: "Riyadh",
    zipCode: "12345",
    country: "Saudi Arabia"
  },
  role: "Admin"
};

const data = JSON.stringify(adminUserData);

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/signup',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('Creating admin user...');
console.log('Email: admin@ministry.gov.sa');
console.log('Password: Admin123');
console.log('');

const req = https.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(responseData);
      
      if (res.statusCode === 201) {
        console.log('✅ Admin user created successfully!');
        console.log('');
        console.log('Login credentials:');
        console.log('Email: admin@ministry.gov.sa');
        console.log('Password: Admin123');
        console.log('');
        console.log('You can now login to the admin panel at: http://localhost:4000');
      } else {
        console.log('❌ Failed to create admin user:');
        console.log(response.message || 'Unknown error');
        
        if (response.message && response.message.includes('already exists')) {
          console.log('');
          console.log('ℹ️  Admin user already exists. Use these credentials:');
          console.log('Email: admin@ministry.gov.sa');
          console.log('Password: Admin123');
        }
      }
    } catch (error) {
      console.log('❌ Error parsing response:', responseData);
    }
  });
});

req.on('error', (error) => {
  console.log('❌ Error creating admin user:', error.message);
  console.log('');
  console.log('Make sure the server is running on port 5000');
  console.log('Run: npm run server');
});

req.write(data);
req.end(); 
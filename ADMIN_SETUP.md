# Admin Panel Setup Guide

## Overview
The admin panel is a completely separate React application that provides administrative functionality for the Ministry of Transport platform. It runs independently from the main client application and has its own authentication system.

## Port Configuration
- **Server**: http://localhost:5000
- **Client Application**: http://localhost:3000 (or next available port)
- **Admin Panel**: http://localhost:4000

## Getting Started

### 1. Install Dependencies
First, install dependencies for all applications:
```bash
# From the root directory
npm run install-all
```

Or install them individually:
```bash
# Install admin dependencies
cd admin
npm install
cd ..

# Install client dependencies  
cd client
npm install
cd ..

# Install server dependencies
cd server
npm install
cd ..
```

### 2. Start the Applications
```bash
# Start all applications (server + client + admin)
npm run dev-all

# Or start them individually:
npm run server    # Start backend server
npm run client    # Start client application  
npm run admin     # Start admin panel
```

### 3. Create an Admin Account

**IMPORTANT**: To access the admin panel, you need an account with "Administrator" role.

#### Option 1: Use the Main Application (Recommended)
1. Go to http://localhost:3000/register
2. Fill out the registration form
3. **Select "Administrator" as the Account Type**
4. Complete the registration

#### Option 2: Use API directly
```bash
# POST to http://localhost:5000/api/auth/signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Admin",
    "lastName": "User", 
    "email": "admin@ministry.gov.sa",
    "password": "Admin123",
    "phone": "+966501234567",
    "nationalId": "1234567890",
    "dateOfBirth": "1990-01-01",
    "address": {
      "street": "Admin Street",
      "city": "Riyadh", 
      "state": "Riyadh",
      "zipCode": "12345",
      "country": "Saudi Arabia"
    },
    "role": "Admin"
  }'
```

### 4. Access the Admin Panel
1. Navigate to http://localhost:4000
2. Use the credentials from your admin account
3. You'll be redirected to the admin dashboard upon successful login

## Features

### Admin Dashboard
- **User Statistics**: Total users, active accounts, role distribution
- **System Overview**: Application metrics and system health
- **Recent Activity**: Latest user registrations and activity
- **Quick Actions**: Navigate to management sections

### Management Sections
- **User Management**: View, edit, and manage user accounts
- **Vehicle Management**: Oversee vehicle registration applications
- **License Management**: Handle driving license applications  
- **Transport Management**: Manage transport routes and services

## Authentication System

### Separate Authentication
- Admin panel uses completely separate authentication from the client app
- Admin tokens are stored as `adminToken` and `adminUser` in localStorage
- Client tokens are stored as `token` and `user` in localStorage
- No session sharing between admin and client applications

### Role-Based Access
- Only users with `role: "Admin"` can access the admin panel
- Public users will receive "Access denied" error
- Authentication is verified on every protected route

### Session Management
- Admin sessions persist in localStorage
- Token verification happens on app startup
- Automatic logout on token expiration
- Manual logout clears all admin session data

## Development Notes

### API Integration
- Admin panel connects to the same backend (port 5000)
- Uses proxy configuration in Vite for API calls
- All endpoints require proper authentication headers

### Styling
- Uses Tailwind CSS with custom primary blue theme
- Responsive design for desktop and mobile
- Professional administrative interface
- Component library with reusable UI elements

### Error Handling
- Graceful handling of authentication failures
- User-friendly error messages
- Automatic redirection for unauthorized access
- Loading states for all async operations

## Troubleshooting

### Common Issues

#### "No authentication data found" Error
This is normal when:
- No admin user is logged in (expected behavior)
- First time accessing the admin panel
- After logout or session expiration

**Solution**: Create an admin account and log in.

#### "Access denied. Admin privileges required"
This means you're trying to log in with a non-admin account.

**Solution**: 
1. Create a new account with "Administrator" role
2. Or update an existing account's role in the database

#### Port Conflicts
If port 4000 is in use, the admin panel will automatically try the next available port.

**Check the terminal output for the actual port being used.**

#### CSS/Styling Issues
If Tailwind CSS isn't working:
1. Ensure PostCSS is configured correctly
2. Check that Tailwind classes are being applied
3. Verify the build process is running without errors

### Development Commands
```bash
# Start only admin panel
npm run admin

# Build admin panel for production
npm run build-admin

# Install admin dependencies only
npm run install-admin

# Run all applications
npm run dev-all
```

## Security Considerations

### Admin Access
- Admin panel should only be accessible to authorized personnel
- Consider implementing additional security measures for production
- Monitor admin activity and maintain audit logs

### Data Protection
- All API calls use authentication tokens
- Sensitive operations require admin role verification
- User data is protected by role-based access controls

## Production Deployment

When deploying to production:
1. Build the admin panel: `npm run build-admin`
2. Configure proper domain and SSL for admin access
3. Set up environment-specific configurations
4. Implement additional security measures (IP whitelisting, VPN access)
5. Set up monitoring and logging for admin activities

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the browser console for error messages
3. Verify server logs for backend issues
4. Ensure all dependencies are properly installed 
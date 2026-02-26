# Pure Admin Account Setup

## Overview

A pure admin account is a special user type that has no `clientType` and only the `admin` role. This account has full access to manage both private and public client data without any verification requirements.

## Creating a Pure Admin Account

### Method 1: Using the Script (Recommended)

Run the following command to create a pure admin account:

```bash
cd backend
node src/utils/createPureAdmin.js
```

This will create an admin account with:

- **Email**: `pureadmin@cuttingedge.com`
- **Password**: `admin123`
- **Role**: `admin` (pure admin)
- **Client Type**: None (pure admin)
- **Access**: Full access to both private and public client data

### Method 2: Manual MongoDB Insertion

You can also manually insert the admin user into MongoDB:

```javascript
db.users.insertOne({
  name: "Pure Admin User",
  email: "pureadmin@cuttingedge.com",
  password: "$2a$10$...", // bcrypt hash of "admin123"
  roles: ["admin"],
  emailVerified: true,
  govtValidationStatus: "VERIFIED",
  createdAt: new Date(),
  updatedAt: new Date(),
});
```

## Admin Account Features

### Pure Admin Account (`pureadmin@cuttingedge.com`)

- ✅ **No clientType required** - Pure admin role only
- ✅ **No verification needed** - Immediate access to all features
- ✅ **Full data access** - Can view and manage both private and public client data
- ✅ **All route access** - Can access admin routes, government routes, and private routes
- ✅ **No restrictions** - Bypasses all verification and client-type checks

### Regular Admin Account (`admin@cuttingedge.com`)

- ✅ **Has clientType** - Set as "PRIVATE" for admin oversight
- ✅ **No verification needed** - Immediate access to all features
- ✅ **Full data access** - Can view and manage both private and public client data
- ✅ **All route access** - Can access admin routes, government routes, and private routes

## Access Levels

### Pure Admin Account

- **Admin Routes**: `/admin/*` - Full access to admin dashboard, products, orders, enquiries, quotes
- **Government Routes**: `/enquiry`, `/enquiries`, `/quotes`, `/service-enquiries`, `/service-quotes` - Full access
- **Private Routes**: `/cart`, `/orders`, `/checkout` - Full access
- **General Routes**: `/`, `/products`, `/products/:id` - Full access

### Regular Users

- **Private Clients**: Can access private and general routes without verification
- **Government Clients**: Must verify before accessing government-specific routes
- **All Users**: Can access general routes (home, products) without restrictions

## Security Notes

- Pure admin accounts bypass all verification checks
- Pure admin accounts have access to all client data regardless of type
- Use strong passwords for admin accounts
- Limit the number of admin accounts in production
- Monitor admin account activity

## Usage

1. Run the creation script: `node src/utils/createPureAdmin.js`
2. Login with: `pureadmin@cuttingedge.com` / `admin123`
3. Access the admin dashboard at `/admin/dashboard`
4. Manage both private and public client data from the admin interface

## Troubleshooting

- If the script fails, check that MongoDB is running and the connection string is correct
- If login fails, verify the password is `admin123`
- If routes are inaccessible, check that the admin role is properly set to `["admin"]`

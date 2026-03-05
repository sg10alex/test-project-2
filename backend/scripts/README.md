# Database Scripts

This directory contains utility scripts for database management.

## Seed Script

The seed script (`seed.ts`) populates the database with initial data for development and testing.

### What it seeds:

1. **Services** - Six corporate services:
   - Business Registration ($1,500)
   - Tax Consultation ($250)
   - Legal Advisory ($350)
   - Accounting Services ($800)
   - Annual Compliance Filing ($500)
   - Corporate Restructuring ($5,000)

2. **Admin User**:
   - Email: `admin@example.com`
   - Password: `Admin123!`
   - Role: `admin`
   - KYC Status: `Verified`

### Usage:

```bash
# Make sure your database is set up and migrations are run
npm run migrate:up

# Run the seed script
npm run seed
```

### Features:

- **Idempotent**: Can be run multiple times safely - checks if data exists before inserting
- **Environment-aware**: Uses environment variables from `.env` file
- **Clear output**: Shows what was created and what already exists

### Important Notes:

⚠️ **Security**: The default admin password (`Admin123!`) should be changed immediately after first login in production environments.

⚠️ **Environment**: Make sure your `.env` file is properly configured with database credentials before running the seed script.

### After Seeding:

You can log in to the admin portal with:
- Email: `admin@example.com`
- Password: `Admin123!`

The seeded services will be available for customers to browse and order.

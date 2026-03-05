# Project Setup Guide

This guide will help you set up the Corporate Services Webapp development environment.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ LTS (https://nodejs.org/)
- **PostgreSQL** 14+ (https://www.postgresql.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** (https://git-scm.com/)

## Step 1: Install Dependencies

### Frontend Dependencies

```bash
cd frontend
npm install
```

This will install:
- Next.js 14+ with TypeScript
- React 18+
- Tailwind CSS
- next-auth for authentication
- react-hook-form for form handling
- Testing libraries (Jest, React Testing Library, fast-check)

### Backend Dependencies

```bash
cd backend
npm install
```

This will install:
- Express.js with TypeScript
- PostgreSQL client (pg)
- Authentication libraries (jsonwebtoken, bcrypt)
- File upload handling (multer)
- Email service (nodemailer)
- Security middleware (helmet, cors)
- Testing libraries (Jest, Supertest, fast-check)

## Step 2: Database Setup

### Create PostgreSQL Database

```bash
# Using psql
psql -U postgres
CREATE DATABASE corporate_services;
\q

# Or using createdb command
createdb -U postgres corporate_services
```

### Configure Database Connection

1. Copy the example environment file:
```bash
cd backend
cp .env.example .env
```

2. Edit `backend/.env` and update the database configuration:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=corporate_services
DB_USER=postgres
DB_PASSWORD=your_password
```

### Run Database Migrations

```bash
cd backend
npm run migrate:up
```

This will create all necessary tables (users, services, orders, documents, etc.)

### Seed Initial Data (Optional but Recommended)

```bash
cd backend
npm run seed
```

This will populate the database with:
- 6 sample corporate services (Business Registration, Tax Consultation, Legal Advisory, etc.)
- An admin user for testing:
  - Email: `admin@example.com`
  - Password: `Admin123!`
  - ⚠️ Change this password in production!

The seed script is idempotent - you can run it multiple times safely.

## Step 3: Environment Configuration

### Backend Environment Variables

Edit `backend/.env` and configure:

```env
# Server
PORT=4000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/corporate_services

# JWT
JWT_SECRET=your_secure_random_string_here
JWT_EXPIRES_IN=24h

# Email (configure based on your email provider)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@corporateservices.com

# File Storage
STORAGE_TYPE=local
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
```

### Frontend Environment Variables

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secure_random_string_here
```

## Step 4: Generate Secure Secrets

Generate secure random strings for JWT_SECRET and NEXTAUTH_SECRET:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or using OpenSSL
openssl rand -hex 32
```

## Step 5: Create Upload Directory

```bash
cd backend
mkdir uploads
```

## Step 6: Start Development Servers

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend API will be available at http://localhost:4000

### Start Frontend Server

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will be available at http://localhost:3000

## Step 7: Verify Installation

1. Open http://localhost:3000 in your browser
2. You should see the homepage
3. Check backend health: http://localhost:4000/health

## Running Tests

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Common Issues and Solutions

### Issue: PostgreSQL Connection Error

**Solution:** Ensure PostgreSQL is running and credentials in `.env` are correct.

```bash
# Check if PostgreSQL is running
# On Windows:
pg_ctl status

# On macOS/Linux:
sudo systemctl status postgresql
```

### Issue: Port Already in Use

**Solution:** Change the port in `.env` files or kill the process using the port.

```bash
# Find process using port 4000
# On Windows:
netstat -ano | findstr :4000

# On macOS/Linux:
lsof -i :4000
```

### Issue: Module Not Found

**Solution:** Delete node_modules and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript Errors

**Solution:** Ensure TypeScript is installed and tsconfig.json is properly configured:

```bash
npm install -D typescript
npx tsc --version
```

## Next Steps

After successful setup:

1. Review the project structure in README.md
2. Check the requirements document: `.kiro/specs/corporate-services-webapp/requirements.md`
3. Review the design document: `.kiro/specs/corporate-services-webapp/design.md`
4. Follow the implementation tasks: `.kiro/specs/corporate-services-webapp/tasks.md`

## Development Workflow

1. Create a new branch for your feature
2. Implement the feature following the tasks
3. Write tests (unit tests and property-based tests)
4. Run tests to ensure they pass
5. Commit your changes
6. Create a pull request

## Additional Resources

- Next.js Documentation: https://nextjs.org/docs
- Express.js Documentation: https://expressjs.com/
- PostgreSQL Documentation: https://www.postgresql.org/docs/
- TypeScript Documentation: https://www.typescriptlang.org/docs/
- Jest Documentation: https://jestjs.io/docs/getting-started
- fast-check Documentation: https://fast-check.dev/

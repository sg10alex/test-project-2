# Installation Checklist

Use this checklist to ensure your development environment is properly set up.

## ✅ Prerequisites

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] PostgreSQL 14+ installed (`psql --version`)
- [ ] PostgreSQL server running
- [ ] Git installed (`git --version`)

## ✅ Project Setup

### 1. Dependencies Installation

- [ ] Frontend dependencies installed
  ```bash
  cd frontend && npm install
  ```
  Expected: No errors, `node_modules/` created

- [ ] Backend dependencies installed
  ```bash
  cd backend && npm install
  ```
  Expected: No errors, `node_modules/` created

### 2. Database Setup

- [ ] PostgreSQL database created
  ```bash
  createdb corporate_services
  ```
  Verify: `psql -l | grep corporate_services`

- [ ] Database connection configured in `backend/.env`
  - [ ] DB_HOST set
  - [ ] DB_PORT set
  - [ ] DB_NAME set
  - [ ] DB_USER set
  - [ ] DB_PASSWORD set

### 3. Environment Configuration

- [ ] Backend `.env` file created from `.env.example`
  ```bash
  cd backend && cp .env.example .env
  ```

- [ ] Backend environment variables configured:
  - [ ] PORT (default: 4000)
  - [ ] DATABASE_URL or individual DB_* variables
  - [ ] JWT_SECRET (generated with crypto)
  - [ ] EMAIL_* variables (if testing email features)
  - [ ] STORAGE_TYPE (local for development)

- [ ] Frontend `.env` file created from `.env.example`
  ```bash
  cd frontend && cp .env.example .env
  ```

- [ ] Frontend environment variables configured:
  - [ ] NEXT_PUBLIC_API_URL (default: http://localhost:4000)
  - [ ] NEXTAUTH_URL (default: http://localhost:3000)
  - [ ] NEXTAUTH_SECRET (generated with crypto)

### 4. Security Secrets Generated

Generate secure random strings:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

- [ ] JWT_SECRET generated and set in `backend/.env`
- [ ] NEXTAUTH_SECRET generated and set in `frontend/.env`

### 5. Database Migrations

- [ ] Migrations directory exists (`backend/migrations/`)
- [ ] Migration configuration exists (`backend/.migration.json`)
- [ ] Migrations run successfully
  ```bash
  cd backend && npm run migrate:up
  ```
  Expected: All migrations applied

- [ ] Database seeded with initial data (optional but recommended)
  ```bash
  cd backend && npm run seed
  ```
  Expected: Services and admin user created

### 6. File Storage

- [ ] Upload directory created (or will be created automatically)
  ```bash
  cd backend && mkdir -p uploads
  ```

## ✅ Verification

### Backend Verification

- [ ] TypeScript compiles without errors
  ```bash
  cd backend && npx tsc --noEmit
  ```

- [ ] Backend starts successfully
  ```bash
  cd backend && npm run dev
  ```
  Expected: "Server running on port 4000"

- [ ] Health check endpoint responds
  ```bash
  curl http://localhost:4000/health
  ```
  Expected: `{"status":"ok","timestamp":"..."}`

- [ ] Backend tests run
  ```bash
  cd backend && npm test
  ```
  Expected: All tests pass

### Frontend Verification

- [ ] TypeScript compiles without errors
  ```bash
  cd frontend && npx tsc --noEmit
  ```

- [ ] Frontend starts successfully
  ```bash
  cd frontend && npm run dev
  ```
  Expected: "Ready on http://localhost:3000"

- [ ] Homepage loads in browser
  - [ ] Open http://localhost:3000
  - [ ] Page displays "Welcome to Corporate Services"

- [ ] Frontend tests run
  ```bash
  cd frontend && npm test
  ```
  Expected: All tests pass

## ✅ Project Structure

- [ ] Root directory structure correct:
  - [ ] `frontend/` directory exists
  - [ ] `backend/` directory exists
  - [ ] `README.md` exists
  - [ ] `SETUP.md` exists
  - [ ] `.gitignore` exists

- [ ] Backend structure correct:
  - [ ] `src/` directory with subdirectories
  - [ ] `src/config/database.ts` exists
  - [ ] `src/index.ts` exists
  - [ ] `package.json` with all dependencies
  - [ ] `tsconfig.json` configured
  - [ ] `jest.config.js` configured

- [ ] Frontend structure correct:
  - [ ] `app/` directory with layout and page
  - [ ] `components/` directory exists
  - [ ] `lib/` directory exists
  - [ ] `package.json` with all dependencies
  - [ ] `tsconfig.json` configured
  - [ ] `next.config.js` configured
  - [ ] `tailwind.config.ts` configured

## ✅ Dependencies Installed

### Backend Dependencies (Core)
- [ ] express
- [ ] pg (PostgreSQL client)
- [ ] jsonwebtoken
- [ ] bcrypt
- [ ] multer
- [ ] nodemailer
- [ ] express-validator
- [ ] helmet
- [ ] cors
- [ ] dotenv

### Backend Dependencies (Dev)
- [ ] typescript
- [ ] ts-node
- [ ] ts-node-dev
- [ ] jest
- [ ] ts-jest
- [ ] supertest
- [ ] fast-check
- [ ] node-pg-migrate
- [ ] @types/* packages

### Frontend Dependencies (Core)
- [ ] next (14+)
- [ ] react (18+)
- [ ] react-dom
- [ ] next-auth
- [ ] react-hook-form

### Frontend Dependencies (Dev)
- [ ] typescript
- [ ] tailwindcss
- [ ] postcss
- [ ] autoprefixer
- [ ] jest
- [ ] @testing-library/react
- [ ] @testing-library/jest-dom
- [ ] fast-check
- [ ] eslint
- [ ] eslint-config-next

## 🎉 Setup Complete!

If all items are checked, your development environment is ready!

### Next Steps:

1. **Task 2**: Create database schema and migrations
2. **Task 3**: Implement core TypeScript data models
3. Continue with remaining tasks in `.kiro/specs/corporate-services-webapp/tasks.md`

### Useful Commands:

```bash
# Start both servers (use two terminals)
cd backend && npm run dev
cd frontend && npm run dev

# Run tests
cd backend && npm test
cd frontend && npm test

# Check TypeScript
cd backend && npx tsc --noEmit
cd frontend && npx tsc --noEmit
```

### Documentation:

- `README.md` - Project overview
- `SETUP.md` - Detailed setup instructions
- `QUICK_START.md` - 5-minute quick start
- `PROJECT_STRUCTURE.md` - Codebase organization
- `.kiro/specs/corporate-services-webapp/` - Requirements and design

## Troubleshooting

If any checks fail, refer to:
1. `SETUP.md` for detailed instructions
2. Common issues section in `SETUP.md`
3. Error messages for specific guidance

## Support

- Review the spec files in `.kiro/specs/corporate-services-webapp/`
- Check documentation files in the root directory
- Verify all environment variables are set correctly

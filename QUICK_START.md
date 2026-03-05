# Quick Start Guide

Get the Corporate Services Webapp running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- Terminal/Command Prompt

## 1. Install Dependencies (2 minutes)

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

## 2. Setup Database (1 minute)

```bash
# Create database
createdb corporate_services

# Or using psql:
# psql -U postgres -c "CREATE DATABASE corporate_services;"
```

## 3. Configure Environment (1 minute)

```bash
# Backend
cd backend
cp .env.example .env

# Edit backend/.env and set:
# - DB_PASSWORD (your PostgreSQL password)
# - JWT_SECRET (run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# Frontend
cd ../frontend
cp .env.example .env

# Edit frontend/.env and set:
# - NEXTAUTH_SECRET (run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
```

## 4. Run Migrations (30 seconds)

```bash
cd backend
npm run migrate:up

# Optional: Seed initial data (recommended for development)
npm run seed
```

The seed script creates:
- 6 sample corporate services (Business Registration, Tax Consultation, etc.)
- Admin user: `admin@example.com` / `Admin123!`

## 5. Start Development Servers (30 seconds)

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 6. Open Browser

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/health

## Common Commands

### Development
```bash
# Start backend
cd backend && npm run dev

# Start frontend
cd frontend && npm run dev
```

### Testing
```bash
# Test backend
cd backend && npm test

# Test frontend
cd frontend && npm test
```

### Database
```bash
# Run migrations
cd backend && npm run migrate:up

# Seed initial data
cd backend && npm run seed

# Rollback migration
cd backend && npm run migrate:down

# Create new migration
cd backend && npm run migrate:create migration_name
```

### Build
```bash
# Build backend
cd backend && npm run build

# Build frontend
cd frontend && npm run build
```

## Troubleshooting

### "Cannot connect to database"
- Check PostgreSQL is running
- Verify DB_PASSWORD in backend/.env
- Ensure database exists: `psql -l | grep corporate_services`

### "Port already in use"
- Change PORT in backend/.env (default: 4000)
- Change port in frontend/.env NEXT_PUBLIC_API_URL

### "Module not found"
- Delete node_modules: `rm -rf node_modules`
- Reinstall: `npm install`

## Next Steps

1. Read `README.md` for project overview
2. Check `SETUP.md` for detailed setup instructions
3. Review `PROJECT_STRUCTURE.md` to understand the codebase
4. See `.kiro/specs/corporate-services-webapp/` for requirements and design

## Need Help?

- Check the full setup guide: `SETUP.md`
- Review project structure: `PROJECT_STRUCTURE.md`
- Read the requirements: `.kiro/specs/corporate-services-webapp/requirements.md`
- Check the design: `.kiro/specs/corporate-services-webapp/design.md`

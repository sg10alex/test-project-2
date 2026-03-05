# Corporate Services Webapp

A full-stack web application for corporate services management with customer portal and KYC verification.

## Project Structure

```
.
├── frontend/          # Next.js 14+ frontend with TypeScript
├── backend/           # Express.js backend API with TypeScript
└── README.md
```

## Technology Stack

### Frontend
- Next.js 14+ with App Router
- TypeScript
- Tailwind CSS
- React Hook Form
- next-auth for authentication

### Backend
- Node.js with Express
- TypeScript
- PostgreSQL with pg library
- JWT authentication
- bcrypt for password hashing
- multer for file uploads
- nodemailer for email notifications

### Testing
- Jest for unit testing
- React Testing Library for frontend tests
- Supertest for API testing
- fast-check for property-based testing

## Getting Started

### Prerequisites
- Node.js 18+ LTS
- PostgreSQL 14+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies for both frontend and backend:

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables:

```bash
# Copy example env files
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env

# Edit the .env files with your configuration
```

4. Set up the database:

```bash
# Create PostgreSQL database
createdb corporate_services

# Run migrations
cd backend
npm run migrate:up

# Seed initial data (optional but recommended for development)
npm run seed
```

The seed script will create:
- 6 sample corporate services
- An admin user (email: `admin@example.com`, password: `Admin123!`)

### Development

Run both frontend and backend in development mode:

```bash
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Backend
cd backend
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

### Testing

```bash
# Run frontend tests
cd frontend
npm test

# Run backend tests
cd backend
npm test
```

### Building for Production

```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd backend
npm run build
```

## Features

- Public website with company and service information (SEO optimized)
- Customer registration and authentication
- Customer portal for service orders and document management
- KYC document upload and verification
- Admin portal for KYC review and order management
- Email notifications for key events
- Secure file storage
- Role-based access control

## API Documentation

API endpoints are available at `/api`:
- `/api/auth` - Authentication endpoints
- `/api/services` - Service information
- `/api/orders` - Service orders
- `/api/documents` - KYC document management
- `/api/admin` - Admin operations

## License

Private - All rights reserved

# Project Structure

This document describes the organization of the Corporate Services Webapp codebase.

## Root Directory

```
corporate-services-webapp/
├── frontend/              # Next.js frontend application
├── backend/               # Express.js backend API
├── .kiro/                 # Kiro spec files
├── README.md              # Project overview
├── SETUP.md               # Setup instructions
├── PROJECT_STRUCTURE.md   # This file
└── .gitignore             # Git ignore rules
```

## Frontend Structure (`frontend/`)

```
frontend/
├── app/                   # Next.js App Router
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   └── .gitkeep
├── lib/                   # Utility functions and API clients
│   └── .gitkeep
├── types/                 # TypeScript type definitions
│   └── .gitkeep
├── __tests__/             # Test files
│   └── setup.test.tsx
├── public/                # Static assets (created by Next.js)
├── .next/                 # Next.js build output (gitignored)
├── node_modules/          # Dependencies (gitignored)
├── package.json           # Frontend dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── next.config.js         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
├── jest.config.js         # Jest configuration
├── jest.setup.js          # Jest setup file
├── .eslintrc.json         # ESLint configuration
├── .env.example           # Example environment variables
├── .env                   # Environment variables (gitignored)
└── .gitignore             # Frontend-specific gitignore
```

### Frontend Directory Purposes

- **`app/`**: Next.js 14+ App Router pages and layouts
  - Server Components for SEO-optimized public pages
  - Client Components for interactive features
  - API routes (if needed)

- **`components/`**: Reusable React components
  - Navigation components
  - Form components
  - UI components (buttons, cards, modals)
  - Layout components

- **`lib/`**: Utility functions and helpers
  - API client for backend communication
  - Authentication helpers
  - Form validation utilities
  - Data formatting functions

- **`types/`**: TypeScript type definitions
  - API response types
  - Component prop types
  - Shared interfaces

- **`__tests__/`**: Test files
  - Component tests
  - Integration tests
  - Property-based tests

## Backend Structure (`backend/`)

```
backend/
├── src/                   # Source code
│   ├── config/            # Configuration files
│   │   └── database.ts    # Database connection
│   ├── models/            # TypeScript interfaces and types
│   │   └── .gitkeep
│   ├── services/          # Business logic services
│   │   └── .gitkeep
│   ├── routes/            # Express route handlers
│   │   └── .gitkeep
│   ├── middleware/        # Express middleware
│   │   └── .gitkeep
│   ├── utils/             # Utility functions
│   │   └── .gitkeep
│   ├── __tests__/         # Test files
│   │   └── setup.test.ts
│   └── index.ts           # Application entry point
├── migrations/            # Database migrations
│   └── .gitkeep
├── uploads/               # File uploads (gitignored)
├── dist/                  # Compiled JavaScript (gitignored)
├── node_modules/          # Dependencies (gitignored)
├── package.json           # Backend dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── jest.config.js         # Jest configuration
├── .migration.json        # Migration configuration
├── .env.example           # Example environment variables
├── .env                   # Environment variables (gitignored)
└── .gitignore             # Backend-specific gitignore
```

### Backend Directory Purposes

- **`src/config/`**: Configuration files
  - Database connection setup
  - Email service configuration
  - Storage service configuration
  - Environment-specific settings

- **`src/models/`**: Data models and TypeScript interfaces
  - User model
  - Service model
  - Order model
  - Document model
  - Type definitions for database entities

- **`src/services/`**: Business logic layer
  - AuthService: Authentication and authorization
  - OrderService: Service order management
  - DocumentService: Document upload and management
  - KYCService: KYC verification logic
  - EmailService: Email notifications
  - StorageService: File storage abstraction

- **`src/routes/`**: API route handlers
  - `/api/auth`: Authentication endpoints
  - `/api/services`: Service information endpoints
  - `/api/orders`: Order management endpoints
  - `/api/documents`: Document management endpoints
  - `/api/admin`: Admin-only endpoints

- **`src/middleware/`**: Express middleware functions
  - Authentication middleware (JWT verification)
  - Authorization middleware (role-based access)
  - Error handling middleware
  - Validation middleware
  - Rate limiting middleware
  - File upload middleware (multer)

- **`src/utils/`**: Utility functions
  - Validation helpers
  - Password hashing utilities
  - Token generation and verification
  - File name sanitization
  - Date formatting

- **`migrations/`**: Database migration files
  - Created using node-pg-migrate
  - Version-controlled schema changes
  - Up and down migrations

## Key Files

### Configuration Files

- **`package.json`**: Dependencies, scripts, and project metadata
- **`tsconfig.json`**: TypeScript compiler options
- **`.env`**: Environment variables (not committed to git)
- **`.env.example`**: Template for environment variables

### Frontend Configuration

- **`next.config.js`**: Next.js framework configuration
- **`tailwind.config.ts`**: Tailwind CSS customization
- **`postcss.config.js`**: PostCSS plugins configuration
- **`jest.config.js`**: Jest testing framework configuration

### Backend Configuration

- **`.migration.json`**: Database migration settings
- **`jest.config.js`**: Jest testing framework configuration

## Development Workflow

### Adding a New Feature

1. **Backend**:
   - Create data model in `src/models/`
   - Implement business logic in `src/services/`
   - Create API routes in `src/routes/`
   - Add middleware if needed in `src/middleware/`
   - Write tests in `src/__tests__/`

2. **Frontend**:
   - Create components in `components/`
   - Add pages in `app/`
   - Create API client functions in `lib/`
   - Define types in `types/`
   - Write tests in `__tests__/`

### Database Changes

1. Create a new migration:
   ```bash
   cd backend
   npm run migrate:create migration_name
   ```

2. Edit the migration file in `migrations/`

3. Run the migration:
   ```bash
   npm run migrate:up
   ```

### Testing

- Unit tests: Test individual functions and components
- Integration tests: Test API endpoints and component interactions
- Property-based tests: Test universal properties with fast-check

## Naming Conventions

### Files
- Components: PascalCase (e.g., `UserProfile.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Routes: kebab-case (e.g., `auth-routes.ts`)
- Tests: `*.test.ts` or `*.spec.ts`

### Code
- Variables and functions: camelCase
- Classes and interfaces: PascalCase
- Constants: UPPER_SNAKE_CASE
- Database tables: snake_case

## Best Practices

1. **Separation of Concerns**: Keep business logic in services, not in routes
2. **Type Safety**: Use TypeScript interfaces for all data structures
3. **Error Handling**: Use try-catch blocks and proper error responses
4. **Testing**: Write tests for all new features
5. **Security**: Validate all inputs, use parameterized queries
6. **Documentation**: Comment complex logic and maintain README files

## Additional Resources

- See `README.md` for project overview
- See `SETUP.md` for installation instructions
- See `.kiro/specs/corporate-services-webapp/` for detailed requirements and design

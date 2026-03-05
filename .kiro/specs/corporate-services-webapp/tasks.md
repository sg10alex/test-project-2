# Implementation Plan: Corporate Services Webapp

## Overview

This implementation plan breaks down the Corporate Services Webapp into discrete, incremental coding tasks. The system uses Next.js 14+ with TypeScript for the frontend, Node.js/Express with TypeScript for the backend API, and PostgreSQL for data storage. The implementation follows a bottom-up approach: database setup, backend API services, frontend components, and finally integration.

Each task builds on previous work, with checkpoints to validate progress. Property-based tests validate universal correctness properties, while unit tests cover specific examples and edge cases.

## Tasks

- [ ] 1. Set up project structure and dependencies
  - Initialize Next.js 14+ project with TypeScript and App Router
  - Initialize Express backend project with TypeScript
  - Configure PostgreSQL connection with pg library
  - Set up project directory structure (frontend/backend separation)
  - Install core dependencies: express, jsonwebtoken, bcrypt, multer, nodemailer, express-validator, helmet, cors
  - Install frontend dependencies: next-auth, react-hook-form, tailwind CSS
  - Install testing dependencies: jest, @testing-library/react, supertest, fast-check
  - Configure TypeScript for both frontend and backend
  - Set up environment variables configuration (.env files)
  - _Requirements: All requirements (foundation)_

- [ ] 2. Create database schema and migrations
  - [ ] 2.1 Set up database migration system
    - Install and configure node-pg-migrate
    - Create initial migration structure
    - _Requirements: All requirements (data foundation)_

  - [ ] 2.2 Create users table migration
    - Write migration for users table with all fields and indexes
    - Include constraints for role and kyc_status
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.6, 3.1, 3.2, 3.3, 7.4, 8.2_

  - [ ] 2.3 Create services table migration
    - Write migration for services table with all fields and indexes
    - _Requirements: 1.2, 1.4, 4.1_

  - [ ] 2.4 Create service_orders table migration
    - Write migration for service_orders table with foreign keys and indexes
    - Include status constraint
    - _Requirements: 4.2, 4.3, 4.5, 9.1, 9.3, 10.1, 10.3_

  - [ ] 2.5 Create kyc_documents table migration
    - Write migration for kyc_documents table with foreign keys and indexes
    - Include status constraint
    - _Requirements: 5.1, 5.3, 5.6, 6.1, 6.2, 6.3, 7.2_

  - [ ] 2.6 Create kyc_status_history table migration
    - Write migration for kyc_status_history table with foreign keys and indexes
    - _Requirements: 7.6_

  - [ ] 2.7 Create sessions table migration
    - Write migration for sessions table with indexes
    - _Requirements: 3.4, 3.5, 8.3_

  - [ ] 2.8 Create database seed data
    - Write seed script for initial services data
    - Write seed script for test admin user
    - _Requirements: 1.2, 7.1_

- [ ] 3. Implement core TypeScript data models and interfaces
  - [ ] 3.1 Create TypeScript interfaces for all data models
    - Define User, Service, ServiceOrder, KYCDocument, KYCStatusHistory, Session interfaces
    - Create type definitions for enums (Role, KYCStatus, OrderStatus, DocumentStatus)
    - _Requirements: All requirements (type safety foundation)_

  - [ ] 3.2 Create validation utility functions
    - Implement email validation function
    - Implement password strength validation function
    - Implement file format validation function
    - Implement file size validation function
    - _Requirements: 2.3, 2.4, 5.2, 5.4, 5.5_

  - [ ]* 3.3 Write property test for validation functions
    - **Property 3: Invalid Registration Shows Errors**
    - **Property 13: Document Format Validation**
    - **Property 14: Document Size Validation**
    - **Validates: Requirements 2.3, 5.2, 5.4, 5.5**

- [ ] 4. Implement authentication service and middleware
  - [ ] 4.1 Create AuthService with password hashing
    - Implement password hashing with bcrypt
    - Implement password comparison function
    - Implement JWT token generation
    - Implement JWT token validation
    - _Requirements: 2.2, 3.2, 3.3_

  - [ ] 4.2 Implement user registration logic
    - Create register function in AuthService
    - Validate registration inputs
    - Hash password and create user in database
    - Set initial KYC status to Pending
    - Return user data (without password hash)
    - _Requirements: 2.2, 2.3, 2.4, 2.6_

  - [ ]* 4.3 Write property test for registration
    - **Property 2: Valid Registration Creates Account**
    - **Property 4: Registration Requires Email and Password**
    - **Property 5: New Account Initial State**
    - **Validates: Requirements 2.2, 2.4, 2.6**

  - [ ] 4.4 Implement user login logic
    - Create login function in AuthService
    - Validate credentials against database
    - Generate JWT token on successful login
    - Create session record in database
    - Return token and user data
    - _Requirements: 3.2, 3.3, 3.4_

  - [ ]* 4.5 Write property test for login
    - **Property 6: Valid Login Grants Access**
    - **Property 7: Invalid Login Denies Access**
    - **Validates: Requirements 3.2, 3.3**

  - [ ] 4.6 Implement logout functionality
    - Create logout function that invalidates session
    - Remove session from database
    - _Requirements: 3.5_

  - [ ]* 4.7 Write property test for logout
    - **Property 9: Logout Terminates Session**
    - **Validates: Requirements 3.5**

  - [ ] 4.8 Create authentication middleware
    - Implement JWT verification middleware
    - Extract user from token and attach to request
    - Handle expired tokens
    - Handle invalid tokens
    - _Requirements: 3.4, 8.1, 8.3_

  - [ ]* 4.9 Write property test for session duration
    - **Property 8: Session Duration**
    - **Property 26: Expired Session Re-authentication**
    - **Validates: Requirements 3.4, 8.3**

  - [ ] 4.10 Create authorization middleware
    - Implement role-based access control middleware
    - Create customer-only middleware
    - Create admin-only middleware
    - _Requirements: 8.1, 8.2_

  - [ ]* 4.11 Write unit tests for authentication middleware
    - Test valid token acceptance
    - Test expired token rejection
    - Test invalid token rejection
    - Test missing token handling
    - _Requirements: 3.4, 8.1, 8.3_

- [ ] 5. Checkpoint - Ensure authentication tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement email service
  - [ ] 6.1 Create EmailService with nodemailer
    - Set up nodemailer transport configuration
    - Create base email sending function
    - Implement email templates for all notification types
    - _Requirements: 2.5, 4.4, 7.5, 9.2_

  - [ ] 6.2 Implement registration confirmation email
    - Create sendRegistrationConfirmation function
    - Include welcome message and account details
    - _Requirements: 2.5_

  - [ ] 6.3 Implement order confirmation email
    - Create sendOrderConfirmation function
    - Include order details and status
    - _Requirements: 4.4_

  - [ ] 6.4 Implement order status update email
    - Create sendOrderStatusUpdate function
    - Include updated status and order information
    - _Requirements: 9.2_

  - [ ] 6.5 Implement KYC status update email
    - Create sendKYCStatusUpdate function
    - Include new KYC status and next steps
    - _Requirements: 7.5_

  - [ ]* 6.6 Write unit tests for email service
    - Mock nodemailer transport
    - Test each email type is sent with correct data
    - Test error handling for email failures
    - _Requirements: 2.5, 4.4, 7.5, 9.2_

- [ ] 7. Implement document storage service
  - [ ] 7.1 Create file storage abstraction
    - Create StorageService interface
    - Implement local filesystem storage for development
    - Implement AWS S3 storage for production
    - Configure storage based on environment
    - _Requirements: 5.3, 6.4, 7.3_

  - [ ] 7.2 Implement file upload handling
    - Configure multer for file uploads
    - Implement file name sanitization
    - Implement file storage with unique naming
    - Return file metadata after upload
    - _Requirements: 5.3_

  - [ ] 7.3 Implement file download handling
    - Create file retrieval function
    - Stream file content to response
    - Set appropriate content-type headers
    - _Requirements: 6.4, 7.3_

  - [ ] 7.4 Implement file deletion handling
    - Create file deletion function
    - Remove file from storage
    - Handle missing file errors gracefully
    - _Requirements: 6.2_

  - [ ]* 7.5 Write unit tests for storage service
    - Test file upload with valid files
    - Test file download returns correct content
    - Test file deletion removes file
    - Test error handling for storage failures
    - _Requirements: 5.3, 6.2, 6.4, 7.3_

- [ ] 8. Implement DocumentService for KYC documents
  - [ ] 8.1 Create DocumentService class
    - Implement uploadDocument function
    - Validate file format (PDF, JPG, PNG)
    - Validate file size (max 10MB)
    - Store file using StorageService
    - Create database record with file metadata
    - Associate document with customer
    - _Requirements: 5.2, 5.3, 5.4, 5.5_

  - [ ]* 8.2 Write property test for document upload
    - **Property 13: Document Format Validation**
    - **Property 14: Document Size Validation**
    - **Property 15: Valid Document Upload Storage**
    - **Validates: Requirements 5.2, 5.3, 5.4, 5.5, 5.6**

  - [ ] 8.3 Implement getDocumentsByCustomer function
    - Query database for customer's documents
    - Return document list with metadata
    - _Requirements: 5.6, 6.1_

  - [ ]* 8.4 Write property test for document visibility
    - **Property 15: Valid Document Upload Storage** (visibility aspect)
    - **Property 16: Document Display Information**
    - **Validates: Requirements 5.6, 6.1**

  - [ ] 8.5 Implement downloadDocument function
    - Retrieve document metadata from database
    - Verify document ownership
    - Stream file from storage
    - _Requirements: 6.4_

  - [ ]* 8.6 Write property test for document download
    - **Property 19: Customer Document Download**
    - **Validates: Requirements 6.4**

  - [ ] 8.7 Implement deleteDocument function
    - Check document status (only allow deletion of Pending documents)
    - Verify document ownership
    - Delete file from storage
    - Remove database record
    - _Requirements: 6.2, 6.3_

  - [ ]* 8.8 Write property test for document deletion
    - **Property 17: Pending Document Deletion**
    - **Property 18: Verified Document Protection**
    - **Validates: Requirements 6.2, 6.3**

- [ ] 9. Implement KYCService for verification management
  - [ ] 9.1 Create KYCService class
    - Implement updateKYCStatus function
    - Validate new status (Verified or Rejected)
    - Update user's kyc_status in database
    - Create audit record in kyc_status_history
    - Trigger email notification
    - _Requirements: 7.4, 7.5, 7.6_

  - [ ]* 9.2 Write property test for KYC status update
    - **Property 22: Admin KYC Status Update**
    - **Property 23: KYC Status Change Notification and Audit**
    - **Validates: Requirements 7.4, 7.5, 7.6**

  - [ ] 9.3 Implement getCustomersByKYCStatus function
    - Query database for customers with specified KYC status
    - Return customer list with relevant fields
    - _Requirements: 7.1_

  - [ ]* 9.4 Write property test for KYC filtering
    - **Property 20: Admin Pending KYC View**
    - **Validates: Requirements 7.1**

  - [ ] 9.5 Implement getKYCHistory function
    - Query kyc_status_history for customer
    - Return chronological list of status changes
    - Include admin user and timestamp for each change
    - _Requirements: 7.6_

  - [ ]* 9.6 Write unit tests for KYC history
    - Test history records are created on status change
    - Test history includes admin ID and timestamp
    - Test history is retrievable by customer ID
    - _Requirements: 7.6_

- [ ] 10. Checkpoint - Ensure document and KYC tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Implement OrderService for service orders
  - [ ] 11.1 Create OrderService class
    - Implement createOrder function
    - Validate service exists and is active
    - Create order with Pending status
    - Associate order with customer
    - Trigger order confirmation email
    - _Requirements: 4.2, 4.3, 4.4_

  - [ ]* 11.2 Write property test for order creation
    - **Property 11: Order Creation Initial State**
    - **Validates: Requirements 4.2, 4.3, 4.4**

  - [ ] 11.3 Implement getOrdersByCustomer function
    - Query database for customer's orders
    - Join with services table for service details
    - Return orders with service information
    - _Requirements: 4.5_

  - [ ]* 11.4 Write property test for order visibility
    - **Property 12: Customer Orders Visibility**
    - **Validates: Requirements 4.5**

  - [ ] 11.5 Implement getOrderById function
    - Query database for specific order
    - Join with services table for service details
    - Verify order ownership for customers
    - _Requirements: 9.4_

  - [ ]* 11.6 Write property test for order details
    - **Property 30: Order Service Details Display**
    - **Validates: Requirements 9.4**

  - [ ] 11.7 Implement getAllOrders function for admin
    - Query database for all orders
    - Support filtering by status and customer
    - Join with users and services tables
    - Include customer KYC status in results
    - _Requirements: 10.1, 10.2, 10.4_

  - [ ]* 11.8 Write property test for admin order visibility
    - **Property 31: Admin Order Visibility**
    - **Property 33: Admin Order View Customer Information**
    - **Validates: Requirements 10.1, 10.2, 10.4**

  - [ ] 11.9 Implement updateOrderStatus function
    - Validate status transition
    - Check KYC verification requirement for Completed status
    - Update order status in database
    - Update updated_at timestamp
    - Trigger status change email notification
    - _Requirements: 9.2, 10.3, 10.5_

  - [ ]* 11.10 Write property test for order status updates
    - **Property 28: Order Status Change Notification**
    - **Property 32: Admin Order Status Update**
    - **Property 34: KYC Verification Required for Order Completion**
    - **Validates: Requirements 9.2, 10.3, 10.5**

  - [ ] 11.11 Implement canCompleteOrder validation function
    - Check if customer's KYC status is Verified
    - Return boolean indicating if order can be completed
    - _Requirements: 10.5_

  - [ ]* 11.12 Write unit tests for order status validation
    - Test status transitions are validated
    - Test KYC requirement for completion
    - Test email notifications are triggered
    - _Requirements: 9.2, 10.3, 10.5_

- [ ] 12. Implement backend API routes
  - [ ] 12.1 Create authentication routes
    - POST /api/auth/register - user registration
    - POST /api/auth/login - user login
    - POST /api/auth/logout - user logout
    - GET /api/auth/me - get current user
    - Apply validation middleware to all routes
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.5_

  - [ ]* 12.2 Write integration tests for auth routes
    - Test registration endpoint with valid/invalid data
    - Test login endpoint with valid/invalid credentials
    - Test logout endpoint
    - Test /me endpoint with valid/invalid tokens
    - _Requirements: 2.2, 2.3, 3.2, 3.3, 3.5_

  - [ ] 12.3 Create service routes
    - GET /api/services - list all active services
    - GET /api/services/:id - get service details
    - Apply caching headers for public routes
    - _Requirements: 1.2, 1.4_

  - [ ]* 12.4 Write integration tests for service routes
    - Test services list endpoint
    - Test service details endpoint
    - Test non-existent service returns 404
    - _Requirements: 1.2, 1.4_

  - [ ] 12.5 Create order routes
    - POST /api/orders - create new order (authenticated)
    - GET /api/orders - get customer's orders (authenticated)
    - GET /api/orders/:id - get order details (authenticated)
    - Apply authentication middleware
    - Apply authorization to ensure customers only see their orders
    - _Requirements: 4.1, 4.2, 4.5, 9.1, 9.3, 9.4_

  - [ ]* 12.6 Write integration tests for order routes
    - Test order creation with authentication
    - Test order creation without authentication returns 401
    - Test customer can only view their own orders
    - Test order details include service information
    - _Requirements: 4.2, 4.5, 8.2, 9.4_

  - [ ] 12.7 Create document routes
    - POST /api/documents - upload document (authenticated, multipart)
    - GET /api/documents - list customer's documents (authenticated)
    - GET /api/documents/:id/download - download document (authenticated)
    - DELETE /api/documents/:id - delete document (authenticated)
    - Apply authentication middleware
    - Apply file upload middleware (multer)
    - Apply authorization to ensure customers only access their documents
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 6.1, 6.2, 6.3, 6.4, 8.2_

  - [ ]* 12.8 Write integration tests for document routes
    - Test document upload with valid file
    - Test document upload with invalid format returns 400
    - Test document upload with oversized file returns 400
    - Test document list shows only customer's documents
    - Test document download returns file content
    - Test document deletion for Pending documents
    - Test document deletion for Verified documents is prevented
    - _Requirements: 5.2, 5.3, 5.4, 5.5, 5.6, 6.2, 6.3, 6.4, 8.2_

  - [ ] 12.9 Create admin routes
    - GET /api/admin/customers - list customers with filters (admin only)
    - GET /api/admin/customers/:id - get customer details with documents (admin only)
    - PUT /api/admin/customers/:id/kyc-status - update KYC status (admin only)
    - GET /api/admin/orders - list all orders with filters (admin only)
    - PUT /api/admin/orders/:id/status - update order status (admin only)
    - Apply authentication middleware
    - Apply admin-only authorization middleware
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 10.1, 10.2, 10.3, 10.4, 10.5_

  - [ ]* 12.10 Write integration tests for admin routes
    - Test customer list endpoint with admin token
    - Test customer list endpoint with customer token returns 403
    - Test KYC status update creates audit record
    - Test KYC status update sends email notification
    - Test order list shows all orders with filters
    - Test order status update validates KYC for completion
    - _Requirements: 7.1, 7.4, 7.5, 7.6, 10.1, 10.2, 10.3, 10.5_

  - [ ] 12.11 Implement error handling middleware
    - Create global error handler
    - Return consistent error response format
    - Log errors with context
    - Handle validation errors (400)
    - Handle authentication errors (401)
    - Handle authorization errors (403)
    - Handle not found errors (404)
    - Handle server errors (500)
    - _Requirements: All requirements (error handling)_

  - [ ] 12.12 Implement security middleware
    - Configure helmet for security headers
    - Configure CORS with appropriate origins
    - Implement rate limiting for auth endpoints
    - Add request logging
    - _Requirements: 8.4_

- [ ] 13. Checkpoint - Ensure backend API tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 14. Implement Next.js frontend - Public pages (SSR/SSG)
  - [ ] 14.1 Create HomePage as Server Component
    - Implement server-side rendering for homepage
    - Display company introduction
    - Show featured services
    - Add meta tags for SEO (title, description, Open Graph)
    - Add structured data (JSON-LD) for organization
    - _Requirements: 1.1, 1.2_

  - [ ] 14.2 Create ServicesPage as Server Component
    - Implement server-side rendering with static generation
    - Fetch services from API at build time
    - Display list of services with descriptions
    - Add meta tags for SEO
    - Add structured data for services
    - _Requirements: 1.2_

  - [ ] 14.3 Create ServiceDetailPage as Server Component
    - Implement server-side rendering with dynamic routes
    - Fetch service details from API
    - Display comprehensive service information
    - Add "Order" button (Client Component) for authenticated users
    - Redirect to login for unauthenticated users
    - Add meta tags and structured data for each service
    - _Requirements: 1.4, 4.1_

  - [ ]* 14.4 Write property test for service display
    - **Property 1: Service Selection Displays Details**
    - **Property 10: Authenticated Service View Shows Order Button**
    - **Validates: Requirements 1.4, 4.1**

  - [ ] 14.5 Create ContactPage as Server Component
    - Implement server-side rendering
    - Display company contact information
    - Add meta tags for SEO
    - _Requirements: 1.3_

  - [ ] 14.6 Create layout and navigation components
    - Create root layout with navigation
    - Add links to home, services, contact
    - Add login/register links for unauthenticated users
    - Add portal link for authenticated users
    - Implement responsive design with Tailwind CSS
    - _Requirements: 1.1, 1.2, 1.3_

  - [ ] 14.7 Configure SEO optimization
    - Create sitemap.xml generation
    - Create robots.txt
    - Configure meta tags defaults
    - Set up Open Graph defaults
    - _Requirements: 1.1, 1.2, 1.4_

- [ ] 15. Implement Next.js frontend - Authentication pages (Client Components)
  - [ ] 15.1 Configure next-auth
    - Set up next-auth with JWT strategy
    - Configure credentials provider
    - Set up session management
    - Configure callbacks for token and session
    - _Requirements: 3.2, 3.4, 3.5_

  - [ ] 15.2 Create LoginPage as Client Component
    - Create login form with email and password fields
    - Implement form validation with react-hook-form
    - Call next-auth signIn on form submit
    - Display error messages for invalid credentials
    - Redirect to customer portal on successful login
    - Add link to registration page
    - _Requirements: 3.1, 3.2, 3.3_

  - [ ]* 15.3 Write integration tests for login page
    - Test login form renders correctly
    - Test successful login redirects to portal
    - Test invalid credentials show error
    - _Requirements: 3.2, 3.3_

  - [ ] 15.4 Create RegisterPage as Client Component
    - Create registration form with all required fields
    - Implement client-side validation with react-hook-form
    - Call registration API on form submit
    - Display validation errors
    - Show success message and redirect to login
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [ ]* 15.5 Write integration tests for register page
    - Test registration form renders correctly
    - Test successful registration shows success message
    - Test invalid data shows validation errors
    - _Requirements: 2.2, 2.3_

- [ ] 16. Implement Next.js frontend - Customer Portal (Client Components)
  - [ ] 16.1 Create portal layout with authentication check
    - Create protected layout component
    - Redirect to login if not authenticated
    - Display navigation for portal sections
    - Show user info and logout button
    - _Requirements: 8.1_

  - [ ]* 16.2 Write property test for portal access control
    - **Property 24: Unauthenticated Portal Access Redirect**
    - **Validates: Requirements 8.1**

  - [ ] 16.3 Create CustomerDashboard component
    - Display account overview
    - Show KYC status with visual indicator
    - Display recent orders summary
    - Add quick links to documents and orders
    - _Requirements: 2.6, 4.5, 5.6_

  - [ ] 16.4 Create OrdersPage component
    - Fetch and display customer's orders from API
    - Show order status, date, and service details
    - Implement status filter
    - Create order detail modal/view
    - Display order dates (created and updated)
    - _Requirements: 4.5, 9.1, 9.3, 9.4_

  - [ ]* 16.5 Write property test for order display
    - **Property 27: Order Status Display**
    - **Property 29: Order Date Information Display**
    - **Validates: Requirements 9.1, 9.3**

  - [ ] 16.6 Create DocumentsPage component
    - Create document upload form with file input
    - Validate file format and size on client side
    - Upload document to API
    - Display list of uploaded documents
    - Show document name, upload date, and status
    - Implement download button for each document
    - Implement delete button for Pending documents only
    - Show appropriate messages for validation errors
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 6.1, 6.2, 6.3, 6.4_

  - [ ]* 16.7 Write integration tests for documents page
    - Test document upload with valid file
    - Test document upload with invalid format shows error
    - Test document list displays correctly
    - Test delete button only appears for Pending documents
    - _Requirements: 5.2, 5.4, 5.5, 6.1, 6.2, 6.3_

  - [ ] 16.8 Create ProfilePage component
    - Display customer information
    - Implement password change form
    - Show account creation date
    - _Requirements: 2.2_

  - [ ]* 16.9 Write property test for data isolation
    - **Property 25: Customer Data Isolation**
    - **Validates: Requirements 8.2**

- [ ] 17. Implement Next.js frontend - Admin Portal (Client Components)
  - [ ] 17.1 Create admin layout with role check
    - Create protected admin layout component
    - Redirect to login if not authenticated
    - Redirect to customer portal if not admin role
    - Display admin navigation
    - _Requirements: 7.1, 10.1_

  - [ ] 17.2 Create AdminDashboard component
    - Display statistics (pending KYC count, pending orders count)
    - Show quick links to pending items
    - _Requirements: 7.1, 10.1_

  - [ ] 17.3 Create KYCReviewPage component
    - Fetch and display customers with pending KYC
    - Create customer detail view
    - Display all customer documents with download links
    - Implement document viewer/downloader
    - Add Approve/Reject buttons
    - Show KYC status history
    - Call API to update KYC status
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.6_

  - [ ]* 17.4 Write integration tests for KYC review
    - Test pending customers list displays correctly
    - Test customer documents are visible
    - Test approve/reject updates status
    - _Requirements: 7.1, 7.2, 7.4_

  - [ ] 17.5 Create OrderManagementPage component
    - Fetch and display all orders from API
    - Implement filters by status and customer
    - Display customer KYC status for each order
    - Create order status update interface
    - Prevent marking as Completed if customer KYC not Verified
    - Show validation error if attempting invalid status change
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [ ]* 17.6 Write integration tests for order management
    - Test order list displays all orders
    - Test filters work correctly
    - Test status update works
    - Test completion blocked for unverified customers
    - _Requirements: 10.1, 10.2, 10.3, 10.5_

  - [ ] 17.7 Implement admin document access
    - Add document download functionality in customer detail view
    - Ensure admins can download any customer's documents
    - _Requirements: 7.3_

  - [ ]* 17.8 Write property test for admin document access
    - **Property 21: Admin Customer Document Access**
    - **Validates: Requirements 7.2, 7.3**

- [ ] 18. Checkpoint - Ensure frontend tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 19. Implement HTTPS and security configurations
  - [ ] 19.1 Configure HTTPS for production
    - Set up SSL/TLS certificates
    - Configure Next.js for HTTPS
    - Configure Express for HTTPS
    - Enforce HTTPS redirects
    - _Requirements: 8.4_

  - [ ] 19.2 Implement security headers
    - Configure helmet middleware with appropriate settings
    - Set Content-Security-Policy
    - Set X-Frame-Options
    - Set X-Content-Type-Options
    - _Requirements: 8.4_

  - [ ] 19.3 Configure CORS properly
    - Set allowed origins based on environment
    - Configure credentials support
    - Set appropriate headers
    - _Requirements: 8.4_

  - [ ] 19.4 Implement rate limiting
    - Add rate limiting to auth endpoints
    - Add rate limiting to file upload endpoints
    - Configure appropriate limits
    - _Requirements: Security best practices_

- [ ] 20. Integration and end-to-end wiring
  - [ ] 20.1 Connect frontend to backend API
    - Configure API base URL for different environments
    - Implement API client with authentication headers
    - Handle API errors consistently across frontend
    - _Requirements: All requirements_

  - [ ] 20.2 Test complete user flows
    - Test visitor registration flow
    - Test customer login and portal access flow
    - Test service ordering flow
    - Test document upload and management flow
    - Test admin KYC verification flow
    - Test admin order management flow
    - _Requirements: All requirements_

  - [ ] 20.3 Implement proper error boundaries
    - Add React error boundaries to catch rendering errors
    - Display user-friendly error messages
    - Log errors for debugging
    - _Requirements: All requirements_

  - [ ] 20.4 Add loading states and optimistic updates
    - Implement loading indicators for async operations
    - Add skeleton screens for data fetching
    - Implement optimistic UI updates where appropriate
    - _Requirements: User experience_

  - [ ]* 20.5 Write end-to-end tests
    - Test complete registration and login flow
    - Test complete order creation flow
    - Test complete document upload and verification flow
    - Test complete admin workflows
    - _Requirements: All requirements_

- [ ] 21. Final checkpoint - Comprehensive testing
  - Run all unit tests
  - Run all property-based tests
  - Run all integration tests
  - Run all end-to-end tests
  - Verify all 34 properties are validated
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Property-based tests validate universal correctness properties using fast-check
- Unit tests validate specific examples, edge cases, and error conditions
- Integration tests validate API endpoints and component interactions
- End-to-end tests validate complete user workflows
- Checkpoints ensure incremental validation and provide opportunities for user feedback
- All code should be written in TypeScript for type safety
- Follow Next.js 14+ App Router conventions for frontend
- Follow Express.js best practices for backend API
- Implement proper error handling at all layers
- Ensure security best practices are followed throughout

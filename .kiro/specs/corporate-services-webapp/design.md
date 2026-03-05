# Design Document

## Overview

The Corporate Services Webapp is a full-stack web application that serves three primary user groups: visitors (public users), customers (authenticated users), and administrators. The system architecture uses Next.js for server-side rendering (SSR) and static site generation (SSG) to optimize SEO, with a Node.js/Express backend API and PostgreSQL database.

The application enables visitors to browse company information and services with excellent search engine visibility, allows customers to register, authenticate, order services, and upload KYC documents, and provides administrators with tools to verify KYC documents and manage service orders. Security is paramount, with role-based access control, session management, and HTTPS enforcement for all authenticated operations.

### Key Design Goals

- **SEO Optimization**: Server-side rendering for public pages to maximize search engine visibility
- **Security First**: Implement robust authentication, authorization, and data protection
- **Scalability**: Design for growth in users, documents, and service orders
- **User Experience**: Provide intuitive interfaces for all user types with fast page loads
- **Compliance**: Support KYC verification workflows with audit trails
- **Maintainability**: Clear separation of concerns and modular architecture

## Architecture

### System Architecture

The system follows a client-server architecture with clear separation between presentation, business logic, and data layers:

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer (Browser)                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Next.js Application (SSR/SSG + CSR)            │ │
│  │  - Public Pages (Home, Services, Contact) - SSR/SSG    │ │
│  │  - Auth Pages (Login, Register) - CSR                  │ │
│  │  - Customer Portal (Orders, Documents, Profile) - CSR  │ │
│  │  - Admin Portal (KYC Review, Order Management) - CSR   │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Node.js + Express API Server              │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  Authentication Middleware (JWT)                  │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  Authorization Middleware (Role-based)            │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  REST API Routes                                  │ │ │
│  │  │  - /api/auth (login, register, logout)            │ │ │
│  │  │  - /api/services (public service info)            │ │ │
│  │  │  - /api/orders (customer orders)                  │ │ │
│  │  │  - /api/documents (KYC documents)                 │ │ │
│  │  │  - /api/admin (admin operations)                  │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  Business Logic Services                          │ │ │
│  │  │  - AuthService                                    │ │ │
│  │  │  - OrderService                                   │ │ │
│  │  │  - DocumentService                                │ │ │
│  │  │  - KYCService                                     │ │ │
│  │  │  - EmailService                                   │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              PostgreSQL Database                       │ │
│  │  - Users (customers and admins)                        │ │
│  │  - Services                                            │ │
│  │  - Service_Orders                                      │ │
│  │  - KYC_Documents                                       │ │
│  │  - KYC_Status_History                                  │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         File Storage (AWS S3 or local filesystem)      │ │
│  │  - KYC document files                                  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- Next.js 14+ with App Router for SSR/SSG and SEO optimization
- TypeScript for type safety
- Server Components for public pages (Home, Services, Contact)
- Client Components for interactive features (forms, portals)
- Tailwind CSS for styling
- React Hook Form for form validation
- next-auth for authentication integration

**Backend:**
- Node.js 18+ LTS
- Express.js for REST API
- TypeScript for type safety
- JWT (jsonwebtoken) for authentication
- bcrypt for password hashing
- multer for file upload handling
- nodemailer for email notifications
- express-validator for input validation

**Database:**
- PostgreSQL 14+ for relational data
- pg (node-postgres) for database connectivity
- Database migrations using node-pg-migrate

**File Storage:**
- AWS S3 for production (scalable, secure)
- Local filesystem for development

**Security:**
- helmet for HTTP security headers
- cors for CORS configuration
- express-rate-limit for rate limiting
- HTTPS/TLS for all connections

**SEO Optimization:**
- Server-side rendering for all public pages
- Static generation for service pages
- Dynamic meta tags and Open Graph tags
- Structured data (JSON-LD) for rich snippets
- XML sitemap generation
- robots.txt configuration

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                Single Server Instance (HTTPS)                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Next.js Application (Port 3000)                │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Express API Server (Port 4000)                 │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌───────────────────┐ ┌───────────────┐ ┌───────────────┐
│    PostgreSQL     │ │   AWS S3      │ │ Email Service │
│    Database       │ │ (File Storage)│ │  (nodemailer) │
└───────────────────┘ └───────────────┘ └───────────────┘
```

**Cost-Optimized Single Server Deployment:**
- Single VPS or cloud instance (e.g., DigitalOcean Droplet, AWS EC2 t3.small)
- Next.js and Express running on same server with different ports
- Nginx reverse proxy for HTTPS termination and routing
- PostgreSQL database on same server or managed service
- AWS S3 for file storage (pay-per-use)
- Can scale vertically by upgrading server resources as needed

## Components and Interfaces

### Frontend Components

#### Public Components (Server-Side Rendered)

**HomePage (Server Component)**
- Server-side rendered for optimal SEO
- Displays company introduction with meta tags
- Shows featured services
- Provides navigation to service details and registration
- Includes structured data for search engines

**ServicesPage (Server Component)**
- Server-side rendered with static generation
- Lists all available services
- Displays service descriptions
- Links to detailed service views
- Optimized meta tags and Open Graph data

**ServiceDetailPage (Server Component with Client Interactivity)**
- Server-side rendered for SEO
- Shows comprehensive service information
- Displays pricing and features
- Provides "Order" button for authenticated users (Client Component)
- Redirects to login for unauthenticated users
- Rich snippets with structured data

**ContactPage (Server Component)**
- Server-side rendered
- Displays company contact information
- May include contact form (Client Component)

#### Authentication Components (Client Components)

**LoginPage**
- Client-side rendered for interactivity
- Email and password input fields
- Form validation
- Error message display
- Link to registration page

**RegisterPage**
- Client-side rendered
- Registration form (email, password, name, etc.)
- Client-side validation
- Success/error message display
- Automatic redirect to login after successful registration

#### Customer Portal Components (Client Components)

**CustomerDashboard**
- Overview of account status
- KYC status display
- Recent orders summary
- Quick links to documents and orders

**OrdersPage**
- Lists all customer service orders
- Displays order status, date, and service details
- Filters by status
- Order detail view

**DocumentsPage**
- Document upload interface
- Lists uploaded KYC documents
- Shows document status (Pending, Verified, Rejected)
- Download and delete functionality
- File format and size validation

**ProfilePage**
- Displays customer information
- Password change functionality
- Account settings

#### Admin Portal Components (Client Components)

**AdminDashboard**
- Statistics overview (pending KYC, pending orders)
- Quick access to pending items

**KYCReviewPage**
- Lists customers with pending KYC
- Customer detail view with all documents
- Document viewer/downloader
- Approve/Reject buttons
- Audit trail display

**OrderManagementPage**
- Lists all service orders
- Filters by status and customer
- Order status update interface
- Customer KYC status visibility
- Prevents completion of orders for unverified customers

### Backend API Endpoints

#### Authentication Endpoints

```
POST /api/auth/register
Request: { email, password, firstName, lastName }
Response: { message, userId }

POST /api/auth/login
Request: { email, password }
Response: { token, user: { id, email, role, kycStatus } }

POST /api/auth/logout
Headers: Authorization: Bearer <token>
Response: { message }

GET /api/auth/me
Headers: Authorization: Bearer <token>
Response: { user: { id, email, role, kycStatus } }
```

#### Service Endpoints

```
GET /api/services
Response: { services: [{ id, name, description, price }] }

GET /api/services/:id
Response: { service: { id, name, description, price, details } }
```

#### Order Endpoints

```
POST /api/orders
Headers: Authorization: Bearer <token>
Request: { serviceId }
Response: { order: { id, serviceId, status, createdAt } }

GET /api/orders
Headers: Authorization: Bearer <token>
Response: { orders: [{ id, serviceId, serviceName, status, createdAt, updatedAt }] }

GET /api/orders/:id
Headers: Authorization: Bearer <token>
Response: { order: { id, serviceId, serviceName, status, createdAt, updatedAt, details } }
```

#### Document Endpoints

```
POST /api/documents
Headers: Authorization: Bearer <token>
Content-Type: multipart/form-data
Request: FormData with file
Response: { document: { id, fileName, uploadDate, status } }

GET /api/documents
Headers: Authorization: Bearer <token>
Response: { documents: [{ id, fileName, uploadDate, status }] }

GET /api/documents/:id/download
Headers: Authorization: Bearer <token>
Response: File stream

DELETE /api/documents/:id
Headers: Authorization: Bearer <token>
Response: { message }
```

#### Admin Endpoints

```
GET /api/admin/customers
Headers: Authorization: Bearer <token>
Query: ?kycStatus=Pending
Response: { customers: [{ id, email, firstName, lastName, kycStatus, createdAt }] }

GET /api/admin/customers/:id
Headers: Authorization: Bearer <token>
Response: { customer: { id, email, firstName, lastName, kycStatus, documents: [...] } }

PUT /api/admin/customers/:id/kyc-status
Headers: Authorization: Bearer <token>
Request: { kycStatus: 'Verified' | 'Rejected', notes }
Response: { message, customer: { id, kycStatus } }

GET /api/admin/orders
Headers: Authorization: Bearer <token>
Query: ?status=Pending&customerId=123
Response: { orders: [{ id, customerId, customerName, serviceId, serviceName, status, customerKycStatus }] }

PUT /api/admin/orders/:id/status
Headers: Authorization: Bearer <token>
Request: { status: 'In_Progress' | 'Completed' | 'Cancelled' }
Response: { message, order: { id, status } }
```

### Service Layer Interfaces

#### AuthService

```typescript
interface AuthService {
  register(email: string, password: string, firstName: string, lastName: string): Promise<User>
  login(email: string, password: string): Promise<{ token: string, user: User }>
  validateToken(token: string): Promise<User>
  hashPassword(password: string): Promise<string>
  comparePassword(password: string, hash: string): Promise<boolean>
}
```

#### OrderService

```typescript
interface OrderService {
  createOrder(customerId: number, serviceId: number): Promise<Order>
  getOrdersByCustomer(customerId: number): Promise<Order[]>
  getOrderById(orderId: number): Promise<Order>
  getAllOrders(filters?: OrderFilters): Promise<Order[]>
  updateOrderStatus(orderId: number, status: OrderStatus, adminId: number): Promise<Order>
  canCompleteOrder(orderId: number): Promise<boolean>
}
```

#### DocumentService

```typescript
interface DocumentService {
  uploadDocument(customerId: number, file: File): Promise<Document>
  getDocumentsByCustomer(customerId: number): Promise<Document[]>
  getDocumentById(documentId: number): Promise<Document>
  downloadDocument(documentId: number): Promise<FileStream>
  deleteDocument(documentId: number): Promise<void>
  validateFileFormat(file: File): boolean
  validateFileSize(file: File): boolean
}
```

#### KYCService

```typescript
interface KYCService {
  updateKYCStatus(customerId: number, status: KYCStatus, adminId: number, notes?: string): Promise<void>
  getKYCHistory(customerId: number): Promise<KYCStatusChange[]>
  getCustomersByKYCStatus(status: KYCStatus): Promise<Customer[]>
}
```

#### EmailService

```typescript
interface EmailService {
  sendRegistrationConfirmation(email: string, name: string): Promise<void>
  sendOrderConfirmation(email: string, order: Order): Promise<void>
  sendOrderStatusUpdate(email: string, order: Order): Promise<void>
  sendKYCStatusUpdate(email: string, status: KYCStatus): Promise<void>
}
```

## Data Models

### Database Schema

#### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'admin')),
  kyc_status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (kyc_status IN ('Pending', 'Verified', 'Rejected')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_kyc_status ON users(kyc_status);
CREATE INDEX idx_users_role ON users(role);
```

#### Services Table

```sql
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  details TEXT,
  price DECIMAL(10, 2),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_services_is_active ON services(is_active);
```

#### Service_Orders Table

```sql
CREATE TABLE service_orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In_Progress', 'Completed', 'Cancelled')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_service_orders_customer_id ON service_orders(customer_id);
CREATE INDEX idx_service_orders_status ON service_orders(status);
CREATE INDEX idx_service_orders_created_at ON service_orders(created_at DESC);
```

#### KYC_Documents Table

```sql
CREATE TABLE kyc_documents (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Verified', 'Rejected')),
  uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  verified_at TIMESTAMP,
  verified_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_kyc_documents_customer_id ON kyc_documents(customer_id);
CREATE INDEX idx_kyc_documents_status ON kyc_documents(status);
```

#### KYC_Status_History Table

```sql
CREATE TABLE kyc_status_history (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  previous_status VARCHAR(20) NOT NULL,
  new_status VARCHAR(20) NOT NULL,
  changed_by INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  notes TEXT,
  changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_kyc_status_history_customer_id ON kyc_status_history(customer_id);
CREATE INDEX idx_kyc_status_history_changed_at ON kyc_status_history(changed_at DESC);
```

#### Sessions Table (for session management)

```sql
CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token_hash ON sessions(token_hash);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

### TypeScript Data Models

```typescript
// User model
interface User {
  id: number;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'admin';
  kycStatus: 'Pending' | 'Verified' | 'Rejected';
  createdAt: Date;
  updatedAt: Date;
}

// Service model
interface Service {
  id: number;
  name: string;
  description: string;
  details?: string;
  price?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Service Order model
interface ServiceOrder {
  id: number;
  customerId: number;
  serviceId: number;
  status: 'Pending' | 'In_Progress' | 'Completed' | 'Cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// KYC Document model
interface KYCDocument {
  id: number;
  customerId: number;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  uploadedAt: Date;
  verifiedAt?: Date;
  verifiedBy?: number;
}

// KYC Status History model
interface KYCStatusHistory {
  id: number;
  customerId: number;
  previousStatus: string;
  newStatus: string;
  changedBy: number;
  notes?: string;
  changedAt: Date;
}

// Session model
interface Session {
  id: number;
  userId: number;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
}
```

### Data Validation Rules

**User Registration:**
- Email: Valid email format, unique in database
- Password: Minimum 8 characters, at least one uppercase, one lowercase, one number
- First Name: 1-100 characters, letters only
- Last Name: 1-100 characters, letters only

**Document Upload:**
- File Format: PDF, JPG, PNG only
- File Size: Maximum 10 MB
- File Name: Sanitized to prevent path traversal

**Service Order:**
- Service ID: Must exist and be active
- Customer: Must be authenticated

**KYC Status Update:**
- Status: Must be 'Verified' or 'Rejected'
- Admin: Must have admin role
- Notes: Optional, max 1000 characters


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, I identified several areas where properties can be consolidated to eliminate redundancy:

- Display properties (1.4, 4.5, 5.6, 6.1, 9.1, 9.3, 9.4, 10.1, 10.4) can be grouped into comprehensive data visibility properties
- Email notification properties (2.5, 4.4, 7.5, 9.2) follow the same pattern and can be consolidated
- Document format validation (5.2, 5.4) and size validation (5.5) are related validation rules
- Access control properties (8.1, 8.2, 8.3) form a cohesive security property set
- Status-based permissions (6.2, 6.3, 10.5) are business rule constraints

The following properties represent the unique, non-redundant validation requirements:

### Property 1: Service Selection Displays Details

*For any* service in the system, when a visitor selects that service, the displayed page should contain the service's detailed information including name, description, and full details.

**Validates: Requirements 1.4**

### Property 2: Valid Registration Creates Account

*For any* valid registration data (valid email format, password meeting requirements, valid names), submitting the registration should result in a new customer account being created with that email and name.

**Validates: Requirements 2.2**

### Property 3: Invalid Registration Shows Errors

*For any* invalid registration data (invalid email, weak password, missing required fields), submitting the registration should result in specific validation error messages being displayed and no account being created.

**Validates: Requirements 2.3**

### Property 4: Registration Requires Email and Password

*For any* registration attempt missing either email or password, the registration should fail with an appropriate error message.

**Validates: Requirements 2.4**

### Property 5: New Account Initial State

*For any* newly created customer account, the account should have KYC_Status set to 'Pending' and a confirmation email should be sent to the registered email address.

**Validates: Requirements 2.5, 2.6**

### Property 6: Valid Login Grants Access

*For any* valid customer credentials (correct email and password combination), submitting the login should authenticate the customer and grant access to the Customer_Portal.

**Validates: Requirements 3.2**

### Property 7: Invalid Login Denies Access

*For any* invalid credentials (wrong email, wrong password, or non-existent account), submitting the login should display an error message and deny access to the Customer_Portal.

**Validates: Requirements 3.3**

### Property 8: Session Duration

*For any* authenticated customer session, the session should remain valid for 24 hours from creation, and any request within that period should be authorized.

**Validates: Requirements 3.4**

### Property 9: Logout Terminates Session

*For any* authenticated customer session, invoking the logout function should immediately terminate the session, and subsequent requests with that session token should be unauthorized.

**Validates: Requirements 3.5**

### Property 10: Authenticated Service View Shows Order Button

*For any* service viewed by an authenticated customer, the service page should display an order button that allows the customer to initiate a service order.

**Validates: Requirements 4.1**

### Property 11: Order Creation Initial State

*For any* service order created by a customer, the order should have status 'Pending', be associated with the customer's account, and trigger a confirmation email to the customer.

**Validates: Requirements 4.2, 4.3, 4.4**

### Property 12: Customer Orders Visibility

*For any* customer, accessing the Customer_Portal orders page should display all and only the service orders associated with that customer's account.

**Validates: Requirements 4.5**

### Property 13: Document Format Validation

*For any* file uploaded as a KYC document, if the file format is PDF, JPG, or PNG, the upload should be accepted; otherwise, an error message should be displayed and the upload rejected.

**Validates: Requirements 5.2, 5.4**

### Property 14: Document Size Validation

*For any* file uploaded as a KYC document, if the file size exceeds 10 megabytes, the upload should be rejected with an error message.

**Validates: Requirements 5.5**

### Property 15: Valid Document Upload Storage

*For any* valid document upload (correct format and size), the document should be stored in the system, associated with the customer's account, and appear in the customer's document list.

**Validates: Requirements 5.3, 5.6**

### Property 16: Document Display Information

*For any* KYC document belonging to a customer, when the customer views their documents, the display should include the document name, upload date, and verification status.

**Validates: Requirements 6.1**

### Property 17: Pending Document Deletion

*For any* KYC document with status 'Pending', the customer who owns the document should be able to delete it, and after deletion, the document should no longer appear in their document list.

**Validates: Requirements 6.2**

### Property 18: Verified Document Protection

*For any* KYC document with status 'Verified' or 'Rejected', attempts by the customer to delete the document should be prevented with an appropriate error message.

**Validates: Requirements 6.3**

### Property 19: Customer Document Download

*For any* KYC document belonging to a customer, the customer should be able to download the document and receive the original file content.

**Validates: Requirements 6.4**

### Property 20: Admin Pending KYC View

*For any* set of customers in the system, the admin interface should display all and only customers with KYC_Status 'Pending' when filtering by pending status.

**Validates: Requirements 7.1**

### Property 21: Admin Customer Document Access

*For any* customer, when an admin views that customer's profile, all KYC documents uploaded by that customer should be displayed and downloadable by the admin.

**Validates: Requirements 7.2, 7.3**

### Property 22: Admin KYC Status Update

*For any* customer, an admin should be able to update the customer's KYC_Status to either 'Verified' or 'Rejected', and the update should be reflected in the customer's account.

**Validates: Requirements 7.4**

### Property 23: KYC Status Change Notification and Audit

*For any* KYC status change performed by an admin, the system should send a notification email to the customer and record an audit entry containing the admin user ID, timestamp, previous status, and new status.

**Validates: Requirements 7.5, 7.6**

### Property 24: Unauthenticated Portal Access Redirect

*For any* unauthenticated user attempting to access the Customer_Portal, the system should redirect the user to the login page without granting access to portal content.

**Validates: Requirements 8.1**

### Property 25: Customer Data Isolation

*For any* authenticated customer, the customer should be able to view only their own service orders and KYC documents, and should not be able to access or view data belonging to other customers.

**Validates: Requirements 8.2**

### Property 26: Expired Session Re-authentication

*For any* customer session that has expired (older than 24 hours), attempts to access the Customer_Portal should fail and require re-authentication through the login page.

**Validates: Requirements 8.3**

### Property 27: Order Status Display

*For any* service order, when displayed to the customer or admin, the current status ('Pending', 'In_Progress', 'Completed', or 'Cancelled') should be visible.

**Validates: Requirements 9.1**

### Property 28: Order Status Change Notification

*For any* service order status change, the system should send a notification email to the customer associated with that order.

**Validates: Requirements 9.2**

### Property 29: Order Date Information Display

*For any* service order, when displayed, the order creation date and last updated date should be visible.

**Validates: Requirements 9.3**

### Property 30: Order Service Details Display

*For any* service order, when a customer views the order, detailed information about the ordered service should be displayed.

**Validates: Requirements 9.4**

### Property 31: Admin Order Visibility

*For any* set of service orders in the system, the admin interface should display all orders, with the ability to filter by status and customer.

**Validates: Requirements 10.1, 10.2**

### Property 32: Admin Order Status Update

*For any* service order, an admin should be able to update the order status to 'In_Progress', 'Completed', or 'Cancelled'.

**Validates: Requirements 10.3**

### Property 33: Admin Order View Customer Information

*For any* service order, when an admin views the order, the associated customer information and the customer's current KYC_Status should be displayed.

**Validates: Requirements 10.4**

### Property 34: KYC Verification Required for Order Completion

*For any* service order where the associated customer's KYC_Status is not 'Verified', attempts by an admin to update the order status to 'Completed' should be prevented with an appropriate error message.

**Validates: Requirements 10.5**

## Error Handling

### Error Categories

**Validation Errors (400 Bad Request)**
- Invalid email format
- Weak password (less than 8 characters, missing required character types)
- Missing required fields
- Invalid file format (not PDF, JPG, or PNG)
- File size exceeds 10 MB
- Invalid status transitions

**Authentication Errors (401 Unauthorized)**
- Invalid credentials
- Missing authentication token
- Expired session token
- Invalid token signature

**Authorization Errors (403 Forbidden)**
- Customer attempting to access another customer's data
- Customer attempting to delete verified/rejected documents
- Customer attempting to access admin endpoints
- Admin attempting to complete order for unverified customer

**Not Found Errors (404 Not Found)**
- Service ID does not exist
- Order ID does not exist
- Document ID does not exist
- Customer ID does not exist

**Conflict Errors (409 Conflict)**
- Email already registered
- Duplicate order submission (within time window)

**Server Errors (500 Internal Server Error)**
- Database connection failures
- File storage failures
- Email service failures
- Unexpected exceptions

### Error Response Format

All API errors should return a consistent JSON structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "specific field that caused error",
      "reason": "detailed reason"
    }
  }
}
```

### Error Handling Strategies

**Frontend Error Handling:**
- Display user-friendly error messages
- Highlight form fields with validation errors
- Provide actionable guidance for error resolution
- Log errors to monitoring service
- Implement retry logic for transient failures

**Backend Error Handling:**
- Validate all inputs before processing
- Use try-catch blocks for database operations
- Log all errors with context (user ID, request ID, timestamp)
- Return appropriate HTTP status codes
- Never expose internal error details to clients
- Implement circuit breakers for external services (email)

**File Upload Error Handling:**
- Validate file type before upload
- Check file size before processing
- Sanitize file names to prevent path traversal
- Handle storage failures gracefully
- Clean up partial uploads on failure

**Database Error Handling:**
- Use transactions for multi-step operations
- Implement connection pooling with retry logic
- Handle constraint violations gracefully
- Log query errors with sanitized parameters
- Implement database health checks

## Testing Strategy

### Dual Testing Approach

The testing strategy employs both unit testing and property-based testing to ensure comprehensive coverage:

- **Unit tests** verify specific examples, edge cases, and error conditions
- **Property tests** verify universal properties across all inputs
- Both approaches are complementary and necessary for complete validation

### Unit Testing

Unit tests focus on:
- Specific examples that demonstrate correct behavior
- Integration points between components
- Edge cases (empty inputs, boundary values, special characters)
- Error conditions and exception handling
- Mock external dependencies (database, file storage, email service)

**Unit Test Coverage:**
- Authentication flows (login, register, logout)
- Authorization checks (role-based access)
- File upload validation (format, size)
- Email sending (mocked)
- Database operations (using test database)
- API endpoint responses
- Frontend component rendering
- Form validation

**Testing Tools:**
- Backend: Jest or Mocha for Node.js testing
- Frontend: Jest + React Testing Library for Next.js components
- API Testing: Supertest for HTTP assertions
- Database: PostgreSQL test database with migrations
- Mocking: jest.mock() for external services

### Property-Based Testing

Property-based testing validates universal properties across randomized inputs. Each property test should:
- Run a minimum of 100 iterations
- Generate random valid and invalid inputs
- Reference the design document property
- Use tags: **Feature: corporate-services-webapp, Property {number}: {property_text}**

**Property Testing Library:**
- Backend: fast-check (JavaScript/TypeScript property testing)
- Frontend: fast-check with React Testing Library for Next.js components

**Property Test Examples:**

```typescript
// Property 2: Valid Registration Creates Account
// Feature: corporate-services-webapp, Property 2: Valid Registration Creates Account
test('valid registration creates account', () => {
  fc.assert(
    fc.asyncProperty(
      fc.emailAddress(),
      fc.string({ minLength: 8 }).filter(hasUpperLowerNumber),
      fc.string({ minLength: 1, maxLength: 100 }),
      fc.string({ minLength: 1, maxLength: 100 }),
      async (email, password, firstName, lastName) => {
        const result = await authService.register(email, password, firstName, lastName);
        expect(result.email).toBe(email);
        expect(result.firstName).toBe(firstName);
        expect(result.kycStatus).toBe('Pending');
      }
    ),
    { numRuns: 100 }
  );
});

// Property 13: Document Format Validation
// Feature: corporate-services-webapp, Property 13: Document Format Validation
test('document format validation', () => {
  fc.assert(
    fc.property(
      fc.constantFrom('pdf', 'jpg', 'png', 'doc', 'txt', 'exe'),
      fc.nat(15 * 1024 * 1024), // up to 15MB
      (format, size) => {
        const file = createMockFile(`test.${format}`, size);
        const isValid = documentService.validateFileFormat(file);
        const expectedValid = ['pdf', 'jpg', 'png'].includes(format);
        expect(isValid).toBe(expectedValid);
      }
    ),
    { numRuns: 100 }
  );
});

// Property 34: KYC Verification Required for Order Completion
// Feature: corporate-services-webapp, Property 34: KYC Verification Required for Order Completion
test('cannot complete order without verified KYC', () => {
  fc.assert(
    fc.asyncProperty(
      fc.constantFrom('Pending', 'Rejected'),
      async (kycStatus) => {
        const customer = await createTestCustomer({ kycStatus });
        const order = await createTestOrder(customer.id);
        
        await expect(
          orderService.updateOrderStatus(order.id, 'Completed', adminId)
        ).rejects.toThrow('Customer KYC must be verified');
      }
    ),
    { numRuns: 100 }
  );
});
```

### Integration Testing

Integration tests verify interactions between components:
- API endpoints with database
- File upload with storage service
- Email service integration
- Authentication middleware with protected routes
- Frontend components with API

### End-to-End Testing

E2E tests validate complete user workflows:
- Visitor registration and login flow
- Customer ordering service flow
- Customer document upload flow
- Admin KYC verification flow
- Admin order management flow

**E2E Testing Tools:**
- Playwright or Cypress for browser automation
- Test against staging environment
- Use test data fixtures

### Security Testing

Security-focused tests:
- SQL injection attempts
- XSS attack vectors
- CSRF protection
- Authentication bypass attempts
- Authorization boundary testing
- Session hijacking prevention
- File upload security (path traversal, malicious files)

### Performance Testing

Performance validation:
- API response time benchmarks
- Database query optimization
- File upload performance
- Concurrent user load testing
- Memory leak detection

### Test Data Management

- Use factories for generating test data
- Implement database seeding for consistent test state
- Clean up test data after each test
- Use separate test database
- Mock external services (email, file storage)

### Continuous Integration

- Run all tests on every commit
- Enforce test coverage thresholds (minimum 80%)
- Run property tests with 100 iterations in CI
- Automated security scanning
- Performance regression detection


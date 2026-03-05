# Validation Utilities

This directory contains validation utility functions for the Corporate Services Webapp backend.

## Available Functions

### Email Validation

```typescript
validateEmail(email: string): boolean
```

Validates email format using a standard email regex pattern.

**Requirements:** 2.3, 2.4

**Example:**
```typescript
validateEmail('user@example.com'); // true
validateEmail('invalid-email'); // false
```

### Password Validation

```typescript
validatePassword(password: string): PasswordValidationResult
```

Validates password strength according to requirements:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

**Requirements:** 2.3, 2.4

**Example:**
```typescript
const result = validatePassword('SecurePass123');
// { isValid: true, errors: [] }

const result2 = validatePassword('weak');
// { isValid: false, errors: ['Password must be at least 8 characters long', ...] }
```

### File Format Validation

```typescript
validateFileFormat(fileName: string, mimeType?: string): boolean
```

Validates file format for KYC documents. Accepts only: PDF, JPG, PNG

**Requirements:** 5.2, 5.4

**Example:**
```typescript
validateFileFormat('document.pdf'); // true
validateFileFormat('document.pdf', 'application/pdf'); // true
validateFileFormat('document.doc'); // false
```

### File Size Validation

```typescript
validateFileSize(fileSizeInBytes: number): boolean
```

Validates file size for KYC documents. Maximum allowed size: 10 MB (10,485,760 bytes)

**Requirements:** 5.5

**Example:**
```typescript
validateFileSize(5 * 1024 * 1024); // true (5 MB)
validateFileSize(15 * 1024 * 1024); // false (15 MB)
```

### Helper Functions

```typescript
getMaxFileSize(): number
getAllowedFileExtensions(): string[]
getAllowedMimeTypes(): string[]
```

Utility functions to get validation constants.

## Testing

Unit tests are located in `__tests__/validation.test.ts`.

To run tests:
```bash
npm test validation.test.ts
```

## Usage in Services

These validation functions should be used in:
- AuthService for email and password validation during registration
- DocumentService for file format and size validation during upload
- API route handlers for input validation

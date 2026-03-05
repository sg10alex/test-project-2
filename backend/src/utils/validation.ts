/**
 * Validation utility functions for the Corporate Services Webapp
 * 
 * This module provides validation functions for:
 * - Email format validation
 * - Password strength validation
 * - File format validation (PDF, JPG, PNG)
 * - File size validation (max 10MB)
 */

/**
 * Validates email format using a standard email regex pattern
 * 
 * @param email - The email address to validate
 * @returns true if email format is valid, false otherwise
 * 
 * Requirements: 2.3, 2.4
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }

  // Standard email regex pattern
  // Matches: local-part@domain.tld
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates password strength according to requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * 
 * @param password - The password to validate
 * @returns Object with isValid boolean and array of error messages
 * 
 * Requirements: 2.3, 2.4
 */
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      errors: ['Password is required']
    };
  }

  // Check minimum length
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates file format for KYC documents
 * Accepts only: PDF, JPG, PNG
 * 
 * @param fileName - The name of the file (with extension)
 * @param mimeType - Optional MIME type for additional validation
 * @returns true if file format is valid, false otherwise
 * 
 * Requirements: 5.2, 5.4
 */
export function validateFileFormat(fileName: string, mimeType?: string): boolean {
  if (!fileName || typeof fileName !== 'string') {
    return false;
  }

  // Extract file extension
  const extension = fileName.toLowerCase().split('.').pop();
  
  // Check if extension is one of the allowed formats
  const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
  const extensionValid = extension ? allowedExtensions.includes(extension) : false;

  // If MIME type is provided, validate it as well
  if (mimeType) {
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ];
    const mimeTypeValid = allowedMimeTypes.includes(mimeType.toLowerCase());
    
    return extensionValid && mimeTypeValid;
  }

  return extensionValid;
}

/**
 * Validates file size for KYC documents
 * Maximum allowed size: 10 MB (10,485,760 bytes)
 * 
 * @param fileSizeInBytes - The size of the file in bytes
 * @returns true if file size is within limit, false otherwise
 * 
 * Requirements: 5.5
 */
export function validateFileSize(fileSizeInBytes: number): boolean {
  if (typeof fileSizeInBytes !== 'number' || fileSizeInBytes < 0) {
    return false;
  }

  const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
  return fileSizeInBytes <= MAX_FILE_SIZE_BYTES;
}

/**
 * Gets the maximum allowed file size in bytes
 * 
 * @returns Maximum file size in bytes (10 MB)
 */
export function getMaxFileSize(): number {
  return 10 * 1024 * 1024; // 10 MB
}

/**
 * Gets the list of allowed file extensions
 * 
 * @returns Array of allowed file extensions
 */
export function getAllowedFileExtensions(): string[] {
  return ['pdf', 'jpg', 'jpeg', 'png'];
}

/**
 * Gets the list of allowed MIME types
 * 
 * @returns Array of allowed MIME types
 */
export function getAllowedMimeTypes(): string[] {
  return [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ];
}

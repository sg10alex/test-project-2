/**
 * Property-based tests for validation utility functions
 * 
 * These tests use fast-check to validate universal properties across randomized inputs.
 * Each property test runs 100 iterations with different random inputs.
 * 
 * Feature: corporate-services-webapp
 */

import * as fc from 'fast-check';
import {
  validateEmail,
  validatePassword,
  validateFileFormat,
  validateFileSize,
  getMaxFileSize
} from '../validation';

describe('Property-Based Tests for Validation Functions', () => {
  /**
   * Property 3: Invalid Registration Shows Errors
   * 
   * For any invalid registration data (invalid email, weak password, missing required fields),
   * the validation should fail with appropriate error messages.
   * 
   * **Validates: Requirements 2.3**
   */
  describe('Property 3: Invalid Registration Shows Errors', () => {
    it('should reject invalid email formats', () => {
      // Generator for invalid emails (strings without @ or without domain)
      const invalidEmailGen = fc.oneof(
        fc.string().filter(s => !s.includes('@')), // No @ symbol
        fc.string().filter(s => s.includes('@') && !s.includes('.')), // @ but no domain
        fc.constant(''), // Empty string
        fc.constant('@example.com'), // Missing local part
        fc.constant('user@'), // Missing domain
        fc.constant('user @example.com'), // Space in email
        fc.constant('user@example') // Missing TLD
      );

      fc.assert(
        fc.property(invalidEmailGen, (email) => {
          const result = validateEmail(email);
          expect(result).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it('should reject passwords that are too short', () => {
      // Generator for short passwords (less than 8 characters)
      const shortPasswordGen = fc.string({ minLength: 0, maxLength: 7 });

      fc.assert(
        fc.property(shortPasswordGen, (password) => {
          const result = validatePassword(password);
          expect(result.isValid).toBe(false);
          // Should have at least one error about length
          const hasLengthError = result.errors.some(err => 
            err.includes('at least 8 characters')
          );
          expect(hasLengthError || result.errors.includes('Password is required')).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should reject passwords without uppercase letters', () => {
      // Generator for passwords without uppercase (lowercase + numbers, min 8 chars)
      const noUppercaseGen = fc.string({ minLength: 8, maxLength: 20 })
        .filter(s => /^[a-z0-9]+$/.test(s) && /[0-9]/.test(s) && /[a-z]/.test(s));

      fc.assert(
        fc.property(noUppercaseGen, (password) => {
          const result = validatePassword(password);
          expect(result.isValid).toBe(false);
          expect(result.errors).toContain('Password must contain at least one uppercase letter');
        }),
        { numRuns: 100 }
      );
    });

    it('should reject passwords without lowercase letters', () => {
      // Generator for passwords without lowercase (uppercase + numbers, min 8 chars)
      const noLowercaseGen = fc.string({ minLength: 8, maxLength: 20 })
        .filter(s => /^[A-Z0-9]+$/.test(s) && /[0-9]/.test(s) && /[A-Z]/.test(s));

      fc.assert(
        fc.property(noLowercaseGen, (password) => {
          const result = validatePassword(password);
          expect(result.isValid).toBe(false);
          expect(result.errors).toContain('Password must contain at least one lowercase letter');
        }),
        { numRuns: 100 }
      );
    });

    it('should reject passwords without numbers', () => {
      // Generator for passwords without numbers (letters only, min 8 chars)
      const noNumberGen = fc.string({ minLength: 8, maxLength: 20 })
        .filter(s => /^[A-Za-z]+$/.test(s) && /[A-Z]/.test(s) && /[a-z]/.test(s));

      fc.assert(
        fc.property(noNumberGen, (password) => {
          const result = validatePassword(password);
          expect(result.isValid).toBe(false);
          expect(result.errors).toContain('Password must contain at least one number');
        }),
        { numRuns: 100 }
      );
    });

    it('should reject passwords with multiple validation failures', () => {
      // Generator for passwords that fail multiple criteria
      const multipleFailuresGen = fc.oneof(
        fc.constant(''), // Empty
        fc.constant('abc'), // Too short, no uppercase, no number
        fc.constant('password'), // No uppercase, no number
        fc.constant('PASSWORD'), // No lowercase, no number
        fc.constant('12345678') // No uppercase, no lowercase
      );

      fc.assert(
        fc.property(multipleFailuresGen, (password) => {
          const result = validatePassword(password);
          expect(result.isValid).toBe(false);
          expect(result.errors.length).toBeGreaterThan(0);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 13: Document Format Validation
   * 
   * For any file, if the format is PDF/JPG/PNG, validation accepts it; otherwise rejects it.
   * 
   * **Validates: Requirements 5.2, 5.4**
   */
  describe('Property 13: Document Format Validation', () => {
    it('should accept valid file formats (PDF, JPG, JPEG, PNG)', () => {
      // Generator for valid file formats
      const validFormatGen = fc.record({
        name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => !s.includes('.')),
        extension: fc.constantFrom('pdf', 'jpg', 'jpeg', 'png', 'PDF', 'JPG', 'JPEG', 'PNG')
      }).map(({ name, extension }) => `${name}.${extension}`);

      fc.assert(
        fc.property(validFormatGen, (fileName) => {
          const result = validateFileFormat(fileName);
          expect(result).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should reject invalid file formats', () => {
      // Generator for invalid file formats
      const invalidFormatGen = fc.record({
        name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => !s.includes('.')),
        extension: fc.constantFrom('doc', 'docx', 'txt', 'exe', 'zip', 'mp4', 'mp3', 'avi', 'gif', 'bmp')
      }).map(({ name, extension }) => `${name}.${extension}`);

      fc.assert(
        fc.property(invalidFormatGen, (fileName) => {
          const result = validateFileFormat(fileName);
          expect(result).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it('should validate MIME types correctly when provided', () => {
      // Generator for valid format + MIME type combinations
      const validCombinationGen = fc.constantFrom(
        { fileName: 'document.pdf', mimeType: 'application/pdf' },
        { fileName: 'image.jpg', mimeType: 'image/jpeg' },
        { fileName: 'image.jpeg', mimeType: 'image/jpeg' },
        { fileName: 'picture.png', mimeType: 'image/png' },
        { fileName: 'FILE.PDF', mimeType: 'application/pdf' },
        { fileName: 'IMAGE.JPG', mimeType: 'image/jpeg' }
      );

      fc.assert(
        fc.property(validCombinationGen, ({ fileName, mimeType }) => {
          const result = validateFileFormat(fileName, mimeType);
          expect(result).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should reject mismatched file extension and MIME type', () => {
      // Generator for mismatched format + MIME type combinations
      // Note: The validation requires BOTH extension and MIME type to match
      const mismatchedCombinationGen = fc.constantFrom(
        { fileName: 'document.pdf', mimeType: 'text/plain' },
        { fileName: 'image.jpg', mimeType: 'text/plain' },
        { fileName: 'picture.png', mimeType: 'text/plain' },
        { fileName: 'document.txt', mimeType: 'application/pdf' },
        { fileName: 'file.doc', mimeType: 'image/jpeg' }
      );

      fc.assert(
        fc.property(mismatchedCombinationGen, ({ fileName, mimeType }) => {
          const result = validateFileFormat(fileName, mimeType);
          expect(result).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it('should be case-insensitive for file extensions', () => {
      // Generator for file names with various case combinations
      const caseVariationGen = fc.record({
        name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => !s.includes('.')),
        extension: fc.constantFrom('pdf', 'PDF', 'Pdf', 'jpg', 'JPG', 'Jpg', 'png', 'PNG', 'Png', 'jpeg', 'JPEG', 'Jpeg')
      }).map(({ name, extension }) => `${name}.${extension}`);

      fc.assert(
        fc.property(caseVariationGen, (fileName) => {
          const result = validateFileFormat(fileName);
          expect(result).toBe(true);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 14: Document Size Validation
   * 
   * For any file size, if it exceeds 10MB, validation rejects it.
   * 
   * **Validates: Requirements 5.5**
   */
  describe('Property 14: Document Size Validation', () => {
    it('should accept files within size limit (0 to 10MB)', () => {
      // Generator for valid file sizes (0 to 10MB)
      const validSizeGen = fc.integer({ min: 0, max: 10 * 1024 * 1024 });

      fc.assert(
        fc.property(validSizeGen, (fileSize) => {
          const result = validateFileSize(fileSize);
          expect(result).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should reject files exceeding size limit (> 10MB)', () => {
      // Generator for oversized files (10MB + 1 byte to 100MB)
      const oversizedGen = fc.integer({ min: 10 * 1024 * 1024 + 1, max: 100 * 1024 * 1024 });

      fc.assert(
        fc.property(oversizedGen, (fileSize) => {
          const result = validateFileSize(fileSize);
          expect(result).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it('should accept exactly 10MB', () => {
      const exactLimit = getMaxFileSize();
      const result = validateFileSize(exactLimit);
      expect(result).toBe(true);
    });

    it('should reject exactly 10MB + 1 byte', () => {
      const justOverLimit = getMaxFileSize() + 1;
      const result = validateFileSize(justOverLimit);
      expect(result).toBe(false);
    });

    it('should reject negative file sizes', () => {
      // Generator for negative numbers
      const negativeSizeGen = fc.integer({ min: -1000000, max: -1 });

      fc.assert(
        fc.property(negativeSizeGen, (fileSize) => {
          const result = validateFileSize(fileSize);
          expect(result).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it('should handle boundary values correctly', () => {
      // Test specific boundary values
      const boundaries = [
        { size: 0, expected: true },
        { size: 1, expected: true },
        { size: 1024, expected: true }, // 1 KB
        { size: 1024 * 1024, expected: true }, // 1 MB
        { size: 5 * 1024 * 1024, expected: true }, // 5 MB
        { size: 10 * 1024 * 1024 - 1, expected: true }, // 10 MB - 1 byte
        { size: 10 * 1024 * 1024, expected: true }, // Exactly 10 MB
        { size: 10 * 1024 * 1024 + 1, expected: false }, // 10 MB + 1 byte
        { size: 15 * 1024 * 1024, expected: false }, // 15 MB
      ];

      boundaries.forEach(({ size, expected }) => {
        const result = validateFileSize(size);
        expect(result).toBe(expected);
      });
    });
  });

  /**
   * Combined Property Test: Valid Registration Data
   * 
   * For any valid registration data (valid email format, password meeting requirements),
   * both validations should pass.
   */
  describe('Combined Property: Valid Registration Data', () => {
    it('should accept valid email and password combinations', () => {
      // Generator for valid emails
      const validEmailGen = fc.record({
        local: fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'.split('')), { minLength: 1, maxLength: 20 }),
        domain: fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz'.split('')), { minLength: 2, maxLength: 20 }),
        tld: fc.constantFrom('com', 'org', 'net', 'edu', 'co.uk')
      }).map(({ local, domain, tld }) => `${local}@${domain}.${tld}`);

      // Generator for valid passwords (8+ chars, uppercase, lowercase, number)
      const validPasswordGen = fc.record({
        prefix: fc.constantFrom('A', 'B', 'C', 'D', 'E'), // Uppercase
        middle: fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz'.split('')), { minLength: 6, maxLength: 10 }), // Lowercase (at least 6 to ensure 8+ total)
        suffix: fc.integer({ min: 0, max: 999 }) // Number
      }).map(({ prefix, middle, suffix }) => `${prefix}${middle}${suffix}`);

      fc.assert(
        fc.property(validEmailGen, validPasswordGen, (email, password) => {
          const emailValid = validateEmail(email);
          const passwordResult = validatePassword(password);
          
          expect(emailValid).toBe(true);
          expect(passwordResult.isValid).toBe(true);
          expect(passwordResult.errors).toHaveLength(0);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Combined Property Test: Valid Document Upload
   * 
   * For any valid document (correct format and size), both validations should pass.
   */
  describe('Combined Property: Valid Document Upload', () => {
    it('should accept valid document format and size combinations', () => {
      // Generator for valid documents
      const validDocumentGen = fc.record({
        name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => !s.includes('.')),
        extension: fc.constantFrom('pdf', 'jpg', 'jpeg', 'png'),
        size: fc.integer({ min: 1, max: 10 * 1024 * 1024 })
      });

      fc.assert(
        fc.property(validDocumentGen, ({ name, extension, size }) => {
          const fileName = `${name}.${extension}`;
          const formatValid = validateFileFormat(fileName);
          const sizeValid = validateFileSize(size);
          
          expect(formatValid).toBe(true);
          expect(sizeValid).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should reject documents with invalid format or size', () => {
      // Generator for invalid documents (either bad format or bad size)
      const invalidDocumentGen = fc.oneof(
        // Invalid format, valid size
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => !s.includes('.')),
          extension: fc.constantFrom('doc', 'txt', 'exe'),
          size: fc.integer({ min: 1, max: 10 * 1024 * 1024 })
        }),
        // Valid format, invalid size
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => !s.includes('.')),
          extension: fc.constantFrom('pdf', 'jpg', 'png'),
          size: fc.integer({ min: 10 * 1024 * 1024 + 1, max: 50 * 1024 * 1024 })
        })
      );

      fc.assert(
        fc.property(invalidDocumentGen, ({ name, extension, size }) => {
          const fileName = `${name}.${extension}`;
          const formatValid = validateFileFormat(fileName);
          const sizeValid = validateFileSize(size);
          
          // At least one validation should fail
          expect(formatValid && sizeValid).toBe(false);
        }),
        { numRuns: 100 }
      );
    });
  });
});

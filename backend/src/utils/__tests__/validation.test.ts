/**
 * Unit tests for validation utility functions
 */

import {
  validateEmail,
  validatePassword,
  validateFileFormat,
  validateFileSize,
  getMaxFileSize,
  getAllowedFileExtensions,
  getAllowedMimeTypes
} from '../validation';

describe('Email Validation', () => {
  describe('validateEmail', () => {
    it('should accept valid email addresses', () => {
      const validEmails = [
        'user@example.com',
        'test.user@example.com',
        'user+tag@example.co.uk',
        'user_name@example-domain.com',
        'user123@test.org',
        'a@b.co'
      ];

      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true);
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        '',
        'notanemail',
        '@example.com',
        'user@',
        'user @example.com',
        'user@example',
        'user..name@example.com',
        'user@.com',
        'user@domain..com'
      ];

      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(false);
      });
    });

    it('should handle edge cases', () => {
      expect(validateEmail('  user@example.com  ')).toBe(true); // trimmed
      expect(validateEmail(null as any)).toBe(false);
      expect(validateEmail(undefined as any)).toBe(false);
      expect(validateEmail(123 as any)).toBe(false);
      expect(validateEmail({} as any)).toBe(false);
    });
  });
});

describe('Password Validation', () => {
  describe('validatePassword', () => {
    it('should accept valid passwords', () => {
      const validPasswords = [
        'Password1',
        'MyP@ssw0rd',
        'Abcdefg1',
        'Test1234',
        'SecurePass99'
      ];

      validPasswords.forEach(password => {
        const result = validatePassword(password);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    it('should reject passwords that are too short', () => {
      const result = validatePassword('Pass1');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });

    it('should reject passwords without uppercase letters', () => {
      const result = validatePassword('password1');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should reject passwords without lowercase letters', () => {
      const result = validatePassword('PASSWORD1');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    it('should reject passwords without numbers', () => {
      const result = validatePassword('Password');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('should return multiple errors for passwords with multiple issues', () => {
      const result = validatePassword('pass');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
      expect(result.errors).toContain('Password must be at least 8 characters long');
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('should handle edge cases', () => {
      const emptyResult = validatePassword('');
      expect(emptyResult.isValid).toBe(false);
      expect(emptyResult.errors).toContain('Password is required');

      const nullResult = validatePassword(null as any);
      expect(nullResult.isValid).toBe(false);
      expect(nullResult.errors).toContain('Password is required');

      const undefinedResult = validatePassword(undefined as any);
      expect(undefinedResult.isValid).toBe(false);
      expect(undefinedResult.errors).toContain('Password is required');
    });

    it('should accept passwords with special characters', () => {
      const result = validatePassword('P@ssw0rd!');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});

describe('File Format Validation', () => {
  describe('validateFileFormat', () => {
    it('should accept valid file formats', () => {
      const validFiles = [
        'document.pdf',
        'image.jpg',
        'photo.jpeg',
        'picture.png',
        'FILE.PDF',
        'IMAGE.JPG',
        'test-file.pdf',
        'my_document.png'
      ];

      validFiles.forEach(fileName => {
        expect(validateFileFormat(fileName)).toBe(true);
      });
    });

    it('should reject invalid file formats', () => {
      const invalidFiles = [
        'document.doc',
        'document.docx',
        'file.txt',
        'script.js',
        'executable.exe',
        'archive.zip',
        'video.mp4',
        'audio.mp3'
      ];

      invalidFiles.forEach(fileName => {
        expect(validateFileFormat(fileName)).toBe(false);
      });
    });

    it('should validate MIME types when provided', () => {
      expect(validateFileFormat('document.pdf', 'application/pdf')).toBe(true);
      expect(validateFileFormat('image.jpg', 'image/jpeg')).toBe(true);
      expect(validateFileFormat('image.jpeg', 'image/jpeg')).toBe(true);
      expect(validateFileFormat('picture.png', 'image/png')).toBe(true);
    });

    it('should reject mismatched file extension and MIME type', () => {
      expect(validateFileFormat('document.pdf', 'image/jpeg')).toBe(false);
      expect(validateFileFormat('image.jpg', 'application/pdf')).toBe(false);
      expect(validateFileFormat('document.pdf', 'text/plain')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(validateFileFormat('')).toBe(false);
      expect(validateFileFormat('noextension')).toBe(false);
      expect(validateFileFormat(null as any)).toBe(false);
      expect(validateFileFormat(undefined as any)).toBe(false);
      expect(validateFileFormat('file.')).toBe(false);
    });

    it('should be case-insensitive for extensions', () => {
      expect(validateFileFormat('FILE.PDF')).toBe(true);
      expect(validateFileFormat('Image.JPG')).toBe(true);
      expect(validateFileFormat('Photo.PnG')).toBe(true);
    });
  });
});

describe('File Size Validation', () => {
  describe('validateFileSize', () => {
    it('should accept files within size limit', () => {
      expect(validateFileSize(0)).toBe(true); // Empty file
      expect(validateFileSize(1024)).toBe(true); // 1 KB
      expect(validateFileSize(1024 * 1024)).toBe(true); // 1 MB
      expect(validateFileSize(5 * 1024 * 1024)).toBe(true); // 5 MB
      expect(validateFileSize(10 * 1024 * 1024)).toBe(true); // Exactly 10 MB
    });

    it('should reject files exceeding size limit', () => {
      expect(validateFileSize(10 * 1024 * 1024 + 1)).toBe(false); // 10 MB + 1 byte
      expect(validateFileSize(15 * 1024 * 1024)).toBe(false); // 15 MB
      expect(validateFileSize(100 * 1024 * 1024)).toBe(false); // 100 MB
    });

    it('should handle edge cases', () => {
      expect(validateFileSize(-1)).toBe(false); // Negative size
      expect(validateFileSize(NaN)).toBe(false);
      expect(validateFileSize(Infinity)).toBe(false);
      expect(validateFileSize(null as any)).toBe(false);
      expect(validateFileSize(undefined as any)).toBe(false);
      expect(validateFileSize('1024' as any)).toBe(false); // String instead of number
    });
  });

  describe('getMaxFileSize', () => {
    it('should return 10 MB in bytes', () => {
      expect(getMaxFileSize()).toBe(10 * 1024 * 1024);
      expect(getMaxFileSize()).toBe(10485760);
    });
  });
});

describe('Helper Functions', () => {
  describe('getAllowedFileExtensions', () => {
    it('should return array of allowed extensions', () => {
      const extensions = getAllowedFileExtensions();
      expect(extensions).toEqual(['pdf', 'jpg', 'jpeg', 'png']);
      expect(extensions).toHaveLength(4);
    });
  });

  describe('getAllowedMimeTypes', () => {
    it('should return array of allowed MIME types', () => {
      const mimeTypes = getAllowedMimeTypes();
      expect(mimeTypes).toEqual([
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png'
      ]);
      expect(mimeTypes).toHaveLength(4);
    });
  });
});

describe('Integration Scenarios', () => {
  it('should validate complete registration data', () => {
    const email = 'user@example.com';
    const password = 'SecurePass123';

    expect(validateEmail(email)).toBe(true);
    expect(validatePassword(password).isValid).toBe(true);
  });

  it('should validate complete document upload', () => {
    const fileName = 'kyc-document.pdf';
    const mimeType = 'application/pdf';
    const fileSize = 5 * 1024 * 1024; // 5 MB

    expect(validateFileFormat(fileName, mimeType)).toBe(true);
    expect(validateFileSize(fileSize)).toBe(true);
  });

  it('should reject invalid registration data', () => {
    const invalidEmail = 'notanemail';
    const weakPassword = 'pass';

    expect(validateEmail(invalidEmail)).toBe(false);
    expect(validatePassword(weakPassword).isValid).toBe(false);
  });

  it('should reject invalid document upload', () => {
    const invalidFileName = 'document.doc';
    const oversizedFile = 15 * 1024 * 1024; // 15 MB

    expect(validateFileFormat(invalidFileName)).toBe(false);
    expect(validateFileSize(oversizedFile)).toBe(false);
  });
});

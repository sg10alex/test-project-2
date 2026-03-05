import { AuthService } from '../AuthService';
import jwt from 'jsonwebtoken';
import pool from '../../config/database';

// Mock the database pool
jest.mock('../../config/database', () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
  },
}));

// Mock the validation utilities
jest.mock('../../utils/validation', () => ({
  validateEmail: jest.fn(),
  validatePassword: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  const originalEnv = process.env;
  const mockPool = pool as jest.Mocked<typeof pool>;
  const mockQuery = mockPool.query as jest.MockedFunction<any>;
  const { validateEmail, validatePassword } = require('../../utils/validation');

  beforeAll(() => {
    // Set up test environment variables
    process.env.JWT_SECRET = 'test-secret-key-for-testing';
    process.env.JWT_EXPIRES_IN = '24h';
  });

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('constructor', () => {
    it('should throw error if JWT_SECRET is not configured', () => {
      const tempSecret = process.env.JWT_SECRET;
      delete process.env.JWT_SECRET;

      expect(() => new AuthService()).toThrow('JWT_SECRET environment variable is not configured');

      process.env.JWT_SECRET = tempSecret;
    });
  });

  describe('register', () => {
    it('should successfully register a new user with valid inputs', async () => {
      // Mock validation functions
      validateEmail.mockReturnValue(true);
      validatePassword.mockReturnValue({ isValid: true, errors: [] });

      // Mock database queries
      mockQuery
        .mockResolvedValueOnce({ rows: [] } as any) // Email doesn't exist
        .mockResolvedValueOnce({ // User created
          rows: [{
            id: 1,
            email: 'test@example.com',
            first_name: 'John',
            last_name: 'Doe',
            role: 'customer',
            kyc_status: 'Pending',
            created_at: new Date(),
            updated_at: new Date(),
          }]
        } as any);

      const result = await authService.register('test@example.com', 'Password123', 'John', 'Doe');

      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'customer',
        kycStatus: 'Pending',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      expect(validateEmail).toHaveBeenCalledWith('test@example.com');
      expect(validatePassword).toHaveBeenCalledWith('Password123');
      expect(mockQuery).toHaveBeenCalledTimes(2);
    });

    it('should throw error for invalid email format', async () => {
      validateEmail.mockReturnValue(false);

      await expect(
        authService.register('invalid-email', 'Password123', 'John', 'Doe')
      ).rejects.toThrow('Invalid email format');

      expect(mockQuery).not.toHaveBeenCalled();
    });

    it('should throw error for weak password', async () => {
      validateEmail.mockReturnValue(true);
      validatePassword.mockReturnValue({
        isValid: false,
        errors: ['Password must be at least 8 characters long', 'Password must contain at least one number']
      });

      await expect(
        authService.register('test@example.com', 'weak', 'John', 'Doe')
      ).rejects.toThrow('Password validation failed');

      expect(mockQuery).not.toHaveBeenCalled();
    });

    it('should throw error for missing first name', async () => {
      validateEmail.mockReturnValue(true);
      validatePassword.mockReturnValue({ isValid: true, errors: [] });

      await expect(
        authService.register('test@example.com', 'Password123', '', 'Doe')
      ).rejects.toThrow('First name is required');

      expect(mockQuery).not.toHaveBeenCalled();
    });

    it('should throw error for missing last name', async () => {
      validateEmail.mockReturnValue(true);
      validatePassword.mockReturnValue({ isValid: true, errors: [] });

      await expect(
        authService.register('test@example.com', 'Password123', 'John', '')
      ).rejects.toThrow('Last name is required');

      expect(mockQuery).not.toHaveBeenCalled();
    });

    it('should throw error if email already exists', async () => {
      validateEmail.mockReturnValue(true);
      validatePassword.mockReturnValue({ isValid: true, errors: [] });

      // Mock email already exists
      mockQuery.mockResolvedValueOnce({ rows: [{ id: 1 }] } as any);

      await expect(
        authService.register('existing@example.com', 'Password123', 'John', 'Doe')
      ).rejects.toThrow('Email already registered');

      expect(mockQuery).toHaveBeenCalledTimes(1);
    });

    it('should set initial KYC status to Pending', async () => {
      validateEmail.mockReturnValue(true);
      validatePassword.mockReturnValue({ isValid: true, errors: [] });

      mockQuery
        .mockResolvedValueOnce({ rows: [] } as any)
        .mockResolvedValueOnce({
          rows: [{
            id: 1,
            email: 'test@example.com',
            first_name: 'John',
            last_name: 'Doe',
            role: 'customer',
            kyc_status: 'Pending',
            created_at: new Date(),
            updated_at: new Date(),
          }]
        } as any);

      const result = await authService.register('test@example.com', 'Password123', 'John', 'Doe');

      expect(result.kycStatus).toBe('Pending');
    });

    it('should set role to customer', async () => {
      validateEmail.mockReturnValue(true);
      validatePassword.mockReturnValue({ isValid: true, errors: [] });

      mockQuery
        .mockResolvedValueOnce({ rows: [] } as any)
        .mockResolvedValueOnce({
          rows: [{
            id: 1,
            email: 'test@example.com',
            first_name: 'John',
            last_name: 'Doe',
            role: 'customer',
            kyc_status: 'Pending',
            created_at: new Date(),
            updated_at: new Date(),
          }]
        } as any);

      const result = await authService.register('test@example.com', 'Password123', 'John', 'Doe');

      expect(result.role).toBe('customer');
    });

    it('should not return password hash', async () => {
      validateEmail.mockReturnValue(true);
      validatePassword.mockReturnValue({ isValid: true, errors: [] });

      mockQuery
        .mockResolvedValueOnce({ rows: [] } as any)
        .mockResolvedValueOnce({
          rows: [{
            id: 1,
            email: 'test@example.com',
            first_name: 'John',
            last_name: 'Doe',
            role: 'customer',
            kyc_status: 'Pending',
            created_at: new Date(),
            updated_at: new Date(),
          }]
        } as any);

      const result = await authService.register('test@example.com', 'Password123', 'John', 'Doe');

      expect(result).not.toHaveProperty('passwordHash');
    });

    it('should trim and lowercase email', async () => {
      validateEmail.mockReturnValue(true);
      validatePassword.mockReturnValue({ isValid: true, errors: [] });

      mockQuery
        .mockResolvedValueOnce({ rows: [] } as any)
        .mockResolvedValueOnce({
          rows: [{
            id: 1,
            email: 'test@example.com',
            first_name: 'John',
            last_name: 'Doe',
            role: 'customer',
            kyc_status: 'Pending',
            created_at: new Date(),
            updated_at: new Date(),
          }]
        } as any);

      await authService.register('  TEST@EXAMPLE.COM  ', 'Password123', 'John', 'Doe');

      // Check that the query was called with lowercase trimmed email
      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT id FROM users WHERE email = $1',
        ['test@example.com']
      );
    });

    it('should trim first and last names', async () => {
      validateEmail.mockReturnValue(true);
      validatePassword.mockReturnValue({ isValid: true, errors: [] });

      mockQuery
        .mockResolvedValueOnce({ rows: [] } as any)
        .mockResolvedValueOnce({
          rows: [{
            id: 1,
            email: 'test@example.com',
            first_name: 'John',
            last_name: 'Doe',
            role: 'customer',
            kyc_status: 'Pending',
            created_at: new Date(),
            updated_at: new Date(),
          }]
        } as any);

      await authService.register('test@example.com', 'Password123', '  John  ', '  Doe  ');

      // Check that the INSERT query was called with trimmed names
      const insertCall = mockQuery.mock.calls[1];
      expect(insertCall[1][2]).toBe('John');
      expect(insertCall[1][3]).toBe('Doe');
    });
  });

  describe('hashPassword', () => {
    it('should hash a valid password', async () => {
      const password = 'TestPassword123';
      const hash = await authService.hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'TestPassword123';
      const hash1 = await authService.hashPassword(password);
      const hash2 = await authService.hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });

    it('should throw error for empty password', async () => {
      await expect(authService.hashPassword('')).rejects.toThrow('Password cannot be empty');
    });

    it('should throw error for whitespace-only password', async () => {
      await expect(authService.hashPassword('   ')).rejects.toThrow('Password cannot be empty');
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching password and hash', async () => {
      const password = 'TestPassword123';
      const hash = await authService.hashPassword(password);
      const isMatch = await authService.comparePassword(password, hash);

      expect(isMatch).toBe(true);
    });

    it('should return false for non-matching password and hash', async () => {
      const password = 'TestPassword123';
      const wrongPassword = 'WrongPassword456';
      const hash = await authService.hashPassword(password);
      const isMatch = await authService.comparePassword(wrongPassword, hash);

      expect(isMatch).toBe(false);
    });

    it('should throw error for empty password', async () => {
      const hash = await authService.hashPassword('TestPassword123');
      await expect(authService.comparePassword('', hash)).rejects.toThrow('Password cannot be empty');
    });

    it('should throw error for empty hash', async () => {
      await expect(authService.comparePassword('TestPassword123', '')).rejects.toThrow('Hash cannot be empty');
    });

    it('should throw error for whitespace-only password', async () => {
      const hash = await authService.hashPassword('TestPassword123');
      await expect(authService.comparePassword('   ', hash)).rejects.toThrow('Password cannot be empty');
    });
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token for customer', () => {
      const userId = 1;
      const email = 'customer@example.com';
      const role = 'customer' as const;

      const token = authService.generateToken(userId, email, role);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT has 3 parts
    });

    it('should generate a valid JWT token for admin', () => {
      const userId = 2;
      const email = 'admin@example.com';
      const role = 'admin' as const;

      const token = authService.generateToken(userId, email, role);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('should include correct payload in token', () => {
      const userId = 1;
      const email = 'test@example.com';
      const role = 'customer' as const;

      const token = authService.generateToken(userId, email, role);
      const decoded = jwt.decode(token) as any;

      expect(decoded.userId).toBe(userId);
      expect(decoded.email).toBe(email);
      expect(decoded.role).toBe(role);
      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
    });

    it('should throw error for invalid user ID (zero)', () => {
      expect(() => authService.generateToken(0, 'test@example.com', 'customer')).toThrow('Invalid user ID');
    });

    it('should throw error for invalid user ID (negative)', () => {
      expect(() => authService.generateToken(-1, 'test@example.com', 'customer')).toThrow('Invalid user ID');
    });

    it('should throw error for empty email', () => {
      expect(() => authService.generateToken(1, '', 'customer')).toThrow('Email cannot be empty');
    });

    it('should throw error for invalid role', () => {
      expect(() => authService.generateToken(1, 'test@example.com', 'invalid' as any)).toThrow('Invalid role');
    });
  });

  describe('validateToken', () => {
    it('should validate and decode a valid token', async () => {
      const userId = 1;
      const email = 'test@example.com';
      const role = 'customer' as const;

      const token = authService.generateToken(userId, email, role);
      const payload = await authService.validateToken(token);

      expect(payload.userId).toBe(userId);
      expect(payload.email).toBe(email);
      expect(payload.role).toBe(role);
    });

    it('should throw error for empty token', async () => {
      await expect(authService.validateToken('')).rejects.toThrow('Token cannot be empty');
    });

    it('should throw error for whitespace-only token', async () => {
      await expect(authService.validateToken('   ')).rejects.toThrow('Token cannot be empty');
    });

    it('should throw error for invalid token format', async () => {
      await expect(authService.validateToken('invalid-token')).rejects.toThrow('Invalid token');
    });

    it('should throw error for token with invalid signature', async () => {
      const token = jwt.sign({ userId: 1, email: 'test@example.com', role: 'customer' }, 'wrong-secret');
      await expect(authService.validateToken(token)).rejects.toThrow('Invalid token');
    });

    it('should throw error for expired token', async () => {
      const token = jwt.sign(
        { userId: 1, email: 'test@example.com', role: 'customer' },
        process.env.JWT_SECRET!,
        { expiresIn: '0s' }
      );

      // Wait a moment to ensure token expires
      await new Promise(resolve => setTimeout(resolve, 100));

      await expect(authService.validateToken(token)).rejects.toThrow('Token has expired');
    });

    it('should throw error for token with missing userId', async () => {
      const token = jwt.sign({ email: 'test@example.com', role: 'customer' }, process.env.JWT_SECRET!);
      await expect(authService.validateToken(token)).rejects.toThrow('Invalid token payload structure');
    });

    it('should throw error for token with missing email', async () => {
      const token = jwt.sign({ userId: 1, role: 'customer' }, process.env.JWT_SECRET!);
      await expect(authService.validateToken(token)).rejects.toThrow('Invalid token payload structure');
    });

    it('should throw error for token with missing role', async () => {
      const token = jwt.sign({ userId: 1, email: 'test@example.com' }, process.env.JWT_SECRET!);
      await expect(authService.validateToken(token)).rejects.toThrow('Invalid token payload structure');
    });
  });

  describe('integration tests', () => {
    it('should complete full authentication flow', async () => {
      // Hash password
      const password = 'SecurePassword123';
      const hash = await authService.hashPassword(password);

      // Verify password
      const isValid = await authService.comparePassword(password, hash);
      expect(isValid).toBe(true);

      // Generate token
      const token = authService.generateToken(1, 'user@example.com', 'customer');
      expect(token).toBeDefined();

      // Validate token
      const payload = await authService.validateToken(token);
      expect(payload.userId).toBe(1);
      expect(payload.email).toBe('user@example.com');
      expect(payload.role).toBe('customer');
    });
  });
});

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Role } from '../models/types';
import { User } from '../models/User';
import pool from '../config/database';
import { validateEmail, validatePassword } from '../utils/validation';

/**
 * JWT token payload interface
 */
export interface TokenPayload {
  userId: number;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}

/**
 * AuthService class
 * Provides authentication and authorization functionality including:
 * - Password hashing and comparison
 * - JWT token generation and validation
 */
export class AuthService {
  private readonly saltRounds: number = 10;
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn: string;

  constructor() {
    // Load JWT configuration from environment variables
    this.jwtSecret = process.env.JWT_SECRET || '';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';

    // Validate that JWT_SECRET is configured
    if (!this.jwtSecret) {
      throw new Error('JWT_SECRET environment variable is not configured');
    }
  }

  /**
   * Register a new user
   * @param email - User's email address
   * @param password - User's plain text password
   * @param firstName - User's first name
   * @param lastName - User's last name
   * @returns Promise resolving to the created user (without password hash)
   * @throws Error if validation fails, email already exists, or database operation fails
   * 
   * Requirements: 2.2, 2.3, 2.4, 2.6
   */
  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<Omit<User, 'passwordHash'>> {
    // Validate email format
    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
    }

    // Validate first name
    if (!firstName || firstName.trim().length === 0) {
      throw new Error('First name is required');
    }
    if (firstName.trim().length > 100) {
      throw new Error('First name must not exceed 100 characters');
    }

    // Validate last name
    if (!lastName || lastName.trim().length === 0) {
      throw new Error('Last name is required');
    }
    if (lastName.trim().length > 100) {
      throw new Error('Last name must not exceed 100 characters');
    }

    try {
      // Check if email already exists
      const existingUserResult = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email.trim().toLowerCase()]
      );

      if (existingUserResult.rows.length > 0) {
        throw new Error('Email already registered');
      }

      // Hash the password
      const passwordHash = await this.hashPassword(password);

      // Create user in database with role='customer' and kycStatus='Pending'
      const insertResult = await pool.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, role, kyc_status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
         RETURNING id, email, first_name, last_name, role, kyc_status, created_at, updated_at`,
        [
          email.trim().toLowerCase(),
          passwordHash,
          firstName.trim(),
          lastName.trim(),
          'customer',
          'Pending'
        ]
      );

      const row = insertResult.rows[0];

      // Return user data without password hash
      return {
        id: row.id,
        email: row.email,
        firstName: row.first_name,
        lastName: row.last_name,
        role: row.role,
        kycStatus: row.kyc_status,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
    } catch (error) {
      // Re-throw known errors
      if (error instanceof Error && (
        error.message.includes('Email already registered') ||
        error.message.includes('validation failed')
      )) {
        throw error;
      }

      // Handle database errors
      throw new Error(`Failed to register user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Hash a password using bcrypt
   * @param password - Plain text password to hash
   * @returns Promise resolving to the hashed password
   * @throws Error if password is empty or hashing fails
   */
  async hashPassword(password: string): Promise<string> {
    if (!password || password.trim().length === 0) {
      throw new Error('Password cannot be empty');
    }

    try {
      const hash = await bcrypt.hash(password, this.saltRounds);
      return hash;
    } catch (error) {
      throw new Error(`Failed to hash password: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Compare a plain text password with a hashed password
   * @param password - Plain text password to compare
   * @param hash - Hashed password to compare against
   * @returns Promise resolving to true if passwords match, false otherwise
   * @throws Error if inputs are invalid or comparison fails
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    if (!password || password.trim().length === 0) {
      throw new Error('Password cannot be empty');
    }

    if (!hash || hash.trim().length === 0) {
      throw new Error('Hash cannot be empty');
    }

    try {
      const isMatch = await bcrypt.compare(password, hash);
      return isMatch;
    } catch (error) {
      throw new Error(`Failed to compare password: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate a JWT token for a user
   * @param userId - User's unique identifier
   * @param email - User's email address
   * @param role - User's role (customer or admin)
   * @returns JWT token string
   * @throws Error if token generation fails
   */
  generateToken(userId: number, email: string, role: Role): string {
    if (!userId || userId <= 0) {
      throw new Error('Invalid user ID');
    }

    if (!email || email.trim().length === 0) {
      throw new Error('Email cannot be empty');
    }

    if (!role || (role !== 'customer' && role !== 'admin')) {
      throw new Error('Invalid role');
    }

    try {
      const payload: TokenPayload = {
        userId,
        email,
        role,
      };

      const token = jwt.sign(
        payload,
        this.jwtSecret,
        { expiresIn: this.jwtExpiresIn } as jwt.SignOptions
      );

      return token;
    } catch (error) {
      throw new Error(`Failed to generate token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate and decode a JWT token
   * @param token - JWT token string to validate
   * @returns Promise resolving to the decoded token payload
   * @throws Error if token is invalid, expired, or verification fails
   */
  async validateToken(token: string): Promise<TokenPayload> {
    if (!token || token.trim().length === 0) {
      throw new Error('Token cannot be empty');
    }

    try {
      const decoded = jwt.verify(token, this.jwtSecret) as TokenPayload;

      // Validate the decoded payload structure
      if (!decoded.userId || !decoded.email || !decoded.role) {
        throw new Error('Invalid token payload structure');
      }

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token has expired');
      } else if (error instanceof jwt.NotBeforeError) {
        throw new Error('Token not yet valid');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      } else {
        throw new Error(`Failed to validate token: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }
}


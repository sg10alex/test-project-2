import { Role, KYCStatus } from './types';

/**
 * User model interface
 * Represents both customers and administrators in the system
 */
export interface User {
  id: number;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: Role;
  kycStatus: KYCStatus;
  createdAt: Date;
  updatedAt: Date;
}

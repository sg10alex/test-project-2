/**
 * Type definitions for enums used across the application
 */

/**
 * User role types
 */
export type Role = 'customer' | 'admin';

/**
 * KYC verification status types
 */
export type KYCStatus = 'Pending' | 'Verified' | 'Rejected';

/**
 * Service order status types
 */
export type OrderStatus = 'Pending' | 'In_Progress' | 'Completed' | 'Cancelled';

/**
 * Document verification status types
 */
export type DocumentStatus = 'Pending' | 'Verified' | 'Rejected';

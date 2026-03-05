/**
 * Session model interface
 * Represents an authenticated user session
 */
export interface Session {
  id: number;
  userId: number;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
}

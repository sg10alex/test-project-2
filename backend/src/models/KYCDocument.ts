import { DocumentStatus } from './types';

/**
 * KYCDocument model interface
 * Represents a document uploaded by a customer for KYC verification
 */
export interface KYCDocument {
  id: number;
  customerId: number;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  status: DocumentStatus;
  uploadedAt: Date;
  verifiedAt?: Date;
  verifiedBy?: number;
}

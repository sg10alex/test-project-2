/**
 * KYCStatusHistory model interface
 * Represents an audit record of KYC status changes for a customer
 */
export interface KYCStatusHistory {
  id: number;
  customerId: number;
  previousStatus: string;
  newStatus: string;
  changedBy: number;
  notes?: string;
  changedAt: Date;
}

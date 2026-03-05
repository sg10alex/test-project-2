import { OrderStatus } from './types';

/**
 * ServiceOrder model interface
 * Represents a customer's order for a specific service
 */
export interface ServiceOrder {
  id: number;
  customerId: number;
  serviceId: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

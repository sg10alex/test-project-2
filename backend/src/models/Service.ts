/**
 * Service model interface
 * Represents corporate services offered by the company
 */
export interface Service {
  id: number;
  name: string;
  description: string;
  details?: string;
  price?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

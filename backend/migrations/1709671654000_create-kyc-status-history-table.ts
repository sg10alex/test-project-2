import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  // Create kyc_status_history table
  pgm.createTable('kyc_status_history', {
    id: 'id', // This is a shorthand for SERIAL PRIMARY KEY
    customer_id: {
      type: 'integer',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    previous_status: {
      type: 'varchar(20)',
      notNull: true,
    },
    new_status: {
      type: 'varchar(20)',
      notNull: true,
    },
    changed_by: {
      type: 'integer',
      notNull: true,
      references: 'users(id)',
      onDelete: 'RESTRICT',
    },
    notes: {
      type: 'text',
      notNull: false,
    },
    changed_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
  });

  // Create indexes
  pgm.createIndex('kyc_status_history', 'customer_id', {
    name: 'idx_kyc_status_history_customer_id',
  });

  pgm.createIndex('kyc_status_history', 'changed_at', {
    name: 'idx_kyc_status_history_changed_at',
    method: 'btree',
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  // Drop indexes first
  pgm.dropIndex('kyc_status_history', 'changed_at', {
    name: 'idx_kyc_status_history_changed_at',
  });

  pgm.dropIndex('kyc_status_history', 'customer_id', {
    name: 'idx_kyc_status_history_customer_id',
  });

  // Drop the table
  pgm.dropTable('kyc_status_history');
}

import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  // Create kyc_documents table
  pgm.createTable('kyc_documents', {
    id: 'id', // This is a shorthand for SERIAL PRIMARY KEY
    customer_id: {
      type: 'integer',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    file_name: {
      type: 'varchar(255)',
      notNull: true,
    },
    file_path: {
      type: 'varchar(500)',
      notNull: true,
    },
    file_size: {
      type: 'integer',
      notNull: true,
    },
    mime_type: {
      type: 'varchar(100)',
      notNull: true,
    },
    status: {
      type: 'varchar(20)',
      notNull: true,
      default: 'Pending',
      check: "status IN ('Pending', 'Verified', 'Rejected')",
    },
    uploaded_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
    verified_at: {
      type: 'timestamp',
      notNull: false,
    },
    verified_by: {
      type: 'integer',
      notNull: false,
      references: 'users(id)',
      onDelete: 'SET NULL',
    },
  });

  // Create indexes
  pgm.createIndex('kyc_documents', 'customer_id', {
    name: 'idx_kyc_documents_customer_id',
  });

  pgm.createIndex('kyc_documents', 'status', {
    name: 'idx_kyc_documents_status',
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  // Drop indexes first
  pgm.dropIndex('kyc_documents', 'status', {
    name: 'idx_kyc_documents_status',
  });

  pgm.dropIndex('kyc_documents', 'customer_id', {
    name: 'idx_kyc_documents_customer_id',
  });

  // Drop the table
  pgm.dropTable('kyc_documents');
}

import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  // Create users table
  pgm.createTable('users', {
    id: 'id', // This is a shorthand for SERIAL PRIMARY KEY
    email: {
      type: 'varchar(255)',
      notNull: true,
      unique: true,
    },
    password_hash: {
      type: 'varchar(255)',
      notNull: true,
    },
    first_name: {
      type: 'varchar(100)',
      notNull: true,
    },
    last_name: {
      type: 'varchar(100)',
      notNull: true,
    },
    role: {
      type: 'varchar(20)',
      notNull: true,
      check: "role IN ('customer', 'admin')",
    },
    kyc_status: {
      type: 'varchar(20)',
      notNull: true,
      default: 'Pending',
      check: "kyc_status IN ('Pending', 'Verified', 'Rejected')",
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
  });

  // Create indexes
  pgm.createIndex('users', 'email', {
    name: 'idx_users_email',
  });

  pgm.createIndex('users', 'kyc_status', {
    name: 'idx_users_kyc_status',
  });

  pgm.createIndex('users', 'role', {
    name: 'idx_users_role',
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  // Drop indexes first
  pgm.dropIndex('users', 'role', {
    name: 'idx_users_role',
  });

  pgm.dropIndex('users', 'kyc_status', {
    name: 'idx_users_kyc_status',
  });

  pgm.dropIndex('users', 'email', {
    name: 'idx_users_email',
  });

  // Drop the table
  pgm.dropTable('users');
}

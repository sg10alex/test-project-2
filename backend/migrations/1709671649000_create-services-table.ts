import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  // Create services table
  pgm.createTable('services', {
    id: 'id', // This is a shorthand for SERIAL PRIMARY KEY
    name: {
      type: 'varchar(255)',
      notNull: true,
    },
    description: {
      type: 'text',
      notNull: true,
    },
    details: {
      type: 'text',
      notNull: false,
    },
    price: {
      type: 'decimal(10, 2)',
      notNull: false,
    },
    is_active: {
      type: 'boolean',
      notNull: true,
      default: true,
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

  // Create index on is_active
  pgm.createIndex('services', 'is_active', {
    name: 'idx_services_is_active',
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  // Drop index first
  pgm.dropIndex('services', 'is_active', {
    name: 'idx_services_is_active',
  });

  // Drop the table
  pgm.dropTable('services');
}

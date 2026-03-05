import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  // Create service_orders table
  pgm.createTable('service_orders', {
    id: 'id', // This is a shorthand for SERIAL PRIMARY KEY
    customer_id: {
      type: 'integer',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    service_id: {
      type: 'integer',
      notNull: true,
      references: 'services(id)',
      onDelete: 'RESTRICT',
    },
    status: {
      type: 'varchar(20)',
      notNull: true,
      default: 'Pending',
      check: "status IN ('Pending', 'In_Progress', 'Completed', 'Cancelled')",
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
  pgm.createIndex('service_orders', 'customer_id', {
    name: 'idx_service_orders_customer_id',
  });

  pgm.createIndex('service_orders', 'status', {
    name: 'idx_service_orders_status',
  });

  pgm.createIndex('service_orders', 'created_at', {
    name: 'idx_service_orders_created_at',
    method: 'btree',
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  // Drop indexes first
  pgm.dropIndex('service_orders', 'created_at', {
    name: 'idx_service_orders_created_at',
  });

  pgm.dropIndex('service_orders', 'status', {
    name: 'idx_service_orders_status',
  });

  pgm.dropIndex('service_orders', 'customer_id', {
    name: 'idx_service_orders_customer_id',
  });

  // Drop the table
  pgm.dropTable('service_orders');
}

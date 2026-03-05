import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  // Create sessions table
  pgm.createTable('sessions', {
    id: 'id', // This is a shorthand for SERIAL PRIMARY KEY
    user_id: {
      type: 'integer',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    token_hash: {
      type: 'varchar(255)',
      notNull: true,
    },
    expires_at: {
      type: 'timestamp',
      notNull: true,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
  });

  // Create indexes
  pgm.createIndex('sessions', 'user_id', {
    name: 'idx_sessions_user_id',
  });

  pgm.createIndex('sessions', 'token_hash', {
    name: 'idx_sessions_token_hash',
  });

  pgm.createIndex('sessions', 'expires_at', {
    name: 'idx_sessions_expires_at',
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  // Drop indexes first
  pgm.dropIndex('sessions', 'expires_at', {
    name: 'idx_sessions_expires_at',
  });

  pgm.dropIndex('sessions', 'token_hash', {
    name: 'idx_sessions_token_hash',
  });

  pgm.dropIndex('sessions', 'user_id', {
    name: 'idx_sessions_user_id',
  });

  // Drop the table
  pgm.dropTable('sessions');
}

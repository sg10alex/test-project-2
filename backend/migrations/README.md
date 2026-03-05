# Database Migrations

This directory contains database migrations for the Corporate Services Webapp using `node-pg-migrate`.

## Overview

The migration system is configured and ready to use. Migrations are managed using `node-pg-migrate`, which provides a simple and reliable way to version control your database schema.

## Configuration

The migration system is configured via `.migration.json` in the backend root:

```json
{
  "database-url": {
    "env": "DATABASE_URL"
  },
  "migrations-dir": "migrations",
  "migrations-table": "pgmigrations",
  "schema": "public"
}
```

## Environment Setup

Before running migrations, ensure your `.env` file has the correct database configuration:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/corporate_services
```

## Available Commands

All migration commands should be run from the `backend` directory:

### Create a new migration
```bash
npm run migrate:create <migration-name>
```

Example:
```bash
npm run migrate:create create-users-table
```

This creates a new migration file in `migrations/` with a timestamp prefix.

### Run pending migrations
```bash
npm run migrate:up
```

This applies all pending migrations to your database.

### Rollback the last migration
```bash
npm run migrate:down
```

This reverts the most recently applied migration.

### Rollback multiple migrations
```bash
npm run migrate:down -- -m 2
```

This reverts the last 2 migrations.

## Migration File Structure

Each migration file exports two functions:

```typescript
import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  // Code to apply the migration
  pgm.createTable('users', {
    id: 'id',
    email: { type: 'varchar(255)', notNull: true, unique: true },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  // Code to revert the migration
  pgm.dropTable('users');
}
```

## Best Practices

1. **Always test migrations**: Test both `up` and `down` functions before committing
2. **Keep migrations small**: Each migration should handle one logical change
3. **Never modify existing migrations**: Once a migration is committed and run in production, create a new migration for changes
4. **Use transactions**: Migrations run in transactions by default, ensuring atomicity
5. **Document complex migrations**: Add comments explaining non-obvious changes

## Migration Tracking

The system tracks applied migrations in the `pgmigrations` table. This table is automatically created on the first migration run.

## Upcoming Migrations

According to the design document, the following migrations need to be created:

1. **users table** - Customer and admin accounts
2. **services table** - Corporate services catalog
3. **service_orders table** - Customer service orders
4. **kyc_documents table** - KYC document metadata
5. **kyc_status_history table** - Audit trail for KYC changes
6. **sessions table** - User session management

## Troubleshooting

### Migration fails with connection error
- Verify your `DATABASE_URL` in `.env` is correct
- Ensure PostgreSQL is running
- Check that the database exists

### Migration table not found
- Run `npm run migrate:up` to create the migrations table

### Need to reset database
```bash
# Drop all tables and re-run migrations
npm run migrate:down -- -m 999
npm run migrate:up
```

## Resources

- [node-pg-migrate documentation](https://salsita.github.io/node-pg-migrate/)
- [PostgreSQL documentation](https://www.postgresql.org/docs/)

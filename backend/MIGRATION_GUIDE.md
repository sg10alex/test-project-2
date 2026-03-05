# Database Migration Quick Start Guide

This guide will help you get started with the database migration system for the Corporate Services Webapp.

## Prerequisites

1. PostgreSQL 14+ installed and running
2. Node.js 18+ installed
3. Backend dependencies installed (`npm install` in the `backend` directory)

## Initial Setup

### 1. Configure Database Connection

Copy the `.env.example` file to `.env` and update the database credentials:

```bash
cd backend
cp .env.example .env
```

Edit `.env` and set your database connection:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/corporate_services
```

### 2. Create Database

If the database doesn't exist yet, create it:

```bash
# Using psql
psql -U postgres -c "CREATE DATABASE corporate_services;"

# Or using createdb
createdb -U postgres corporate_services
```

### 3. Verify Setup

Test that the migration system is properly configured:

```bash
npm run migrate:test
```

This will check:
- Environment variables are set
- Database connection works
- Migration configuration is correct
- Migration scripts are available

## Creating Migrations

### Create a New Migration

```bash
npm run migrate:create <migration-name>
```

Example:
```bash
npm run migrate:create create-users-table
```

This creates a file like `migrations/1234567890123_create-users-table.ts`

### Edit the Migration File

Open the generated file and add your schema changes:

```typescript
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('users', {
    id: 'id', // Shorthand for SERIAL PRIMARY KEY
    email: { 
      type: 'varchar(255)', 
      notNull: true, 
      unique: true 
    },
    password_hash: { 
      type: 'varchar(255)', 
      notNull: true 
    },
    first_name: { 
      type: 'varchar(100)', 
      notNull: true 
    },
    last_name: { 
      type: 'varchar(100)', 
      notNull: true 
    },
    role: { 
      type: 'varchar(20)', 
      notNull: true,
      check: "role IN ('customer', 'admin')"
    },
    kyc_status: { 
      type: 'varchar(20)', 
      notNull: true,
      default: 'Pending',
      check: "kyc_status IN ('Pending', 'Verified', 'Rejected')"
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  });

  // Add indexes
  pgm.createIndex('users', 'email');
  pgm.createIndex('users', 'kyc_status');
  pgm.createIndex('users', 'role');
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('users');
}
```

## Running Migrations

### Apply All Pending Migrations

```bash
npm run migrate:up
```

This runs all migrations that haven't been applied yet.

### Rollback Last Migration

```bash
npm run migrate:down
```

### Rollback Multiple Migrations

```bash
npm run migrate:down -- -m 3
```

This rolls back the last 3 migrations.

## Common Migration Patterns

### Creating a Table with Foreign Key

```typescript
export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('service_orders', {
    id: 'id',
    customer_id: {
      type: 'integer',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE'
    },
    service_id: {
      type: 'integer',
      notNull: true,
      references: 'services(id)',
      onDelete: 'RESTRICT'
    },
    status: {
      type: 'varchar(20)',
      notNull: true,
      default: 'Pending',
      check: "status IN ('Pending', 'In_Progress', 'Completed', 'Cancelled')"
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  });

  pgm.createIndex('service_orders', 'customer_id');
  pgm.createIndex('service_orders', 'status');
  pgm.createIndex('service_orders', ['created_at'], { method: 'btree', order: 'DESC' });
}
```

### Adding a Column to Existing Table

```typescript
export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumn('users', {
    phone_number: {
      type: 'varchar(20)',
      notNull: false
    }
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropColumn('users', 'phone_number');
}
```

### Creating an Index

```typescript
export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createIndex('users', ['email', 'role'], {
    name: 'idx_users_email_role',
    unique: false
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropIndex('users', ['email', 'role'], {
    name: 'idx_users_email_role'
  });
}
```

## Migration Workflow

1. **Create migration**: `npm run migrate:create <name>`
2. **Edit migration file**: Add your schema changes
3. **Test locally**: `npm run migrate:up`
4. **Verify changes**: Check database with psql or GUI tool
5. **Test rollback**: `npm run migrate:down` (optional)
6. **Re-apply**: `npm run migrate:up` (if you tested rollback)
7. **Commit**: Add migration file to git

## Troubleshooting

### Error: "relation already exists"

The migration has already been run. Check the `pgmigrations` table:

```sql
SELECT * FROM pgmigrations ORDER BY run_on DESC;
```

### Error: "database does not exist"

Create the database first:

```bash
createdb -U postgres corporate_services
```

### Error: "password authentication failed"

Check your `.env` file and ensure the database credentials are correct.

### Need to Reset Everything

```bash
# Rollback all migrations
npm run migrate:down -- -m 999

# Re-apply all migrations
npm run migrate:up
```

## Next Steps

According to the implementation plan, you need to create these migrations in order:

1. ✅ Migration system setup (Task 2.1) - **COMPLETE**
2. ✅ Users table (Task 2.2) - **COMPLETE**
3. ✅ Services table (Task 2.3) - **COMPLETE**
4. ✅ Service orders table (Task 2.4) - **COMPLETE**
5. ✅ KYC documents table (Task 2.5) - **COMPLETE**
6. ✅ KYC status history table (Task 2.6) - **COMPLETE**
7. ✅ Sessions table (Task 2.7) - **COMPLETE**
8. ✅ Seed data (Task 2.8) - **COMPLETE**

See `migrations/README.md` for more detailed information about the migration system.

## Resources

- [node-pg-migrate Documentation](https://salsita.github.io/node-pg-migrate/)
- [PostgreSQL Data Types](https://www.postgresql.org/docs/current/datatype.html)
- [PostgreSQL Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)

/**
 * Test script to verify migration system setup
 * Run with: npx ts-node scripts/test-migration-setup.ts
 */

import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function testMigrationSetup() {
  console.log('Testing migration system setup...\n');

  // Check environment variables
  console.log('1. Checking environment variables:');
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('   ❌ DATABASE_URL not found in environment');
    console.log('   Please ensure you have a .env file with DATABASE_URL set');
    process.exit(1);
  }
  
  console.log(`   ✓ DATABASE_URL: ${databaseUrl.replace(/:[^:@]+@/, ':****@')}`);

  // Test database connection
  console.log('\n2. Testing database connection:');
  const pool = new Pool({
    connectionString: databaseUrl,
  });

  try {
    const client = await pool.connect();
    console.log('   ✓ Successfully connected to PostgreSQL');
    
    // Check PostgreSQL version
    const versionResult = await client.query('SELECT version()');
    const version = versionResult.rows[0].version;
    console.log(`   ✓ PostgreSQL version: ${version.split(',')[0]}`);
    
    // Check if database exists
    const dbResult = await client.query('SELECT current_database()');
    console.log(`   ✓ Current database: ${dbResult.rows[0].current_database}`);
    
    client.release();
  } catch (error) {
    console.error('   ❌ Database connection failed:', error instanceof Error ? error.message : error);
    console.log('\n   Troubleshooting:');
    console.log('   - Ensure PostgreSQL is running');
    console.log('   - Verify DATABASE_URL is correct');
    console.log('   - Check that the database exists');
    await pool.end();
    process.exit(1);
  }

  // Check migration configuration
  console.log('\n3. Checking migration configuration:');
  const fs = require('fs');
  const path = require('path');
  
  const migrationConfigPath = path.join(__dirname, '..', '.migration.json');
  if (fs.existsSync(migrationConfigPath)) {
    console.log('   ✓ .migration.json found');
    const config = JSON.parse(fs.readFileSync(migrationConfigPath, 'utf8'));
    console.log(`   ✓ Migrations directory: ${config['migrations-dir']}`);
    console.log(`   ✓ Migrations table: ${config['migrations-table']}`);
  } else {
    console.error('   ❌ .migration.json not found');
    await pool.end();
    process.exit(1);
  }

  // Check migrations directory
  console.log('\n4. Checking migrations directory:');
  const migrationsDir = path.join(__dirname, '..', 'migrations');
  if (fs.existsSync(migrationsDir)) {
    console.log('   ✓ migrations/ directory exists');
    const files = fs.readdirSync(migrationsDir);
    const migrationFiles = files.filter((f: string) => f.endsWith('.js') || f.endsWith('.ts'));
    console.log(`   ✓ Found ${migrationFiles.length} migration file(s)`);
    if (migrationFiles.length > 0) {
      migrationFiles.forEach((file: string) => {
        console.log(`     - ${file}`);
      });
    }
  } else {
    console.error('   ❌ migrations/ directory not found');
    await pool.end();
    process.exit(1);
  }

  // Check package.json scripts
  console.log('\n5. Checking migration scripts:');
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  const requiredScripts = ['migrate:up', 'migrate:down', 'migrate:create'];
  requiredScripts.forEach(script => {
    if (packageJson.scripts[script]) {
      console.log(`   ✓ npm run ${script} - available`);
    } else {
      console.error(`   ❌ npm run ${script} - missing`);
    }
  });

  await pool.end();

  console.log('\n✅ Migration system setup is complete and ready to use!\n');
  console.log('Next steps:');
  console.log('  1. Create your first migration: npm run migrate:create create-users-table');
  console.log('  2. Edit the migration file in migrations/');
  console.log('  3. Run migrations: npm run migrate:up');
  console.log('  4. See migrations/README.md for more information\n');
}

testMigrationSetup().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});

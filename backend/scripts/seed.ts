import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'corporate_services',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

async function seedServices() {
  console.log('Seeding services...');
  
  const services = [
    {
      name: 'Business Registration',
      description: 'Complete business registration services including company formation, registration with authorities, and obtaining necessary licenses.',
      details: 'Our business registration service handles all aspects of setting up your company. We assist with choosing the right business structure, preparing and filing incorporation documents, obtaining your EIN, and registering with state and local authorities. The process typically takes 2-4 weeks depending on jurisdiction.',
      price: 1500.00,
    },
    {
      name: 'Tax Consultation',
      description: 'Professional tax planning and consultation services to optimize your tax strategy and ensure compliance.',
      details: 'Our experienced tax consultants provide comprehensive tax planning services for businesses and individuals. We help you understand your tax obligations, identify deductions and credits, plan for quarterly payments, and develop strategies to minimize tax liability while maintaining full compliance with tax laws.',
      price: 250.00,
    },
    {
      name: 'Legal Advisory',
      description: 'Expert legal advice for corporate matters, contracts, compliance, and business transactions.',
      details: 'Our legal advisory service provides expert guidance on a wide range of corporate legal matters. We assist with contract drafting and review, corporate governance, regulatory compliance, intellectual property protection, employment law, and business transactions. Our team of experienced attorneys ensures your business operates within legal frameworks.',
      price: 350.00,
    },
    {
      name: 'Accounting Services',
      description: 'Full-service accounting including bookkeeping, financial statements, and financial analysis.',
      details: 'We offer comprehensive accounting services tailored to your business needs. Our services include monthly bookkeeping, accounts payable and receivable management, financial statement preparation, bank reconciliation, payroll processing, and financial analysis. We use modern accounting software to ensure accuracy and provide real-time financial insights.',
      price: 800.00,
    },
    {
      name: 'Annual Compliance Filing',
      description: 'Annual report filing and compliance services to maintain good standing with regulatory authorities.',
      details: 'Stay compliant with annual filing requirements through our comprehensive compliance service. We handle annual report preparation and filing, registered agent services, business license renewals, and ongoing compliance monitoring. We ensure all deadlines are met and your business maintains good standing with all relevant authorities.',
      price: 500.00,
    },
    {
      name: 'Corporate Restructuring',
      description: 'Strategic corporate restructuring services including mergers, acquisitions, and organizational changes.',
      details: 'Our corporate restructuring service helps businesses navigate complex organizational changes. We provide strategic planning for mergers and acquisitions, entity conversions, spin-offs, and reorganizations. Our team handles all legal, tax, and regulatory aspects to ensure smooth transitions while maximizing value and minimizing disruption.',
      price: 5000.00,
    },
  ];

  for (const service of services) {
    // Check if service already exists
    const existingService = await pool.query(
      'SELECT id FROM services WHERE name = $1',
      [service.name]
    );

    if (existingService.rows.length === 0) {
      await pool.query(
        `INSERT INTO services (name, description, details, price, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [service.name, service.description, service.details, service.price, true]
      );
      console.log(`  ✓ Created service: ${service.name}`);
    } else {
      console.log(`  - Service already exists: ${service.name}`);
    }
  }
}

async function seedAdminUser() {
  console.log('Seeding admin user...');
  
  const adminEmail = 'admin@example.com';
  const adminPassword = 'Admin123!'; // Default password - should be changed after first login
  
  // Check if admin user already exists
  const existingAdmin = await pool.query(
    'SELECT id FROM users WHERE email = $1',
    [adminEmail]
  );

  if (existingAdmin.rows.length === 0) {
    // Hash the password
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    
    await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, kyc_status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [adminEmail, passwordHash, 'Admin', 'User', 'admin', 'Verified']
    );
    console.log(`  ✓ Created admin user: ${adminEmail}`);
    console.log(`  ℹ Default password: ${adminPassword}`);
    console.log(`  ⚠ Please change the password after first login!`);
  } else {
    console.log(`  - Admin user already exists: ${adminEmail}`);
  }
}

async function seed() {
  try {
    console.log('Starting database seed...\n');
    
    // Test database connection
    await pool.query('SELECT NOW()');
    console.log('✓ Database connection successful\n');
    
    // Run seed functions
    await seedServices();
    console.log('');
    await seedAdminUser();
    
    console.log('\n✓ Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the seed function
seed();

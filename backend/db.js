const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: 'aws-1-ap-southeast-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.utwsaxexddsmxlirzfrb',
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
  family: 4
});

module.exports = pool;
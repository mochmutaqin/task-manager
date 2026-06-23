const { Pool } = require('pg');
const dns = require('dns');
require('dotenv').config();

dns.setDefaultResultOrder('ipv4first');

// String koneksi Pooler IPv4 baru milikmu
const connectionStringIPv4 = "postgresql://postgres.utwsaxexddsmxlirzfrb:TaskManager123!@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require";

console.log("DATABASE_URL yang digunakan:", connectionStringIPv4);

const pool = new Pool({
  // Kita paksa menggunakan connectionStringIPv4 yang baru di sini
  connectionString: connectionStringIPv4,
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;
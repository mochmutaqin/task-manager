const { Pool } = require('pg');
const dns = require('dns');
require('dotenv').config();

dns.setDefaultResultOrder('ipv4first');

// Ubah URL di bawah: ganti ?sslmode=require menjadi ?sslmode=no-verify
const connectionStringIPv4 = "postgresql://postgres.utwsaxexddsmxlirzfrb:TaskManager123!@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=no-verify";

console.log("DATABASE_URL yang digunakan:", connectionStringIPv4);

const pool = new Pool({
  connectionString: connectionStringIPv4,
  // Tetap pertahankan ini agar pg client mengabaikan validasi sertifikat lokal
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;
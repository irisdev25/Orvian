const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

console.log('Intentando conectar a BD:', {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    ssl: (process.env.DATABASE_URL || process.env.POSTGRES_URL) ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 10000, // 10 segundos para dar tiempo a Neon a despertar
    max: 10 // Limite de conexiones para evitar saturar el tier gratuito
});

// Probar conexion de inmediato
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Error conectando a PostgreSQL:', err.message);
  } else {
    console.log('✅ Base de datos conectada correctamente');
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};

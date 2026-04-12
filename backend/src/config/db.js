/**
 * Pool de conexiones a PostgreSQL (pg).
 * Reutiliza conexiones en lugar de abrir una nueva en cada consulta.
 */
const { Pool } = require('pg');
// Asegura que .env esté cargado si este módulo se importa antes que server.js
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

module.exports = pool;

/**
 * Punto de entrada del API: crea la app Express, aplica middleware global
 * y registra las rutas bajo prefijos /api/...
 */
const express = require('express');
// Permite que el front (otro origen/puerto) llame a este servidor sin bloqueo del navegador
const cors = require('cors');
// Lee variables desde el archivo .env (PORT, DB_*, JWT_SECRET, etc.)
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
// Parsea cuerpos JSON en req.body para POST/PUT
app.use(express.json());

// Prefijo común: todo lo de autenticación queda en /api/auth/...
app.use('/api/auth', authRoutes);
// CRUD de usuarios en /api/users/...
app.use('/api/users', userRoutes);

// Puerto HTTP del servidor; si no defines PORT en .env, usa 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

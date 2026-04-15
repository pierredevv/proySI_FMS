const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes')//caso de uso de freed CU03
const profesorRoutes = require('./routes/profesorRoutes'); //caso de uso de freed CU04
const gestionRoutes = require('./routes/gestionRoutes');
const estructuraRoutes = require('./routes/estructuraRoutes');
const materiaRoutes = require('./routes/materiaRoutes');

const app = express();

app.use(cors());
app.use(express.json());

//RUTAS DE LA API 
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes) //ruta del caso de uso de freed CU03
app.use('/api/profesores', profesorRoutes); //ruta del caso de uso de freed CU04
app.use('/api/gestiones', gestionRoutes);
app.use('/api/estructura', estructuraRoutes);
app.use('/api/materias', materiaRoutes);

const PORT = process.env.PORT || 3000; // Esto es si el puerto del cors esta ocupado uso el puerto 3000

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})


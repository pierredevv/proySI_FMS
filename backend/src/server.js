const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const roleRoutes = require("./routes/roleRoutes");
const profesorRoutes = require("./routes/profesorRoutes");
const gestionRoutes = require("./routes/gestionRoutes");
const estructuraRoutes = require("./routes/estructuraRoutes");
const materiaRoutes = require("./routes/materiaRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// RUTAS
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/profesores", profesorRoutes);
app.use("/api/gestiones", gestionRoutes);
app.use("/api/estructura", estructuraRoutes);
app.use("/api/materias", materiaRoutes);

const PORT = Number(process.env.PORT) || 3000;

const startServer = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Conectado a PostgreSQL");

    const server = app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });

    server.on("error", (error) => {
      console.error("❌ Error al iniciar el servidor:", error);
    });
  } catch (error) {
    console.error("❌ Error conectando a la BD:", error);
    process.exit(1);
  }
};

startServer();

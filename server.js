require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const usuariosRoutes = require("./routes/usuarios");

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev")); // Middleware para logs de peticiones

app.use("/", usuariosRoutes); // Cargar las rutas de usuarios

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
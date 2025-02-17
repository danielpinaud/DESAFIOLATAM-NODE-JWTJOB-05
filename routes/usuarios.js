const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../config/db");
const { generarToken } = require("../auth/auth");
const { verificarCredenciales, validarToken } = require("../middlewares/middlewares");

const router = express.Router();

// Registrar usuario
router.post("/usuarios", verificarCredenciales, async (req, res) => {
    try {
        const { email, password, rol, lenguage } = req.body;
        const passwordEncriptada = await bcrypt.hash(password, 10);

        const query = "INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4) RETURNING id, email, rol, lenguage";
        const values = [email, passwordEncriptada, rol, lenguage];

        const { rows } = await pool.query(query, values);
        res.status(201).json({ mensaje: "Usuario registrado con éxito", usuario: rows[0] });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar usuario" });
    }
});

// Login usuario
router.post("/login", verificarCredenciales, async (req, res) => {
    try {
        const { email, password } = req.body;
        const query = "SELECT * FROM usuarios WHERE email = $1";
        const { rows } = await pool.query(query, [email]);

        if (rows.length === 0) return res.status(401).json({ error: "Credenciales incorrectas" });

        const usuario = rows[0];
        const passwordCorrecta = await bcrypt.compare(password, usuario.password);

        if (!passwordCorrecta) return res.status(401).json({ error: "Credenciales incorrectas" });

        const token = generarToken(usuario.email);
        res.json({ mensaje: "Login exitoso", token });
    } catch (error) {
        res.status(500).json({ error: "Error en el proceso de autenticación" });
    }
});

// Obtener usuario autenticado
router.get("/usuarios", validarToken, async (req, res) => {
    try {
        const email = req.user.email;
        const query = "SELECT id, email, rol, lenguage FROM usuarios WHERE email = $1";
        const { rows } = await pool.query(query, [email]);

        if (rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener usuario" });
    }
});

module.exports = router;
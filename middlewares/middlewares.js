const jwt = require("jsonwebtoken");

const verificarCredenciales = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Faltan credenciales" });
    next();
};
  
const validarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(403).json({ error: "Token requerido" });
  
    const token = authHeader.split(" ")[1];
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        res.status(401).json({ error: "Token inválido o expirado" });
    }
};

module.exports = { verificarCredenciales, validarToken };
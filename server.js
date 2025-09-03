// --- Dependencias ---
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

// Carga las variables de entorno
require('dotenv').config();

// --- Configuración ---
const app = express();
const port = process.env.PORT || 8080;

// --- Middleware ---
app.use(express.json());

// Configuración de CORS para permitir peticiones desde tu frontend
const corsOptions = {
  origin: 'https://super-blini-7b6fb0.netlify.app',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));


// --- Conexión a Base de Datos ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});


// --- Endpoints ---
app.get('/api/health', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    res.status(200).json({ status: 'ok', db_time: result.rows[0].now });
  } catch (error) {
    res.status(503).json({ status: 'error', message: 'No se pudo conectar a la base de datos.' });
  }
});

app.post('/api/auth/register', async (req, res) => {
    const { email, password, rol = 'mesero' } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        const newUserQuery = 'INSERT INTO Usuarios (email, password_hash, rol) VALUES ($1, $2, $3) RETURNING id, email, rol';
        const result = await pool.query(newUserQuery, [email, password_hash, rol]);
        res.status(201).json({ message: 'Usuario registrado.', user: result.rows[0] });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ message: 'El email ya está registrado.' });
        }
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
    }
    try {
        const userQuery = 'SELECT * FROM Usuarios WHERE email = $1';
        const result = await pool.query(userQuery, [email]);
        const user = result.rows[0];
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }
        const payload = { user: { id: user.id, email: user.email, rol: user.rol } };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '24h' });
        res.status(200).json({ message: 'Inicio de sesión exitoso.', token });
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});


// --- Arranque del Servidor ---
app.listen(port, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${port}`);
});


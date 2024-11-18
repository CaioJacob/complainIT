const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();

// Configurações
app.use(bodyParser.json());
app.use(cors()); // Permitir acesso do front-end ao back-end

// Conexão com o banco de dados
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'complainit',
});

// Rota para registro de usuários
app.post('/api/register', async (req, res) => {
    const { email, password, type } = req.body;

    try {
        const [result] = await db.query('INSERT INTO users (email, password, type) VALUES (?, ?, ?)', [email, password, type]);
        res.json({ success: true, userId: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.json({ success: false, message: 'Email already exists!' });
        } else {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
});

// Rota para login de usuários
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        if (users.length > 0) {
            const user = users[0];
            const [complaints] = await db.query('SELECT * FROM complaints WHERE user_id = ?', [user.id]);
            res.json({ success: true, user, complaints });
        } else {
            res.json({ success: false, message: 'Incorrect email or password!' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Rota para criar uma nova reclamação
app.post('/api/complaint', async (req, res) => {
    const { userId, text } = req.body;

    try {
        await db.query('INSERT INTO complaints (user_id, text) VALUES (?, ?)', [userId, text]);
        const [complaints] = await db.query('SELECT * FROM complaints WHERE user_id = ?', [userId]);
        res.json({ success: true, message: 'Complaint created successfully', complaints });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.get('/api/complaints', async (req, res) => {
    const { userId } = req.query;

    try {
        const [complaints] = await db.query('SELECT * FROM complaints WHERE user_id = ?', [userId]);
        res.json({ success: true, complaints });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Iniciar o servidor
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

// npm imports
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// local imports
const { login, refresh } = require("./endpoints/auth-endpoints");
const pool = require('./helpers/db');
const validateRequest = require('./helpers/validate')
const limiter = require("./helpers/limiter");
const authenticateAccessToken = require("./helpers/auth-middleware");
const corsConfig = require("./helpers/cors.config");

const PORT = process.env.PORT;

const app = express();

app.use(limiter);

// Middleware для обробки JSON-запитів
app.use(express.json());

app.use(cookieParser());

// Cors settings
app.use(cors(corsConfig));
app.options('*', cors(corsConfig));

// Валідуємо деякі POST запити
app.use(validateRequest);

// Ендпоінти автентифікації
app.post('/login', login);
app.post('/refresh', refresh);

// Маршрут для отримання всіх сертифікатів
app.get('/certificate/all', authenticateAccessToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM certificate');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Маршрут для отримання сертифікату за id
app.get('/certificate/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM certificate WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).send('Certificate not found');
        }

        res.json(result.rows[0]); // Повертаємо перший знайдений запис
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Маршрут для створення нового сертифікату
app.post('/certificate/create', authenticateAccessToken, async (req, res) => {
    try {
        const nanoid = (await import('nanoid')).nanoid;

        const amount = req.body.amount;
        const id = nanoid(10);

        const result = await pool.query(
            `INSERT INTO certificate (id, amount)
             VALUES ($1, $2) RETURNING *`,
            [id, amount]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Message: ', err.message);
        res.status(500).send('Server error');
    }
});

// Маршрут для оновлення сертифікату
app.post('/certificate/update/:id', authenticateAccessToken, async (req, res) => {
    try {
        const id = req.params.id;
        const amount = req.body.amount;

        const result = await pool.query(
            `UPDATE certificate
             SET amount = $2
             WHERE id = $1
             RETURNING *`,
            [id, amount]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Маршрут для видалення запису
app.delete('/certificate/delete/:id', authenticateAccessToken, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM certificate WHERE id = $1 RETURNING *',
            [id]
        );

        // Якщо запис не знайдений, повертаємо 404
        if (result.rowCount === 0) {
            return res.status(404).send('Certificate not found');
        }

        res.json({ message: 'Certificate deleted successfully', deletedRecord: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

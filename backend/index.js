const express = require('express');
const pool = require('./db'); // Імпортуємо підключення до бази
const validateRequest = require('./validate')

const app = express();

const PORT = process.env.PORT;

// Middleware для обробки JSON-запитів
app.use(express.json());

// Валідуємо запити
app.use(validateRequest)

// Маршрут для отримання всіх сертифікатів
app.get('/certificate/all', async (req, res) => {
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
app.post('/certificate/create', async (req, res) => {
    try {
        const amount = req.body.amount;

        const result = await pool.query(
            `INSERT INTO certificate (amount)
             VALUES (${amount});
            `,
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Message: ', err.message);
        res.status(500).send('Server error');
    }
});

// Маршрут для оновлення сертифікату
app.post('/certificate/update/:id', async (req, res) => {
    try {
        const id = req.params.id
        const amount = req.body.amount;

        const result = await pool.query(
            `UPDATE certificate
             SET amount = ${amount}
             WHERE id = ${id};
            `,
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Маршрут для видалення запису
app.delete('/certificate/delete/:id', async (req, res) => {
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

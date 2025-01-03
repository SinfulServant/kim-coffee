const { Pool } = require('pg');

require('dotenv').config();

// Створюємо пул підключень
const pool = new Pool({
    connectionString: process.env.DB_CONNECTION,
});

// Перевіряємо підключення
pool.connect()
    .then(client => {
        console.log('Connected to the database!');
        client.release(); // Завершуємо підключення
    })
    .catch(err => console.error('Connection error', err.stack));

module.exports = pool;

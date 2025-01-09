var { Pool } = require('pg');

require('dotenv').config();

// Створюємо пул підключень
var pool = new Pool({
    connectionString: process.env.DB_CONNECTION,
    idleTimeoutMillis: 30000,
    keepAlive: true,
});

// Перевіряємо підключення
pool.connect()
    .then(client => {
        console.log('Connected to the database!');
        client.release(); // Завершуємо підключення
    })
    .catch(err => console.error('Connection error', err.stack));

module.exports = pool;

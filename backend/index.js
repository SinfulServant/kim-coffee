// npm imports
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// local imports
const { login, refresh } = require("./endpoints/auth-endpoints");
const validateRequest = require('./helpers/validate')
const limiter = require("./helpers/limiter");
const authenticateAccessToken = require("./helpers/auth-middleware");
const corsConfig = require("./helpers/cors.config");
const { getAllCertificates, getCertificateById, createNewCertificate, updateCertificate, deleteCertificate} = require("./endpoints/certificate-endpoints");

const PORT = process.env.PORT;

const app = express();

app.set('trust proxy', 1); // '1' означає довіру першому проксі-серверу

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

// Ендпоінти для роботи з сертифікатами
app.get('/certificate/all', authenticateAccessToken, getAllCertificates);
app.get('/certificate/:id', getCertificateById);
app.post('/certificate/create', authenticateAccessToken, createNewCertificate);
app.post('/certificate/update/:id', authenticateAccessToken, updateCertificate);
app.delete('/certificate/delete/:id', authenticateAccessToken, deleteCertificate);


// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

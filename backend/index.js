// npm imports
var express = require('express');
var cookieParser = require('cookie-parser');
var cors = require('cors');

// local imports
var { login, refresh } = require("./endpoints/auth-endpoints");
var validateRequest = require('./helpers/validate')
var limiter = require("./helpers/limiter");
var authenticateAccessToken = require("./helpers/auth-middleware");
var corsConfig = require("./helpers/cors.config");
var { getAllCertificates, getCertificateById, createNewCertificate, updateCertificate, deleteCertificate} = require("./endpoints/certificate-endpoints");

var PORT = process.env.PORT;

var app = express();

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

app.get('/monitor', (req, res) => {
    console.log('Monitoring...');
})

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

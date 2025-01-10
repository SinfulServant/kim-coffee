var rateLimit = require('express-rate-limit');

var isProduction = process.env.NODE_ENV === 'production'

var limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // Вікно часу: 10 хвилин
    max: isProduction ? 60 : 500, // Максимальна кількість запитів від одного IP за вікно
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: 'draft-8', // Повертає ліміти у заголовках `RateLimit-*`
    legacyHeaders: false, // Відключає старі заголовки `X-RateLimit-*`
});

module.exports = limiter;
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // Вікно часу: 15 хвилин
    max: 50, // Максимальна кількість запитів від одного IP за вікно
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: 'draft-8', // Повертає ліміти у заголовках `RateLimit-*`
    legacyHeaders: false, // Відключає старі заголовки `X-RateLimit-*`
});

module.exports = limiter;
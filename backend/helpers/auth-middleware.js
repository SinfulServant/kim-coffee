const jwt = require('jsonwebtoken');

const ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY;

function authenticateAccessToken(req, res, next) {
    const authHeader = req.headers['authorization']; // Токен передається в заголовку
    const token = authHeader && authHeader.split(' ')[1]; // Витягуємо токен із "Bearer TOKEN"

    if (!token || token === 'null') {
        return res.status(401).json({ message: 'Access token is missing' });
    }

    // Верифікуємо токен
    jwt.verify(token, ACCESS_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired access token' });
        }

        // Якщо все ок, додаємо payload токена до запиту
        req.user = decoded; // Наприклад, { userId: '123' } або ваш payload
        next();
    });
}

module.exports = authenticateAccessToken;
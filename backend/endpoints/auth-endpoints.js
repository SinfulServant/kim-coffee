var pool = require("./../helpers/db");
var jwt = require("jsonwebtoken");

var PASSWORD = process.env.CERTIFICATE_PASSWORD;
var ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY;
var REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;
var REFRESH_AGE = +process.env.REFRESH_AGE;
var NODE_ENV = process.env.NODE_ENV

// Генеруємо токени
function generateAccessToken() {
    return jwt.sign({}, ACCESS_SECRET_KEY, { expiresIn: '15m' });
}

function generateRefreshToken() {
    return jwt.sign({}, REFRESH_SECRET_KEY, { expiresIn: '10d' });
}

var cookieOptions = {
    httpOnly: true, // Робить кукі недоступними для JS
    secure: NODE_ENV === 'production', // Тільки HTTPS
    sameSite: NODE_ENV === 'production' ? 'None' : 'strict', // Захист від CSRF
    maxAge: REFRESH_AGE,
}

var login = async (req, res) => {
    var password = req.body.password;

    var isPasswordCorrect = password === PASSWORD;
    if (!isPasswordCorrect) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    var accessToken = generateAccessToken();
    var refreshToken = generateRefreshToken();

    var expiresAt = new Date(Date.now() + REFRESH_AGE); // 100 днів
    await pool.query(
        'INSERT INTO refresh_tokens (token, expires_at) VALUES ($1, $2)',
        [refreshToken, expiresAt]
    );

    res.cookie('refreshToken', refreshToken, cookieOptions)
        .json({ accessToken });
}

var refresh = async (req, res) => {
    var refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(403).json({ message: 'Refresh token is missing' });
    }

    // Верифікація рефреш токена
    jwt.verify(refreshToken, REFRESH_SECRET_KEY, async (err) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired refresh token' });
        }

        try {
            var result = await pool.query(
                'SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()',
                [refreshToken]
            );

            if (result.rows.length === 0) {
                return res.status(403).json({ message: 'Refresh token not found or expired in database' });
            }

            var newAccessToken = generateAccessToken();
            var newRefreshToken = generateRefreshToken();

            var expiresAt = new Date(Date.now() + REFRESH_AGE);
            await pool.query(
                'UPDATE refresh_tokens SET token = $1, expires_at = $2 WHERE token = $3',
                [newRefreshToken, expiresAt, refreshToken]
            );

            res.cookie('refreshToken', newRefreshToken, cookieOptions)
                .json({ accessToken: newAccessToken });
        } catch (error) {
            console.error('Database error: ', dbError);
            return res.status(500).json({ message: 'Database error occurred' });
        }
    });
}

var deleteExpiredTokens = async () => {
    try {
        var result = await pool.query(
            'DELETE FROM refresh_tokens WHERE expires_at < NOW()'
        );
        console.log(`${result.rowCount} expired tokens deleted`);
    } catch (err) {
        console.error('Error deleting expired tokens:', err.message);
    }
};

setInterval(() => {
    console.log('Running daily expired token cleanup...');
    deleteExpiredTokens();
}, 86400000); // 24 години


module.exports = {
    login,
    refresh,
};
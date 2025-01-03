const validateRequest = (req, res, next) => {
    const password = req.body.password;

    // Перевірка наявності необхідних полів
    if (req.method === 'POST' ) {
        const amount = req.body.amount;

        if (!password || password !== process.env.CERTIFICATE_PASSWORD) {
            return res.status(403).send('Invalid password');
        }

        // Перевірка, чи є необхідні поля в тілі запиту
        if (!amount || typeof amount !== 'number' || amount < 0) {
            return res.status(400).send('Amount is required and must be a number bigger than 0');
        }
    }

    if (req.method === 'DELETE') {
        if (!password || password !== process.env.CERTIFICATE_PASSWORD) {
            return res.status(403).send('Invalid password');
        }
    }

    // Якщо все ок, передаємо запит далі
    next();
};

module.exports = validateRequest;


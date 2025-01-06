const validateRequest = (req, res, next) => {
    if (['/login', '/refresh'].includes(req.path)) {
        next()
        return;
    }

    // Перевірка наявності необхідних полів
    if (req.method === 'POST') {
        const amount = req.body.amount;

        if (req.params.id) {
        }

        // Перевірка, чи є необхідні поля в тілі запиту
        if (!amount || typeof amount !== 'number' || amount < 0) {
            return res.status(400).send('Amount is required and must be a number bigger than 0');
        }
    }

    // Якщо все ок, передаємо запит далі
    next();
};

module.exports = validateRequest;


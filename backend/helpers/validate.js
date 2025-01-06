const validateRequest = (req, res, next) => {
    if (['/login', '/refresh'].includes(req.path)) {
        next()
        return;
    }

    // Перевірка наявності необхідних полів
    if (req.method === 'POST') {
        const amount = req.body.amount;
        const id = req.params.id;

        if (id) {
            if (!id || typeof id !== 'string' || id.length !== 10) {
                return res.status(400).send('Id is required and must be a string with length 10 symbols');
            }
        }

        if (!amount || typeof amount !== 'number' || amount < 0) {
            return res.status(400).send('Amount is required and must be a number bigger than 0');
        }
    }

    // Якщо все ок, передаємо запит далі
    next();
};

module.exports = validateRequest;


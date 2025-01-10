const validateRequest = (req, res, next) => {
    if (['/login', '/refresh'].includes(req.path)) {
        next()
        return;
    }

    // Перевірка наявності необхідних полів
    if (req.method === 'POST') {
        const amount = req.body.amount;
        const id = req.params.id;
        const name = req.params.name;

        if (['/update', '/create'].includes(req.path) && (!name || name !== '')) {
            return res.status(400).send('Name is required and must be a string');
        }

        if (id) {
            var idLength = 24;
            if (!id || typeof id !== 'string' || id.length !== idLength) {
                return res.status(400).send(`Id is required and must be a string with length ${idLength} symbols`);
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


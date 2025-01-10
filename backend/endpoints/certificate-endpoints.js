var pool = require("../helpers/db");

var getAllCertificates = async function (req, res) {
    try {
        var result = await pool.query('SELECT * FROM certificate');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

var getCertificateById = async function(req, res) {
    var { id } = req.params;

    try {
        var result = await pool.query('SELECT * FROM certificate WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).send('Certificate not found');
        }

        res.json(result.rows[0]); // Повертаємо перший знайдений запис
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

var createNewCertificate = async function (req, res) {
    try {
        var nanoid = (await import('nanoid')).nanoid;

        var amount = req.body.amount;
        var id = nanoid(24);
        var name = req.body.name;

        var result = await pool.query(
            `INSERT INTO certificate (id, amount, name)
             VALUES ($1, $2, $3) RETURNING *`,
            [id, amount, name]
        );
        res.json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') {
            // Обробляємо помилку порушення унікальності
            res.status(409).json({
                message: "The name already exists. Please choose a different name.",
                error: err.detail,
            });
        } else {
            // Інші помилки
            res.status(500).json({
                message: "An unexpected error occurred.",
                error: err.message,
            });
        }
    }
}

var updateCertificate = async function(req, res) {
    try {
        var id = req.params.id;
        var amount = req.body.amount;
        var name = req.body.name;

        var result = await pool.query(
            `UPDATE certificate
             SET amount = $2, name = $3
             WHERE id = $1
                 RETURNING *`,
            [id, amount, name]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') {
            // Обробляємо помилку порушення унікальності
            res.status(409).json({
                message: "The name already exists. Please choose a different name.",
                error: err.detail,
            });
        } else {
            // Інші помилки
            res.status(500).json({
                message: "An unexpected error occurred.",
                error: err.message,
            });
        }
    }
}

var deleteCertificate = async function(req, res) {
    try {
        var { id } = req.params;

        var result = await pool.query(
            'DELETE FROM certificate WHERE id = $1 RETURNING *',
            [id]
        );

        // Якщо запис не знайдений, повертаємо 404
        if (result.rowCount === 0) {
            return res.status(404).send('Certificate not found');
        }

        res.json({ message: 'Certificate deleted successfully', deletedRecord: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

module.exports = {
    getAllCertificates,
    getCertificateById,
    createNewCertificate,
    updateCertificate,
    deleteCertificate,
}
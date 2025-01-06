const ORIGIN = process.env.FRONTEND_ORIGIN;

const corsConfig = {
    origin: ORIGIN,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization']
}

module.exports = corsConfig;
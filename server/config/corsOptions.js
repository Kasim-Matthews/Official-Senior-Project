
const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true
}

module.exports = corsOptions;
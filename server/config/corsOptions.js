
const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    origin: 'https://diaper-bank-inventory-management-system-3ktm.onrender.com',
    optionsSuccessStatus: 200,
    credentials: true
}

module.exports = corsOptions;
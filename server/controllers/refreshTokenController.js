const jwt = require('jsonwebtoken');
require('dotenv').config();

const sb = require('mysql2/promise').createPool({
    host: "localhost",
    user: "root",
    password: "WebVoyage2023!",
    database: 'claire',
    port: 3006,
    connectionLimit: 50,
    multipleStatements: true
});

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    try {
        const [rows] = await sb.query('SELECT * FROM claire.user WHERE RefreshToken = ?', [refreshToken]);
        const foundUser = rows[0];
        if (!foundUser) return res.sendStatus(403); // Forbidden

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err || foundUser.Username !== decoded.username) return res.sendStatus(403);
            const role = foundUser.Role
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "role": role
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '5m' }
            );

            res.json({ role, accessToken });
        });
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Server error
    }
};


module.exports = { handleRefreshToken };

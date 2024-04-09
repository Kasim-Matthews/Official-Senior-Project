const mysql =  require('mysql2/promise');
const sb = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Lindsey1!",
    database: 'claire',
    port: 3306
});

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
require('dotenv').config();
const path = require('path');

const login = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    try {
        // Query the database for the user
        const [rows] = await sb.query('SELECT * FROM claire.user WHERE Username = ?', [user]);
        const foundUser = rows[0]; // Assuming usernames are unique, so we take the first result
        if (!foundUser) return res.sendStatus(401); // Unauthorized

        const match = await bcrypt.compare(pwd, foundUser.Password); // Ensure the column name matches your DB schema
        if (match) {
            const roles = Object.values(foundUser.Role);
            // Here you would create JWTs or perform other login success actions
            const accessToken = jwt.sign(
                { 
                    "UserInfo": {
                        "username": foundUser.Username,
                        "roles": roles
                }
            },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '10m' }
            );
            const refreshToken = jwt.sign(
                { "username": foundUser.Username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );

            await sb.query('UPDATE user SET RefreshToken = ? WHERE User_id = ?', [refreshToken, foundUser.User_id]);

            res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
            res.json({ accessToken });
        } else {
            res.sendStatus(401); // Unauthorized
        }
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
};

module.exports = { login };
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Your provided database connection pool
const pg = require('pg')

const { Pool } = pg
const dbconfig = require('../database')
var sb = new Pool(dbconfig)

sb.on('connect', connection => {
    console.log("Connected")
})
sb.on('error', error => {
    console.log(error);
})

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    try {
        // Query the database for the user with the given refresh token
        const [rows] = await sb.query('SELECT * FROM user WHERE RefreshToken = ?', [refreshToken]);
        const foundUser = rows[0];
        if (!foundUser) return res.sendStatus(403); // Forbidden

        // Evaluate JWT
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err || foundUser.Username !== decoded.username) return res.sendStatus(403);
                
                // Assuming 'Role' is stored as a JSON string in the database and contains an object with roles
                // Adjust this if your roles are stored differently
                const roles = Object.values(JSON.parse(foundUser.Role));

                const accessToken = jwt.sign(
                    {
                        "UserInfo": {
                            "username": decoded.username,
                            "roles": roles
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '30s' }
                );
                res.json({ accessToken });
            }
        );
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Server error
    }
}

module.exports = { handleRefreshToken };

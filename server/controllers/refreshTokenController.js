const jwt = require('jsonwebtoken');
require('dotenv').config();

const sb = require('mysql2/promise').createPool({
    host: "localhost",
    user: "root",
    password: "Lindsey1!",
    database: 'claire',
    port: 3306
});

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    console.log("Cookies:", cookies)
    console.log(req.headers);

    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    try {
        const [rows] = await sb.query('SELECT * FROM claire.user WHERE RefreshToken = ?', [refreshToken]);
        const foundUser = rows[0];
        if (!foundUser) return res.sendStatus(403); // Forbidden

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err || foundUser.Username !== decoded.Username) return res.sendStatus(403);

            const newAccessToken = jwt.sign(
                { "UserInfo": { "username": decoded.Username }},
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '5m' }
            );
            const newRefreshToken = jwt.sign(
                { "username": decoded.Username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '5m' }
            );

            console.log("New Access Token:", newAccessToken);
            console.log("New Refresh Token:", newRefreshToken);

               //why isnt it storing in application storage
         
            // Update refresh token in the database
            await sb.query('UPDATE claire.user SET RefreshToken = ? WHERE User_id = ?', [newRefreshToken, foundUser.User_id]);

            // Optionally reset the cookie with new refresh token
            res.cookie('jwt', newRefreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });

            res.json({ accessToken: newAccessToken });
        });
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Server error
    }
};


module.exports = { handleRefreshToken };

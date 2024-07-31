const sb = require('mysql2/promise').createPool({
    host: "localhost",
    user: "root",
    password: "WebVoyage2023!",
    database: 'claire',
    port: 3006,
    connectionLimit: 50,
    multipleStatements: true
});

const handleLogout = async (req, res) => {
    const cookies = req.cookies;


    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;

    try {
        const [rows] = await sb.query('SELECT * FROM claire.user WHERE RefreshToken = ?', [refreshToken]);
        const foundUser = rows[0];
        if (!foundUser) {
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 })
            console.log("didn't find you")
            return res.sendStatus(204);
        }

        await sb.query('UPDATE claire.user SET RefreshToken = NULL WHERE User_id = ?', [foundUser.User_id]);
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 })
        res.sendStatus(204);

    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Server error
    }
};


module.exports = { handleLogout };

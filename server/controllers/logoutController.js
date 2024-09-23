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

const handleLogout = async (req, res) => {
    const cookies = req.cookies;


    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;

    try {
        const rows = await sb.query(`SELECT * FROM public.user WHERE "RefreshToken" = '{${refreshToken}}'`, [refreshToken]);
        const foundUser = rows.rows[0]
        if (!foundUser) {
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 })
            console.log("didn't find you")
            return res.sendStatus(204);
        }

        await sb.query(`UPDATE public.user SET "RefreshToken" = NULL WHERE "User_id" = ${foundUser.User_id}`);
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 })
        res.sendStatus(204);

    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Server error
    }
};


module.exports = { handleLogout };

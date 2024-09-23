const mysql =  require('mysql2/promise');
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



const bcrypt = require('bcrypt');

const register = async (req, res) => {
    const { user, pwd, role, email } = req.body;
    if (!user || !pwd || !role || !email) return res.status(400).json({ 'message': 'Username, password, email, and role are required.' });

    try {
        // Check for duplicate usernames in the database
        const rows = await sb.query(`SELECT "User_id" FROM public.user WHERE "Username" = '{${user}}'`);
        if (rows.rows.length) return res.sendStatus(409); // Conflict

        // Encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);
        

        

        // Store the new user in the database
        await sb.query(`INSERT INTO public.user ("Username", "Password", "Email", "Role") VALUES ('{${user}}', '{${hashedPwd}}', '{${email}}', '${role}')`);

        console.log(`New user ${user} created!`);
        res.status(201).json({ 'success': `New user ${user} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
};


module.exports = {
    register
}
const mysql = require('mysql2/promise');
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






const data = async (req, res) => {
    let id = req.params.id

    const query = `
        SELECT "Username", "Email"
        FROM public.user
        WHERE "User_id" = ${id}`;

    try {
        const rows = await sb.query(query);
        res.status(201).json(rows.rows);
    }

    catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

const bcrypt = require('bcrypt');

const change_username_and_email = async (req, res) => {
    const { userName, email } = req.body;
    const id = req.params.id
    if (!userName || !email) return res.status(400).json({ 'message': 'Username, and email are required.' });

    try {
        // Check for duplicate usernames in the database
        const rows = await sb.query(`SELECT "User_id" FROM public.user WHERE "Username" = '{${userName}}'`);
        if (rows.rows.length > 1 && rows.rows[0].User_id != id) return res.sendStatus(409); // Conflict

        await sb.query(`UPDATE public.user Username = '{${userName}}' Email = '{${email}}' WHERE User_id = ${id}`);

        res.status(201).json({ 'success': `User updated!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
};

const change_password = async (req, res) => {
    const { pwd } = req.body
    const id = req.params.id
    if (!pwd ) return res.status(400).json({ 'message': 'New Password is required.' });

    try {
        const rows = await sb.query(`SELECT "Password" FROM public.user WHERE "User_id" = ${id}`);
        const foundUser = rows.rows[0];
        if (!foundUser) return res.sendStatus(409); // Conflict


        const match = await bcrypt.compare(pwd, foundUser.Password);

        if (match) return res.sendStatus(406);

        const hashedPwd = await bcrypt.hash(pwd, 10);
        await sb.query(`UPDATE public.user "Password" = '{${hashedPwd}}' WHERE "User_id" = ${id}`);
        res.status(201).json({'success': 'Password updated'})

    }
    catch (err) {
        console.log(err)
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = {
    data,
    change_username_and_email,
    change_password
}
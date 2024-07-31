const mysql = require('mysql2/promise');
const sb = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "WebVoyage2023!",
    database: 'claire',
    port: 3006,
    connectionLimit: 50,
    multipleStatements: true
});






const data = async (req, res) => {
    let id = req.params.id

    const query = `
        SELECT Username, Email
        FROM claire.user
        WHERE User_id = ?`;

    try {
        const [rows] = await sb.query(query, [id]);
        res.status(201).json(rows);
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
        const [rows] = await sb.query('SELECT User_id FROM claire.user WHERE Username = ?', [userName]);
        if (rows.length > 1 && rows[0].User_id != id) return res.sendStatus(409); // Conflict

        await sb.query('UPDATE claire.user Username = ? Email = ? WHERE User_id = ?', [userName, email, id]);

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
        const [rows] = await sb.query('SELECT Password FROM claire.user WHERE User_id = ?', [id]);
        const foundUser = rows[0];
        if (!foundUser) return res.sendStatus(409); // Conflict


        const match = await bcrypt.compare(pwd, foundUser.Password);

        if (match) return res.sendStatus(406);

        const hashedPwd = await bcrypt.hash(pwd, 10);
        await sb.query('UPDATE claire.user Password = ? WHERE User_id = ?', [hashedPwd, id]);
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
const mysql =  require('mysql2/promise');
const sb = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Lindsey1!",
    database: 'claire',
    port: 3306
});



const bcrypt = require('bcrypt');

const register = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    try {
        // Check for duplicate usernames in the database
        const [rows] = await sb.query('SELECT User_id FROM claire.user WHERE Username = ?', [user]);
        if (rows.length) return res.sendStatus(409); // Conflict

        // Encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);

        // Store the new user in the database
        await sb.query('INSERT INTO claire.user (Username, Password) VALUES (?, ?)', [user, hashedPwd]);

        console.log(`New user ${user} created!`);
        res.status(201).json({ 'success': `New user ${user} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
};


module.exports = {
    register
}
const mysql =  require('mysql2/promise');
const sb = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Lindsey1!",
    database: 'claire',
    port: 3306
});

const bcrypt = require('bcrypt');

const login = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    try {
        // Query the database for the user
        const [rows] = await sb.query('SELECT * FROM claire.user WHERE Username = ?', [user]);
        const foundUser = rows[0]; // Assuming usernames are unique, so we take the first result
        if (!foundUser) return res.sendStatus(401); // Unauthorized

        // Evaluate password
        console.log(pwd)
        console.log(foundUser.Password)
        const match = await bcrypt.compare(pwd, foundUser.Password); // Ensure the column name matches your DB schema
        if (match) {
            // Here you would create JWTs or perform other login success actions
            res.json({ 'success': `User ${user} is logged in!` });
        } else {
            res.sendStatus(401); // Unauthorized
        }
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
};

module.exports = { login };
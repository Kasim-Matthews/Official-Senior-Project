const mysql = require('mysql2');
const sb = mysql.createPool({
    host: "sql5.freesqldatabase.com",
    user: "sql5669328",
    password: "xJdIL1M3qI",
    database: 'sql5669328',
    port: 3306
});



const promisePool = sb.promise();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');



const register = async (req, res) => {
    const { email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const sqlInsert = 'INSERT INTO sql5669328.user (Email, Password) VALUES (?, ?)';

    sb.query(sqlInsert, [email, hashedPassword], (err, result) => {
        console.log(err);
        //res.send(result);
        res.status(201).json({ success: true, message: "User registered successfully", data: result });
    });
  

      
    } catch (error) {
      res.status(500).json({ success: false, message: "Error registering user", error: error.message });
    }
  }

  const login = (req, res) => {
    const { email, password } = req.body;
    const sqlSelect = 'SELECT * FROM sql5669328.user WHERE Email = ?';

    sb.query(sqlSelect, [email], async (err, users) => {

            if (err) {
                return res.status(500).json({ success: false, message: "Error logging in", error: err.message });
            }

            if (users.length > 0) {
                const user = users[0];
                if (await bcrypt.compare(password, user.Password)) {
                    const token = jwt.sign(
                        { userId: user.User_id },
                        'yourSecretKey',
                        { expiresIn: '1h' }
                    );

                    res.json({ success: true, token });
                } else {
                    res.status(401).json({ success: false, message: "Invalid credentials" });
                }
            } else {
                res.send({ status: 'error', message: "Wrong username/password combination!" });
            }
            
        }
    )
}
/* 
const sb = mysql.createPool({
    host: "sql5.freesqldatabase.com",
    user: "sql5669328",
    password: "xJdIL1M3qI",
    database: 'sql5669328',
    port: 3306
});
https://diaper-bank-inventory-management-system.onrender.com
*/

module.exports = {
    login,
    register,
    data
}
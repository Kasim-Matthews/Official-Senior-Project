const mysql = require('mysql2');
const sb = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Lindsey1!",
    database: "claire",
    port: 3306
});



const promisePool = sb.promise();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');



const register = async (req, res) => {
    const { email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const sqlInsert = 'INSERT INTO claire.user (Email, Password) VALUES (?, ?)';

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
    const sqlSelect = 'SELECT * FROM claire.user WHERE Email = ?';

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
                res.status(404).json({ success: false, message: "User not found" });
            }
        }
    );
};

const data = (req, res) => {
    const query = `
        SELECT i.Name as itemName, l.Name as locationName, il.Quantity
        FROM claire.itemlocation il 
        JOIN claire.item i ON il.Item_id = i.Item_id
        JOIN claire.location l ON il.Location_id = l.Location_i`;

    sb.query(query, (err, result) => {

        console.log(result)

        if (err) {
            res.send({ status: 'error', message: err.message });
        } else {
            res.send({ status: 'ok', data: result });
        }
    });
}

module.exports = {
    login,
    register,
    data
}
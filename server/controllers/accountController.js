const mysql = require('mysql2');
const sb = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Piano2601!",
    database: 'claire',
    port: 3306
});

const register = (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    sb.query(
        "INSERT INTO register (usernameReg, passwordReg) VALUES (?,?)",
        [username, password],
        (err, result) => {
            console.log(err);
        }
    )

}

const login = (req, res) => {
    console.log(req.body)
    let username = req.body.username;
    let password = req.body.password;

    sb.query(
        "SELECT * FROM register WHERE usernameReg = ? AND passwordReg = ?",
        [username, password],
        (err, result) => {

            if (err) {
                res.send({ err: err })

            }



            if (result.length > 0) {
                res.send({ status: 'ok', user: result[0] }); // Send user data and status
            } else {
                res.send({ status: 'error', message: "Wrong username/password combination!" });
            }

        }
    )
}

const data = (req, res) => {
    const query = `
        SELECT i.Name as itemName, l.Name as locationName, il.Quantity
        FROM claire.itemlocation il
        JOIN claire.item i ON il.Item_id = i.Item_id
        JOIN claire.location l ON il.Location_id = l.Location_id;
    `;

    sb.query(query, (err, result) => {
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
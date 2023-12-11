const mysql = require('mysql2');
const sb = mysql.createPool({
    host: "sql5.freesqldatabase.com",
    user: "sql5669328",
    password: "xJdIL1M3qI",
    database: 'sql5669328',
    port: 3306
});

const register = (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    sb.query(
        "INSERT INTO sql5669328.register (usernameReg, passwordReg) VALUES (?,?)",
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
        "SELECT * FROM sql5669328.register WHERE usernameReg = ? AND passwordReg = ?",
        [username, password],
        (err, result) => {

            if(err){
                res.send({err: err})

            }



            if (result.length > 0) {
                res.send({ status: 'ok', user: result[0] }); // Send user data and status
            } else {
                res.send({ status: 'error', message: "Wrong username/password combination!" });
            }
            
        }
    )
}

module.exports = {
    login,
    register
}
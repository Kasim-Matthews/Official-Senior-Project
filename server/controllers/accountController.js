const mysql = require('mysql2');
const sb = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "WebVoyage2023!",
    database: 'claire',
    port: 3006
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
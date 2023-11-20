const mysql = require('mysql2');
const sb = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "WebVoyage2023!",
    port: 3006
});

const partner_index = (req, res) => {
    const sqlGet = "SELECT * FROM test.partner;"
    sb.query(sqlGet, (err, result) =>{
        res.send(result);
    })
}

const partner_create = (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let comments = req.body.comments;
    let representative = req.body.representative;

    const sqlInsert = "INSERT INTO test.partner (name, email, comments, representative) VALUES (?,?,?,?);"
    sb.query(sqlInsert, [name, email, comments, representative], (err, result) =>{
        console.log(result);
    }) 
}

module.exports = {
    partner_create,
    partner_index
}
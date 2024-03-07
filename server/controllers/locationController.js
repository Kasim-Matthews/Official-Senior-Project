const mysql = require('mysql2');
const sb = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Piano2601!",
    database: 'claire',
    port: 3306
});

const location_index = (req, res) => {
    const sqlGet = "SELECT * FROM claire.location;"
    sb.query(sqlGet, (err, result) => {
        res.send(result);
    })
}

const location_creation = (req, res) => {
    let Name = req.body.name;
    let Address = req.body.Address;


    if (typeof Name != "string" && typeof Address != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (Name && Address) {
        const sqlInsert = "INSERT INTO claire.location (Name, Address) VALUES (?,?);"
        sb.query(sqlInsert, [Name, Address], (err, result) => {
            console.log(err);
        })
    }
}

const location_delete = (req, res) => {
    let id = req.params.id;
    if (typeof id != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (id) {
        const sqlDelete = 'DELETE FROM claire.location WHERE Location_id = ?;'
        sb.query(sqlDelete, [id], (err, result) => {
            console.log(err);
        })
    }
}

const location_edit = (req, res) => {
    let id = req.params.id

    if (typeof id != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (id) {
        const sqlGet = 'SELECT * FROM claire.location WHERE Location_id= ?;'
        sb.query(sqlGet, [id], (err, result) => {
            res.send(result);
        })
    }
}

const location_update = (req, res) => {

    let id = req.params.id
    let Name = req.body.name;
    let Address = req.body.Address;


    if (typeof Name != "string" && typeof Address != "string" && typeof id != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (Name && Address && id) {
        const sqlUpdate = "UPDATE claire.location SET Name= ?, Address= ? WHERE Location_id = ?;"
        sb.query(sqlUpdate, [Name, Address, id], (err, result) => {
            console.log(err);
        })
    }
}


module.exports = {
    location_index,
    location_creation,
    location_delete,
    location_update,
    location_edit
}
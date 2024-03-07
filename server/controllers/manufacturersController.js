const mysql = require('mysql2');
const sb = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Piano2601!",
    database: 'claire',
    port: 3306
});
const manufacturers_index = (req, res) => {
    const sqlGet = "SELECT * FROM test.manufacturers;"
    sb.query(sqlGet, (err, result) => {
        res.send(result);
    })
}

const manufacturers_creation = (req, res) => {
    let Name = req.body.name;


    if (typeof Name != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (Name) {
        const sqlInsert = "INSERT INTO test.manufacturers (Name) VALUES (?);"
        sb.query(sqlInsert, [Name], (err, result) => {
            console.log(err);
        })
    }
}

const manufacturers_delete = (req, res) => {
    let id = req.params.id;
    if (typeof id != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (id) {
        const sqlDelete = 'DELETE FROM test.manufacturers WHERE id = ?;'
        sb.query(sqlDelete, [id], (err, result) => {
            console.log(err);
        })
    }
}

const manufacturers_edit = (req, res) => {
    let id = req.params.id

    if (typeof id != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (id) {
        const sqlGet = 'SELECT * FROM test.manufacturers WHERE id= ?;'
        sb.query(sqlGet, [id], (err, result) => {
            res.send(result);
        })
    }
}

const manufacturers_update = (req, res) => {

    let id = req.params.id
    let Name = req.body.name;

    if (typeof Name != "string" && typeof id != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (Name && id) {
        const sqlUpdate = "UPDATE test.manufacturers SET Name= ? WHERE id = ?;"
        sb.query(sqlUpdate, [Name, id], (err, result) => {
            console.log(err);
        })
    }
}


module.exports = {
    manufacturers_index,
    manufacturers_creation,
    manufacturers_delete,
    manufacturers_update,
    manufacturers_edit
}
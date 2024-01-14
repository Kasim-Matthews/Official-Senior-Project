const mysql = require('mysql2');
const sb = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "WebVoyage2023!",
    database: 'claire',
    port: 3006
});

const item_index = (req, res) => {
    const sqlGet = "SELECT * FROM claire.item"
    sb.query(sqlGet, (err, result) => {
        res.send(result);
    })
}

const item_creation = (req, res) => {
    let Name = req.body.name;
    let FairMarketValue = req.body.FairMarketValue;

    if (typeof Name != "string" && typeof FairMarketValue != "number") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (Name && FairMarketValue) {
        const sqlInsert = "INSERT INTO claire.item (Name, FairMarketValue) VALUES (?,?);"
        sb.query(sqlInsert, [Name, FairMarketValue], (err, result) => {
            console.log(err);
        })
    }
}

const item_delete = (req, res) => {
    let id = req.params.id;
    if (typeof id != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (id) {
        const sqlDelete = 'DELETE FROM claire.item WHERE Item_id = ?;'
        sb.query(sqlDelete, [id], (err, result) => {
            console.log(err);
        })
    }
}

const item_edit = (req, res) => {
    let id = req.params.id

    if (typeof id != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (id) {
        const sqlGet = 'SELECT * FROM claire.item WHERE Item_id = ?;'
        sb.query(sqlGet, [id], (err, result) => {
            res.send(result);
        })
    }
}

const item_update = (req, res) => {

    let id = req.params.id
    let Name = req.body.name;
    let FairMarketValue = req.body.FairMarketValue;


    if (typeof id != "string" && typeof Name != "string" && typeof FairMarketValue != "number") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (Name && FairMarketValue && id) {
        const sqlUpdate = "UPDATE claire.item SET Name= ?, FairMarketValue= ? WHERE Item_id = ?;"
        sb.query(sqlUpdate, [Name, FairMarketValue, id], (err, result) => {
            console.log(err);
        })
    }
}

const item_view = (req, res) => {
    let id = req.params.id

    if (typeof id != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (id) {
        const sqlGet = 'SELECT * FROM claire.item WHERE Item_id = ?;'
        sb.query(sqlGet, [id], (err, result) => {
            res.send(result);
        })
    }
}


module.exports = {
    item_index,
    item_creation,
    item_delete,
    item_update,
    item_edit,
    item_view
}
const mysql = require('mysql2');
const sb = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "WebVoyage2023!",
    database: 'claire',
    port: 3006
});

const location_index = (req, res) => {
    const sqlGet = "SELECT * FROM claire.location WHERE DeletedAt IS NULL;"
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
    let date = req.body.date;
    if (typeof id != "string" && typeof date != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (id) {
        const sqlDelete = `UPDATE claire.location Set DeletedAt= STR_TO_Date(?, '%m/%d/%Y') WHERE Location_id = ?;`
        sb.query(sqlDelete, [date, id], (err, result) => {
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

const last = (req, res) => {
    const sqlGet = `SELECT Location_id from claire.location
    ORDER BY Location_id DESC
    Limit 1;`
    sb.query(sqlGet, (err, result) => {
        res.send(result)
    })
}

const pair = (req, res) => {
    let Location_id = req.body.Location_id;
    let Items = req.body.Items;
    if (typeof Location_id != "number" && typeof Items != "object") {
        res.send("Invalid");
        res.end();
        return;
    }
    if (Location_id, Items) {
        for (let item in Items) {
            const sqlInsert = `INSERT INTO claire.itemlocation (Location_id, Item_id, Quantity) VALUES (?,?,0);`
            sb.query(sqlInsert, [Location_id, Items[item].Item_id], (err, result) => {
                console.log(err);
            })
        }
    }
}


module.exports = {
    location_index,
    location_creation,
    location_delete,
    location_update,
    location_edit,
    last,
    pair
}
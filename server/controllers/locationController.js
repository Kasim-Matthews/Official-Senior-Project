const mysql = require('mysql2');
const sb = mysql.createPool({
    host: "sql5.freesqldatabase.com",
    user: "sql5669328",
    password: "xJdIL1M3qI",
    database: 'sql5669328',
    port: 3306
});

const location_index = (req, res) => {
    const sqlGet = "SELECT * FROM sql5669328.location WHERE DeletedAt IS NULL;"
    sb.query(sqlGet, (err, result) => {
        res.send(result);
        res.end();
        return
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
        const sqlInsert = "INSERT INTO sql5669328.location (Name, Address) VALUES (?,?);"
        sb.query(sqlInsert, [Name, Address], (err, result) => {
            console.log(err);
            res.send();
            res.end();
            return
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
        const sqlDelete = `UPDATE sql5669328.location Set DeletedAt= STR_TO_Date(?, '%m/%d/%Y') WHERE Location_id = ?;`
        sb.query(sqlDelete, [date, id], (err, result) => {
            console.log(err);
            res.send()
            res.end();
            return;
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
        const sqlGet = 'SELECT * FROM sql5669328.location WHERE Location_id= ?;'
        sb.query(sqlGet, [id], (err, result) => {
            res.send(result);
            res.end();
            return
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
        const sqlUpdate = "UPDATE sql5669328.location SET Name= ?, Address= ? WHERE Location_id = ?;"
        sb.query(sqlUpdate, [Name, Address, id], (err, result) => {
            console.log(err);
        })
    }
}

const last = (req, res) => {
    const sqlGet = `SELECT Location_id from sql5669328.location
    ORDER BY Location_id DESC
    Limit 1;`
    sb.query(sqlGet, (err, result) => {
        res.send(result)
        res.end();
        return
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
            const sqlInsert = `INSERT INTO sql5669328.itemlocation (Location_id, Item_id, Quantity) VALUES (?,?,0);`
            sb.query(sqlInsert, [Location_id, Items[item].Item_id], (err, result) => {
                console.log(err);

            })
        }
        res.send();
        res.end();
        return
    }
}

const adjustment = (req, res) => {
    const sqlGet = `SELECT pt.PartnerType_id
    FROM sql5669328.partnertype pt
    WHERE pt.Type = "Adjustment";`

    sb.query(sqlGet, (err, result) => {
        res.send(result);
        res.end()
        return
    })
}

const partner = (req, res) => {
    let name = req.body.name
    let address = req.body.address
    let type = req.body.Type
    let Location = req.body.Location

    if(typeof name != " string" && typeof address != "string" && typeof type != "string" && typeof Location != "number"){
        res.send("Invalid")
        res.end();
        return;
    }

    if(name && address && type && Location){
        const sqlInsert = `INSERT INTO sql5669328.partner (Name, Address, Type, Location) VALUES (?,?,?,?);`
        sb.query(sqlInsert, [name, address, type, Location], (err, result) =>{
            console.log(err)
            res.send();
            res.end();
            return
        })
    }
}



module.exports = {
    location_index,
    location_creation,
    location_delete,
    location_update,
    location_edit,
    last,
    pair,
    adjustment,
    partner
}
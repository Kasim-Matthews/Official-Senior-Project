const { Client } = require('pg');
const sb = new Client({
    user: 'claire_a2dn_user',
    password: 'TaHQMaIFBkS5eYRJIzhj7uiCZd5Om5Kf',
    host: 'dpg-cnh1rs20si5c73bm4ptg-a.oregon-postgres.render.com',
    port: '5432',
    database: 'claire_a2dn',
    ssl: true,
    connectionString: 'postgres://claire_a2dn_user:TaHQMaIFBkS5eYRJIzhj7uiCZd5Om5Kf@dpg-cnh1rs20si5c73bm4ptg-a:5432/claire_a2dn'
});

const location_index = (req, res) => {
    const sqlGet = "SELECT * FROM claire.location WHERE DeletedAt IS NULL;"
    sb.connect()
    sb.query(sqlGet, (err, result) => {
        res.send(result);
    })
    sb.end();
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
        sb.connect()
        sb.query(sqlInsert, [Name, Address], (err, result) => {
            console.log(err);
        })
        sb.end();
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
        sb.connect()
        sb.query(sqlDelete, [date, id], (err, result) => {
            console.log(err);
        })
        sb.end();
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
        sb.connect()
        sb.query(sqlGet, [id], (err, result) => {
            res.send(result);
        })
        sb.end();
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
        sb.connect()
        sb.query(sqlUpdate, [Name, Address, id], (err, result) => {
            console.log(err);
        })
        sb.end();
    }
}

const last = (req, res) => {
    const sqlGet = `SELECT Location_id from claire.location
    ORDER BY Location_id DESC
    Limit 1;`
    sb.connect()
    sb.query(sqlGet, (err, result) => {
        res.send(result)
    })
    sb.end();
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
        sb.connect()
        for (let item in Items) {
            const sqlInsert = `INSERT INTO claire.itemlocation (Location_id, Item_id, Quantity) VALUES (?,?,0);`
            sb.query(sqlInsert, [Location_id, Items[item].Item_id], (err, result) => {
                console.log(err);
            })
        }
        sb.end();
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
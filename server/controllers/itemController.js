const { Client } = require('pg');
const sb = new Client({
    user: 'claire_a2dn_user',
    password:'TaHQMaIFBkS5eYRJIzhj7uiCZd5Om5Kf',
    host: 'dpg-cnh1rs20si5c73bm4ptg-a.oregon-postgres.render.com',
    port: 5432,
    database: 'claire_a2dn',
    ssl: true,
    connectionString: 'postgres://claire_a2dn_user:TaHQMaIFBkS5eYRJIzhj7uiCZd5Om5Kf@dpg-cnh1rs20si5c73bm4ptg-a.oregon-postgres.render.com/claire_a2dn'
});

const item_index = (req, res) => {
    const sqlGet = "SELECT * FROM claire.item WHERE DeletedAt IS NULL;"
    sb.connect();
    sb.query(sqlGet, (err, result) => {
        res.send(result);
    })
    sb.end();
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
        sb.connect();
        sb.query(sqlInsert, [Name, FairMarketValue], (err, result) => {
            console.log(err);
        })
        sb.end();
    }
}

const item_delete = (req, res) => {
    let id = req.params.id;
    let date = req.body.date;
    if (typeof id != "string" && typeof date != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (id) {
        const sqlDelete = `UPDATE claire.item Set DeletedAt= STR_TO_Date(?, '%m/%d/%Y') WHERE Item_id = ?;`
        sb.connect();
        sb.query(sqlDelete, [date, id], (err, result) => {
            console.log(err);
        })
        sb.end();
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
        sb.connect();
        sb.query(sqlGet, [id], (err, result) => {
            res.send(result);
        })
        sb.end();
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
        sb.connect();
        sb.query(sqlUpdate, [Name, FairMarketValue, id], (err, result) => {
            console.log(err);
        })
        sb.end();
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
        sb.connect();
        sb.query(sqlGet, [id], (err, result) => {
            res.send(result);
        })
        sb.end();
    }
}

const last = (req, res) => {
    const sqlGet = `SELECT Item_id from claire.item
    ORDER BY Item_id DESC
    Limit 1;`
    sb.connect();
    sb.query(sqlGet, (err,result) => {
        res.send(result)
    })
    sb.end();
}

const pair = (req, res) => {
    let Locations = req.body.Locations;
    let Item_id = req.body.Item_id;
    if(typeof Locations != "object" && typeof Item_id != "number"){
        res.send("Invalid");
        res.end();
        return;
    }
    if (Locations, Item_id) {
        sb.connect();
        for (let location in Locations) {
            const sqlInsert = `INSERT INTO claire.itemlocation (Location_id, Item_id, Quantity) VALUES (?,?,0);`
            
            sb.query(sqlInsert, [Locations[location].Location_id, Item_id], (err, result) => {
                console.log(err);
            })
        }
        sb.end();
    }
    
}


module.exports = {
    item_index,
    item_creation,
    item_delete,
    item_update,
    item_edit,
    item_view,
    last,
    pair
}
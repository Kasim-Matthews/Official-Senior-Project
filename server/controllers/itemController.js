const mysql = require('mysql2');
const sb = mysql.createPool({
    host: "sql5.freesqldatabase.com",
    user: "sql5669328",
    password: "xJdIL1M3qI",
    database: 'sql5669328',
    port: 3306
});

const item_index = (req, res) => {
    const sqlGet = "SELECT * FROM sql5669328.item WHERE DeletedAt IS NULL;"
    sb.query(sqlGet, (err, result) => {
        res.send(result);
        res.end();
        return;
    })
}

const item_creation = (req, res) => {
    let Name = req.body.name;
    let FairMarketValue = req.body.FairMarketValue;
    let PackageCount = req.body.PackageCount

    if (typeof Name != "string" && typeof FairMarketValue != "number" && typeof PackageCount != "number") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (Name && FairMarketValue && PackageCount) {
        if (PackageCount > 0) {
            const sqlInsert = "INSERT INTO sql5669328.item (Name, FairMarketValue, PackageCount) VALUES (?,?,?);"
            sb.query(sqlInsert, [Name, FairMarketValue, PackageCount], (err, result) => {
                console.log(err);
                res.end();
                return
            })
        }
        else {
            const sqlInsert = "INSERT INTO sql5669328.item (Name, FairMarketValue) VALUES (?,?);"
            sb.query(sqlInsert, [Name, FairMarketValue], (err, result) => {
                console.log(err);
                res.end();
                return;
            })
        }
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
        const sqlDelete = `UPDATE sql5669328.item Set DeletedAt= STR_TO_Date(?, '%m/%d/%Y') WHERE Item_id = ?;`
        sb.query(sqlDelete, [date, id], (err, result) => {
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
        const sqlGet = 'SELECT Name, FairMarketValue, Item_id, PackageCount FROM sql5669328.item WHERE Item_id = ?;'
        sb.query(sqlGet, [id], (err, result) => {
            res.send(result);
        })
    }
}

const item_update = (req, res) => {

    let id = req.params.id
    let Name = req.body.name;
    let FairMarketValue = req.body.FairMarketValue;
    let PackageCount = req.body.PackageCount


    if (typeof id != "string" && typeof Name != "string" && typeof FairMarketValue != "number" && typeof PackageCount != "number") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (Name && FairMarketValue && id && PackageCount) {
        if (PackageCount > 0) {
            const sqlUpdate = "UPDATE sql5669328.item SET Name= ?, FairMarketValue= ?, PackageCount= ? WHERE Item_id = ?;"
            sb.query(sqlUpdate, [Name, FairMarketValue, PackageCount, id], (err, result) => {
                console.log(err);

            })
            res.end();
            return
        }
        else {
            const sqlUpdate = "UPDATE sql5669328.item SET Name= ?, FairMarketValue= ? WHERE Item_id = ?;"
            sb.query(sqlUpdate, [Name, FairMarketValue, id], (err, result) => {
                console.log(err);

            })
            res.end();
            return
        }

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
        const sqlGet = 'SELECT * FROM sql5669328.item WHERE Item_id = ?;'
        sb.query(sqlGet, [id], (err, result) => {
            res.send(result);
        })
    }
}

const last = (req, res) => {
    const sqlGet = `SELECT Item_id from sql5669328.item
    ORDER BY Item_id DESC
    Limit 1;`
    sb.query(sqlGet, (err, result) => {
        res.send(result)
    })
}

const pair = (req, res) => {
    let Locations = req.body.Locations;
    let Item_id = req.body.Item_id;
    if (typeof Locations != "object" && typeof Item_id != "number") {
        res.send("Invalid");
        res.end();
        return;
    }
    if (Locations, Item_id) {
        for (let location in Locations) {
            const sqlInsert = `INSERT INTO sql5669328.itemlocation (Location_id, Item_id, Quantity) VALUES (?,?,0);`
            sb.query(sqlInsert, [Locations[location].Location_id, Item_id], (err, result) => {
                console.log(err);
            })
        }
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
const mysql = require('mysql2');
const sb = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "WebVoyage2023!",
    database: 'claire',
    port: 3006
});


const adjustment = (req, res) => {
    const sqlGet = `SELECT p.Partner_id, p.Name, p.Location
    from partner p
    where p.Location IS NOT NULL;`
    sb.query(sqlGet, (err, result) => {
        res.send(result);
        res.end();
        return
    })
}

const takeaway = (req, res) => {
    let Location = req.body.Location
    let Items = req.body.Items

    if (typeof Items != "object" && typeof Location != "number") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (Location && Items) {
        for (item in Items) {
            const sqlUpdate = `UPDATE claire.itemlocation set Quantity = Quantity - ? WHERE Location_id = ? AND Item_id = ?;`
            sb.query(sqlUpdate, [Items[item].Quantity, Location, Items[item].Item_id], (err, result) => {
                console.log(err);
            })
        }
        res.send();
        res.end();
        return
    }

}

const give = (req, res) => {
    let Location = req.body.Location
    let Items = req.body.Items

    if (typeof Items != "object" && typeof Location != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (Location && Items) {
        for (item in Items) {
            const sqlUpdate = `UPDATE claire.itemlocation set Quantity = Quantity + ? WHERE Location_id = ? AND Item_id = ?;`
            sb.query(sqlUpdate, [Items[item].Quantity, Location, Items[item].Item_id], (err, result) => {
                console.log(err);

            })
            res.send();
            res.end();
            return
        }
    }
}

const find_value = (req, res) => {
    let Items = req.body.Items

    if (typeof Items != "object") {
        res.send("Invalid")
        res.end();
        return;
    }

    if (Items) {
        let ids = []
        Items.forEach(element => {
            ids.push(element.Item_id);
        });

        const sqlGet = `SELECT i.FairMarketValue
        from claire.item i
        WHERE i.Item_id IN (?);`

        sb.query(sqlGet, [ids], (err, result) => {
            console.log(err);
            res.send(result);
            res.end();
            return;
        })
    }
}


const find_ild = (req, res) => {
    let Items = req.body.Items
    let Location = req.body.Location

    if (typeof Items != "object" && typeof Location != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if(Items && Location){
        let ids = []
        Items.forEach(element => {
            ids.push(element.Item_id);
        });

        const sqlGet = `SELECT il.ItemLocation_id
        from claire.itemlocation il
        WHERE il.Item_id IN (?) AND il.Location_id = ?;`

        
        sb.query(sqlGet, [ids, Location], (err, result) => {
            console.log(err);
            res.send(result);
            res.end();
            return;
        })

    }
}

const validation = (req, res) => {
    let Items = req.body.Items
    let Location = req.body.Location

    if (typeof Items != "object" && typeof Location != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if(Items && Location){
        let ids = []
        Items.forEach(element => {
            ids.push(element.Item_id);
        });

        const sqlGet = `SELECT il.ItemLocation_id, il.Quantity, i.Name as Item, i.Item_id
        from claire.itemlocation il
        join claire.item i on i.Item_id = il.Item_id
        WHERE il.Item_id IN (?) AND il.Location_id = ?;`

        
        sb.query(sqlGet, [ids, Location], (err, result) => {
            console.log(err);
            res.send(result);
            res.end();
            return;
        })

    }
}



const track_intake = (req, res) => {
    let Items = req.body.Items
    let Values = req.body.Values
    let Intake_id = req.body.Intake_id
    let FKItemLocation = req.body.FKItemLocation


    if (typeof Items != "object" && typeof Values != "object" && typeof Intake_id != "number" && typeof FKItemLocation != "object") {
        res.send("Invalid")
        res.end();
        return;
    }

    if (Items && Values && Intake_id && FKItemLocation) {
        const sqlInsert = `INSERT INTO claire.intakeitems (Intake_id, Quantity, Value, FKItemLocation) VALUES (?,?,?,?);`
        for (var i = 0; i < Items.length; i++) {
            let Value = Items[i].Quantity * Values[i].FairMarketValue
            sb.query(sqlInsert, [Intake_id.Intake_id, Items[i].Quantity, Value, FKItemLocation[i].ItemLocation_id], (err, result) => {
                console.log(err);

            })
        }
        res.send();
        res.end();
        return;
    }
}

const transfer = (req, res) => {
    const sqlGet = `SELECT p.Name as Taken, l.Name as Given, Cast(i.RecievedDate as char(10)) as Date, i.Intake_id, SUM(ii.Quantity) as TotalMoved, i.Comments, p.Location
    from claire.intake i
    join claire.partner p on p.Partner_id = i.Partner
    join claire.partnertype pt on p.Type = pt.PartnerType_id
    join claire.intakeitems ii on ii.Intake_id = i.Intake_id
    join claire.itemlocation il on ii.FKItemLocation = il.ItemLocation_id
    join claire.location l on il.Location_id = l.Location_id
    WHERE pt.Type = "Adjustment"
    group by p.Name, l.Name, i.RecievedDate, i.Intake_id;`

    sb.query(sqlGet, (err, result) => {
        res.send(result);
        res.end();
        return
    })
}

const transfer_view = (req, res) => {
    let id = req.params.id

    if(typeof id != "string"){
        res.send("Invalid");
        res.end();
        return;
    }

    if(id){
        const sqlGet = `SELECT p.Name as Taken, l.Name as Given, CAST(i.RecievedDate as char(10)) as Date, it.Name as Item, ii.Quantity
        from claire.intake i
        join claire.partner p on p.Partner_id = i.Partner
        join claire.intakeitems ii on ii.Intake_id = i.Intake_id
        join claire.itemlocation il on il.ItemLocation_id = ii.FKItemLocation
        join claire.item it on it.Item_id = il.Item_id
        join claire.location l on l.Location_id = il.Location_id
        WHERE i.Intake_id = ?
        group by p.Name, l.Name, i.RecievedDate, it.Name, ii.Quantity;`

        sb.query(sqlGet, [id], (err, result) => {
            console.log(err);
            res.send(result);
            res.end();
            return;
        })
    }
}

const transfer_cleanup = (req, res) => {
    let id = req.params.id

    if (typeof id != 'string') {
        res.send('Invalid');
        res.end();
        return
    }

    if (id) {
        const sqlGet = `SELECT ii.Quantity as Given, ii.FKItemLocation, il.Item_id
        from claire.intakeitems as ii
        join claire.itemlocation il on ii.FKItemLocation = il. ItemLocation_id
        where ii.Intake_id = ?;`
        sb.query(sqlGet, [id], (err, result) => {
            res.send(result)
            res.end()
            return;
        })
    }
}

const transfer_reclaim = (req, res) => {
    let records = req.body.records


    if (typeof records != "object") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (records) {
        for (let record in records) {
            const sqlUpdate = "UPDATE claire.itemlocation SET Quantity= Quantity - ? WHERE ItemLocation_id = ?;"
            sb.query(sqlUpdate, [records[record].Given, records[record].FKItemLocation], (err, result) => {
                console.log(err);
                res.send()
                res.end()
                return;
            })
        }

    }
}

const transfer_renounce = (req, res) => {
    let records = req.body.records
    let Location = req.body.Location


    if (typeof records != "object" && typeof Location != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (records && Location) {
        for (let record in records) {
            const sqlUpdate = "UPDATE claire.itemlocation SET Quantity= Quantity + ? WHERE Location_id = ? AND Item_id = ?;"
            sb.query(sqlUpdate, [records[record].Given, Location, records[record].Item_id], (err, result) => {
                console.log(err);
                res.send()
                res.end()
                return;
            })
        }

    }
}

module.exports = {
    adjustment,
    takeaway,
    give,
    find_value,
    track_intake,
    find_ild,
    transfer,
    transfer_view,
    transfer_cleanup,
    transfer_reclaim,
    transfer_renounce,
    validation
}
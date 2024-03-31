const mysql = require('mysql2');
const sb = mysql.createPool({
    host: "sql5.freesqldatabase.com",
    user: "sql5669328",
    password: "xJdIL1M3qI",
    database: 'sql5669328',
    port: 3306
});

const data = (req, res) => {
    const sqlGet = `
    select p.Name, i.Comments as Comments, Cast(i.RecievedDate as char(10)) as RecievedDate, i.Intake_id, i.TotalValue as Total, l.Name as Location, p.Type
    from sql5669328.intake i
    join sql5669328.partner p on i.Partner = p.Partner_id
    join sql5669328.partnertype pt on p.Type = pt.PartnerType_id
    join sql5669328.intakeitems ii on i.Intake_id = ii.Intake_id
    join sql5669328.itemlocation il on ii.FKItemLocation = il.ItemLocation_id
    join sql5669328. location l on l.Location_id = il.Location_id
    WHERE pt.Type NOT IN ("Vendor", "Adjustment")
    group by i.Intake_id, l.Name
    `;
    sb.query(sqlGet, (err, result) => {
        res.send(result);
        res.end();
        return;
    })
}

const create = (req, res) => {

    let Comments = req.body.Comments;
    let RecievedDate = req.body.RecievedDate;
    let Partner = req.body.Partner;
    let Value = req.body.Value

    if (typeof Comments != "string" && typeof RecievedDate != "string" && typeof Partner != "number" && typeof Value != "number") {
        res.send("Invalid");
        res.end();
        return;
    }


    if (Partner && RecievedDate) {
        const sqlInsert = "INSERT INTO sql5669328.intake (Comments, RecievedDate, Partner, TotalValue) VALUES (?,?,?,?);"
        sb.query(sqlInsert, [Comments, RecievedDate, Partner, Value], (err, result) => {
            console.log(err);
            console.log("1")
            res.send()
            res.end()
            return;
        })
    }

}

const location = (req, res) => {
    let Items = req.body.Items
    let Location = req.body.Location_id


    if (typeof Items != "object" && typeof Location != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (Items && Location) {
        let ids = []
        Items.forEach(element => {
            ids.push(element.Item_id);
        });

        const sqlGet = `SELECT il.ItemLocation_id
        from sql5669328.itemlocation il
        WHERE il.Item_id IN (?) AND il.Location_id = ?;`

        sb.query(sqlGet, [ids, Location], (err, result) => {
            console.log(err);
            console.log("5")
            res.send(result);
            res.end();
            return;
        })

    }
}

const find_id = (req, res) => {
    const query = "SELECT MAX(Intake_id) as Intake_id FROM sql5669328.intake;"

    sb.query(query, (err, result) => {
        console.log("3")
        res.send(result);
        res.end()
        return;
    })
}

const track = (req, res) => {
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
        const sqlInsert = `INSERT INTO sql5669328.intakeitems (Intake_id, Quantity, Value, FKItemLocation) VALUES (?,?,?,?);`
        for (var i = 0; i < Items.length; i++) {
            let Value = Items[i].Quantity * Values[i].FairMarketValue
            sb.query(sqlInsert, [Intake_id, Items[i].Quantity, Value, FKItemLocation[i].ItemLocation_id], (err, result) => {
                console.log(err);

            })
        }
        console.log("6")
        res.send();
        res.end();
        return;
    }
}



const update_item = (req, res) => {
    let ItemLocationFK = req.body.ItemLocationFK;
    let Items = req.body.Items;

    if (typeof ItemLocationFK != "object" && typeof Items != "object") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (ItemLocationFK && Items) {
        const sqlUpdate = "UPDATE sql5669328.itemlocation SET Quantity= Quantity + ? WHERE ItemLocation_id = ?;"
        for (var i = 0; i < Items.length; i++) {
            sb.query(sqlUpdate, [Items[i].Quantity, ItemLocationFK[i].ItemLocation_id], (err, result) => {
                console.log("7");
                console.log(err);
                res.send()
                res.end()
                return;
            })
        }
    }
}

const intake_view = (req, res) => {
    let id = req.params.id

    if (typeof id != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (id) {
        const sqlGet = `
    select Cast(i.RecievedDate as char(10)) as RecievedDate, p.Name as Partner, it.Name as Item, it.FairMarketValue, l.Name as Location, ii.Quantity
    from sql5669328.intakeitems ii
    join sql5669328.itemlocation il on ii.FKItemLocation = il.ItemLocation_id
    join sql5669328.intake i on ii.Intake_id = i.Intake_id
    join sql5669328.item it on it.Item_id = il.Item_id
    join sql5669328.location l on l.Location_id = il.Location_id
    join sql5669328.partner p on i.Partner = p.Partner_id
    where ii.Intake_id = ?; 
    `;
        sb.query(sqlGet, [id], (err, result) => {
            res.send(result);
            res.end();
            return
        })
    }
}

const edit = (req, res) => {
    let id = req.params.id

    if (typeof id != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (id) {
        const sqlGet = `
    select i.Comments, i.TotalValue, Cast(i.RecievedDate as char(10)) AS RecievedDate, i.Partner, il.Location_id, pt.Type
    from sql5669328.intake i
    join sql5669328.intakeitems ii on i.Intake_id = ii.Intake_id
    join sql5669328.partner p on i.Partner = p.Partner_id
    join sql5669328.partnertype pt on p.Type = pt.PartnerType_id
    join sql5669328.itemlocation il on ii.FKItemLocation = il.ItemLocation_id
    where i.Intake_id = ?; 
    `;
        sb.query(sqlGet, [id], (err, result) => {
            res.send(result);
            res.end()
            return;
        })
    }
}

const update = (req, res) => {
    let id = req.params.id
    let Comments = req.body.Comments;
    let RecievedDate = req.body.RecievedDate;
    let Partner = req.body.Partner;
    let Value = req.body.Value


    if (typeof id != "string" && typeof Comments != "string" && typeof RecievedtDate != 'string' && typeof Partner != 'number' && typeof Value != 'number') {
        res.send("Invalid");
        console.log("err");
        res.end();
        return;
    }

    if (RecievedDate && Partner) {
        const sqlUpdate = "UPDATE sql5669328.intake SET Comments= ?, RecievedDate= ?, Partner= ?, TotalValue= ? WHERE Intake_id = ?;"
        sb.query(sqlUpdate, [Comments, RecievedDate, Partner, Value, id], (err, result) => {
            console.log(err);
            res.send()
            res.end()
            return;
        })
    }
}

const intake_find_value = (req, res) => {
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
        from sql5669328.item i
        WHERE i.Item_id IN (?);`

        
        console.log(sb.format(sqlGet, [ids]))
        sb.query(sqlGet, [ids], (err, result, fields, query) => {
            console.log(err);
            res.send(result);
            res.end();
            return;
        })
    }

}

const intake_cleanup = (req, res) => {
    let id = req.params.id

    if (typeof id != 'string') {
        res.send('Invalid');
        res.end();
        return
    }

    if (id) {
        const sqlGet = `SELECT ii.Quantity as Given, ii.FKItemLocation, il.Quantity
        from sql5669328.intakeitems as ii
        join sql5669328.itemlocation il on ii.FKItemLocation = il. ItemLocation_id
        where ii.Intake_id = ?;`
        sb.query(sqlGet, [id], (err, result) => {
            res.send(result)
            res.end()
            return;
        })
    }
}

const intake_reclaim = (req, res) => {
    let records = req.body.records


    if (typeof records != "object") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (records) {
        for (let record in records) {
            Quantity = records[record].Quantity - records[record].Given
            const sqlUpdate = "UPDATE sql5669328.itemlocation SET Quantity= ? WHERE ItemLocation_id = ?;"
            sb.query(sqlUpdate, [Quantity, records[record].FKItemLocation], (err, result) => {
                console.log(err);
                res.send()
                res.end()
                return;
            })
        }

    }
}

const intake_remove = (req, res) => {

    let id = req.params.id;
    if (typeof id != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (id) {
        const sqlDelete = 'DELETE FROM sql5669328.intake WHERE Intake_id = ?;'
        sb.query(sqlDelete, [id], (err, result) => {
            console.log(err);
            res.send()
            res.end()
            return;
        })
    }
}

const intake_edit_items = (req, res) => {
    let id = req.params.id

    if (typeof id != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (id) {
        const sqlGet = `
        SELECT ii.Quantity, il.Item_id
        from sql5669328.intakeitems as ii
        join sql5669328.itemlocation il on ii.FKItemLocation= il.ItemLocation_id
        where ii.Intake_id = ?;
    `;
        sb.query(sqlGet, [id], (err, result) => {
            res.send(result);
            res.end()
            return;
        })
    }
}

const intake_update_delete = (req, res) => {
    let id = req.params.id

    if (typeof id != "string") {
        res.send("Invalid");
        res.end();
        return
    }

    if (id) {
        const sqlDelete = "DELETE FROM sql5669328.intakeitems WHERE Intake_id = ?;"
        sb.query(sqlDelete, [id], (err, result) => {
            console.log(err);
            res.send()
            res.end()
            return;
        })
    }
}

const intake_misc = (req, res) => {
    const sqlGet = `SELECT p.Partner_id
    from sql5669328.partner p
    join sql5669328.partnertype pt on p.Type = pt.PartnerType_id
    WHERE pt.Type = "Misc Donation";`

    sb.query(sqlGet, (err, result) => {
        console.log(err);
        res.send(result);
        res.end()
        return
    })
}

module.exports = {
    data,
    create,
    location,
    find_id,
    track,
    update_item,
    intake_view,
    edit,
    update,
    intake_find_value,
    intake_cleanup,
    intake_reclaim,
    intake_remove,
    intake_edit_items,
    intake_update_delete,
    intake_misc
}
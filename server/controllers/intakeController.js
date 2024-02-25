const mysql = require('mysql2');
const sb = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "WebVoyage2023!",
    database: 'claire',
    port: 3006
});

const data = (req, res) => {
    const sqlGet = `
    select p.Name, i.Comments as Comments, Cast(i.RecievedDate as char(10)) as RecievedDate, i.Value as Value, i.Intake_id, ROUND(SUM(ii.Value), 2) as Total
    from claire.intake i
    join claire.partner p on i.Partner = p.Partner_id
    join claire.intakeitems ii on i.Intake_id = ii.Intake_id
    group by i.Intake_id
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
    let Value = req.body.Value;
    let Partner = req.body.Partner;


    const sqlInsert = "INSERT INTO claire.intake (Comments, RecievedDate, Value, Partner) VALUES (?,?,?,?);"
    sb.query(sqlInsert, [Comments, RecievedDate, Value, Partner], (err, result) => {
        console.log(err);
        res.send()
        res.end()
        return;
    })
}

const location = (req, res) => {
    let Item_id = req.body.Item_id;
    let Location_id = req.body.Location_id;

    const query = `
    select il.ItemLocation_id
    from itemlocation il
    JOIN item i ON il.Item_id = i.Item_id
    JOIN location l ON il.Location_id = l.Location_id
    WHERE i.Item_id = ? AND l.Location_id = ?
    `;

    sb.query(query, [Item_id, Location_id], (err, result) => {
        res.send(result);
        res.end()
        return;
    })
}

const find_id = (req, res) => {
    const query = "SELECT MAX(Intake_id) as Intake_id FROM claire.intake;"

    sb.query(query, (err, result) => {
        res.send(result);
        res.end()
        return;
    })
}

const track = (req, res) => {
    let Intake_id = req.body.Intake_id;
    let Quantity = req.body.Quantity;
    let Value = req.body.Value;
    let FKItemLocation = req.body.FKItemLocation;

    const sqlInsert = "INSERT INTO claire.intakeitems (Intake_id, Quantity, Value, FKItemLocation) VALUES (?,?,?,?);"

    sb.query(sqlInsert, [Intake_id, Quantity, Value, FKItemLocation], (err, result) => {
        console.log(err);
        res.send()
        res.end()
        return;
    })
}

const find_q = (req, res) => {
    let ItemLocationFK = req.body.ItemLocationFK;

    const sqlGet = "SELECT Quantity FROM claire.itemlocation WHERE ItemLocation_id = ?"
    sb.query(sqlGet, [ItemLocationFK], (err, result) => {
        res.send(result);

        res.end()
        return;
    })
}

const update_item = (req, res) => {
    let ItemLocationFK = req.body.ItemLocationFK;
    let Quantity = req.body.Quantity;
    let CurrentQ = req.body.CurrentQ;

    Quantity = +CurrentQ + +Quantity;
    const sqlUpdate = "UPDATE claire.itemlocation SET Quantity= ? WHERE ItemLocation_id = ?;"
    sb.query(sqlUpdate, [Quantity, ItemLocationFK], (err, result) => {
        console.log(err);
        res.send()
        res.end()
        return;
    })
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
    from claire.intakeitems ii
    join claire.itemlocation il on ii.FKItemLocation = il.ItemLocation_id
    join claire.intake i on ii.Intake_id = i.Intake_id
    join claire.item it on it.Item_id = il.Item_id
    join claire.location l on l.Location_id = il.Location_id
    join claire.partner p on i.Partner = p.Partner_id
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
    select i.Comments, i.Value, Cast(i.RecievedDate as char(10)) AS RecievedDate, i.Partner, il.Location_id
    from claire.intake i
    join claire.intakeitems ii on i.Intake_id = ii.Intake_id
    join claire.itemlocation il on ii.FKItemLocation = il.ItemLocation_id
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
    let Value = req.body.Value;
    let Partner = req.body.Partner;


    if (typeof id != "string" && typeof Comments != "string" && typeof RecievedtDate != 'string' && typeof Partner != 'number' && typeof Value != 'number') {
        res.send("Invalid");
        console.log("err");
        res.end();
        return;
    }

    if (RecievedDate && Value && Partner) {
        const sqlUpdate = "UPDATE claire.intake SET Comments= ?, RecievedDate= ?, Partner= ?, Value = ? WHERE Intake_id = ?;"
        sb.query(sqlUpdate, [Comments, RecievedDate, Partner, Value, id], (err, result) => {
            console.log(err);
            res.send()
            res.end()
            return;
        })
    }
}

const intake_find_value = (req, res) => {
    let Item_id = req.body.Item_id;
    if (typeof Item_id != "string") {
        res.send("Invalid");
        res.end();
        return;
    }


    if (Item_id) {
        const sqlGet = "SELECT FairMarketValue FROM claire.item WHERE Item_id = ?;"
        sb.query(sqlGet, [Item_id], (err, result) => {
            res.send(result);
            res.end()
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
        const sqlUpdate = `SELECT ii.Quantity as Given, ii.FKItemLocation, il.Quantity
        from claire.intakeitems as ii
        join claire.itemlocation il on ii.FKItemLocation = il. ItemLocation_id
        where ii.Intake_id = ?;`
        sb.query(sqlUpdate, [id], (err, result) => {
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
            const sqlUpdate = "UPDATE claire.itemlocation SET Quantity= ? WHERE ItemLocation_id = ?;"
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
        const sqlDelete = 'DELETE FROM claire.intake WHERE Intake_id = ?;'
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
        SELECT ii.Quantity, il.Item_id as Item
        from claire.intakeitems as ii
        join claire.itemlocation il on ii.FKItemLocation= il.ItemLocation_id
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
        const sqlDelete = "DELETE FROM claire.intakeitems WHERE Intake_id = ?;"
        sb.query(sqlDelete, [id], (err, result) => {
            console.log(err);
            res.send()
            res.end()
            return;
        })
    }
}

module.exports = {
    data,
    create,
    location,
    find_id,
    track,
    find_q,
    update_item,
    intake_view,
    edit,
    update,
    intake_find_value,
    intake_cleanup,
    intake_reclaim,
    intake_remove,
    intake_edit_items,
    intake_update_delete
}
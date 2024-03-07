const mysql = require('mysql2');
const sb = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "WebVoyage2023!",
    database: 'claire',
    port: 3006
});

const distribution_index = (req, res) => {
    const sqlGet = `
    select o.Comments, o.Status, o.DeliveryMethod, Cast(o.RequestDate as char(10)) AS RequestDate, CAST(o.CompletedDate as char(10))AS CompletedDate, o.Order_id, p.Name, SUM(oi.Quantity) as Total
    from claire.order o
    join claire.partner p on o.Partner_id = p.Partner_id 
    join claire.orderitems oi on o.Order_id = oi.Order_id
    group by o.Order_id
    `;
    sb.query(sqlGet, (err, result) => {
        res.send(result);
        res.end()
        return;
    })
}

const distribution_creation = (req, res) => {
    let Comments = req.body.Comments;
    let Status = req.body.Status;
    let DeliveryMethod = req.body.DeliveryMethod;
    let RequestDate = req.body.RequestDate;
    let CompletedDate = req.body.CompletedDate;
    let Partner_id = req.body.Partner_id;

    if (typeof Comments != "string" && typeof Status != 'string' && typeof DeliveryMethod != 'string' && typeof RequestDate != 'string' && typeof CompletedDate != 'string' && typeof Partner_id != 'number') {
        res.send("Invalid");
        res.end();
        return;
    }

    if (DeliveryMethod && RequestDate && CompletedDate && Partner_id) {
        const sqlInsert = "INSERT INTO claire.order (Comments, Status, DeliveryMethod, RequestDate, CompletedDate, Partner_id) VALUES (?,?,?,?,?,?);"
        sb.query(sqlInsert, [Comments, Status, DeliveryMethod, RequestDate, CompletedDate, Partner_id], (err, result) => {
            console.log(err);
            res.end()
            return;
        })
    }
}

const distribution_remove = (req, res) => {

    let id = req.params.id;
    if (typeof id != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (id) {
        const sqlDelete = 'DELETE FROM claire.order WHERE Order_id = ?;'
        sb.query(sqlDelete, [id], (err, result) => {
            console.log(err);
            res.end()
            return;
        })
    }
}

const distribution_view = (req, res) => {
    let id = req.params.id

    if (typeof id != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (id) {
        const sqlGet = `
        select o.DeliveryMethod, o.Status, l.Name as Location, Cast(o.RequestDate as char(10)) AS RequestDate, CAST(o.CompletedDate as char(10))AS CompletedDate, p.Name
        from claire.orderitems oi
        join claire.itemlocation il on oi.ItemLocationFK = il.ItemLocation_id
        join claire.order o on oi.Order_id = o.Order_id
        join claire.partner p on o.Partner_id = p.Partner_id
        join claire.location l on l.Location_id = il.Location_id
        where oi.Order_id = ?;
    `;
        sb.query(sqlGet, [id], (err, result) => {
            res.send(result);
            res.end()
            return;
        })
    }
}

const distribution_itemlist = (req, res) => {
    let id = req.params.id

    if (typeof id != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (id) {
        const sqlGet = `
        SELECT oi.Quantity, i.Name as Item, i.FairMarketValue
        from claire.orderitems as oi
        join claire.itemlocation il on oi.ItemLocationFK = il. ItemLocation_id
        join claire.item i on i.Item_id = il.Item_id
        where oi.Order_id = ?;
        `;
        sb.query(sqlGet, [id], (err, result) => {
            res.send(result);
            res.end()
            return;
        })
    }
}

const distribution_edit = (req, res) => {
    let id = req.params.id

    if (typeof id != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (id) {
        const sqlGet = `
    select o.Comments, o.DeliveryMethod, Cast(o.RequestDate as char(10)) AS RequestDate, CAST(o.CompletedDate as char(10))AS CompletedDate, o.Partner_id, il.Location_id
    from claire.order o
    join claire.orderitems oi on o.Order_id = oi.Order_id
    join claire.itemlocation il on oi.ItemLocationFK = il.ItemLocation_id
    where o.Order_id = ?; 
    `;
        sb.query(sqlGet, [id], (err, result) => {
            res.send(result);
            res.end()
            return;
        })
    }
}

const distribution_edit_items = (req, res) => {
    let id = req.params.id

    if (typeof id != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (id) {
        const sqlGet = `
        SELECT oi.Quantity, il.Item_id as Item
        from claire.orderitems as oi
        join claire.itemlocation il on oi.ItemLocationFK = il. ItemLocation_id
        where oi.Order_id = ?;
    `;
        sb.query(sqlGet, [id], (err, result) => {
            res.send(result);
            res.end()
            return;
        })
    }
}

const distribution_update = (req, res) => {

    let id = req.params.id
    let Comments = req.body.Comments;
    let DeliveryMethod = req.body.DeliveryMethod;
    let RequestDate = req.body.RequestDate;
    let CompletedDate = req.body.CompletedDate;
    let Partner_id = req.body.Partner_id;


    if (typeof id != "string" && typeof Comments != "string" && typeof DeliveryMethod != 'string' && typeof RequestDate != 'string' && typeof CompletedDate != 'string' && typeof Partner_id != 'number') {
        res.send("Invalid");
        console.log("err");
        res.end();
        return;
    }

    if (DeliveryMethod && RequestDate && CompletedDate && Partner_id && id) {
        const sqlUpdate = "UPDATE claire.order SET Comments= ?, DeliveryMethod= ?, RequestDate= ?, CompletedDate= ?, Partner_id= ? WHERE Order_id = ?;"
        sb.query(sqlUpdate, [Comments, DeliveryMethod, RequestDate, CompletedDate, Partner_id, id], (err, result) => {
            console.log("done");
            res.send()
            res.end()
            return;
        })
    }
}

const distribution_find_ild = (req, res) => {
    let Item_id = req.body.Item_id;
    let Location_id = req.body.Location_id;

    if (typeof Item_id != "string" && typeof Location_id != "string") {
        res.send("Invalid");
        console.log("ild Invalid")
        res.end();
        return;
    }


    if (Item_id && Location_id) {
        const sqlGet = "SELECT ItemLocation_id FROM claire.itemlocation WHERE Item_id = ? AND Location_id = ?;"
        sb.query(sqlGet, [Item_id, Location_id], (err, result) => {
            res.send(result);
            res.end()
            return;
        })
    }

}

const distribution_find_q = (req, res) => {
    let ItemLocationFK = req.body.ItemLocationFK;

    if (typeof ItemLocationFK != "number") {
        res.send("Invalid");
        res.end();
        return;
    }


    if (ItemLocationFK) {
        const sqlGet = "SELECT Quantity FROM claire.itemlocation WHERE ItemLocation_id = ?"
        sb.query(sqlGet, [ItemLocationFK], (err, result) => {
            res.send(result);
            res.end()
            return;
        })
    }

}

const distribution_find_value = (req, res) => {
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

const distribution_find_id = (req, res) => {
    let RequestDate = req.body.RequestDate;
    let CompletedDate = req.body.CompletedDate;
    let Partner_id = req.body.Partner_id;

    if (typeof RequestDate != "string" && typeof CompletedDate != "string" && typeof Partner_id != "number") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (RequestDate && CompletedDate && Partner_id) {
        const sqlGet = "SELECT Order_id FROM claire.order WHERE Partner_id = ? AND RequestDate = ? AND CompletedDate = ?;"
        sb.query(sqlGet, [Partner_id, RequestDate, CompletedDate], (err, result) => {
            res.send(result);
            res.end()
            return;
        })
    }

}

const distribution_track = (req, res) => {
    let Order_id = req.body.Order_id;
    let Quantity = req.body.Quantity;
    let Value = req.body.Value;
    let ItemLocationFK = req.body.ItemLocationFK;

    if (typeof ItemLocationFK != 'number' && typeof Value != 'number' && typeof Quantity != 'number' && typeof Order_id != 'string') {
        res.send("Invalid");
        res.end();
        return;
    }

    if (Order_id && Quantity && Value && ItemLocationFK) {
        const sqlInsert = "INSERT INTO claire.orderitems (Order_id, Quantity, Value, ItemLocationFK) VALUES (?,?,?,?);"
        sb.query(sqlInsert, [Order_id, Quantity, Value, ItemLocationFK], (err, result) => {
            console.log(err);
            res.send()
            res.end()
            return;
        })
    }
}

const distribution_update_item = (req, res) => {

    let ItemLocationFK = req.body.ItemLocationFK;
    let Quantity = req.body.Quantity;
    let CurrentQ = req.body.CurrentQ;


    if (typeof ItemLocationFK != "number" && typeof Quantity != "number" && typeof CurrentQ != "number") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (ItemLocationFK && Quantity && CurrentQ) {
        Quantity = CurrentQ - Quantity;
        const sqlUpdate = "UPDATE claire.itemlocation SET Quantity= ? WHERE ItemLocation_id = ?;"
        sb.query(sqlUpdate, [Quantity, ItemLocationFK], (err, result) => {
            console.log(err);
            res.send()
            res.end()
            return;
        })
    }
}

const distribution_complete = (req, res) => {
    let id = req.params.id

    if (typeof id != 'string') {
        res.send('Invalid');
        res.end();
        return
    }

    if (id) {
        const sqlUpdate = "UPDATE claire.order SET Status = 'Submitted' WHERE Order_id = ?;"
        sb.query(sqlUpdate, [id], (err, result) => {
            console.log(err);
            res.send()
            res.end()
            return;
        })
    }
}

const distribution_incomplete = (req, res) => {
    let id = req.params.id

    if (typeof id != 'string') {
        res.send('Invalid');
        res.end();
        return
    }

    if (id) {
        const sqlUpdate = "UPDATE claire.order SET Status = 'Draft' WHERE Order_id = ?;"
        sb.query(sqlUpdate, [id], (err, result) => {
            console.log(err);
            res.send()
            res.end()
            return;
        })
    }
}

const distribution_cleanup = (req, res) => {
    let id = req.params.id

    if (typeof id != 'string') {
        res.send('Invalid');
        res.end();
        return
    }

    if (id) {
        const sqlUpdate = `SELECT oi.Quantity as Given, oi.ItemLocationFK, il.Quantity
        from claire.orderitems as oi
        join claire.itemlocation il on oi.ItemLocationFK = il. ItemLocation_id
        where oi.Order_id = ?;`
        sb.query(sqlUpdate, [id], (err, result) => {
            res.send(result)
            res.end()
            return;
        })
    }
}

const distribution_reclaim = (req, res) => {
    let records = req.body.records


    if (typeof records != "object") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (records) {
        for (let record in records) {
            Quantity = records[record].Quantity + records[record].Given
            const sqlUpdate = "UPDATE claire.itemlocation SET Quantity= ? WHERE ItemLocation_id = ?;"
            sb.query(sqlUpdate, [Quantity, records[record].ItemLocationFK], (err, result) => {
                console.log(err);
                res.send()
                res.end()
                return;
            })
        }

    }
}

const distribution_update_delete = (req, res) => {
    let id = req.params.id

    if (typeof id != "string") {
        res.send("Invalid");
        res.end();
        return
    }

    if (id) {
        const sqlDelete = "DELETE FROM claire.orderitems WHERE Order_id = ?;"
        sb.query(sqlDelete, [id], (err, result) => {
            console.log(err);
            res.send()
            res.end()
            return;
        })
    }
}

const distribution_print = (req, res) => {
    let id = req.params.id
    if (typeof id != "string") {
        res.send("Invalid");
        res.end();
        return
    }

    if (id) {
        const sqlGet = `SELECT o.Comments, CAST(o.CompletedDate as char(10))AS CompletedDate, p.Name AS Partner, SUM(oi.Quantity) AS Total, SUM(oi.Value) AS TotalValue
        from claire.order o
        join claire.partner p on o.Partner_id = p.Partner_id
        join claire.orderitems oi on o.Order_id = oi.Order_id
        where o.Order_id = ?;`

        sb.query(sqlGet, [id], (err, result) => {
            console.log(err);
            res.send(result)
            res.end()
            return;
        })
    }

}


module.exports = {
    distribution_index,
    distribution_creation,
    distribution_remove,
    distribution_edit,
    distribution_update,
    distribution_find_id,
    distribution_find_ild,
    distribution_find_value,
    distribution_track,
    distribution_find_q,
    distribution_update_item,
    distribution_view,
    distribution_complete,
    distribution_incomplete,
    distribution_cleanup,
    distribution_reclaim,
    distribution_itemlist,
    distribution_edit_items,
    distribution_update_delete,
    distribution_print
}
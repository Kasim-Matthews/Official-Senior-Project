const mysql = require('mysql2');
const sb = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Lindsey1!",
    database: 'claire',
    port: 3306
});

const distribution_index = (req, res) => {
    const sqlGet = `
    select o.Comments, o.Status, o.DeliveryMethod, Cast(o.RequestDate as char(10)) AS RequestDate, CAST(o.CompletedDate as char(10))AS CompletedDate, o.Order_id, p.Name, SUM(oi.Quantity) as Total, l.Name as Location
    from claire.order o
    join claire.partner p on o.Partner_id = p.Partner_id 
    join claire.orderitems oi on o.Order_id = oi.Order_id
    join claire.itemlocation il on oi.ItemLocationFK = il.ItemLocation_id
    join claire. location l on l.Location_id = il.Location_id
    group by o.Order_id, l.Name;
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
        SELECT oi.Quantity, i.Name as Item, i.FairMarketValue, i.PackageCount
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
        SELECT oi.Quantity, il.Item_id
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


const distribution_find_value = (req, res) => {
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

        
        sb.query(sqlGet, [ids], (err, result, fields, query) => {
            console.log(err);
            res.send(result);
            res.end();
            return;
        })
    }

}

const distribution_find_id = (req, res) => {
    const query = "SELECT MAX(Order_id) as Order_id FROM claire.order;"

    sb.query(query, (err, result) => {
        console.log(err);
        res.send(result);
        res.end()
        return;
    })

}

const distribution_track = (req, res) => {
    let Items = req.body.Items
    let Values = req.body.Values
    let Order_id = req.body.Order_id
    let ItemLocationFK = req.body.ItemLocationFK
    
    
    
    if (typeof Items != "object" && typeof Values != "object" && typeof Order_id != "number" && typeof ItemLocationFK != "object") {
        res.send("Invalid")
        res.end();
        return;
    }
    
    if (Items && Values && Order_id && ItemLocationFK) {
        const sqlInsert = `INSERT INTO claire.orderitems (Order_id, Quantity, Value, ItemLocationFK) VALUES (?,?,?,?);`
        for (var i = 0; i < Items.length; i++) {
            let Value = Items[i].Quantity * Values[i].FairMarketValue
            sb.query(sqlInsert, [Order_id, Items[i].Quantity, Value, ItemLocationFK[i].ItemLocation_id], (err, result) => {
                console.log(err);
    
            })
        }
        res.send();
        res.end();
        return;
    }
}



const distribution_update_item = (req, res) => {
    let ItemLocationFK = req.body.ItemLocationFK;
    let Items = req.body.Items;

    if (typeof ItemLocationFK != "object" && typeof Items != "object") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (ItemLocationFK && Items) {
        const sqlUpdate = "UPDATE claire.itemlocation SET Quantity= Quantity - ? WHERE ItemLocation_id = ?;"
        for (var i = 0; i < Items.length; i++) {
            sb.query(sqlUpdate, [Items[i].Quantity, ItemLocationFK[i].ItemLocation_id], (err, result) => {
                console.log(err);
                res.send()
                res.end()
                return;
            })
        }
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
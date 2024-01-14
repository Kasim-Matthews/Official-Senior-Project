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
    select o.Comments, o.Status, o.DeliveryMethod, o.RequestDate, o.CompletedDate, o.Order_id, p.Name
    from claire.order o
    join claire.partner p on o.Partner_id = p.Partner_id 
    `;
    sb.query(sqlGet, (err, result) => {
        res.send(result);
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
    select o.Comments, o.Status, o.DeliveryMethod, o.RequestDate, o.CompletedDate, o.Order_id, p.Name
    from claire.order o
    join claire.partner p on o.Partner_id = p.Partner_id
    where Order_id = ?; 
    `;
        sb.query(sqlGet, [id], (err, result) => {
            res.send(result);
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
    select o.Comments, o.Status, o.DeliveryMethod, Cast(o.RequestDate as char(10)) AS RequestDate, CAST(o.CompletedDate as char(10))AS CompletedDate, o.Order_id, o.Partner_id, p.Name
    from claire.order o
    join claire.partner p on o.Partner_id = p.Partner_id
    where Order_id = ?; 
    `;
        sb.query(sqlGet, [id], (err, result) => {
            res.send(result);
        })
    }
}

const distribution_update = (req, res) => {

    let id = req.params.id
    let Comments = req.body.Comments;
    let Status = req.body.Status;
    let DeliveryMethod = req.body.DeliveryMethod;
    let RequestDate = req.body.RequestDate;
    let CompletedDate = req.body.CompletedDate;
    let Partner_id = req.body.Partner_id;


    if (typeof id != "string" && typeof Comments != "string" && typeof Status != 'string' && typeof DeliveryMethod != 'string' && typeof RequestDate != 'string' && typeof CompletedDate != 'string' && typeof Partner_id != 'number') {
        res.send("Invalid");
        console.log("err");
        res.end();
        return;
    }

    if (Status && DeliveryMethod && RequestDate && CompletedDate && Partner_id) {
        console.log("err");
        const sqlUpdate = "UPDATE claire.order SET Comments= ?, Status= ?, DeliveryMethod= ?, RequestDate= ?, CompletedDate= ?, Partner_id= ? WHERE Order_id = ?;"
        sb.query(sqlUpdate, [Comments, Status, DeliveryMethod, RequestDate, CompletedDate, Partner_id, id], (err, result) => {
            console.log(err);
        })
    }
}

const distribution_find_ild = (req, res) => {
    let Item_id = req.body.Item_id;
    let Location_id = req.body.Location_id;

    const sqlGet = "SELECT ItemLocation_id FROM claire.itemlocation WHERE Item_id = ? AND Location_id = ?;"
    sb.query(sqlGet, [Item_id, Location_id], (err, result) => {
        res.send(result);
    })
}

const distribution_find_q = (req, res) => {
    let ItemLocationFK = req.body.ItemLocationFK;

    const sqlGet = "SELECT Quantity FROM claire.itemlocation WHERE ItemLocation_id = ?"
    sb.query(sqlGet, [ItemLocationFK], (err, result) => {
        res.send(result);
    })
}

const distribution_find_value = (req, res) => {
    let Item_id = req.body.Item_id;

    const sqlGet = "SELECT FairMarketValue FROM claire.item WHERE Item_id = ?;"
    sb.query(sqlGet, [Item_id], (err, result) => {
        res.send(result);
    })
}

const distribution_find_id = (req, res) => {
    let RequestDate = req.body.RequestDate;
    let CompletedDate = req.body.CompletedDate;
    let Partner_id = req.body.Partner_id;

    const sqlGet = "SELECT Order_id FROM claire.order WHERE Partner_id = ? AND RequestDate = ? AND CompletedDate = ?;"
    sb.query(sqlGet, [Partner_id, RequestDate, CompletedDate], (err, result) => {
        res.send(result);
    })
}

const distribution_track = (req, res) => {
    console.log(req.body)
    let Order_id = req.body.Order_id;
    let Quantity = req.body.Quantity;
    let Value = req.body.Value;
    let ItemLocationFK = req.body.ItemLocationFK;

    if (typeof ItemLocationFK != 'number' && typeof Value != 'number' && typeof Quantity != 'number' && typeof Order_id != 'number') {
        res.send("Invalid");
        res.end();
        return;
    }

    if (Order_id && Quantity && Value && ItemLocationFK) {
        const sqlInsert = "INSERT INTO claire.orderitems (Order_id, Quantity, Value, ItemLocationFK) VALUES (?,?,?,?);"
        sb.query(sqlInsert, [Order_id, Quantity, Value, ItemLocationFK], (err, result) => {
            console.log(err);
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
    distribution_incomplete
}
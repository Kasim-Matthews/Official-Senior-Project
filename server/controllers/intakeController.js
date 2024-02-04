const mysql = require('mysql2');
const sb = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Lindsey1!",
    database: "claire",
    port: 3306
});

const data = (req, res) => {
    const sqlGet = `
    select p.Name, i.Comments as Comments, i.RecievedDate as RecievedDate, i.Value as Value, i.Intake_id
    from claire.intake i
    join claire.partner p on i.Partner = p.Partner_id
    `;
    sb.query(sqlGet, (err, result) => {
        res.send(result);
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
    })
}

const find_id = (req, res) => {
    const query = "SELECT MAX(Intake_id) as Intake_id FROM claire.intake;"

    sb.query(query, (err, result) => {
        res.send(result);
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
    })
}

const find_q = (req, res) => {
    let ItemLocationFK = req.body.ItemLocationFK;

    const sqlGet = "SELECT Quantity FROM claire.itemlocation WHERE ItemLocation_id = ?"
    sb.query(sqlGet, [ItemLocationFK], (err, result) => {
        res.send(result);
    })
}

const update = (req, res) => {
    let ItemLocationFK = req.body.ItemLocationFK;
    let Quantity = req.body.Quantity;
    let CurrentQ = req.body.CurrentQ;

    Quantity = +CurrentQ + +Quantity;
    const sqlUpdate = "UPDATE claire.itemlocation SET Quantity= ? WHERE ItemLocation_id = ?;"
    sb.query(sqlUpdate, [Quantity, ItemLocationFK], (err, result) => {
        console.log(err);
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
    select i.Comments, i.RecievedDate, p.Name, i.Value
    from claire.intake i
    join claire.partner p on i.Partner = p.Partner_id
    where Intake_id = ?; 
    `;
        sb.query(sqlGet, [id], (err, result) => {
            res.send(result);
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
    update,
    intake_view
}
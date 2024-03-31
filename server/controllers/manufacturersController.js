const mysql = require('mysql2');
const sb = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Lindsey1!",
    database: "claire",
    port: 3306
});

const manu_index = (req, res) => {
    const sqlGet = `SELECT p.Name, p.Partner_id, COUNT(ii.FKItemLocation) as TotalItems 
    FROM claire.partner p 
    join claire.partnertype pt on p.Type = pt.PartnerType_id
    join intake i on i.Partner = p.Partner_id
    join intakeitems ii on ii.Intake_id = i.Intake_id
    join itemlocation il on il.ItemLocation_id = ii.FKItemLocation 
    WHERE DeletedAt IS NULL AND pt.Type = "Manufacturer"
    group by p.Name, p.Partner_id;`
    sb.query(sqlGet, (err, result) => {
        res.send(result);
    })
}

const manu_list = (req, res) => {
    const sqlGet = `SELECT Name, Partner_id FROM claire.partner 
    join claire.partnertype on claire.partner.Type = claire.partnertype.PartnerType_id 
    WHERE DeletedAt IS NULL AND partnertype.Type = "Manufacturer";`
    sb.query(sqlGet, (err, result) => {
        res.send(result);
    })
}

const manu_create = (req, res) => {
    let Name = req.body.name;
    let Type = req.body.type;

    if (typeof Name != "string" && typeof Type != "number") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (Name && Type) {
        const sqlInsert = "INSERT INTO claire.partner (Name, Type) VALUES (?,?);"
        sb.query(sqlInsert, [Name, Type], (err, result) => {
            console.log(err);
        })
        res.end();
        return;
    }
}

const manu_delete = (req, res) => {
    let id = req.params.id;
    let date = req.body.date;
    if (typeof id != "string" && typeof date != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (id) {
        const sqlDelete = `UPDATE claire.partner Set DeletedAt= STR_TO_Date(?, '%m/%d/%Y') WHERE Partner_id = ?;`
        sb.query(sqlDelete, [date, id], (err, result) => {
            console.log(err);
        })
    }
}

const manu_edit = (req, res) => {
    let id = req.params.id

    if (typeof id != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (id) {
        const sqlGet = 'SELECT Name FROM claire.partner WHERE Partner_id = ?;'
        sb.query(sqlGet, [id], (err, result) => {
            res.send(result);
        })
    }
}

const manu_update = (req, res) => {

    let id = req.params.id
    let Name = req.body.name;



    if (typeof id != "string" && typeof Name != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (Name && id) {
        const sqlUpdate = "UPDATE claire.partner SET Name= ? WHERE Partner_id = ?;"
        sb.query(sqlUpdate, [Name, id], (err, result) => {
            console.log(err);
        })
    }
}

const manu_view = (req, res) => {
    let id = req.params.id

    if(typeof id != "string"){
        res.send("Invalid");
        res.end();
        return
    }

    if(id){
        const sqlGet = `SELECT p.Name as Manufacturer, CAST(i.RecievedDate as char(10)) as Date, SUM(ii.Quantity) as Volume, i.Intake_id
        from claire.intake i
        join claire.intakeitems ii on ii.Intake_id = i.Intake_id
        join claire.partner p on p.Partner_id = i.Partner
        WHERE p.Partner_id = ?
        group by i.RecievedDate, i.Intake_id`

        sb.query(sqlGet, [id], (err, result) => {
            res.send(result);
            res.end();
            return
        })
    }
}

module.exports = {
    manu_index,
    manu_create,
    manu_delete,
    manu_list,
    manu_edit,
    manu_update,
    manu_view
}
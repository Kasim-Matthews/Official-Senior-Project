const mysql = require('mysql2');
const dbconfig = require('../database')
var sb = mysql.createPool(dbconfig);

const dsite_index = (req, res) => {
    const sqlGet = `SELECT Name, Address, Partner_id FROM sql5669328.partner 
    join sql5669328.partnertype on sql5669328.partner.Type = sql5669328.partnertype.PartnerType_id 
    WHERE DeletedAt IS NULL AND partnertype.Type = "Donation Site";`
    sb.query(sqlGet, (err, result) => {
        res.send(result);
    })
}

const dsite_list = (req, res) => {
    const sqlGet = `SELECT Name, Partner_id FROM sql5669328.partner 
    join sql5669328.partnertype on sql5669328.partner.Type = sql5669328.partnertype.PartnerType_id 
    WHERE DeletedAt IS NULL AND partnertype.Type = "Donation Site";`
    sb.query(sqlGet, (err, result) => {
        res.send(result);
    })
}

const dsite_create = (req, res) => {
    let Name = req.body.name;
    let Address = req.body.address;
    let Type = req.body.type;

    if (typeof Name != "string" && typeof Address != "string" && typeof Type != "number") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (Name && Address && Type) {
        const sqlInsert = "INSERT INTO sql5669328.partner (Name, Address, Type) VALUES (?,?,?);"
        sb.query(sqlInsert, [Name, Address, Type], (err, result) => {
            console.log(err);
        })
        res.end();
        return;
    }
}

const dsite_delete = (req, res) => {
    let id = req.params.id;
    let date = req.body.date;
    if (typeof id != "string" && typeof date != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (id) {
        const sqlDelete = `UPDATE sql5669328.partner Set DeletedAt= STR_TO_Date(?, '%m/%d/%Y') WHERE Partner_id = ?;`
        sb.query(sqlDelete, [date, id], (err, result) => {
            console.log(err);
        })
    }
}

const dsite_edit = (req, res) => {
    let id = req.params.id

    if (typeof id != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (id) {
        const sqlGet = 'SELECT Name, Address FROM sql5669328.partner WHERE Partner_id = ?;'
        sb.query(sqlGet, [id], (err, result) => {
            res.send(result);
        })
    }
}

const dsite_update = (req, res) => {

    let id = req.params.id
    let Name = req.body.name;
    let Address = req.body.address;



    if (typeof id != "string" && typeof Name != "string" && typeof Address != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (Name && Address && id) {
        const sqlUpdate = "UPDATE sql5669328.partner SET Name= ?, Address= ? WHERE Partner_id = ?;"
        sb.query(sqlUpdate, [Name, Address, id], (err, result) => {
            console.log(err);
        })
    }
}

const dsite_view = (req, res) => {
    let id = req.params.id;

    if (typeof id != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (id) {
        const sqlGet = `SELECT l.Name as Location, i.Intake_id, SUM(ii.Quantity) as Total
        from sql5669328.intake i 
        join sql5669328.intakeitems ii on i.Intake_id = ii.Intake_id
        join sql5669328.itemlocation il on ii.FKItemLocation = il.ItemLocation_id
        join sql5669328.partner p on i.Partner = p.Partner_id
        join sql5669328.location l on l.Location_id = il.Location_id
        WHERE i.Partner = ?
        GROUP by i.Intake_id, l.Name;`
        sb.query(sqlGet, [id], (err, result) => {
            res.send(result);
        })
    }
}

module.exports = {
    dsite_index,
    dsite_create,
    dsite_delete,
    dsite_list,
    dsite_edit,
    dsite_update,
    dsite_view
}
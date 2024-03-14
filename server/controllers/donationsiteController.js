const mysql = require('mysql2');
const sb = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "WebVoyage2023!",
    database: 'claire',
    port: 3006
});

const dsite_index = (req, res) => {
    const sqlGet = `SELECT Name, Address, Partner_id FROM claire.partner 
    join claire.partnertype on claire.partner.Type = claire.partnertype.PartnerType_id 
    WHERE DeletedAt IS NULL AND partnertype.Type = "Donation Site";`
    sb.query(sqlGet, (err, result) => {
        res.send(result);
    })
}

const dsite_list = (req, res) => {
    const sqlGet = `SELECT Name, Partner_id FROM claire.partner 
    join claire.partnertype on claire.partner.Type = claire.partnertype.PartnerType_id 
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
        const sqlInsert = "INSERT INTO claire.partner (Name, Address, Type) VALUES (?,?,?);"
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
        const sqlDelete = `UPDATE claire.partner Set DeletedAt= STR_TO_Date(?, '%m/%d/%Y') WHERE Partner_id = ?;`
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
        const sqlGet = 'SELECT Name, Address FROM claire.partner WHERE Partner_id = ?;'
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
        const sqlUpdate = "UPDATE claire.partner SET Name= ?, Address= ? WHERE Partner_id = ?;"
        sb.query(sqlUpdate, [Name, Address, id], (err, result) => {
            console.log(err);
        })
    }
}

module.exports = {
    dsite_index,
    dsite_create,
    dsite_delete,
    dsite_list,
    dsite_edit,
    dsite_update
}
const mysql = require('mysql2');
const sb = mysql.createPool({
    host: "sql5.freesqldatabase.com",
    user: "sql5669328",
    password: "xJdIL1M3qI",
    database: 'sql5669328',
    port: 3306
});

const vendor_index = (req, res) => {
    const sqlGet = `SELECT Name, Email, PhoneNumber as Phone, ContactName as Contact, Partner_id FROM sql5669328.partner 
    join sql5669328.partnertype on sql5669328.partner.Type = sql5669328.partnertype.PartnerType_id 
    WHERE DeletedAt IS NULL AND partnertype.Type = "Vendor";`
    sb.query(sqlGet, (err, result) => {
        res.send(result);
    })
}

const vendor_list = (req, res) => {
    const sqlGet = `SELECT Name, Partner_id FROM sql5669328.partner 
    join sql5669328.partnertype on sql5669328.partner.Type = sql5669328.partnertype.PartnerType_id 
    WHERE DeletedAt IS NULL AND partnertype.Type = "Vendor";`
    sb.query(sqlGet, (err, result) => {
        res.send(result);
    })
}

const vendor_create = (req, res) => {
    let Name = req.body.name;
    let Phone = req.body.phone;
    let Email = req.body.email;
    let Contact = req.body.contact;
    let Type = req.body.type;

    if (typeof Name != "string" && typeof Type != "number" && typeof Phone != "string" && typeof Email != "string" && typeof Contact != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (Name && Type) {
        const sqlInsert = "INSERT INTO sql5669328.partner (Name, Email, PhoneNumber, ContactName, Type) VALUES (?,?,?,?,?);"
        sb.query(sqlInsert, [Name, Email, Phone, Contact, Type], (err, result) => {
            console.log(err);
        })
        res.end();
        return;
    }
}

const vendor_delete = (req, res) => {
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

const vendor_edit = (req, res) => {
    let id = req.params.id

    if (typeof id != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (id) {
        const sqlGet = 'SELECT Name as BusinessName, Email, PhoneNumber as Phone, ContactName FROM sql5669328.partner WHERE Partner_id = ?;'
        sb.query(sqlGet, [id], (err, result) => {
            res.send(result);
        })
    }
}

const vendor_update = (req, res) => {

    let id = req.params.id
    let Name = req.body.name;
    let Phone = req.body.phone;
    let Email = req.body.email;
    let Contact = req.body.contact;


    if (typeof Name != "string" && typeof Type != "number" && typeof Phone != "string" && typeof Email != "string" && typeof Contact != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (Name && id) {
        const sqlUpdate = "UPDATE sql5669328.partner SET Name= ?, Email= ?, PhoneNumber= ?, ContactName= ? WHERE Partner_id = ?;"
        sb.query(sqlUpdate, [Name, Email, Phone, Contact, id], (err, result) => {
            console.log(err);
        })
    }
}

const vendor_view = (req, res) => {
    let id = req.params.id;

    if (typeof id != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (id) {
        const sqlGet = `SELECT i.Intake_id, Cast(i.RecievedDate as char(10)) AS PurchaseDate, SUM(ii.Quantity) as Total
        from sql5669328.intake i 
        join sql5669328.intakeitems ii on i.Intake_id = ii.Intake_id
        join sql5669328.itemlocation il on ii.FKItemLocation = il.ItemLocation_id
        join sql5669328.partner p on i.Partner = p.Partner_id
        WHERE i.Partner = ?
        GROUP by i.Intake_id;`
        sb.query(sqlGet, [id], (err, result) => {
            res.send(result);
        })
    }
}

module.exports = {
    vendor_index,
    vendor_create,
    vendor_delete,
    vendor_list,
    vendor_edit,
    vendor_update,
    vendor_view
}
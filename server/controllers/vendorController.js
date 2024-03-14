const mysql = require('mysql2');
const sb = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "WebVoyage2023!",
    database: 'claire',
    port: 3006
});

const vendor_index = (req, res) => {
    const sqlGet = `SELECT Name, Email, PhoneNumber as Phone, ContactName as Contact, Partner_id FROM claire.partner 
    join claire.partnertype on claire.partner.Type = claire.partnertype.PartnerType_id 
    WHERE DeletedAt IS NULL AND partnertype.Type = "Vendor";`
    sb.query(sqlGet, (err, result) => {
        res.send(result);
    })
}

const vendor_list = (req, res) => {
    const sqlGet = `SELECT Name, Partner_id FROM claire.partner 
    join claire.partnertype on claire.partner.Type = claire.partnertype.PartnerType_id 
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
        const sqlInsert = "INSERT INTO claire.partner (Name, Email, PhoneNumber, ContactName, Type) VALUES (?,?,?,?,?);"
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
        const sqlDelete = `UPDATE claire.partner Set DeletedAt= STR_TO_Date(?, '%m/%d/%Y') WHERE Partner_id = ?;`
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
        const sqlGet = 'SELECT Name as BusinessName, Email, PhoneNumber as Phone, ContactName FROM claire.partner WHERE Partner_id = ?;'
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
        const sqlUpdate = "UPDATE claire.partner SET Name= ?, Email= ?, PhoneNumber= ?, ContactName= ? WHERE Partner_id = ?;"
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
        const sqlGet = `SELECT o.Order_id, Cast(o.CompletedDate as char(10)) AS CompletedDate, SUM(oi.Quantity) as Total, l.Name as Location 
        from claire.order o 
        join claire.orderitems oi on o.Order_id = oi.Order_id
        join claire.itemlocation il on oi.ItemLocationFK = il.ItemLocation_id
        join claire.location l on l.Location_id = il.Location_id
        WHERE o.Partner_id = ?
        GROUP by o.Order_id, l.Name;`
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
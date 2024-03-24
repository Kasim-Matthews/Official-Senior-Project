const mysql = require('mysql2');
const sb = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "WebVoyage2023!",
    database: 'claire',
    port: 3006
});

const partner_index = (req, res) => {
    const sqlGet = `SELECT Name, Email, Partner_id FROM claire.partner 
    join claire.partnertype on claire.partner.Type = claire.partnertype.PartnerType_id 
    WHERE DeletedAt IS NULL AND partnertype.Type = "Partner";`
    sb.query(sqlGet, (err, result) => {
        res.send(result);
    })
}

const partner_list = (req, res) => {
    const sqlGet = `SELECT Name, Partner_id FROM claire.partner 
    join claire.partnertype on claire.partner.Type = claire.partnertype.PartnerType_id 
    WHERE DeletedAt IS NULL AND partnertype.Type = "Partner";`
    sb.query(sqlGet, (err, result) => {
        res.send(result);
    })
}

const partner_options = (req, res) => {
    const sqlGet = "SELECT Partner_id as value, Name as label FROM claire.partner;"
    sb.query(sqlGet, (err, result) => {
        res.send(result);
    })
}

const partner_create = (req, res) => {
    let Name = req.body.name;
    let Email = req.body.email;
    let Type = req.body.type;

    if (typeof Name != "string" && typeof Email != "string" && typeof Type != "number") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (Name && Email && Type) {
        const sqlInsert = "INSERT INTO claire.partner (Name, Email, Type) VALUES (?,?,?);"
        sb.query(sqlInsert, [Name, Email, Type], (err, result) => {
            console.log(err);
        })
        res.end();
        return;
    }
}

const partner_delete = (req, res) => {
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

const partner_edit = (req, res) => {
    let id = req.params.id

    if (typeof id != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (id) {
        const sqlGet = 'SELECT Name, Email FROM claire.partner WHERE Partner_id = ?;'
        sb.query(sqlGet, [id], (err, result) => {
            res.send(result);
        })
    }
}

const partner_update = (req, res) => {

    let id = req.params.id
    let Name = req.body.name;
    let Email = req.body.email;



    if (typeof id != "string" && typeof Name != "string" && typeof Email != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (Name && Email && id) {
        const sqlUpdate = "UPDATE claire.partner SET Name= ?, Email= ? WHERE Partner_id = ?;"
        sb.query(sqlUpdate, [Name, Email, id], (err, result) => {
            console.log(err);
        })
    }
}

const partner_view = (req, res) => {
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

const partner_types = (req, res) => {
    const sqlGet = `SELECT *
    from partnertype
    WHERE Type NOT IN ("Vendor", "Adjustment", "Partner");`

    sb.query(sqlGet, (err, result) => {
        res.send(result);
        res.end();
        return;
    })
}


module.exports = {
    partner_create,
    partner_index,
    partner_delete,
    partner_update,
    partner_edit,
    partner_options,
    partner_list,
    partner_view,
    partner_types
}
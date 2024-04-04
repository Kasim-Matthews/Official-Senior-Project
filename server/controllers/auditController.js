const mysql = require('mysql2');
const sb = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "WebVoyage2023!",
    database: 'claire',
    port: 3006
});

const index = (req, res) => {
    const sqlGet = `SELECT a.Audit_id, CAST(a.Date as char(10)) as Date, COUNT(IF(ai.Changed IS NOT null, 1, NULL)) as Affected
    from claire.audit a
    join claire.audititems ai on a.Audit_id = ai.Audit
    group by a.date, a.Audit_id;`

    sb.query(sqlGet, (err, result) => {
        res.send(result);
        res.end();
        return
    })
}

const inventory = (req, res) => {
    const sqlGet = `SELECT il.ItemLocation_id, i.Name as Item, l.Name as Location, il.Quantity as Past
    from claire.itemlocation il
    join claire.item i on i.Item_id = il.Item_id
    join claire.location l on l.Location_id = il.Location_id;`

    sb.query(sqlGet, (err, result) => {
        res.send(result);
        res.end();
        return
    })
}

const log = (req, res) => {
    let date = req.body.date;
    if (typeof date != "string") {
        res.send("Invalid");
        res.end();
        return

    }

    if (date) {
        const sqlInsert = `INSERT INTO claire.audit (Date) VALUES (?);`
        sb.query(sqlInsert, [date], (err, result) => {
            console.log(err);
            res.send();
            res.end();
            return
        })
    }

}

const create = (req, res) => {
    let Audits = req.body.Audits
    let audit = req.body.audit

    if (typeof Audits != "object" && typeof audit != "number") {
        res.send("Invalid");
        res.end();
        return

    }

    if (Audits && audit) {
        const sqlInsert = `INSERT INTO claire.audititems (ItemLocation, Past, Changed, Audit) VALUES (?,?,?,?)`

        for (var i = 0; i < Audits.length; i++) {
            if (Audits[i].Changed) {
                sb.query(sqlInsert, [Audits[i].ItemLocation_id, Audits[i].Past, Audits[i].Changed, audit], (err, result) => {
                    console.log(err);
                })
            }

            else {
                const sqlInsert = `INSERT INTO claire.audititems (ItemLocation, Past, Audit) VALUES (?,?,?)`
                sb.query(sqlInsert, [Audits[i].ItemLocation_id, Audits[i].Past, audit], (err, result) => {
                    console.log(err);
                })
            }
        }
        res.send();
        res.end();
        return
    }
}

const update = (req, res) => {
    let Audits = req.body.Audits

    if (typeof Audits != "object") {
        res.send("Invalid");
        res.end();
        return

    }

    if (Audits) {
        const sqlUpdate = `UPDATE claire.itemlocation set Quantity = ? WHERE ItemLocation_id = ?;`
        for (var i = 0; i < Audits.length; i++) {
            if (Audits[i].Changed) {
                sb.query(sqlUpdate, [Audits[i].Changed, Audits[i].ItemLocation_id], (err, result) => {
                    console.log(err);

                })
            }

        }
        res.send();
        res.end();
        return
    }
}

const last = (req, res) => {
    const sqlGet = `SELECT Audit_id from claire.audit
    ORDER BY Audit_id DESC
    Limit 1;`
    sb.query(sqlGet, (err, result) => {
        res.send(result)
        res.end();
        return
    })
}

const view = (req, res) => {
    let id = req.params.id

    if (typeof id != "string") {
        res.send("Invalid");
        res.end();
        return;
    }
    if (id) {
        const sqlGet = `SELECT  Cast(a.Date as char(10)) as Date, l.Name as Location, ai.Past, ai.Changed, i.Name as Item 
    from claire.audit a
    join claire.audititems ai on a.Audit_id = ai.Audit
    join claire.itemlocation il on ai.ItemLocation = il.ItemLocation_id
    join claire.location l on il.Location_id = l.Location_id
    join claire.item i on i.Item_id = il.Item_id
    WHERE a.Audit_id = ?
    group by l.Name, i.Name, ai.Past, ai.Changed;`

        sb.query(sqlGet, [id], (err, result) => {
            res.send(result);
            res.end();
            return
        })
    }
}

module.exports = {
    inventory,
    create,
    update,
    last,
    log,
    index,
    view
}
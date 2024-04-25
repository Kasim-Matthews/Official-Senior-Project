const mysql = require('mysql2');
const pg = require('pg')

const { Pool } = pg
const dbconfig = require('../database')
var sb = new Pool(dbconfig)

sb.on('connect', connection => {
    console.log("Connected")
})
sb.on('error', error => {
    console.log(error);
})


const index = async (req, res) => {
    try {
        let sqlGet = `SELECT "Audit_id", "Date",  COUNT(CASE WHEN audititems."Changed" IS NULL THEN 1 END) as "Affected"
        from public.audit
        join public.audititems on "Audit_id" = "Audit"
        group by "Date", "Audit_id"`
        const response = await sb.query(sqlGet);
        res.send({ status: 'complete', data: response.rows })
        return
    }
    catch (error) {
        res.send({ status: 'error', message: error.message })
        return
    }





    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else {
    //         const sqlGet = `SELECT a.Audit_id, CAST(a.Date as char(10)) as Date, COUNT(IF(ai.Changed IS NOT null, 1, NULL)) as Affected
    //         from sql5669328.audit a
    //         join sql5669328.audititems ai on a.Audit_id = ai.Audit
    //         group by a.date, a.Audit_id;`

    //         tempCont.query(sqlGet, (err, result) => {
    //             tempCont.release();
    //             if (err) {
    //                 console.log(err)
    //             }

    //             else {
    //                 console.log('Audit data sent')
    //                 res.send(result);
    //                 res.end();
    //                 return
    //             }

    //         })
    //     }
    // })

}

const inventory = async (req, res) => {
    try {
        let sqlGet = `SELECT "ItemLocation_id", item."Name" as "Item", location."Name" as "Location", itemlocation."Quantity" as "Past"
        from public.itemlocation
        join public.item on itemlocation."Item_id" = item."Item_id"
        join public.location on itemlocation."Location_id" = location."Location_id"`
        const response = await sb.query(sqlGet);
        res.send({ status: 'complete', data: response.rows })
        return
    }
    catch (error) {
        res.send({ status: 'error', message: error.message })
        return
    }

    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else {
    //         const sqlGet = `SELECT il.ItemLocation_id, i.Name as Item, l.Name as Location, il.Quantity as Past
    //         from sql5669328.itemlocation il
    //         join sql5669328.item i on i.Item_id = il.Item_id
    //         join sql5669328.location l on l.Location_id = il.Location_id;`

    //         tempCont.query(sqlGet, (err, result) => {
    //             tempCont.release();
    //             if (err) {
    //                 console.log(err)
    //             }

    //             else {
    //                 console.log('Inventory data sent')
    //                 res.send(result);
    //                 res.end();
    //                 return
    //             }

    //         })
    //     }
    // })

}

const log = async (req, res) => {
    let date = req.body.date;
    let Audits = req.body.Audits

    if (typeof date != "string" && typeof Audits != "object") {
        res.sendStatus(400)
        res.end();
        return;

    }

    try {
        const auditlog = `INSERT INTO public.audit ("Date") VALUES ('{${date}}')`
        const createaudit = await sb.query(auditlog)

        for (let i = 0; i < Audits.length; i++) {
            if (Audits[i].Changed) {
                const sqlInsert = `INSERT INTO public.audititems ("ItemLocation", "Past", "Changed", "Audit") 
                VALUES (${Audits[i].ItemLocation_id}, ${Audits[i].Past}, ${Audits[i].Changed}, (SELECT Audit_id from public.audit ORDER BY Audit_id DESC Limit 1))`
                const audititemscreation = await sb.query(sqlInsert)
            }

            else {
                const sqlInsert = `INSERT INTO public.audititems ("ItemLocation", "Past", "Audit") 
                VALUES (${Audits[i].ItemLocation_id}, ${Audits[i].Past}, (SELECT Audit_id from public.audit ORDER BY Audit_id DESC Limit 1))`
                const audititemscreation = await sb.query(sqlInsert)
            }
        }

        for (let i = 0; i < Audits.length; i++) {
            if (Audits[i].Changed) {
                const sqlUpdate = `UPDATE public.itemlocation "Quantity" = ${Audits[i].Changed} WHERE "ItemLocation_id" = ${Audits[i].ItemLocation_id}`
                const auditupdate = await sb.query(sqlUpdate)
            }
        }

        res.sendStatus(200)
        res.end();
        return;
    }
    catch (error) {
        console.log(error)
        res.status(500).json(error);
        return;
    }

    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else {
    //         if (typeof date != "string") {
    //             res.send("Invalid");
    //             res.end();
    //             return

    //         }

    //         if (date) {
    //             const sqlInsert = `INSERT INTO sql5669328.audit (Date) VALUES (?);`
    //             tempCont.query(sqlInsert, [date], (err, result) => {
    //                 tempCont.release();
    //                 if (err) {
    //                     console.log(err);
    //                 }

    //                 else {
    //                     console.log('Audit log created')
    //                     res.send();
    //                     res.end();
    //                     return
    //                 }


    //             })
    //         }
    //     }
    // })


}

const create = (req, res) => {
    let Audits = req.body.Audits


    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({ 'message': error.message })
    //     }
    //     else {
    //         if (typeof Audits != "object") {
    //             res.send("Invalid");
    //             res.end();
    //             return

    //         }

    //         if (Audits) {
    //             const sqlInsert = `INSERT INTO sql5669328.audititems (ItemLocation, Past, Changed, Audit) VALUES (?,?,?,(SELECT Audit_id from sql5669328.auditORDER BY Audit_id DESC Limit 1))`

    //             for (var i = 0; i < Audits.length; i++) {
    //                 if (Audits[i].Changed) {
    //                     tempCont.query(sqlInsert, [Audits[i].ItemLocation_id, Audits[i].Past, Audits[i].Changed], (err, result) => {
    //                         if (err) {
    //                             console.log(err);
    //                         }

    //                         else {
    //                             console.log(`${i + 1} out of ${Audits.length}`)
    //                             res.send();
    //                             res.end();
    //                             return
    //                         }

    //                     })
    //                 }

    //                 else {
    //                     const sqlInsert = `INSERT INTO sql5669328.audititems (ItemLocation, Past, Audit) VALUES (?,?,(SELECT Audit_id from sql5669328.audit ORDER BY Audit_id DESC Limit 1))`
    //                     tempCont.query(sqlInsert, [Audits[i].ItemLocation_id, Audits[i].Past], (err, result) => {
    //                         if (err) {
    //                             console.log(err);
    //                         }

    //                         else {
    //                             console.log(`${i + 1} out of ${Audits.length}`)
    //                             res.send();
    //                             res.end();
    //                             return
    //                         }
    //                     })
    //                 }
    //             }
    //             tempCont.release();

    //         }
    //     }
    // })

}

const update = (req, res) => {
    let Audits = req.body.Audits
    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({ 'message': error.message })
    //     }
    //     else {
    //         if (typeof Audits != "object") {
    //             res.send("Invalid");
    //             res.end();
    //             return

    //         }

    //         if (Audits) {
    //             const sqlUpdate = `UPDATE sql5669328.itemlocation set Quantity = ? WHERE ItemLocation_id = ?;`
    //             for (var i = 0; i < Audits.length; i++) {
    //                 if (Audits[i].Changed) {
    //                     tempCont.query(sqlUpdate, [Audits[i].Changed, Audits[i].ItemLocation_id], (err, result) => {
    //                         if (err) {
    //                             console.log(err);
    //                         }

    //                         else {
    //                             console.log(`Change has been made`)
    //                             res.send();
    //                             res.end();
    //                             return
    //                         }

    //                     })
    //                 }

    //             }
    //             tempCont.release();
    //         }
    //     }
    // })

}

const last = (req, res) => {
    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({ 'message': error.message })
    //     }
    //     else {
    //         const sqlGet = `SELECT Audit_id from sql5669328.audit
    //         ORDER BY Audit_id DESC
    //         Limit 1;`
    //         tempCont.query(sqlGet, (err, result) => {
    //             tempCont.release()
    //             if (err) {
    //                 console.log(err)
    //             }

    //             else {
    //                 console.log('Last found in audit')
    //                 res.send(result)
    //                 res.end();
    //                 return
    //             }

    //         })
    //     }
    // })

}

const view = async (req, res) => {
    let id = req.params.id

    if(typeof id != "string"){
        res.sendStatus(400)
        res.end();
        return;
    }

    if (id) {
        try {
            let sqlGet = `SELECT "Date", location."Name" as "Location", "Past", "Changed", item."Name" as "Item"
            from public.audit
            join public.audititems on "Audit_id" = "Audit"
            join public.itemlocation on "ItemLocation" = "ItemLocation_id"
            join public.item on item."Item_id" = itemlocation."Item_id"
            join public.location on location."Location_id" = itemlocation."Location_id"
            WHERE "Audit_id" = ${id}`
            const response = await sb.query(sqlGet);
            res.send({ status: 'complete', data: response.rows })
            return
        }
        catch (error) {
            res.sendStatus(500).json({ "message": error.message})
            return
        }
    }


    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({ 'message': error.message })
    //     }
    //     else {
    //         if (typeof id != "string") {
    //             res.send("Invalid");
    //             res.end();
    //             return;
    //         }
    //         if (id) {
    //             const sqlGet = `SELECT  Cast(a.Date as char(10)) as Date, l.Name as Location, ai.Past, ai.Changed, i.Name as Item 
    //         from sql5669328.audit a
    //         join sql5669328.audititems ai on a.Audit_id = ai.Audit
    //         join sql5669328.itemlocation il on ai.ItemLocation = il.ItemLocation_id
    //         join sql5669328.location l on il.Location_id = l.Location_id
    //         join sql5669328.item i on i.Item_id = il.Item_id
    //         WHERE a.Audit_id = ?
    //         group by l.Name, i.Name, ai.Past, ai.Changed;`

    //             tempCont.query(sqlGet, [id], (err, result) => {
    //                 tempCont.release()
    //                 if (err) {
    //                     console.log(err)
    //                 }
    //                 else {
    //                     console.log('View data found for audit')
    //                     res.send(result);
    //                     res.end();
    //                     return
    //                 }
    //             })
    //         }
    //     }
    // })


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
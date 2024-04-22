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

const drive_index = async (req, res) => {

    try {
        let sqlGet = `SELECT partner."Name" as "Drive", COUNT(intakeitems."FKItemLocation") as "Variety", SUM(intakeitems."Value") as "Total", "DeletedAt", "Partner_id" 
        FROM public.partner
        left join public.intake on "Partner" = "Partner_id"
        left join public.intakeitems on "Intake" = "Intake_id"
        Join public.partnertype on "PartnerType_id" = "Type_id"
        Where "Type" = 'Product Drive'
        group by partner."Name", partner."Partner_id"`
        const response = await sb.query(sqlGet);
        res.send({ status: 'complete', data: response.rows })
        return
    }
    catch (error) {
        res.sendStatus(500).json({ "message": error.message })
        return
    }

    // sb.getConnection(function (error, tempCont){
    //     if(error){
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else{
    //         const sqlGet = `SELECT p.Name as Drive, COUNT(ii.FKItemLocation) as Variety, SUM(ii.Value) as Total, SUM(ii.Quantity) as Quantity, p.Partner_id, p.DeletedAt
    //         from sql5669328.partner p
    //         join sql5669328.intake i on i.Partner = p.Partner_id
    //         join sql5669328.intakeitems ii on i.Intake_id = ii.Intake_id
    //         join sql5669328.partnertype pt on pt.PartnerType_id = p.Type
    //         WHERE pt.Type = "Product Drive"
    //         group by p.Name, p.Partner_id;`
    //         tempCont.query(sqlGet, (err, result) => {
    //             tempCont.release()
    //             if (err) {
    //                 console.log(err)
    //                 res.send({status: 'error in query', message: err.message})
    //                 return
    //             }

    //             else{
    //                 console.log("Product drive data found")
    //                 res.send({status: 'complete', data: result});
    //                 res.end();
    //                 return
    //             }

    //         })
    //     }
    // })

}

const anything_else = async (req, res) => {

    try {
        let sqlGet = `SELECT partner."Name" as "Drive", COUNT(intakeitems."FKItemLocation") as "Variety", SUM(intakeitems."Value") as "Total", "Partner_id" 
        FROM public.partner
        left join public.intake on "Partner" = "Partner_id"
        left join public.intakeitems on "Intake" = "Intake_id"
        Join public.partnertype on "PartnerType_id" = "Type_id"
        Where "Type" = 'Product Drive' AND "DeletedAt" IS NULL
        group by partner."Name", partner."Partner_id"`
        const response = await sb.query(sqlGet);
        res.send({ status: 'complete', data: response.rows })
        return
    }
    catch (error) {
        res.sendStatus(500).json({ "message": error.message })
        return
    }

    // sb.getConnection(function (error, tempCont){
    //     if(error){
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else{
    //         const sqlGet = `SELECT p.Name as Drive, COUNT(ii.FKItemLocation) as Variety, SUM(ii.Value) as Total, SUM(ii.Quantity) as Quantity, p.Partner_id
    //         from sql5669328.partner p
    //         join sql5669328.intake i on i.Partner = p.Partner_id
    //         join sql5669328.intakeitems ii on i.Intake_id = ii.Intake_id
    //         join sql5669328.partnertype pt on pt.PartnerType_id = p.Type
    //         WHERE pt.Type = "Product Drive" AND p.DeletedAt IS NULL
    //         group by p.Name, p.Partner_id;`
    //         tempCont.query(sqlGet, (err, result) => {
    //             tempCont.release()
    //             if (err) {
    //                 console.log(err)
    //                 res.send({status: 'error in query', message: err.message})
    //                 return
    //             }

    //             else{
    //                 console.log("Product drive data found")
    //                 res.send({status: 'complete', data: result});
    //                 res.end();
    //                 return
    //             }

    //         })
    //     }
    // })

}

const drive_list = async (req, res) => {

    try {
        let sqlGet = `SELECT partner."Name", "Partner_id" 
        FROM public.partner
        Join public.partnertype on "PartnerType_id" = "Type_id"
        Where "Type" = 'Product Drive' AND "DeletedAt" IS NULL`
        const response = await sb.query(sqlGet);
        res.send({ status: 'complete', data: response.rows })
        return
    }
    catch (error) {
        res.sendStatus(500).json({ "message": error.message })
        return
    }

    // sb.getConnection(function (error, tempCont){
    //     if(error){
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else{
    //         const sqlGet = `SELECT Name, Partner_id FROM sql5669328.partner 
    //         join sql5669328.partnertype on sql5669328.partner.Type = sql5669328.partnertype.PartnerType_id 
    //         WHERE DeletedAt IS NULL AND sql5669328.partnertype.Type = "Product Drive";`
    //         tempCont.query(sqlGet, (err, result) => {
    //             tempCont.release()
    //             if (err) {
    //                 console.log(err)
    //                 res.send({status: 'error in query', message: err.message})
    //                 return
    //             }

    //             else {
    //                 console.log("Product drive list data found")
    //                 res.send({status: 'complete', data: result});
    //                 res.end()
    //                 return
    //             }

    //         })
    //     }
    // })

}

const drive_create = async (req, res) => {
    let Name = req.body.name;

    if (typeof Name != "string") {
        res.sendStatus(400);
        res.end();
        return;
    }

    try {
        const sqlInsert = `INSERT INTO public.partner ("Name", "Type_id") VALUES ('{${Name}}', (SELECT partnertype."PartnerType_id" from public.partnertype WHERE "Type" = 'Product Drive'))`
        const response = await sb.query(sqlInsert)
        res.sendStatus(200)
        res.end();
        return;
    }

    catch (error) {
        console.log(error)
        res.status(500).json(error);
        return;
    }

    // sb.getConnection(function (error, tempCont){
    //     if(error){
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else{
    //         if (typeof Name != "string") {
    //             res.send("Invalid");
    //             res.end();
    //             return;
    //         }

    //         if (Name) {
    //             const sqlInsert = "INSERT INTO sql5669328.partner (Name, Type) VALUES (?,(SELECT PartnerType_id as Type from sql5669328.partnertype WHERE Type = 'Product Drive'));"
    //             tempCont.query(sqlInsert, [Name], (err, result) => {
    //                 tempCont.release()
    //                 if (err) {
    //                     console.log(err);
    //                     return
    //                 }

    //                 else {
    //                     console.log("Product drive created")
    //                     res.send()
    //                     res.end();
    //                     return;
    //                 }

    //             })

    //         }
    //     }
    // })

}

const drive_reactivate = async (req, res) => {
    let id = req.params.id;

    if (typeof id != "string") {
        res.sendStatus(400);
        res.end();
        return;
    }

    try {
        const sqlUpdate = `UPDATE public.partner Set "DeletedAt" = NULL WHERE "Partner_id" = ${id}`
        const response = await sb.query(sqlUpdate)
        res.sendStatus(200)
        res.end();
        return;
    }
    catch (error) {
        console.log(error)
        res.status(500).json(error);
        return;
    }

    // sb.getConnection(function (error, tempCont){
    //     if(error){
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else{
    //         if (typeof id != "string") {
    //             res.send("Invalid");
    //             res.end();
    //             return;
    //         }

    //         if (id) {
    //             const sqlDelete = `UPDATE sql5669328.partner Set DeletedAt= NULL WHERE Partner_id = ?;`
    //             tempCont.query(sqlDelete, [id], (err, result) => {
    //                 tempCont.release()
    //                 if (err) {
    //                     console.log(err);
    //                     return
    //                 }

    //                 else {
    //                     console.log("Product Drive reactivated")
    //                     res.send()
    //                     res.end()
    //                     return
    //                 }

    //             })
    //         }
    //     }
    // })

}

const drive_delete = async (req, res) => {
    let id = req.params.id;
    let date = req.body.date;

    if (typeof id != "string" && typeof date != "string") {
        res.sendStatus(400);
        res.end();
        return;
    }

    try {
        const sqlUpdate = `UPDATE public.partner Set "DeletedAt" = '{${date}}' WHERE "Partner_id" = ${id}`
        const response = await sb.query(sqlUpdate)
        res.sendStatus(200)
        res.end();
        return;
    }
    catch (error) {
        console.log(error)
        res.status(500).json(error);
        return;
    }

    // sb.getConnection(function (error, tempCont){
    //     if(error){
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else{
    //         if (typeof id != "string" && typeof date != "string") {
    //             res.send("Invalid");
    //             res.end();
    //             return;
    //         }

    //         if (id) {
    //             const sqlDelete = `UPDATE sql5669328.partner Set DeletedAt= STR_TO_Date(?, '%m/%d/%Y') WHERE Partner_id = ?;`
    //             tempCont.query(sqlDelete, [date, id], (err, result) => {
    //                 tempCont.release()
    //                 if (err) {
    //                     console.log(err);
    //                     return
    //                 }

    //                 else {
    //                     console.log("Product Drive deleted")
    //                     res.send()
    //                     res.end()
    //                     return
    //                 }

    //             })
    //         }
    //     }
    // })

}

const drive_edit = async (req, res) => {
    let id = req.params.id

    if (typeof id != "string") {
        res.sendStatus(400);
        res.end();
        return;
    }

    if (id) {
        try {
            let sqlGet = `SELECT "Name" FROM public.partner
        Where "Partner_id" = ${id}`
            const response = await sb.query(sqlGet);
            res.send({ status: 'complete', data: response.rows })
            return
        }
        catch (error) {
            res.sendStatus(500).json({ "message": error.message })
            return
        }
    }

    // sb.getConnection(function (error, tempCont){
    //     if(error){
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else{
    //         if (typeof id != "string") {
    //             res.send("Invalid");
    //             res.end();
    //             return;
    //         }

    //         if (id) {
    //             const sqlGet = 'SELECT Name FROM sql5669328.partner WHERE Partner_id = ?;'
    //             tempCont.query(sqlGet, [id], (err, result) => {
    //                 tempCont.release()
    //                 if (err) {
    //                     console.log(err)
    //                     res.send({status: 'error in query', message: err.message})
    //                     return
    //                 }

    //                 else {
    //                     console.log("Product Drive edit data found")
    //                     res.send({status: 'complete', data: result});
    //                     res.end()
    //                     return
    //                 }

    //             })
    //         }
    //     }
    // })

}

const drive_update = async (req, res) => {

    let id = req.params.id
    let Name = req.body.name;

    if (typeof Name != "string") {
        res.sendStatus(400);
        res.end();
        return;
    }

    try {
        const sqlUpdate = `UPDATE public.partner Set "Name" = '{${Name}}' WHERE "Partner_id" = ${id}`
        const response = await sb.query(sqlUpdate)
        res.sendStatus(200)
        res.end();
        return;
    }
    catch (error) {
        console.log(error)
        res.status(500).json(error);
        return;
    }

    // sb.getConnection(function (error, tempCont){
    //     if(error){
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else{
    //         if (typeof Name != "string") {
    //             res.send("Invalid");
    //             console.log("Invalid")
    //             res.end();
    //             return;
    //         }

    //         if (Name && id) {
    //             const sqlUpdate = "UPDATE sql5669328.partner SET Name= ? WHERE Partner_id = ?;"
    //             tempCont.query(sqlUpdate, [Name, id], (err, result) => {
    //                 tempCont.release()
    //                 if (err) {
    //                     console.log(err);
    //                     return
    //                 }

    //                 else{
    //                     console.log("Product Drive updated")
    //                     res.send()
    //                     res.end()
    //                     return
    //                 }

    //             })
    //         }
    //     }
    // })

}

const drive_view = async (req, res) => {
    let id = req.params.id;

    if (typeof id != "string") {
        res.sendStatus(400);
        res.end();
        return;
    }

    if (id) {
        try {
            let sqlGet = `SELECT "Intake_id", location."Name" as Location, COUNT(intakeitems."FKItemLocation) as Quantity, SUM(intakeitems."Value") as TotalItems 
            FROM public.partner
            join public.intake on "Partner" = "Partner_id"
            join public.intakeitems on "Intake_id" = "Intake"
            join public.itemlocation on "FKItemLocation" = "ItemLocation_id"
            join public.location on location."Location_id" = itemlocation."Location_id"
        Where "Partner_id" = ${id}
        group by intake."Intake_id", location."Name"`
            const response = await sb.query(sqlGet);
            res.send({ status: 'complete', data: response.rows })
            return
        }
        catch (error) {
            res.sendStatus(500).json({ "message": error.message })
            return
        }
    }

    // sb.getConnection(function (error, tempCont){
    //     if(error){
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else{
    //         if (typeof id != "string") {
    //             res.send("Invalid");
    //             res.end();
    //             return;
    //         }

    //         if (id) {
    //             const sqlGet = `SELECT i.Intake_id, l.Name as Location, COUNT(ii.FKItemLocation) as Quantity, CAST(SUM(ii.Value) AS DECIMAL (5,2)) as TotalItems
    //             from sql5669328.partner p
    //             join sql5669328.intake i on i.Partner = p.Partner_id
    //             join sql5669328.intakeitems ii on ii.Intake_id = i.Intake_id
    //             join sql5669328.itemlocation il on il.ItemLocation_id = ii.FKItemLocation
    //             join sql5669328.location l on il.Location_id = l.Location_id
    //             WHERE p.Partner_id = ?
    //             group by i.intake_id, l.Name;`
    //             tempCont.query(sqlGet, [id], (err, result) => {
    //                 tempCont.release()
    //                 if (err) {
    //                     console.log(err)
    //                     res.send({status: 'error in query', message: err.message})
    //                     return
    //                 }

    //                 else {
    //                     console.log("Product Drive view data found")
    //                     res.send({status: 'complete', data: result});
    //                     res.end()
    //                     return
    //                 }

    //             })
    //         }
    //     }
    // })

}

module.exports = {
    drive_index,
    drive_create,
    drive_delete,
    drive_list,
    drive_edit,
    drive_update,
    drive_view,
    drive_reactivate,
    anything_else
}
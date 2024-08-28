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

const partner_index = async (req, res) => {

    try {
        let sqlGet = `SELECT "Name", "Email", "DeletedAt", "Partner_id" FROM public.partner
        Join public.partnertype on "PartnerType_id" = "Type_id"
        Where "Type" = 'Partner'`
        const response = await sb.query(sqlGet);
        res.send({ status: 'complete', data: response.rows })
        return
    }
    catch (error) {
        console.log(error)
        return
    }

    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else {
    //         const sqlGet = `SELECT Name, Email, Partner_id, DeletedAt FROM sql5669328.partner 
    //         join sql5669328.partnertype on sql5669328.partner.Type = sql5669328.partnertype.PartnerType_id 
    //         WHERE partnertype.Type = "Partner";`
    //         tempCont.query(sqlGet, (err, result) => {
    //             tempCont.release()
    //             if (err) {
    //                 console.log(err)
    //                 res.send(["error"])
    //                 res.end();
    //                 return
    //             }

    //             else {
    //                 console.log('Partner data found')
    //                 res.send(result);
    //                 res.end()
    //                 return
    //             }

    //         })
    //     }
    // })

}

const anything_else = async (req, res) => {

    try {
        let sqlGet = `SELECT "Name", "Email", "Partner_id" FROM public.partner
        Join public.partnertype on "PartnerType_id" = "Type_id"
        Where "Type" = 'Partner' AND "DeletedAt" IS NULL`
        const response = await sb.query(sqlGet);
        res.send({ status: 'complete', data: response.rows })
    }
    catch (error) {
        console.log(error)
        return
    }

    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else {
    //         const sqlGet = `SELECT Name, Email, Partner_id FROM sql5669328.partner 
    //         join sql5669328.partnertype on sql5669328.partner.Type = sql5669328.partnertype.PartnerType_id 
    //         WHERE DeletedAt IS NULL AND sql5669328.partnertype.Type = "Partner";`
    //         tempCont.query(sqlGet, (err, result) => {
    //             tempCont.release()
    //             if (err) {
    //                 console.log(err)
    //                 return
    //             }

    //             else {
    //                 res.send(result);
    //                 res.end();
    //                 return
    //             }

    //         })
    //     }
    // })

}

const partner_list = async (req, res) => {

    try {
        let sqlGet = `SELECT "Name", "Partner_id" FROM public.partner
        Join public.partnertype on "PartnerType_id" = "Type_id"
        Where "Type" = 'Partner' AND "DeletedAt" IS NULL`
        const response = await sb.query(sqlGet);
        res.send({ status: 'complete', data: response.rows })
    }
    catch (error) {
        console.log(error)
        return
    }

    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else {
    //         const sqlGet = `SELECT Name, Partner_id FROM sql5669328.partner 
    //         join sql5669328.partnertype on sql5669328.partner.Type = sql5669328.partnertype.PartnerType_id 
    //         WHERE DeletedAt IS NULL AND sql5669328.partnertype.Type = "Partner";`
    //         tempCont.query(sqlGet, (err, result) => {
    //             tempCont.release()
    //             if (err) {
    //                 console.log(err)
    //                 return
    //             }

    //             else {
    //                 console.log('Partner list data found')
    //                 res.send(result);
    //                 res.end()
    //                 return
    //             }

    //         })
    //     }
    // })

}

const partner_options = async (req, res) => {

    try {
        let sqlGet = `SELECT "Name" as "lable", "Partner_id" as "value" FROM public.partner
        Join public.partnertype on "PartnerType_id" = "Type_id"
        Where "Type" = 'Partner' AND "DeletedAt" IS NULL`
        const response = await sb.query(sqlGet);
        res.send({ status: 'complete', data: response.rows })
    }
    catch (error) {
        console.log(error)
        return
    }

    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else {
    //         const sqlGet = "SELECT Partner_id as value, Name as label FROM sql5669328.partner;"
    //         tempCont.query(sqlGet, (err, result) => {
    //             tempCont.release()
    //             if (err) {
    //                 console.log(err)
    //                 return
    //             }

    //             else {
    //                 console.log('Partner options data found')
    //                 res.send(result);
    //                 res.end()
    //                 return
    //             }

    //         })
    //     }
    // })

}

const partner_create = async (req, res) => {
    let Name = req.body.name;
    let Email = req.body.email;

    if (typeof Name != "string" && typeof Email != "string") {
        res.sendStatus(400);
        res.end();
        return;
    }

    try {
        const sqlInsert = `INSERT INTO public.partner ("Name", "Email", "Type_id") VALUES ('{${Name}}', '{${Email}}', (SELECT partnertype."PartnerType_id" from public.partnertype WHERE "Type" = 'Partner'))`
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

    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else {
    //         if (typeof Name != "string" && typeof Email != "string") {
    //             res.send("Invalid");
    //             res.end();
    //             return;
    //         }

    //         if (Name && Email) {
    //             const sqlInsert = "INSERT INTO sql5669328.partner (Name, Email, Type) VALUES (?,?,(SELECT PartnerType_id as Type from sql5669328.partnertype WHERE Type = 'Partner'));"
    //             tempCont.query(sqlInsert, [Name, Email], (err, result) => {
    //                 tempCont.release()
    //                 if (err) {
    //                     console.log(err);
    //                     return
    //                 }

    //                 else {
    //                     console.log("Partner created")
    //                     res.send()
    //                     res.end();
    //                     return;
    //                 }

    //             })

    //         }
    //     }
    // })

}

const partner_delete = async (req, res) => {
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
    //                     console.log("Partner deleted")
    //                     res.send()
    //                     res.end()
    //                     return
    //                 }

    //             })
    //         }
    //     }
    // })

}

const partner_reactivate = async (req, res) => {
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
    //                     console.log("Partner reactivated")
    //                     res.send()
    //                     res.end()
    //                     return
    //                 }

    //             })
    //         }
    //     }
    // })

}

const partner_edit = async (req, res) => {
    let id = req.params.id

    if (typeof id != "string") {
        res.sendStatus(400);
        res.end();
        return;
    }

    if (id) {
        try {
            let sqlGet = `SELECT "Name", "Email" FROM public.partner
        Where "Partner_id" = ${id}`
            const response = await sb.query(sqlGet);
            res.send({ status: 'complete', data: response.rows })
            return
        }
        catch (error) {
            console.log(error)
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
    //             const sqlGet = 'SELECT Name, Email FROM sql5669328.partner WHERE Partner_id = ?;'
    //             tempCont.query(sqlGet, [id], (err, result) => {
    //                 tempCont.release()
    //                 if (err) {
    //                     console.log(err)
    //                     return
    //                 }

    //                 else {
    //                     console.log("Partner edit data found")
    //                     res.send(result);
    //                     res.end();
    //                     return
    //                 }

    //             })
    //         }
    //     }
    // })

}

const partner_update = async (req, res) => {

    let id = req.params.id
    let Name = req.body.name;
    let Email = req.body.email;

    if (typeof id != "string" && typeof Name != "string" && typeof Email != "string") {
        res.sendStatus(400);
        res.end();
        return;
    }

    try {
        const sqlUpdate = `UPDATE public.partner Set "Name" = '{${Name}}', "Email" = '{${Email}}' WHERE "Partner_id" = ${id}`
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
    //         if (typeof id != "string" && typeof Name != "string" && typeof Email != "string") {
    //             res.send("Invalid");
    //             res.end();
    //             return;
    //         }

    //         if (Name && Email && id) {
    //             const sqlUpdate = "UPDATE sql5669328.partner SET Name= ?, Email= ? WHERE Partner_id = ?;"
    //             tempCont.query(sqlUpdate, [Name, Email, id], (err, result) => {
    //                 tempCont.release()
    //                 if (err) {
    //                     console.log(err);
    //                     return
    //                 }

    //                 else {
    //                     console.log("Partner updated")
    //                     res.send()
    //                     res.end()
    //                     return
    //                 }

    //             })
    //         }
    //     }
    // })

}

const partner_view = async (req, res) => {
    let id = req.params.id;

    if (typeof id != "string") {
        res.sendStatus(400);
        res.end();
        return;
    }

    if (id) {
        try {
            let sqlGet = `SELECT distribution."Order_id", "CompletedDate", SUM(orderitems."Quantity") as "Total", location."Name" as "Location"
            FROM public.distribution
            join public.orderitems on distribution."Order_id" = orderitems."Order_id"
            join public.itemlocation on "ItemLocationFK" = "ItemLocation_id"
            join public.location on location."Location_id" = itemlocation."Location_id"
            Where distribution."Partner_id" = ${id}
            group by distribution."Order_id", location."Name"`
            const response = await sb.query(sqlGet);
            res.send({ status: 'complete', data: response.rows })
            return
        }
        catch (error) {
            console.log(error)
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
    //             const sqlGet = `SELECT o.Order_id, Cast(o.CompletedDate as char(10)) AS CompletedDate, SUM(oi.Quantity) as Total, l.Name as Location 
    //             from sql5669328.order o 
    //             join sql5669328.orderitems oi on o.Order_id = oi.Order_id
    //             join sql5669328.itemlocation il on oi.ItemLocationFK = il.ItemLocation_id
    //             join sql5669328.location l on l.Location_id = il.Location_id
    //             WHERE o.Partner_id = ?
    //             GROUP by o.Order_id, l.Name;`
    //             tempCont.query(sqlGet, [id], (err, result) => {
    //                 tempCont.release()
    //                 if (err) {
    //                     console.log(err)
    //                     return
    //                 }

    //                 else {
    //                     console.log("Partner view data found")
    //                     res.send(result);
    //                     res.end()
    //                     return
    //                 }

    //             })
    //         }
    //     }
    // })

}

const partner_types = async (req, res) => {

    try {
        let sqlGet = `SELECT *
        FROM public.partnertype
        Where "Type" NOT IN ('Vendor', 'Adjustment', 'Partner')`
        const response = await sb.query(sqlGet);
        res.send({ status: 'complete', data: response.rows })
        return
    }
    catch (error) {
        console.log(error)
        return
    }

    // sb.getConnection(function (error, tempCont){
    //     if(error){
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else{
    //         const sqlGet = `SELECT *
    //         from sql5669328.partnertype
    //         WHERE Type NOT IN ("Vendor", "Adjustment", "Partner");`

    //         tempCont.query(sqlGet, (err, result) => {
    //             tempCont.release()
    //             if (err) {
    //                 console.log(err)
    //                 return
    //             }

    //             else {
    //                 console.log("Partner types data found")
    //                 res.send(result);
    //                 res.end();
    //                 return;
    //             }

    //         })
    //     }
    // })

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
    partner_types,
    anything_else,
    partner_reactivate
}
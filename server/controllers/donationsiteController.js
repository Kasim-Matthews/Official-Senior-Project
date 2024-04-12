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

const dsite_index = async (req, res) => {
    
    try {
        let sqlGet = `SELECT "Name", "Address", "DeletedAt", "Partner_id" 
        FROM public.partner
        Join public.partnertype on "PartnerType_id" = "Type_id"
        Where "Type" = 'Donation Site'`
        const response = await sb.query(sqlGet);
        res.send({ status: 'complete', data: response.rows })
    }
    catch (error) {
        res.sendStatus(500).json({ "message": error.message })
    }

    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({ 'message': error.message })
    //     }
    //     else {
    //         const sqlGet = `SELECT Name, Address, Partner_id, DeletedAt FROM sql5669328.partner 
    //         join sql5669328.partnertype on sql5669328.partner.Type = sql5669328.partnertype.PartnerType_id 
    //         WHERE sql5669328.partnertype.Type = "Donation Site";`
    //         tempCont.query(sqlGet, (err, result) => {
    //             tempCont.release();
    //             if (err) {
    //                 console.log(err)
    //                 res.send({ status: 'error in query', message: err.message })
    //                 return
    //             }

    //             else {
    //                 console.log('Donation site data found')
    //                 res.send({ status: 'complete', data: result });
    //                 res.end();
    //                 return;
    //             }

    //         })
    //     }
    // })

}

const anything_else = async (req, res) => {
    
    try {
        let sqlGet = `SELECT "Name", "Address", "Partner_id" 
        FROM public.partner
        Join public.partnertype on "PartnerType_id" = "Type_id"
        Where "Type" = 'Donation Site' "DeletedAt" IS NULL`
        const response = await sb.query(sqlGet);
        res.send({ status: 'complete', data: response.rows })
    }
    catch (error) {
        res.sendStatus(500).json({ "message": error.message })
    }

    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({ 'message': error.message })
    //     }
    //     else {
    //         const sqlGet = `SELECT Name, Address, Partner_id FROM sql5669328.partner 
    //         join sql5669328.partnertype on sql5669328.partner.Type = sql5669328.partnertype.PartnerType_id 
    //         WHERE DeletedAt IS NULL AND partnertype.Type = "Donation Site";`
    //         tempCont.query(sqlGet, (err, result) => {
    //             tempCont.release()
    //             if (err) {
    //                 console.log(err)
    //                 res.send({ status: 'error in query', message: err.message })
    //                 return
    //             }

    //             else {
    //                 res.send({ status: 'complete', data: result });
    //                 res.end();
    //                 return
    //             }

    //         })
    //     }
    // })

}

const dsite_list = async (req, res) => {
    
    try {
        let sqlGet = `SELECT "Name", "Partner_id" 
        FROM public.partner
        Join public.partnertype on "PartnerType_id" = "Type_id"
        Where "Type" = 'Donation Site' "DeletedAt" IS NULL`
        const response = await sb.query(sqlGet);
        res.send({ status: 'complete', data: response.rows })
    }
    catch (error) {
        res.sendStatus(500).json({ "message": error.message })
    }

    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({ 'message': error.message })
    //     }
    //     else {
    //         const sqlGet = `SELECT Name, Partner_id FROM sql5669328.partner 
    //         join sql5669328.partnertype on sql5669328.partner.Type = sql5669328.partnertype.PartnerType_id 
    //         WHERE DeletedAt IS NULL AND partnertype.Type = "Donation Site";`
    //         tempCont.query(sqlGet, (err, result) => {
    //             tempCont.release();
    //             if (err) {
    //                 console.log(err)
    //                 res.send({ status: 'error in query', message: err.message })
    //                 return
    //             }

    //             else {
    //                 res.send({ status: 'complete', data: result });
    //                 res.end()
    //                 return
    //             }

    //         })
    //     }
    // })

}

const dsite_create = (req, res) => {
    let Name = req.body.name;
    let Address = req.body.address;

    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else {
    //         if (typeof Name != "string" && typeof Address != "string") {
    //             res.send("Invalid");
    //             res.end();
    //             return;
    //         }

    //         if (Name && Address) {
    //             const sqlInsert = "INSERT INTO sql5669328.partner (Name, Address, Type) VALUES (?,?,(SELECT PartnerType_id as Type from sql5669328.partnertype WHERE Type = 'Donation Site'));"
    //             tempCont.query(sqlInsert, [Name, Address], (err, result) => {
    //                 tempCont.release();
    //                 if (err) {
    //                     console.log(err);
    //                 }

    //                 else {
    //                     console.log('Created donation site')
    //                     res.send();
    //                     res.end();
    //                     return;
    //                 }

    //             })

    //         }
    //     }
    // })

}

const dsite_reactivate = (req, res) => {
    let id = req.params.id;

    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else {
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
    //                     console.log("Donation site reactivated")
    //                     res.send()
    //                     res.end()
    //                     return
    //                 }

    //             })
    //         }
    //     }
    // })

}

const dsite_delete = (req, res) => {
    let id = req.params.id;
    let date = req.body.date;

    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else {
    //         if (typeof id != "string" && typeof date != "string") {
    //             res.send("Invalid");
    //             res.end();
    //             return;
    //         }

    //         if (id) {
    //             const sqlDelete = `UPDATE sql5669328.partner Set DeletedAt= STR_TO_Date(?, '%m/%d/%Y') WHERE Partner_id = ?;`
    //             tempCont.query(sqlDelete, [date, id], (err, result) => {
    //                 tempCont.release();
    //                 if (err) {
    //                     console.log(err);
    //                 }

    //                 else {
    //                     console.log('Deleted donation site')
    //                     res.send();
    //                     res.end();
    //                     return;
    //                 }

    //             })
    //         }
    //     }
    // })

}

const dsite_edit = async (req, res) => {
    let id = req.params.id

    if (typeof id != "string") {
        res.sendStatus(400);
        res.end();
        return;
    }

    if (id) {
        try {
            let sqlGet = `SELECT "Name", "Adress" 
            FROM public.partner
            Where "Partner_id" = ${id}`
            const response = await sb.query(sqlGet);
            res.send({ status: 'complete', data: response.rows })
        }
        catch (error) {
            res.sendStatus(500).json({ "message": error.message })
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
    //             const sqlGet = 'SELECT Name, Address FROM sql5669328.partner WHERE Partner_id = ?;'
    //             tempCont.query(sqlGet, [id], (err, result) => {
    //                 tempCont.release();

    //                 if (err) {
    //                     console.log(err)
    //                     res.send({ status: 'error in query', message: err.message })
    //                     return
    //                 }

    //                 else {
    //                     console.log('Donation site edit data sent')
    //                     res.send({ status: 'complete', data: result });
    //                     res.end();
    //                     return
    //                 }

    //             })
    //         }
    //     }
    // })

}

const dsite_update = (req, res) => {

    let id = req.params.id
    let Name = req.body.name;
    let Address = req.body.address;

    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else {
    //         if (typeof id != "string" && typeof Name != "string" && typeof Address != "string") {
    //             res.send("Invalid");
    //             res.end();
    //             return;
    //         }

    //         if (Name && Address && id) {
    //             const sqlUpdate = "UPDATE sql5669328.partner SET Name= ?, Address= ? WHERE Partner_id = ?;"
    //             tempCont.query(sqlUpdate, [Name, Address, id], (err, result) => {
    //                 tempCont.release();
    //                 if (err) {
    //                     console.log(err);
    //                 }

    //                 else {
    //                     console.log('Donation site updated')
    //                     res.send(result);
    //                     res.end();
    //                     return
    //                 }

    //             })
    //         }
    //     }
    // })


}

const dsite_view = async (req, res) => {
    let id = req.params.id;

    if (typeof id != "string") {
        res.sendStatus(400);
        res.end();
        return;
    }

    if (id) {
        try {
            let sqlGet = `SELECT  location."Name" as Location, "Intake_id", SUM(intakeitems."Quantity") as Total
            FROM public.intake
            join public.intakeitems on "Intake" = "Intake_id"
            join public.itemlocation on "FKItemLocation" = "ItemLocation_id"
            join public.partner on "Partner" = "Partner_id"
            join public.location on location."Location_id" = itemlocation."Location_id"
            Where "Partner" = ${id}
            group by "Intake_id", location."Name"`
            const response = await sb.query(sqlGet);
            res.send({ status: 'complete', data: response.rows })
        }
        catch (error) {
            res.sendStatus(500).json({ "message": error.message })
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
    //             const sqlGet = `SELECT l.Name as Location, i.Intake_id, SUM(ii.Quantity) as Total
    //             from sql5669328.intake i 
    //             join sql5669328.intakeitems ii on i.Intake_id = ii.Intake_id
    //             join sql5669328.itemlocation il on ii.FKItemLocation = il.ItemLocation_id
    //             join sql5669328.partner p on i.Partner = p.Partner_id
    //             join sql5669328.location l on l.Location_id = il.Location_id
    //             WHERE i.Partner = ?
    //             GROUP by i.Intake_id, l.Name;`
    //             tempCont.query(sqlGet, [id], (err, result) => {
    //                 tempCont.release();
    //                 if (err) {
    //                     console.log(err)
    //                     res.send({ status: 'error in query', message: err.message })
    //                     return
    //                 }

    //                 else {
    //                     console.log('View data sent for donation site')
    //                     res.send({status: 'complete', data: result});
    //                     res.end();
    //                     return
    //                 }


    //             })
    //         }
    //     }
    // })

}

module.exports = {
    dsite_index,
    dsite_create,
    dsite_delete,
    dsite_list,
    dsite_edit,
    dsite_update,
    dsite_view,
    dsite_reactivate,
    anything_else
}
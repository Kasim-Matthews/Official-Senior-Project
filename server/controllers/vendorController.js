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

const vendor_index = async (req, res) => {
    try{
        let sqlGet = `SELECT "Name", "Email", "PhoneNumber" as "Phone", "ContactName" as "Contact", "DeletedAt", "Partner_id" FROM public.partner
        Join public.partnertype on "PartnerType_id" = "Type_id"
        Where "Type" = 'Vendor'`
        const response = await sb.query(sqlGet);
        res.send({status: 'complete', data: response.rows})
    }
    catch (error){
        res.send({status: 'error', message: error.message})
    }
    /*sb.getConnection(function (error, tempCont) {
        if (error) {
            console.log('Error')
            res.status(500).json({'message': error.message})
        }
        else {
            const sqlGet = `SELECT Name, Email, PhoneNumber as Phone, ContactName as Contact, DeletedAt, Partner_id FROM sql5669328.partner 
            join sql5669328.partnertype on sql5669328.partner.Type = sql5669328.partnertype.PartnerType_id 
            WHERE sql5669328.partnertype.Type = "Vendor";`
            tempCont.query(sqlGet, (err, result) => {
                tempCont.release()
                if (err) {
                    console.log(err)
                    res.send({status: 'error in query', message: err.message})
                    return
                }

                else {
                    console.log("Vendor data found")
                    res.send({status: 'complete', data: result});
                    res.end()
                    return
                }

            })
        }
    })*/

}

const anything_else = async (req, res) => {
    try{
        let sqlGet = `SELECT "Name", "Email", "PhoneNumber" as "Phone", "ContactName" as "Contact", "Partner_id" FROM public.partner
        Join public.partnertype on "PartnerType_id" = "Type_id"
        Where "Type" = 'Vendor' AND "DeletedAt" IS NULL`
        const response = await sb.query(sqlGet);
        res.send({status: 'complete', data: response.rows})
    }
    catch (error){
        res.send({status: 'error', message: error.message})
    }
    
    /*sb.getConnection(function (error, tempCont) {
        if (error) {
            console.log('Error')
            res.status(500).json({'message': error.message})
        }
        else {
            const sqlGet = `SELECT Name, Email, PhoneNumber as Phone, ContactName as Contact, Partner_id FROM sql5669328.partner 
            join sql5669328.partnertype on sql5669328.partner.Type = sql5669328.partnertype.PartnerType_id 
            WHERE DeletedAt IS NULL AND sql5669328.partnertype.Type = "Vendor";`
            tempCont.query(sqlGet, (err, result) => {
                tempCont.release()
                if (err) {
                    console.log(err)
                    res.send({status: 'error in query', message: err.message})
                    return
                }

                else {
                    console.log("Vendor data found")
                    res.send({status: 'complete', data: result});
                    res.end()
                    return
                }

            })
        }
    })*/

}

const vendor_list = async (req, res) => {
    try{
        let sqlGet = `SELECT "Name", "Partner_id" FROM public.partner
        Join public.partnertype on "PartnerType_id" = "Type_id"
        Where "Type" = 'Vendor' AND "DeletedAt" IS NULL`
        const response = await sb.query(sqlGet);
        res.send({status: 'complete', data: response.rows})
    }
    catch (error){
        res.send({status: 'error', message: error.message})
    }
    
    /*sb.getConnection(function (error, tempCont) {
        if (error) {
            console.log('Error')
            res.status(500).json({'message': error.message})
        }
        else {
            const sqlGet = `SELECT Name, Partner_id FROM sql5669328.partner 
            join sql5669328.partnertype on sql5669328.partner.Type = sql5669328.partnertype.PartnerType_id 
            WHERE DeletedAt IS NULL AND sql5669328.partnertype.Type = "Vendor";`
            tempCont.query(sqlGet, (err, result) => {
                tempCont.release()
                if (err) {
                    console.log(err)
                    res.send({status: 'error in query', message: err.message})
                    return
                }

                else {
                    console.log("Vendor list data found")
                    res.send({status: 'complete', data: result});
                    res.end()
                    return
                }

            })
        }
    })*/

}

const vendor_create = (req, res) => {
    let Name = req.body.name;
    let Phone = req.body.phone;
    let Email = req.body.email;
    let Contact = req.body.contact;

    /*sb.getConnection(function (error, tempCont) {
        if (error) {
            console.log('Error')
            res.status(500).json({'message': error.message})
        }
        else {
            if (typeof Name != "string" && typeof Phone != "string" && typeof Email != "string" && typeof Contact != "string") {
                res.send("Invalid");
                res.end();
                return;
            }

            if (Name) {
                const sqlInsert = "INSERT INTO sql5669328.partner (Name, Email, PhoneNumber, ContactName, Type) VALUES (?,?,?,?,(SELECT PartnerType_id as Type from sql5669328.partnertype WHERE Type = 'Vendor'));"
                tempCont.query(sqlInsert, [Name, Email, Phone, Contact], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err);
                        return
                    }

                    else {
                        console.log("Vendor created")
                        res.send()
                        res.end();
                        return;
                    }

                })

            }
        }
    })*/

}
const vendor_reactivate = (req, res) => {
    let id = req.params.id;

    /*sb.getConnection(function (error, tempCont) {
        if (error) {
            console.log('Error')
            res.status(500).json({'message': error.message})
        }
        else {
            if (typeof id != "string") {
                res.send("Invalid");
                res.end();
                return;
            }

            if (id) {
                const sqlDelete = `UPDATE sql5669328.partner Set DeletedAt= NULL WHERE Partner_id = ?;`
                tempCont.query(sqlDelete, [id], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err);
                        return
                    }

                    else {
                        console.log("Vendor reactivated")
                        res.send()
                        res.end()
                        return
                    }

                })
            }
        }
    })*/

}

const vendor_delete = (req, res) => {
    let id = req.params.id;
    let date = req.body.date;

    /*sb.getConnection(function (error, tempCont) {
        if (error) {
            console.log('Error')
            res.status(500).json({'message': error.message})
        }
        else {
            if (typeof id != "string" && typeof date != "string") {
                res.send("Invalid");
                res.end();
                return;
            }

            if (id) {
                const sqlDelete = `UPDATE sql5669328.partner Set DeletedAt= STR_TO_Date(?, '%m/%d/%Y') WHERE Partner_id = ?;`
                tempCont.query(sqlDelete, [date, id], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err);
                        return
                    }

                    else {
                        console.log("Vendor deleted")
                        res.send()
                        res.end()
                        return
                    }

                })
            }
        }
    })*/

}

const vendor_edit = async (req, res) => {
    let id = req.params.id
    try{
        let sqlGet = `SELECT "Name" as BusinessName, "Email", "PhoneNumber" as "Phone", "ContactName" FROM public.partner
        Where "Partner_id" = ${id}`
        const response = await sb.query(sqlGet);
        res.send({status: 'complete', data: response.rows})
    }
    catch (error){
        res.send({status: 'error', message: error.message})
    }
    /*sb.getConnection(function (error, tempCont) {
        if (error) {
            console.log('Error')
            res.status(500).json({'message': error.message})
        }
        else {
            if (typeof id != "string") {
                res.send("Invalid");
                res.end();
                return;
            }

            if (id) {
                const sqlGet = 'SELECT Name as BusinessName, Email, PhoneNumber as Phone, ContactName FROM sql5669328.partner WHERE Partner_id = ?;'
                tempCont.query(sqlGet, [id], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err)
                        res.send({status: 'error in query', message: err.message})
                        return
                    }

                    else {
                        console.log("Vendor edit data found")
                        res.send({status: 'complete', data: result});
                        res.end()
                        return
                    }

                })
            }
        }
    })*/

}

const vendor_update = (req, res) => {

    let id = req.params.id
    let Name = req.body.name;
    let Phone = req.body.phone;
    let Email = req.body.email;
    let Contact = req.body.contact;

    /*sb.getConnection(function (error, tempCont) {
        if (error) {
            console.log('Error')
            res.status(500).json({'message': error.message})
        }
        else {
            if (typeof Name != "string" && typeof Type != "number" && typeof Phone != "string" && typeof Email != "string" && typeof Contact != "string") {
                res.send("Invalid");
                res.end();
                return;
            }

            if (Name && id) {
                const sqlUpdate = "UPDATE sql5669328.partner SET Name= ?, Email= ?, PhoneNumber= ?, ContactName= ? WHERE Partner_id = ?;"
                tempCont.query(sqlUpdate, [Name, Email, Phone, Contact, id], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err);
                        return
                    }

                    else {
                        console.log("Vendor has been updated")
                        res.send()
                        res.end()
                        return
                    }

                })
            }
        }
    })*/

}

const vendor_view = async(req, res) => {
    let id = req.params.id;

    try{
        let sqlGet = `SELECT "Intake_id", "RecievedDate" as PurchaseDate, SUM("Quantity") as Total
        from public.intake
        join public.intakeitems on "Intake" = "Intake_id"
        join public.itemlocation on "ItemLocation_id" = "FKItemLocation"
        join public.partner on "Partner" = "Partner_id"
        WHERE "Partner" = ${id}
        GROUP by "Intake_id"`
        const response = await sb.query(sqlGet);
        res.send({status: 'complete', data: response.rows})
    }
    catch (error){
        res.send({status: 'error', message: error.message})
    }
    /*sb.getConnection(function (error, tempCont) {
        if (error) {
            console.log('Error')
            res.status(500).json({'message': error.message})
        }
        else {
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
                tempCont.query(sqlGet, [id], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err)
                        res.send({status: 'error in query', message: err.message})
                        res.end();
                        return
                    }

                    else {
                        console.log("Vendor view data found")
                        res.send({status: 'complete', data: result});
                        res.end();
                        return
                    }

                })
            }
        }
    })*/

}

module.exports = {
    vendor_index,
    vendor_create,
    vendor_delete,
    vendor_list,
    vendor_edit,
    vendor_update,
    vendor_view,
    vendor_reactivate,
    anything_else
}
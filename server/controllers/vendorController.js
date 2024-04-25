const mysql = require('mysql2');
const dbconfig = require('../database');

const sb = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Lindsey1!",
    database: 'claire',
    port: 3306
});

const vendor_index = async (req, res) => {

    sb.getConnection(function (error, tempCont) {
        if (error) {
            console.log('Error')
            res.status(500).json({'message': error.message})
        }
        else {
            const sqlGet = `SELECT Name, Email, PhoneNumber as Phone, ContactName as Contact, DeletedAt, Partner_id FROM claire.partner 
            join claire.partnertype on claire.partner.Type = claire.partnertype.PartnerType_id 
            WHERE partnertype.Type = "Vendor";`
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
    })

}

const anything_else = (req, res) => {
    sb.getConnection(function (error, tempCont) {
        if (error) {
            console.log('Error')
            res.status(500).json({'message': error.message})
        }
        else {
            const sqlGet = `SELECT Name, Email, PhoneNumber as Phone, ContactName as Contact, Partner_id FROM claire.partner 
            join claire.partnertype on claire.partner.Type = claire.partnertype.PartnerType_id 
            WHERE DeletedAt IS NULL AND partnertype.Type = "Vendor";`
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
    })

}

const vendor_list = (req, res) => {
    sb.getConnection(function (error, tempCont) {
        if (error) {
            console.log('Error')
            res.status(500).json({'message': error.message})
        }
        else {
            const sqlGet = `SELECT Name, Partner_id FROM claire.partner 
            join claire.partnertype on claire.partner.Type = claire.partnertype.PartnerType_id 
            WHERE DeletedAt IS NULL AND partnertype.Type = "Vendor";`
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
    })

}

const vendor_create = (req, res) => {
    let Name = req.body.name;
    let Phone = req.body.phone;
    let Email = req.body.email;
    let Contact = req.body.contact;

    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            if (typeof Name != "string" && typeof Phone != "string" && typeof Email != "string" && typeof Contact != "string") {
                res.send("Invalid");
                res.end();
                return;
            }

            if (Name) {
                const sqlInsert = "INSERT INTO claire.partner (Name, Email, PhoneNumber, ContactName, Type) VALUES (?,?,?,?,(SELECT PartnerType_id as Type from claire.partnertype WHERE Type = 'Vendor'));"
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
    })

}
const vendor_reactivate = (req, res) => {
    let id = req.params.id;

    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            if (typeof id != "string") {
                res.send("Invalid");
                res.end();
                return;
            }

            if (id) {
                const sqlDelete = `UPDATE claire.partner Set DeletedAt= NULL WHERE Partner_id = ?;`
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
    })

}

const vendor_delete = (req, res) => {
    let id = req.params.id;
    let date = req.body.date;

    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            if (typeof id != "string" && typeof date != "string") {
                res.send("Invalid");
                res.end();
                return;
            }

            if (id) {
                const sqlDelete = `UPDATE claire.partner Set DeletedAt= STR_TO_Date(?, '%m/%d/%Y') WHERE Partner_id = ?;`
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
    })

}

const vendor_edit = (req, res) => {
    let id = req.params.id

    sb.getConnection(function (error, tempCont) {
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
                const sqlGet = 'SELECT Name as BusinessName, Email, PhoneNumber as Phone, ContactName FROM claire.partner WHERE Partner_id = ?;'
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
    })

}

const vendor_update = (req, res) => {

    let id = req.params.id
    let Name = req.body.name;
    let Phone = req.body.phone;
    let Email = req.body.email;
    let Contact = req.body.contact;

    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            if (typeof Name != "string" && typeof Type != "number" && typeof Phone != "string" && typeof Email != "string" && typeof Contact != "string") {
                res.send("Invalid");
                res.end();
                return;
            }

            if (Name && id) {
                const sqlUpdate = "UPDATE claire.partner SET Name= ?, Email= ?, PhoneNumber= ?, ContactName= ? WHERE Partner_id = ?;"
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
    })

}

const vendor_view = (req, res) => {
    let id = req.params.id;

    sb.getConnection(function (error, tempCont) {
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
                from claire.intake i 
                join claire.intakeitems ii on i.Intake_id = ii.Intake_id
                join claire.itemlocation il on ii.FKItemLocation = il.ItemLocation_id
                join claire.partner p on i.Partner = p.Partner_id
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
    })

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
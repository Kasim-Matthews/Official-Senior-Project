const mysql = require('mysql2');
const sb = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Piano2601!",
    database: 'claire',
    port: 3306
});

const partner_index = (req, res) => {
    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            const sqlGet = `SELECT Name, Email, Partner_id, DeletedAt FROM claire.partner 
            join claire.partnertype on claire.partner.Type = claire.partnertype.PartnerType_id 
            WHERE partnertype.Type = "Partner";`
            tempCont.query(sqlGet, (err, result) => {
                tempCont.release()
                if (err) {
                    console.log(err)
                    res.send(["error"])
                    res.end();
                    return
                }

                else {
                    console.log('Partner data found')
                    res.send(result);
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
            tempCont.release();
            console.log('Error')
        }
        else {
            const sqlGet = `SELECT Name, Email, Partner_id FROM claire.partner 
            join claire.partnertype on claire.partner.Type = claire.partnertype.PartnerType_id 
            WHERE DeletedAt IS NULL AND partnertype.Type = "Partner";`
            tempCont.query(sqlGet, (err, result) => {
                tempCont.release()
                if (err) {
                    console.log(err)
                    return
                }

                else {
                    res.send(result);
                    res.end();
                    return
                }

            })
        }
    })

}

const partner_list = (req, res) => {

    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            const sqlGet = `SELECT Name, Partner_id FROM claire.partner 
            join claire.partnertype on claire.partner.Type = claire.partnertype.PartnerType_id 
            WHERE DeletedAt IS NULL AND partnertype.Type = "Partner";`
            tempCont.query(sqlGet, (err, result) => {
                tempCont.release()
                if (err) {
                    console.log(err)
                    return
                }

                else {
                    console.log('Partner list data found')
                    res.send(result);
                    res.end()
                    return
                }

            })
        }
    })

}

const partner_options = (req, res) => {

    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            const sqlGet = "SELECT Partner_id as value, Name as label FROM claire.partner;"
            tempCont.query(sqlGet, (err, result) => {
                tempCont.release()
                if (err) {
                    console.log(err)
                    return
                }

                else {
                    console.log('Partner options data found')
                    res.send(result);
                    res.end()
                    return
                }

            })
        }
    })

}

const partner_create = (req, res) => {
    let Name = req.body.name;
    let Email = req.body.email;

    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            if (typeof Name != "string" && typeof Email != "string") {
                res.send("Invalid");
                res.end();
                return;
            }

            if (Name && Email) {
                const sqlInsert = "INSERT INTO claire.partner (Name, Email, Type) VALUES (?,?,(SELECT PartnerType_id as Type from claire.partnertype WHERE Type = 'Partner'));"
                tempCont.query(sqlInsert, [Name, Email], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err);
                        return
                    }

                    else {
                        console.log("Partner created")
                        res.send()
                        res.end();
                        return;
                    }

                })

            }
        }
    })

}

const partner_delete = (req, res) => {
    let id = req.params.id;
    let date = req.body.date;

    sb.getConnection(function (error, tempCont){
        if(error){
            tempCont.release();
            console.log('Error')
        }
        else{
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
                        console.log("Partner deleted")
                        res.send()
                        res.end()
                        return
                    }
                    
                })
            }
        }
    })

}

const partner_reactivate = (req, res) => {
    let id = req.params.id;

    sb.getConnection(function (error, tempCont){
        if(error){
            tempCont.release();
            console.log('Error')
        }
        else{
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
                        console.log("Partner reactivated")
                        res.send()
                        res.end()
                        return
                    }
                    
                })
            }
        }
    })

}

const partner_edit = (req, res) => {
    let id = req.params.id

    sb.getConnection(function (error, tempCont){
        if(error){
            tempCont.release();
            console.log('Error')
        }
        else{
            if (typeof id != "string") {
                res.send("Invalid");
                res.end();
                return;
            }
        
            if (id) {
                const sqlGet = 'SELECT Name, Email FROM claire.partner WHERE Partner_id = ?;'
                tempCont.query(sqlGet, [id], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err)
                        return
                    }

                    else {
                        console.log("Partner edit data found")
                        res.send(result);
                        res.end();
                        return
                    }
                    
                })
            }
        }
    })

}

const partner_update = (req, res) => {

    let id = req.params.id
    let Name = req.body.name;
    let Email = req.body.email;


    sb.getConnection(function (error, tempCont){
        if(error){
            tempCont.release();
            console.log('Error')
        }
        else{
            if (typeof id != "string" && typeof Name != "string" && typeof Email != "string") {
                res.send("Invalid");
                res.end();
                return;
            }
        
            if (Name && Email && id) {
                const sqlUpdate = "UPDATE claire.partner SET Name= ?, Email= ? WHERE Partner_id = ?;"
                tempCont.query(sqlUpdate, [Name, Email, id], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err);
                        return
                    }

                    else {
                        console.log("Partner updated")
                        res.send()
                        res.end()
                        return
                    }
                    
                })
            }
        }
    })

}

const partner_view = (req, res) => {
    let id = req.params.id;

    sb.getConnection(function (error, tempCont){
        if(error){
            tempCont.release();
            console.log('Error')
        }
        else{
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
                tempCont.query(sqlGet, [id], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err)
                        return
                    }

                    else {
                        console.log("Partner view data found")
                        res.send(result);
                        res.end()
                        return
                    }
                    
                })
            }
        }
    })

}

const partner_types = (req, res) => {
    
    sb.getConnection(function (error, tempCont){
        if(error){
            tempCont.release();
            console.log('Error')
        }
        else{
            const sqlGet = `SELECT *
            from partnertype
            WHERE Type NOT IN ("Vendor", "Adjustment", "Partner");`
        
            tempCont.query(sqlGet, (err, result) => {
                tempCont.release()
                if (err) {
                    console.log(err)
                    return
                }

                else {
                    console.log("Partner types data found")
                    res.send(result);
                    res.end();
                    return;
                }
                
            })
        }
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
    partner_types,
    anything_else,
    partner_reactivate
}
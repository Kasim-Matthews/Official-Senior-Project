const mysql = require('mysql2');
const dbconfig = require('../database')
var sb = mysql.createPool(dbconfig);

const drive_index = (req, res) => {
    
    sb.getConnection(function (error, tempCont){
        if(error){
            console.log('Error')
            res.status(500).json({'message': error.message})
        }
        else{
            const sqlGet = `SELECT p.Name as Drive, COUNT(ii.FKItemLocation) as Variety, SUM(ii.Value) as Total, SUM(ii.Quantity) as Quantity, p.Partner_id, p.DeletedAt
            from sql5669328.partner p
            join sql5669328.intake i on i.Partner = p.Partner_id
            join sql5669328.intakeitems ii on i.Intake_id = ii.Intake_id
            join sql5669328.partnertype pt on pt.PartnerType_id = p.Type
            WHERE pt.Type = "Product Drive"
            group by p.Name, p.Partner_id;`
            tempCont.query(sqlGet, (err, result) => {
                tempCont.release()
                if (err) {
                    console.log(err)
                    res.send({status: 'error in query', message: err.message})
                    return
                }

                else{
                    console.log("Product drive data found")
                    res.send({status: 'complete', data: result});
                    res.end();
                    return
                }
                
            })
        }
    })

}

const anything_else= (req, res) => {
    
    sb.getConnection(function (error, tempCont){
        if(error){
            console.log('Error')
            res.status(500).json({'message': error.message})
        }
        else{
            const sqlGet = `SELECT p.Name as Drive, COUNT(ii.FKItemLocation) as Variety, SUM(ii.Value) as Total, SUM(ii.Quantity) as Quantity, p.Partner_id
            from sql5669328.partner p
            join sql5669328.intake i on i.Partner = p.Partner_id
            join sql5669328.intakeitems ii on i.Intake_id = ii.Intake_id
            join sql5669328.partnertype pt on pt.PartnerType_id = p.Type
            WHERE pt.Type = "Product Drive" AND p.DeletedAt IS NULL
            group by p.Name, p.Partner_id;`
            tempCont.query(sqlGet, (err, result) => {
                tempCont.release()
                if (err) {
                    console.log(err)
                    res.send({status: 'error in query', message: err.message})
                    return
                }

                else{
                    console.log("Product drive data found")
                    res.send({status: 'complete', data: result});
                    res.end();
                    return
                }
                
            })
        }
    })

}

const drive_list = (req, res) => {
    
    sb.getConnection(function (error, tempCont){
        if(error){
            tempCont.release();
            console.log('Error')
            res.status(500).json({'message': error.message})
        }
        else{
            const sqlGet = `SELECT Name, Partner_id FROM sql5669328.partner 
            join sql5669328.partnertype on sql5669328.partner.Type = sql5669328.partnertype.PartnerType_id 
            WHERE DeletedAt IS NULL AND sql5669328.partnertype.Type = "Product Drive";`
            tempCont.query(sqlGet, (err, result) => {
                tempCont.release()
                if (err) {
                    console.log(err)
                    res.send({status: 'error in query', message: err.message})
                    return
                }

                else {
                    console.log("Product drive list data found")
                    res.send({status: 'complete', data: result});
                    res.end()
                    return
                }
                
            })
        }
    })

}

const drive_create = (req, res) => {
    let Name = req.body.name;

    sb.getConnection(function (error, tempCont){
        if(error){
            tempCont.release();
            console.log('Error')
        }
        else{
            if (typeof Name != "string") {
                res.send("Invalid");
                res.end();
                return;
            }
        
            if (Name) {
                const sqlInsert = "INSERT INTO sql5669328.partner (Name, Type) VALUES (?,(SELECT PartnerType_id as Type from sql5669328.partnertype WHERE Type = 'Product Drive'));"
                tempCont.query(sqlInsert, [Name], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err);
                        return
                    }

                    else {
                        console.log("Product drive created")
                        res.send()
                        res.end();
                        return;
                    }
                    
                })
                
            }
        }
    })

}

const drive_reactivate = (req, res) => {
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
                const sqlDelete = `UPDATE sql5669328.partner Set DeletedAt= NULL WHERE Partner_id = ?;`
                tempCont.query(sqlDelete, [id], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err);
                        return
                    }

                    else {
                        console.log("Product Drive reactivated")
                        res.send()
                        res.end()
                        return
                    }
                    
                })
            }
        }
    })

}

const drive_delete = (req, res) => {
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
                const sqlDelete = `UPDATE sql5669328.partner Set DeletedAt= STR_TO_Date(?, '%m/%d/%Y') WHERE Partner_id = ?;`
                tempCont.query(sqlDelete, [date, id], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err);
                        return
                    }

                    else {
                        console.log("Product Drive deleted")
                        res.send()
                        res.end()
                        return
                    }
                    
                })
            }
        }
    })

}

const drive_edit = (req, res) => {
    let id = req.params.id

    sb.getConnection(function (error, tempCont){
        if(error){
            console.log('Error')
            res.status(500).json({'message': error.message})
        }
        else{
            if (typeof id != "string") {
                res.send("Invalid");
                res.end();
                return;
            }
        
            if (id) {
                const sqlGet = 'SELECT Name FROM sql5669328.partner WHERE Partner_id = ?;'
                tempCont.query(sqlGet, [id], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err)
                        res.send({status: 'error in query', message: err.message})
                        return
                    }

                    else {
                        console.log("Product Drive edit data found")
                        res.send({status: 'complete', data: result});
                        res.end()
                        return
                    }
                    
                })
            }
        }
    })

}

const drive_update = (req, res) => {

    let id = req.params.id
    let Name = req.body.name;

    sb.getConnection(function (error, tempCont){
        if(error){
            tempCont.release();
            console.log('Error')
        }
        else{
            if (typeof Name != "string") {
                res.send("Invalid");
                console.log("Invalid")
                res.end();
                return;
            }
        
            if (Name && id) {
                const sqlUpdate = "UPDATE sql5669328.partner SET Name= ? WHERE Partner_id = ?;"
                tempCont.query(sqlUpdate, [Name, id], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err);
                        return
                    }

                    else{
                        console.log("Product Drive updated")
                        res.send()
                        res.end()
                        return
                    }
                    
                })
            }
        }
    })

}

const drive_view = (req, res) => {
    let id = req.params.id;

    sb.getConnection(function (error, tempCont){
        if(error){
            console.log('Error')
            res.status(500).json({'message': error.message})
        }
        else{
            if (typeof id != "string") {
                res.send("Invalid");
                res.end();
                return;
            }
        
            if (id) {
                const sqlGet = `SELECT i.Intake_id, l.Name as Location, COUNT(ii.FKItemLocation) as Quantity, CAST(SUM(ii.Value) AS DECIMAL (5,2)) as TotalItems
                from sql5669328.partner p
                join sql5669328.intake i on i.Partner = p.Partner_id
                join sql5669328.intakeitems ii on ii.Intake_id = i.Intake_id
                join sql5669328.itemlocation il on il.ItemLocation_id = ii.FKItemLocation
                join sql5669328.location l on il.Location_id = l.Location_id
                WHERE p.Partner_id = ?
                group by i.intake_id, l.Name;`
                tempCont.query(sqlGet, [id], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err)
                        res.send({status: 'error in query', message: err.message})
                        return
                    }

                    else {
                        console.log("Product Drive view data found")
                        res.send({status: 'complete', data: result});
                        res.end()
                        return
                    }
                    
                })
            }
        }
    })

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
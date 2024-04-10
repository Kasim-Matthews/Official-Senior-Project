const mysql = require('mysql2');
const dbconfig = require('../database')
var sb = mysql.createPool(dbconfig);



const adjustment = (req, res) => {
    sb.getConnection(function (error, tempCont){
        if(error){
            tempCont.release();
            console.log('Error')
        }
        else{
            const sqlGet = `SELECT p.Partner_id, p.Name, p.Location
            from sql5669328.partner p
            where p.Location IS NOT NULL;`
            tempCont.query(sqlGet, (err, result) => {
                tempCont.release()
                if (err) {
                    console.log(err)
                    return
                }

                else {
                    console.log("Adjustment data found")
                    res.send(result);
                    res.end();
                    return
                }
                
            })
        }
    })

}

const takeaway = (req, res) => {
    let Location = req.body.Location
    let Items = req.body.Items

    sb.getConnection(function (error, tempCont){
        if(error){
            tempCont.release();
            console.log('Error')
        }
        else{
            if (typeof Items != "object" && typeof Location != "number") {
                res.send("Invalid");
                res.end();
                return;
            }
        
            if (Location && Items) {
                for (item in Items) {
                    const sqlUpdate = `UPDATE sql5669328.itemlocation set Quantity = Quantity - ? WHERE Location_id = ? AND Item_id = ?;`
                    tempCont.query(sqlUpdate, [Items[item].Quantity, Location, Items[item].Item_id], (err, result) => {
                        if (err) {
                            console.log(err);
                            return
                        }

                        else {
                            console.log("Taking away in progress")
                            res.send();
                            res.end();
                            return
                        }
                        
                    })
                }
                tempCont.release()
                console.log("Taking away complete")
            }
        }
    })


}

const give = (req, res) => {
    let Location = req.body.Location
    let Items = req.body.Items

    sb.getConnection(function (error, tempCont){
        if(error){
            tempCont.release();
            console.log('Error')
        }
        else{
            if (typeof Items != "object" && typeof Location != "string") {
                res.send("Invalid");
                res.end();
                return;
            }
        
            if (Location && Items) {
                for (item in Items) {
                    const sqlUpdate = `UPDATE sql5669328.itemlocation set Quantity = Quantity + ? WHERE Location_id = ? AND Item_id = ?;`
                    tempCont.query(sqlUpdate, [Items[item].Quantity, Location, Items[item].Item_id], (err, result) => {
                        if (err) {
                            console.log(err);
                            return
                        }

                        else {
                            console.log("Giving in progress")
                            res.send();
                            res.end();
                            return
                        }
        
                    })
                }
                tempCont.release()
                console.log("Giving complete")
            }
        }
    })

}

const find_value = (req, res) => {
    let Items = req.body.Items

    sb.getConnection(function (error, tempCont){
        if(error){
            tempCont.release();
            console.log('Error')
        }
        else{
            if (typeof Items != "object") {
                res.send("Invalid")
                res.end();
                return;
            }
        
            if (Items) {
                let ids = []
                Items.forEach(element => {
                    ids.push(element.Item_id);
                });
        
                const sqlGet = `SELECT i.FairMarketValue
                from sql5669328.item i
                WHERE i.Item_id IN (?);`
        
                tempCont.query(sqlGet, [ids], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err);
                        return
                    }

                    else {
                        console.log("Item values for transfer found")
                        res.send(result);
                        res.end();
                        return;
                    }
                    
                })
            }
        }
    })

}


const find_ild = (req, res) => {
    let Items = req.body.Items
    let Location = req.body.Location

    sb.getConnection(function (error, tempCont){
        if(error){
            tempCont.release();
            console.log('Error')
        }
        else{
            if (typeof Items != "object" && typeof Location != "string") {
                res.send("Invalid");
                res.end();
                return;
            }
        
            if(Items && Location){
                let ids = []
                Items.forEach(element => {
                    ids.push(element.Item_id);
                });
        
                const sqlGet = `SELECT il.ItemLocation_id
                from sql5669328.itemlocation il
                WHERE il.Item_id IN (?) AND il.Location_id = ?;`
        
                
                tempCont.query(sqlGet, [ids, Location], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err);
                        return
                    }

                    else {
                        console.log("Inventor found for Transfer");
                        res.send(result);
                        res.end();
                        return;
                    }
                    
                })
        
            }
        }
    })

}

const validation = (req, res) => {
    let Items = req.body.Items
    let Location = req.body.Location

    sb.getConnection(function (error, tempCont){
        if(error){
            tempCont.release();
            console.log('Error')
        }
        else{
            if (typeof Items != "object" && typeof Location != "string") {
                res.send("Invalid");
                res.end();
                return;
            }
        
            if(Items && Location){
                let ids = []
                Items.forEach(element => {
                    ids.push(element.Item_id);
                });
        
                const sqlGet = `SELECT il.ItemLocation_id, il.Quantity, i.Name as Item, i.Item_id
                from sql5669328.itemlocation il
                join sql5669328.item i on i.Item_id = il.Item_id
                WHERE il.Item_id IN (?) AND il.Location_id = ?;`
        
                
                tempCont.query(sqlGet, [ids, Location], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err);
                        return
                    }

                    else {
                        console.log("Validation quantites found for Transfer");
                        res.send(result);
                        res.end();
                        return;
                    }
                    
                })
        
            }
        }
    })

}



const track_intake = (req, res) => {
    let Items = req.body.Items
    let Values = req.body.Values
    let FKItemLocation = req.body.FKItemLocation

    sb.getConnection(function (error, tempCont){
        if(error){
            tempCont.release();
            console.log('Error')
        }
        else{
            if (typeof Items != "object" && typeof Values != "object" && typeof FKItemLocation != "object") {
                res.send("Invalid")
                res.end();
                return;
            }
        
            if (Items && Values && FKItemLocation) {
                const sqlInsert = `INSERT INTO sql5669328.intakeitems (Intake_id, Quantity, Value, FKItemLocation) VALUES ((SELECT MAX(Intake_id) as Intake_id FROM sql5669328.intake),?,?,?);`
                for (var i = 0; i < Items.length; i++) {
                    let Value = Items[i].Quantity * Values[i].FairMarketValue
                    tempCont.query(sqlInsert, [Items[i].Quantity, Value, FKItemLocation[i].ItemLocation_id], (err, result) => {
                        if (err) {
                            console.log(err);
                            return
                        }

                        else {
                            console.log("Transfer tracking in progress")
                            res.send();
                            res.end();
                            return;
                        }
                        
        
                    })
                }
                tempCont.release()
                console.log("Tracking complete")
                
            }
        }
    })

}

const transfer = (req, res) => {
    sb.getConnection(function (error, tempCont){
        if(error){
            tempCont.release();
            console.log('Error')
        }
        else{
            const sqlGet = `SELECT p.Name as Taken, l.Name as Given, Cast(i.RecievedDate as char(10)) as Date, i.Intake_id, SUM(ii.Quantity) as TotalMoved, i.Comments, p.Location
            from sql5669328.intake i
            join sql5669328.partner p on p.Partner_id = i.Partner
            join sql5669328.partnertype pt on p.Type = pt.PartnerType_id
            join sql5669328.intakeitems ii on ii.Intake_id = i.Intake_id
            join sql5669328.itemlocation il on ii.FKItemLocation = il.ItemLocation_id
            join sql5669328.location l on il.Location_id = l.Location_id
            WHERE pt.Type = "Adjustment"
            group by p.Name, l.Name, i.RecievedDate, i.Intake_id;`
        
            tempCont.query(sqlGet, (err, result) => {
                tempCont.release()
                if (err) {
                    console.log(err)
                    return
                }

                else {
                    console.log("Transfer data found")
                    res.send(result);
                    res.end();
                    return
                }
                
            })
        }
    })

}

const transfer_view = (req, res) => {
    let id = req.params.id

    sb.getConnection(function (error, tempCont){
        if(error){
            tempCont.release();
            console.log('Error')
        }
        else{
            if(typeof id != "string"){
                res.send("Invalid");
                res.end();
                return;
            }
        
            if(id){
                const sqlGet = `SELECT p.Name as Taken, l.Name as Given, CAST(i.RecievedDate as char(10)) as Date, it.Name as Item, ii.Quantity
                from sql5669328.intake i
                join sql5669328.partner p on p.Partner_id = i.Partner
                join sql5669328.intakeitems ii on ii.Intake_id = i.Intake_id
                join sql5669328.itemlocation il on il.ItemLocation_id = ii.FKItemLocation
                join sql5669328.item it on it.Item_id = il.Item_id
                join sql5669328.location l on l.Location_id = il.Location_id
                WHERE i.Intake_id = ?
                group by p.Name, l.Name, i.RecievedDate, it.Name, ii.Quantity;`
        
                tempCont.query(sqlGet, [id], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err)
                        return
                    }

                    else {
                        console.log("Transfer view data found");
                        res.send(result);
                        res.end();
                        return;
                    }
                    
                })
            }
        }
    })

}

const transfer_cleanup = (req, res) => {
    let id = req.params.id

    sb.getConnection(function (error, tempCont){
        if(error){
            tempCont.release();
            console.log('Error')
        }
        else{
            if (typeof id != 'string') {
                res.send('Invalid');
                res.end();
                return
            }
        
            if (id) {
                const sqlGet = `SELECT ii.Quantity as Given, ii.FKItemLocation, il.Item_id
                from sql5669328.intakeitems as ii
                join sql5669328.itemlocation il on ii.FKItemLocation = il. ItemLocation_id
                where ii.Intake_id = ?;`
                tempCont.query(sqlGet, [id], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err)
                        return
                    }

                    else {
                        console.log("Transfer clean up data found")
                        res.send(result)
                        res.end()
                        return;
                    }
                    
                })
            }
        }
    })

}

const transfer_reclaim = (req, res) => {
    let records = req.body.records

    sb.getConnection(function (error, tempCont){
        if(error){
            tempCont.release();
            console.log('Error')
        }
        else{
            if (typeof records != "object") {
                res.send("Invalid");
                res.end();
                return;
            }
        
            if (records) {
                for (let record in records) {
                    const sqlUpdate = "UPDATE sql5669328.itemlocation SET Quantity= Quantity - ? WHERE ItemLocation_id = ?;"
                    tempCont.query(sqlUpdate, [records[record].Given, records[record].FKItemLocation], (err, result) => {
                        if (err) {
                            console.log(err);
                        }
                        
                        else {
                            console.log("Reclaiming in progress")
                            res.send()
                            res.end()
                            return;
                        }
                        
                    })
                }
                tempCont.release()
                console.log("Reclaiming complete")
        
            }
        }
    })

}

const transfer_renounce = (req, res) => {
    let records = req.body.records
    let Location = req.body.Location

    sb.getConnection(function (error, tempCont){
        if(error){
            tempCont.release();
            console.log('Error')
        }
        else{
            if (typeof records != "object" && typeof Location != "string") {
                res.send("Invalid");
                res.end();
                return;
            }
        
            if (records && Location) {
                for (let record in records) {
                    const sqlUpdate = "UPDATE sql5669328.itemlocation SET Quantity= Quantity + ? WHERE Location_id = ? AND Item_id = ?;"
                    tempCont.query(sqlUpdate, [records[record].Given, Location, records[record].Item_id], (err, result) => {
                        if (err) {
                            console.log(err)
                            return
                        }

                        else {
                            console.log("Renouncing in progress");
                            res.send()
                            res.end()
                            return;
                        }
                        
                    })
                }
                tempCont.release()
                console.log("Renounce completed")
        
            }
        }
    })

}

module.exports = {
    adjustment,
    takeaway,
    give,
    find_value,
    track_intake,
    find_ild,
    transfer,
    transfer_view,
    transfer_cleanup,
    transfer_reclaim,
    transfer_renounce,
    validation
}
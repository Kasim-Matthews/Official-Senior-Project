const mysql = require('mysql2');
const dbconfig = require('../database')
var sb = mysql.createPool(dbconfig);

const location_index = (req, res) => {
    sb.getConnection(function (error, tempCont){
        if(error){
            tempCont.release();
            console.log('Error')
        }
        else{
            const sqlGet = "SELECT * FROM sql5669328.location;"
            tempCont.query(sqlGet, (err, result) => {
                tempCont.release()
                if (err) {
                    console.log(err)
                    return
                }

                else {
                    console.log('Location data found')
                    res.send(result);
                    res.end();
                    return
                }
                
            })
        }
    })

}

const anything_else = (req, res) => {
    sb.getConnection(function (error, tempCont){
        if(error){
            tempCont.release();
            console.log('Error')
        }
        else{
            const sqlGet = "SELECT * FROM sql5669328.location WHERE DeletedAt IS null;"
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

const location_creation = (req, res) => {
    let Name = req.body.name;
    let Address = req.body.Address;

    sb.getConnection(function (error, tempCont){
        if(error){
            tempCont.release();
            console.log('Error')
        }
        else{
            if (typeof Name != "string" && typeof Address != "string") {
                res.send("Invalid");
                res.end();
                return;
            }
        
            if (Name && Address) {
                const sqlInsert = "INSERT INTO sql5669328.location (Name, Address) VALUES (?,?);"
                tempCont.query(sqlInsert, [Name, Address], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err);
                        return
                    }
                    
                    else {
                        console.log('Location created')
                        res.send();
                        res.end();
                        return
                    }
                    
                })
            }
        }
    })

}

const location_delete = (req, res) => {
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
                const sqlDelete = `UPDATE sql5669328.location Set DeletedAt= STR_TO_Date(?, '%m/%d/%Y') WHERE Location_id = ?;`
                tempCont.query(sqlDelete, [date, id], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err);
                        return
                    }
                    
                    else {
                        console.log('Location deleted')
                        res.send();
                        res.end();
                        return;
                    }
                    
                })
            }
        }
    })

}

const location_reactivate = (req, res) => {
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
                const sqlDelete = `UPDATE sql5669328.location Set DeletedAt= NULL WHERE Location_id = ?;`
                tempCont.query(sqlDelete, [id], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err);
                        return
                    }

                    else {
                        console.log('Reactivated location')
                        res.send();
                        res.end();
                        return
                    }
                    
                })
            }
        }
    })

}

const location_edit = (req, res) => {
    let id = req.params.id

    sb.getConnection(function (error, tempCont){
        if(error){
            tempCont.release();
            console.log('Error')
            return
        }
        else{
            if (typeof id != "string") {
                res.send("Invalid");
                res.end();
                return;
            }
        
            if (id) {
                const sqlGet = 'SELECT * FROM sql5669328.location WHERE Location_id= ?;'
                tempCont.query(sqlGet, [id], (err, result) => {
                    tempCont.release();
                    if (err) {
                        console.log(err);
                        return
                    }

                    else {
                        console.log('Location edit data found')
                        res.send(result);
                        res.end();
                        return
                    }
                    
                })
            }
        }
    })

}

const tab_1 = (req, res) => {
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
                const sqlGet = `SELECT i.Name as Item, il.Quantity
                from sql5669328.itemlocation il
                join sql5669328.item i on il.Item_id = i.Item_id
                WHERE il.Location_id = ?
                order by il.Item_id;`
                tempCont.query(sqlGet, [id], (err, result) => {
                    tempCont.release();
                    if (err) {
                        console.log(err)
                        return
                    }

                    else {
                        console.log('Location tab1 data found')
                        res.send(result);
                        res.end();
                        return
                    }
                    
                })
            }
        }
    })

}

const tab_2 = (req, res) => {
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
                const sqlGet = `SELECT i.Name as Item, SUM(oi.Quantity) as Quantity, il.Item_id
                from sql5669328.itemlocation il
                join sql5669328.item i on il.Item_id = i.Item_id
                join sql5669328.orderitems oi on oi.ItemLocationFK = il.ItemLocation_id
                WHERE il.Location_id = ?
                group by i.Name, il.Item_id
                order by il.Item_id;`
                tempCont.query(sqlGet, [id], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err)
                        return
                    }

                    else {
                        console.log('Location tab 2 data found')
                        res.send(result);
                        res.end();
                        return
                    }
                    
                })
            }
        }
    })

}

const tab_3 = (req, res) => {
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
                const sqlGet = `SELECT i.Name as Item, SUM(ii.Quantity) as Quantity, il.Item_id
                from sql5669328.itemlocation il
                join sql5669328.item i on il.Item_id = i.Item_id
                join sql5669328.intakeitems ii on ii.FKItemLocation = il.ItemLocation_id
                WHERE il.Location_id = ?
                group by i.Name, il.Item_id
                order by il.Item_id;`
                tempCont.query(sqlGet, [id], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err)
                        return
                    }

                    else {
                        console.log('Location tab 3 data found')
                        res.send(result);
                        res.end();
                        return
                    }
                    
                })
            }
        }
    })

}

const location_update = (req, res) => {

    let id = req.params.id
    let Name = req.body.name;
    let Address = req.body.Address;

    sb.getConnection(function (error, tempCont){
        if(error){
            tempCont.release();
            console.log('Error')
        }
        else{
            if (typeof Name != "string" && typeof Address != "string" && typeof id != "string") {
                res.send("Invalid");
                res.end();
                return;
            }
        
            if (Name && Address && id) {
                const sqlUpdate = "UPDATE sql5669328.location SET Name= ?, Address= ? WHERE Location_id = ?;"
                tempCont.query(sqlUpdate, [Name, Address, id], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err);
                    }

                    else {
                        console.log('Location updated')
                        res.send();
                        res.end()
                        return
                    }
                    
                })
            }
        }
    })

}

const last = (req, res) => {
    sb.getConnection(function (error, tempCont){
        if(error){
            tempCont.release();
            console.log('Error')
        }
        else{
            const sqlGet = `SELECT Location_id from sql5669328.location
            ORDER BY Location_id DESC
            Limit 1;`
            tempCont.query(sqlGet, (err, result) => {
                tempCont.release();
                if (err) {
                    console.log(err)
                }

                else {
                    console.log('Last Location id found')
                    res.send(result)
                    res.end();
                    return
                }
                
            })
        }
    })

}

const pair = (req, res) => {
    let Items = req.body.Items;
    
    sb.getConnection(function (error, tempCont){
        if(error){
            tempCont.release();
            console.log('Error')
        }
        else{
            if (typeof Items != "object") {
                res.send("Invalid");
                res.end();
                return;
            }
            if (Location_id, Items) {
                for (let item in Items) {
                    const sqlInsert = `INSERT INTO sql5669328.itemlocation (Location_id, Item_id, Quantity) VALUES ((SELECT Location_id as Type from sql5669328.location ORDER BY Location_id DESC Limit 1),?,0);`
                    tempCont.query(sqlInsert, [Items[item].Item_id], (err, result) => {
                        if (err) {
                            console.log(err);
                            return
                        }

                        else {
                            console.log('Pairing locations to items in process')
                            res.send();
                            res.end()
                            return
                        }
        
                    })
                }
                tempCont.release()
                console.log('Pairing complete')
            }
        }
    })

}



const partner = (req, res) => {
    let name = req.body.name
    let address = req.body.address

    sb.getConnection(function (error, tempCont){
        if(error){
            tempCont.release();
            console.log('Error')
        }
        else{
            if(typeof name != " string" && typeof address != "string"){
                res.send("Invalid")
                res.end();
                return;
            }
        
            if(name && address){
                const sqlInsert = `INSERT INTO sql5669328.partner (Name, Address, Location, Type) VALUES (?,?,(SELECT Location_id as Type from sql5669328.location ORDER BY Location_id DESC Limit 1),(SELECT PartnerType_id as Type from sql5669328.partnertype WHERE Type = 'Adjustment'));`
                tempCont.query(sqlInsert, [name, address], (err, result) =>{
                    tempCont.release()

                    if (err) {
                        console.log(err)
                        return
                    }
                    
                    else {
                        console.log('Adjustment Partner added')
                        res.send();
                        res.end();
                        return
                    }
                    
                })
            }
        }
    })

}



module.exports = {
    location_index,
    location_creation,
    location_delete,
    location_update,
    location_edit,
    last,
    pair,
    partner,
    location_reactivate,
    anything_else,
    tab_1,
    tab_2,
    tab_3
}
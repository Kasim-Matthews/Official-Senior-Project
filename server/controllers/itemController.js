const mysql = require('mysql2');
const sb = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Piano2601!",
    database: 'claire',
    port: 3306
});

const item_index = (req, res) => {
    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            const sqlGet = "SELECT * FROM claire.item;"
            tempCont.query(sqlGet, (err, result) => {
                tempCont.release()
                if (err) {
                    console.log(err)
                }

                else {
                    console.log('Item data found')
                    res.send(result);
                    res.end();
                    return;
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
            const sqlGet = "SELECT * FROM claire.item WHERE DeletedAt IS null;"
            tempCont.query(sqlGet, (err, result) => {
                tempCont.release();
                if (err) {
                    console.log(err)
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

const item_creation = (req, res) => {
    let Name = req.body.name;
    let FairMarketValue = req.body.FairMarketValue;
    let PackageCount = req.body.PackageCount

    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            if (typeof Name != "string" && typeof FairMarketValue != "number" && typeof PackageCount != "number") {
                res.send("Invalid");
                res.end();
                return;
            }

            if (Name && FairMarketValue && PackageCount) {
                if (PackageCount > 0) {
                    const sqlInsert = "INSERT INTO claire.item (Name, FairMarketValue, PackageCount) VALUES (?,?,?);"
                    tempCont.query(sqlInsert, [Name, FairMarketValue, PackageCount], (err, result) => {
                        tempCont.release();
                        if (err) {
                            console.log(err)
                            return;
                        }

                        else {
                            console.log('Item created')
                            res.send();
                            res.end();
                            return
                        }

                    })
                }
                else {
                    const sqlInsert = "INSERT INTO claire.item (Name, FairMarketValue) VALUES (?,?);"
                    tempCont.query(sqlInsert, [Name, FairMarketValue], (err, result) => {
                        tempCont.release()
                        if (err) {
                            console.log(err);
                        }

                        else {
                            console.log('Item created')
                            res.send();
                            res.end();
                            return;
                        }

                    })
                }
            }
        }
    })

}

const item_delete = (req, res) => {
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

            if (id && date) {
                const sqlDelete = `UPDATE claire.item Set DeletedAt= STR_TO_Date(?, '%m/%d/%Y') WHERE Item_id = ?;`
                tempCont.query(sqlDelete, [date, id], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err);
                        return
                    }

                    else {
                        console.log('Item deleted')
                        res.send()
                        res.end();
                        return
                    }

                })
            }
        }
    })

}

const item_reactivate = (req, res) => {
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
                const sqlDelete = `UPDATE claire.item Set DeletedAt= NULL WHERE Item_id = ?;`
                tempCont.query(sqlDelete, [id], (err, result) => {
                    tempCont.release();
                    if (err) {
                        console.log(err);
                    }

                    else {
                        console.log('Item reactivated')
                        res.send()
                        res.end();
                        return
                    }

                })
            }
        }
    })

}

const item_edit = (req, res) => {
    let id = req.params.id

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
                const sqlGet = 'SELECT Name, FairMarketValue, Item_id, PackageCount FROM claire.item WHERE Item_id = ?;'
                tempCont.query(sqlGet, [id], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err)
                        return
                    }

                    else {
                        console.log('Item edit data found')
                        res.send(result);
                        res.end();
                        return
                    }

                })
            }
        }
    })

}

const item_update = (req, res) => {

    let id = req.params.id
    let Name = req.body.name;
    let FairMarketValue = req.body.FairMarketValue;
    let PackageCount = req.body.PackageCount

    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            if (typeof id != "string" && typeof Name != "string" && typeof FairMarketValue != "number" && typeof PackageCount != "number") {
                res.send("Invalid");
                res.end();
                return;
            }

            if (Name && FairMarketValue && id && PackageCount) {
                if (PackageCount > 0) {
                    const sqlUpdate = "UPDATE claire.item SET Name= ?, FairMarketValue= ?, PackageCount= ? WHERE Item_id = ?;"
                    tempCont.query(sqlUpdate, [Name, FairMarketValue, PackageCount, id], (err, result) => {
                        tempCont.release()
                        if (err) {
                            console.log(err);
                        }

                        else {
                            console.log('Item updated')
                            res.send();
                            res.end();
                            return
                        }


                    })

                }
                else {
                    const sqlUpdate = "UPDATE claire.item SET Name= ?, FairMarketValue= ? WHERE Item_id = ?;"
                    tempCont.query(sqlUpdate, [Name, FairMarketValue, id], (err, result) => {
                        tempCont.release()
                        if (err) {
                            console.log(err);
                        }

                        else {
                            console.log('Item updated')
                            res.send();
                            res.end();
                            return
                        }

                    })
                }

            }
        }
    })

}

const item_view = (req, res) => {
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
                const sqlGet = `SELECT l.Name as Location, il.Quantity
                from claire.itemlocation il
                join claire.item i on il.Item_id = i.Item_id
                join claire.location l on il.Location_id = l.Location_id
                WHERE il.Item_id = ?
                order by il.Location_id;`
                tempCont.query(sqlGet, [id], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err)
                        return
                    }

                    else {
                        console.log('Item view data found')
                        res.send(result);
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
            const sqlGet = `SELECT Item_id from claire.item
            ORDER BY Item_id DESC
            Limit 1;`
            tempCont.query(sqlGet, (err, result) => {
                tempCont.release()
                if (err) {
                    console.log(err)
                }

                else {
                    console.log('Last item id is found')
                    res.send(result)
                    res.end()
                    return
                }
                
            })
        }
    })

}

const pair = (req, res) => {
    let Locations = req.body.Locations;
    let Item_id = req.body.Item_id;
    
    sb.getConnection(function (error, tempCont){
        if(error){
            tempCont.release();
            console.log('Error')
        }
        else{
            if (typeof Locations != "object" && typeof Item_id != "number") {
                res.send("Invalid");
                res.end();
                return;
            }
            if (Locations, Item_id) {
                for (let location in Locations) {
                    const sqlInsert = `INSERT INTO claire.itemlocation (Location_id, Item_id, Quantity) VALUES (?,?,0);`
                    tempCont.query(sqlInsert, [Locations[location].Location_id, Item_id], (err, result) => {
                        if (err) {
                            console.log(err);
                            return
                        }

                        else {
                            console.log('Pairing items to locations in process')
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

const tab2 = (req, res) => {
    sb.getConnection(function (error, tempCont){
        if(error){
            tempCont.release();
            console.log('Error')
        }
        else{
            const sqlGet = `SELECT i.Name as Item, l.Name as Location, il.Quantity
            from claire.itemlocation il
            join claire.item i on il.Item_id = i.Item_id
            join claire.location l on il.Location_id = l.Location_id
            order by i.Name;`
          
              tempCont.query(sqlGet, (err, result) => {
                tempCont.release()
                if (err) {
                    console.log(err)
                }  

                else {
                    console.log('Items tab2 data found')
                    res.send(result);
                    res.end();
                    return;
                }
                
              })
        }
    })

}


module.exports = {
    item_index,
    item_creation,
    item_delete,
    item_update,
    item_edit,
    item_view,
    last,
    pair,
    tab2,
    item_reactivate,
    anything_else
}
const mysql = require('mysql2');
const dbconfig = require('../database')
var sb = mysql.createPool(dbconfig);

const distribution_index = (req, res) => {
    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            console.log('Connected!');

            const sqlGet = `
            select o.Comments, o.Status, o.DeliveryMethod, Cast(o.RequestDate as char(10)) AS RequestDate, CAST(o.CompletedDate as char(10))AS CompletedDate, o.Order_id, p.Name, SUM(oi.Quantity) as Total, l.Name as Location
            from sql5669328.order o
            join sql5669328.partner p on o.Partner_id = p.Partner_id 
            join sql5669328.orderitems oi on o.Order_id = oi.Order_id
            join sql5669328.itemlocation il on oi.ItemLocationFK = il.ItemLocation_id
            join sql5669328.location l on l.Location_id = il.Location_id
            group by o.Order_id, l.Name;
            `;
            tempCont.query(sqlGet, (err, result) => {
                tempCont.release();
                if (err) {
                    console.log(err)
                }
                else {
                    console.log('Distribution data found')
                    res.send(result);
                    res.end()
                    return;
                }

            })
        }
    })
}

const distribution_creation = (req, res) => {
    let Comments = req.body.Comments;
    let Status = req.body.Status;
    let DeliveryMethod = req.body.DeliveryMethod;
    let RequestDate = req.body.RequestDate;
    let CompletedDate = req.body.CompletedDate;
    let Partner_id = req.body.Partner_id;
    let Items = req.body.Items
    let Location = req.body.Location_id

    sb.getConnection(async function (error, tempCont) {
        if (error) {
            console.log('Error')
            res.sendStatus(500).json({ 'message': error.message })
            return
        }

        else {
            console.log('Connected!')
            if (typeof Comments != "string" && typeof Status != 'string' && typeof DeliveryMethod != 'string' && typeof RequestDate != 'string' && typeof CompletedDate != 'string' && typeof Partner_id != 'number' && typeof Items != "object" && typeof Location != "string") {
                res.send("Invalid");
                res.end();
                return;
            }

            if (DeliveryMethod && RequestDate && CompletedDate && Partner_id && Items && Location) {
                let sqlInsert = "INSERT INTO sql5669328.order (Comments, Status, DeliveryMethod, RequestDate, CompletedDate, Partner_id) VALUES (?,?,?,?,?,?);"
                await tempCont.promise().query(sqlInsert, [Comments, Status, DeliveryMethod, RequestDate, CompletedDate, Partner_id]).then(async () => {
                    let ids = []
                    Items.forEach(element => {
                        ids.push(element.Item_id);
                    });

                    const sqlGet = `SELECT il.ItemLocation_id, il.Quantity, il.Item_id, il.Location_id
                    from sql5669328.itemlocation il
                    WHERE il.Item_id IN (?) AND il.Location_id = ?;`

                    await tempCont.promise().query(sqlGet, [ids, Location]).then(async (result) => {
                        const sqlUpdate = "INSERT INTO sql5669328.itemlocation (ItemLocation_id, Quantity, Item_id, Location_id) VALUES ? ON DUPLICATE KEY UPDATE Quantity = values(Quantity);"
                        let rows = []
                        for (let i = 0; i < Items.length; i++) {
                            rows.push([result[0][i].ItemLocation_id, result[0][i].Quantity - Items[i].Quantity, result[0][i].Item_id, result[0][i].Location_id])
                        }
                        await tempCont.promise().query(sqlUpdate, [rows]).then(() => {
                            let sqlInsert = `INSERT INTO sql5669328.orderitems (Order_id, Quantity, Value, ItemLocationFK) VALUES ((SELECT MAX(Order_id) as Order_id FROM claire.order),?,((SELECT FairMarketValue from claire.item WHERE Item_id = ?) * ?),(SELECT ItemLocation_id from claire.itemlocation WHERE Item_id = ? AND Location_id = ?))`
                            for (var i = 0; i < Items.length; i++) {
                                tempCont.query(sqlInsert, [Items[i].Quantity, Items[i].Item_id, Items[i].Quantity, Items[i].Item_id, Location], (err, result) => {
                                    if(err){
                                        console.log(error)
                                        res.sendStatus(500).json({ 'message': error.message })
                                        return
                                    }

                                    else {
                                        return
                                    }
                                })
                            }
                        }).catch(error => {
                            console.log(error)
                            console.log("Error while updating")
                            res.sendStatus(500).json({ 'message': error.message })
                            return
                        })
                    }).catch(error => {
                        console.log(error)
                        console.log("Error while selecting")
                        res.sendStatus(500).json({ 'message': error.message })
                        return
                    })
                }).catch(error => {
                    console.log(error)
                    console.log("Error while inserting")
                    res.sendStatus(500).json({ 'message': error.message })
                    return
                })
            }
            tempCont.release()
            console.log("Distribution creation complete")
            return
        }
    })
}

const distribution_remove = (req, res) => {
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
                const sqlDelete = 'DELETE FROM sql5669328.order WHERE Order_id = ?;'
                tempCont.query(sqlDelete, [id], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('Distribution deleted')
                        res.end()
                        return;
                    }
                })
            }
        }
    })
}



const distribution_view = (req, res) => {
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
                const sqlGet = `
                select o.DeliveryMethod, o.Status, l.Name as Location, Cast(o.RequestDate as char(10)) AS RequestDate, CAST(o.CompletedDate as char(10))AS CompletedDate, p.Name
                from sql5669328.orderitems oi
                join sql5669328.itemlocation il on oi.ItemLocationFK = il.ItemLocation_id
                join sql5669328.order o on oi.Order_id = o.Order_id
                join sql5669328.partner p on o.Partner_id = p.Partner_id
                join sql5669328.location l on l.Location_id = il.Location_id
                where oi.Order_id = ?;
            `;
                tempCont.query(sqlGet, [id], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log('Distribution view data found')
                        res.send(result);
                        res.end()
                        return;
                    }
                })
            }
        }
    })

}

const distribution_itemlist = (req, res) => {
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
                const sqlGet = `
                SELECT oi.Quantity, i.Name as Item, i.FairMarketValue, i.PackageCount
                from sql5669328.orderitems as oi
                join sql5669328.itemlocation il on oi.ItemLocationFK = il. ItemLocation_id
                join sql5669328.item i on i.Item_id = il.Item_id
                where oi.Order_id = ?;
                `;
                tempCont.query(sqlGet, [id], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log('Distribution item list found')
                        res.send(result);
                        res.end()
                        return;
                    }
                })
            }
        }
    })

}

const distribution_edit = (req, res) => {
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
                const sqlGet = `
            select o.Comments, o.DeliveryMethod, Cast(o.RequestDate as char(10)) AS RequestDate, CAST(o.CompletedDate as char(10))AS CompletedDate, o.Partner_id, il.Location_id
            from sql5669328.order o
            join sql5669328.orderitems oi on o.Order_id = oi.Order_id
            join sql5669328.itemlocation il on oi.ItemLocationFK = il.ItemLocation_id
            where o.Order_id = ?; 
            `;
                tempCont.query(sqlGet, [id], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log('Distribution edit data found')
                        res.send(result);
                        res.end()
                        return;
                    }
                })
            }
        }
    })

}

const distribution_edit_items = (req, res) => {
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
                const sqlGet = `
                SELECT oi.Quantity, il.Item_id
                from sql5669328.orderitems as oi
                join sql5669328.itemlocation il on oi.ItemLocationFK = il. ItemLocation_id
                where oi.Order_id = ?;
            `;
                tempCont.query(sqlGet, [id], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log('Distribution edit items found')
                        res.send(result);
                        res.end()
                        return;
                    }
                })
            }
        }
    })

}

const distribution_update = (req, res) => {

    let id = req.params.id
    let Comments = req.body.Comments;
    let DeliveryMethod = req.body.DeliveryMethod;
    let RequestDate = req.body.RequestDate;
    let CompletedDate = req.body.CompletedDate;
    let Partner_id = req.body.Partner_id;

    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            if (typeof id != "string" && typeof Comments != "string" && typeof DeliveryMethod != 'string' && typeof RequestDate != 'string' && typeof CompletedDate != 'string' && typeof Partner_id != 'number') {
                res.send("Invalid");
                console.log("err");
                res.end();
                return;
            }

            if (DeliveryMethod && RequestDate && CompletedDate && Partner_id && id) {
                const sqlUpdate = "UPDATE sql5669328.order SET Comments= ?, DeliveryMethod= ?, RequestDate= ?, CompletedDate= ?, Partner_id= ? WHERE Order_id = ?;"
                tempCont.query(sqlUpdate, [Comments, DeliveryMethod, RequestDate, CompletedDate, Partner_id, id], (err, result) => {
                    tempCont.release();
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log('Distribution update complete')
                        res.send()
                        res.end()
                        return;
                    }
                })
            }
        }
    })


}

const distribution_find_ild = (req, res) => {
    let Items = req.body.Items
    let Location = req.body.Location_id
    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            if (typeof Items != "object" && typeof Location != "string") {
                res.send("Invalid");
                res.end();
                return;
            }

            if (Items && Location) {
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
                        console.log(err)
                    }
                    else {
                        console.log('Distribution itemlocation found')
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
    let Location = req.body.Location_id
    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            if (typeof Items != "object" && typeof Location != "string") {
                res.send("Invalid");
                res.end();
                return;
            }

            if (Items && Location) {
                let ids = []
                Items.forEach(element => {
                    ids.push(element.Item_id);
                });

                const sqlGet = `SELECT il.ItemLocation_id, il.Quantity, i.Name as Item, i.Item_id
                from claire.itemlocation il
                join claire.item i on i.Item_id = il.Item_id
                WHERE il.Item_id IN (?) AND il.Location_id = ?;`


                tempCont.query(sqlGet, [ids, Location], (err, result) => {
                    tempCont.release();
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('Previous item location Quantities have been found')
                        res.send(result);
                        res.end();
                        return;
                    }

                })

            }
        }
    })

}


const distribution_find_value = (req, res) => {
    let Items = req.body.Items
    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
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
                    }
                    else {
                        console.log('Distribution items value been found')
                        res.send(result);
                        res.end();
                        return;
                    }


                })
            }
        }
    })


}

const distribution_find_id = (req, res) => {
    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            const query = "SELECT MAX(Order_id) as Order_id FROM sql5669328.order;"

            tempCont.query(query, (err, result) => {
                tempCont.release();
                if (err) {
                    console.log(err);
                }

                else {
                    console.log('Distribution id found')
                    res.send(result);
                    res.end()
                    return;
                }


            })
        }
    })


}

const distribution_track = (req, res) => {
    let Items = req.body.Items
    let Values = req.body.Values
    let ItemLocationFK = req.body.ItemLocationFK

    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            if (typeof Items != "object" && typeof Values != "object" && typeof ItemLocationFK != "object") {
                res.send("Invalid")
                res.end();
                return;
            }

            if (Items && Values && ItemLocationFK) {
                const sqlInsert = `INSERT INTO sql5669328.orderitems (Order_id, Quantity, Value, ItemLocationFK) VALUES ((SELECT MAX(Order_id) as Order_id FROM sql5669328.order),?,?,?);`
                for (var i = 0; i < Items.length; i++) {
                    let Value = Items[i].Quantity * Values[i].FairMarketValue
                    tempCont.query(sqlInsert, [Items[i].Quantity, Value, ItemLocationFK[i].ItemLocation_id], (err, result) => {

                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log(`${i + 1} out of ${Items.length} has been logged`)
                            res.send();
                            res.end();
                            return;
                        }
                    })
                }
                tempCont.release();

            }
        }
    })



}



const distribution_update_item = (req, res) => {
    let Items = req.body.Items;
    let Location = req.body.Location_id
    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            if (typeof Location != "string" && typeof Items != "object") {
                res.send("Invalid");
                res.end();
                return;
            }

            if (Location && Items) {

                let ids = []
                Items.forEach(element => {
                    ids.push(element.Item_id);
                });

                const sqlGet = `SELECT il.ItemLocation_id
                from sql5669328.itemlocation il
                WHERE il.Item_id IN (?) AND il.Location_id = ?;`

                tempCont.promise().query(sqlGet, [ids, Location]).then((result) => {
                    const sqlUpdate = "UPDATE sql5669328.itemlocation SET Quantity= Quantity - ? WHERE ItemLocation_id = ?;"
                    for (var i = 0; i < Items.length; i++) {
                        tempCont.query(sqlUpdate, [Items[i].Quantity, result[0][i].ItemLocation_id], (err, result) => {

                            if (err) {
                                console.log(err);
                                throw (error)
                            }

                            else {
                                console.log(`${i + 1} out of ${Items.length} locations have been updated`)
                            }

                        })
                    }
                }).catch(error => {
                    console.log(error)
                    throw error
                })


                tempCont.release();
                res.end()
                return;
            }
        }
    })

}

const distribution_complete = (req, res) => {
    let id = req.params.id
    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            if (typeof id != 'string') {
                res.send('Invalid');
                res.end();
                return
            }

            if (id) {
                const sqlUpdate = "UPDATE sql5669328.order SET Status = 'Submitted' WHERE Order_id = ?;"
                tempCont.query(sqlUpdate, [id], (err, result) => {
                    tempCont.release();
                    if (err) {
                        console.log(err);
                    }

                    else {
                        console.log('Status change')
                        res.send()
                        res.end()
                        return;
                    }

                })
            }
        }
    })

}

const distribution_incomplete = (req, res) => {
    let id = req.params.id
    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            if (typeof id != 'string') {
                res.send('Invalid');
                res.end();
                return
            }

            if (id) {
                const sqlUpdate = "UPDATE sql5669328.order SET Status = 'Draft' WHERE Order_id = ?;"
                tempCont.query(sqlUpdate, [id], (err, result) => {
                    tempCont.release();
                    if (err) {
                        console.log(err);
                    }

                    else {
                        console.log('Status change')
                        res.send()
                        res.end()
                        return;
                    }

                })
            }
        }
    })

}

const distribution_cleanup = (req, res) => {
    let id = req.params.id
    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            if (typeof id != 'string') {
                res.send('Invalid');
                res.end();
                return
            }

            if (id) {
                const sqlUpdate = `SELECT oi.Quantity as Given, oi.ItemLocationFK, il.Quantity
                from sql5669328.orderitems as oi
                join sql5669328.itemlocation il on oi.ItemLocationFK = il. ItemLocation_id
                where oi.Order_id = ?;`
                tempCont.query(sqlUpdate, [id], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err)
                    }

                    else {
                        console.log('Clean up data found')
                        res.send(result)
                        res.end()
                        return;
                    }

                })
            }
        }
    })

}

const distribution_reclaim = (req, res) => {
    let records = req.body.records
    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            if (typeof records != "object") {
                res.send("Invalid");
                res.end();
                return;
            }

            if (records) {
                for (let record in records) {
                    Quantity = records[record].Quantity + records[record].Given
                    const sqlUpdate = "UPDATE sql5669328.itemlocation SET Quantity= ? WHERE ItemLocation_id = ?;"
                    tempCont.query(sqlUpdate, [Quantity, records[record].ItemLocationFK], (err, result) => {
                        if (err) {
                            console.log(err);
                        }

                        else {
                            console.log('Reclaiming in progress')
                            res.send()
                            res.end()
                            return;
                        }

                    })
                }
                tempCont.release();
                console.log('Reclaiming is done')

            }
        }
    })


}

const distribution_update_delete = (req, res) => {
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
                return
            }

            if (id) {
                const sqlDelete = "DELETE FROM sql5669328.orderitems WHERE Order_id = ?;"
                tempCont.query(sqlDelete, [id], (err, result) => {
                    tempCont.release();
                    if (err) {
                        console.log(err);
                    }

                    else {
                        console.log('Clean up deletion is done')
                        res.send()
                        res.end()
                        return;
                    }

                })
            }
        }
    })

}

const distribution_print = (req, res) => {
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
                return
            }

            if (id) {
                const sqlGet = `SELECT o.Comments, CAST(o.CompletedDate as char(10))AS CompletedDate, p.Name AS Partner, SUM(oi.Quantity) AS Total, SUM(oi.Value) AS TotalValue
                from sql5669328.order o
                join sql5669328.partner p on o.Partner_id = p.Partner_id
                join sql5669328.orderitems oi on o.Order_id = oi.Order_id
                where o.Order_id = ?;`

                tempCont.query(sqlGet, [id], (err, result) => {
                    tempCont.release();
                    if (err) {
                        console.log(err);
                    }

                    else {
                        console.log('Printing information found')
                        res.send(result)
                        res.end()
                        return;
                    }

                })
            }
        }
    })


}



module.exports = {
    distribution_index,
    distribution_creation,
    distribution_remove,
    distribution_edit,
    distribution_update,
    distribution_find_id,
    distribution_find_ild,
    distribution_find_value,
    distribution_track,
    distribution_update_item,
    distribution_view,
    distribution_complete,
    distribution_incomplete,
    distribution_cleanup,
    distribution_reclaim,
    distribution_itemlist,
    distribution_edit_items,
    distribution_update_delete,
    distribution_print,
    validation
}

/* 
sb.getConnection(function (error, tempCont){
        if(error){
            tempCont.release();
            console.log('Error')
        }
        else{

        }
    })
*/
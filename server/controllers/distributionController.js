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



const distribution_index = async (req, res) => {

    try {
        let sqlGet = `SELECT "Comments", "Status", "DeliveryMethod", "RequestDate", "CompletedDate", distribution."Order_id", partner."Name", SUM(orderitems."Quantity") as Total, location."Name" as Location
        from public.distribution
        join public.partner on distribution."Partner_id" = partner."Partner_id"
        join public.orderitems on distribution."Order_id" = orderitems."Order_id"
        join public.itemlocation on "ItemLocation_id" = "ItemLocationFK"
        join public.location on location."Location_id" = itemlocation."Location_id"
        group by distribution."Order_id", location."Name", partner."Name"`
        const response = await sb.query(sqlGet);
        res.send({ status: 'complete', data: response.rows })
        return
    }
    catch (error) {
        res.sendStatus(500).json({ "message": error.message })
        return
    }

    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else {
    //         console.log('Connected!');

    //         const sqlGet = `
    //         select o.Comments, o.Status, o.DeliveryMethod, Cast(o.RequestDate as char(10)) AS RequestDate, CAST(o.CompletedDate as char(10))AS CompletedDate, o.Order_id, p.Name, SUM(oi.Quantity) as Total, l.Name as Location
    //         from sql5669328.order o
    //         join sql5669328.partner p on o.Partner_id = p.Partner_id 
    //         join sql5669328.orderitems oi on o.Order_id = oi.Order_id
    //         join sql5669328.itemlocation il on oi.ItemLocationFK = il.ItemLocation_id
    //         join sql5669328.location l on l.Location_id = il.Location_id
    //         group by o.Order_id, l.Name;
    //         `;
    //         tempCont.query(sqlGet, (err, result) => {
    //             tempCont.release();
    //             if (err) {
    //                 console.log(err)
    //             }
    //             else {
    //                 console.log('Distribution data found')
    //                 res.send(result);
    //                 res.end()
    //                 return;
    //             }

    //         })
    //     }
    // })
}

const distribution_creation = async (req, res) => {
    let Comments = req.body.Comments;
    let Status = req.body.Status;
    let DeliveryMethod = req.body.DeliveryMethod;
    let RequestDate = req.body.RequestDate;
    let CompletedDate = req.body.CompletedDate;
    let Partner_id = req.body.Partner_id;
    let Items = req.body.Items
    let Location = req.body.Location_id

    if (typeof Comments != "string" && typeof Status != 'string' && typeof DeliveryMethod != 'string' && typeof RequestDate != 'string' && typeof CompletedDate != 'string' && typeof Partner_id != 'number' && typeof Items != "object" && typeof Location != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    try {
        const distributioncreation = `INSERT INTO public.distribution ("Comments", "Status", "DeliveryMethod", "RequestDate", "CompletedDate", "Partner_id") VALUES ('${Comments}', '${Status}', '${DeliveryMethod}', '{${RequestDate}}', '{${CompletedDate}}', ${Partner_id})`
        const createdistribution = await sb.query(distributioncreation)

        let ids = []
        Items.forEach(element => {
            ids.push(element.Item_id);
        });

        let quantities = []
        Items.forEach(element => {
            quantities.push(element.Quantity);
        });

        let sqlGet = `SELECT "FairMarketValue"
        from public.item
        WHERE "Item_id" IN (${ids})`
        const response = await sb.query(sqlGet);
        let valueresults = response.rows
        let values = []

        for (let i = 0; i < Items.length; i++) {
            values.push(Items[i].Quantity * valueresults[i].FairMarketValue)
        }

        const distributiontrack = `INSERT INTO public.orderitems ("Order_id", "Quantity", "Value", "ItemLocationFK")
        SELECT p."Order_id", unnest(array[${quantities}]), unnest(array[${values}]), unnest(t."ItemLocationFK")
        from (SELECT MAX("Order_id") as "Order_id" from public.distribution)p,
             (SELECT array_agg("ItemLocation_id") "ItemLocationFK" from public.itemlocation WHERE "Item_id" IN (${ids}) AND "Location_id" = ${Location})t`
        const trackdistribution = await sb.query(distributiontrack)

        const getitemlocations = `SELECT "ItemLocation_id", "Item_id", "Location_id", "Quantity" from public.itemlocation WHERE "Item_id" IN (${ids}) AND "Location_id" = ${Location}`
        const itemlocations = await sb.query(getitemlocations)
        let results = itemlocations.rows
        let rows = []
        for (let i = 0; i < Items.length; i++) {
            rows[i] = [results[i].ItemLocation_id, results[i].Item_id, results[i].Location_id, results[i].Quantity - parseInt(Items[i].Quantity)]
        }
        for (let i = 0; i < Items.length; i++) {
            const updatelocations = `INSERT INTO public.itemlocation ("ItemLocation_id", "Item_id", "Location_id", "Quantity")
            VALUES (${rows[i]})
            ON CONFLICT ("ItemLocation_id") DO UPDATE
            SET "Quantity" = excluded."Quantity"`
            const locationsupdated = await sb.query(updatelocations)
        }
        res.sendStatus(200)
        res.end();
        return;
    }
    catch (error) {
        console.log(error)
        res.status(500).json(error);
        return;
    }

    // sb.getConnection(async function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.sendStatus(500).json({ 'message': error.message })
    //         return
    //     }

    //     else {
    //         console.log('Connected!')
    //         if (typeof Comments != "string" && typeof Status != 'string' && typeof DeliveryMethod != 'string' && typeof RequestDate != 'string' && typeof CompletedDate != 'string' && typeof Partner_id != 'number' && typeof Items != "object" && typeof Location != "string") {
    //             res.send("Invalid");
    //             res.end();
    //             return;
    //         }

    //         if (DeliveryMethod && RequestDate && CompletedDate && Partner_id && Items && Location) {
    //             let sqlInsert = "INSERT INTO sql5669328.order (Comments, Status, DeliveryMethod, RequestDate, CompletedDate, Partner_id) VALUES (?,?,?,?,?,?);"
    //             await tempCont.promise().query(sqlInsert, [Comments, Status, DeliveryMethod, RequestDate, CompletedDate, Partner_id]).then(async () => {
    //                 let ids = []
    //                 Items.forEach(element => {
    //                     ids.push(element.Item_id);
    //                 });

    //                 const sqlGet = `SELECT il.ItemLocation_id, il.Quantity, il.Item_id, il.Location_id
    //                 from sql5669328.itemlocation il
    //                 WHERE il.Item_id IN (?) AND il.Location_id = ?;`

    //                 await tempCont.promise().query(sqlGet, [ids, Location]).then(async (result) => {
    //                     const sqlUpdate = "INSERT INTO sql5669328.itemlocation (ItemLocation_id, Quantity, Item_id, Location_id) VALUES ? ON DUPLICATE KEY UPDATE Quantity = values(Quantity);"
    //                     let rows = []
    //                     for (let i = 0; i < Items.length; i++) {
    //                         rows.push([result[0][i].ItemLocation_id, result[0][i].Quantity - Items[i].Quantity, result[0][i].Item_id, result[0][i].Location_id])
    //                     }
    //                     await tempCont.promise().query(sqlUpdate, [rows]).then(() => {
    //                         let sqlInsert = `INSERT INTO sql5669328.orderitems (Order_id, Quantity, Value, ItemLocationFK) VALUES ((SELECT MAX(Order_id) as Order_id FROM sql5669328.order),?,((SELECT FairMarketValue from sql5669328.item WHERE Item_id = ?) * ?),(SELECT ItemLocation_id from sql5669328.itemlocation WHERE Item_id = ? AND Location_id = ?))`
    //                         for (var i = 0; i < Items.length; i++) {
    //                             tempCont.query(sqlInsert, [Items[i].Quantity, Items[i].Item_id, Items[i].Quantity, Items[i].Item_id, Location], (err, result) => {
    //                                 if(err){
    //                                     console.log(error)
    //                                     res.sendStatus(500).json({ 'message': error.message })
    //                                     return
    //                                 }

    //                                 else {
    //                                     return
    //                                 }
    //                             })
    //                         }
    //                     }).catch(error => {
    //                         console.log(error)
    //                         console.log("Error while updating")
    //                         res.sendStatus(500).json({ 'message': error.message })
    //                         return
    //                     })
    //                 }).catch(error => {
    //                     console.log(error)
    //                     console.log("Error while selecting")
    //                     res.sendStatus(500).json({ 'message': error.message })
    //                     return
    //                 })
    //             }).catch(error => {
    //                 console.log(error)
    //                 console.log("Error while inserting")
    //                 res.sendStatus(500).json({ 'message': error.message })
    //                 return
    //             })
    //         }
    //         tempCont.release()
    //         console.log("Distribution creation complete")
    //         return
    //     }
    // })
}

const distribution_remove = (req, res) => {
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
    //             const sqlDelete = 'DELETE FROM sql5669328.order WHERE Order_id = ?;'
    //             tempCont.query(sqlDelete, [id], (err, result) => {
    //                 tempCont.release()
    //                 if (err) {
    //                     console.log(err);
    //                 }
    //                 else {
    //                     console.log('Distribution deleted')
    //                     res.end()
    //                     return;
    //                 }
    //             })
    //         }
    //     }
    // })
}



const distribution_view = async (req, res) => {
    let id = req.params.id

    if (typeof id != "string") {
        res.sendStatus(400)
        res.end();
        return;
    }

    if (id) {
        try {
            let sqlGet = `SELECT "Status", "DeliveryMethod", "RequestDate", "CompletedDate", partner."Name", location."Name" as "Location"
            from public.distribution
            join public.partner on distribution."Partner_id" = partner."Partner_id"
            join public.orderitems on distribution."Order_id" = orderitems."Order_id"
            join public.itemlocation on "ItemLocation_id" = "ItemLocationFK"
            join public.location on location."Location_id" = itemlocation."Location_id"
            WHERE distribution."Order_id" = ${id}`
            const response = await sb.query(sqlGet);
            res.send({ status: 'complete', data: response.rows })
            return
        }
        catch (error) {
            res.sendStatus(500).json({ "message": error.message })
            return
        }
    }

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
    //             const sqlGet = `
    //             select o.DeliveryMethod, o.Status, l.Name as Location, Cast(o.RequestDate as char(10)) AS RequestDate, CAST(o.CompletedDate as char(10))AS CompletedDate, p.Name
    //             from sql5669328.orderitems oi
    //             join sql5669328.itemlocation il on oi.ItemLocationFK = il.ItemLocation_id
    //             join sql5669328.order o on oi.Order_id = o.Order_id
    //             join sql5669328.partner p on o.Partner_id = p.Partner_id
    //             join sql5669328.location l on l.Location_id = il.Location_id
    //             where oi.Order_id = ?;
    //         `;
    //             tempCont.query(sqlGet, [id], (err, result) => {
    //                 tempCont.release()
    //                 if (err) {
    //                     console.log(err)
    //                 }
    //                 else {
    //                     console.log('Distribution view data found')
    //                     res.send(result);
    //                     res.end()
    //                     return;
    //                 }
    //             })
    //         }
    //     }
    // })

}

const distribution_itemlist = async (req, res) => {
    let id = req.params.id

    if (typeof id != "string") {
        res.sendStatus(400)
        res.end();
        return;
    }

    if (id) {
        try {
            let sqlGet = `SELECT orderitems."Quantity", item."Name" as "Item", "FairMarketValue", "Package Count"
            from public.orderitems
            join public.itemlocation on "ItemLocation_id" = "ItemLocationFK"
            join public.item on item."Item_id" = itemlocation."Item_id"
            WHERE orderitems."Order_id" = ${id}`
            const response = await sb.query(sqlGet);
            res.send({ status: 'complete', data: response.rows })
            return
        }
        catch (error) {
            res.sendStatus(500).json({ "message": error.message })
            return
        }
    }

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
    //             const sqlGet = `
    //             SELECT oi.Quantity, i.Name as Item, i.FairMarketValue, i.PackageCount
    //             from sql5669328.orderitems as oi
    //             join sql5669328.itemlocation il on oi.ItemLocationFK = il. ItemLocation_id
    //             join sql5669328.item i on i.Item_id = il.Item_id
    //             where oi.Order_id = ?;
    //             `;
    //             tempCont.query(sqlGet, [id], (err, result) => {
    //                 tempCont.release()
    //                 if (err) {
    //                     console.log(err)
    //                 }
    //                 else {
    //                     console.log('Distribution item list found')
    //                     res.send(result);
    //                     res.end()
    //                     return;
    //                 }
    //             })
    //         }
    //     }
    // })

}

const distribution_edit = async (req, res) => {
    let id = req.params.id

    if (typeof id != "string") {
        res.sendStatus(400)
        res.end();
        return;
    }

    if (id) {
        try {
            let sqlGet = `SELECT "Comments", "DeliveryMethod", TO_CHAR("RequestDate", 'yyyy-mm-dd') as "RequestDate", TO_CHAR("CompletedDate", 'yyyy-mm-dd') as "CompletedDate", distribution."Partner_id", itemlocation."Location_id"
            from public.distribution
            join public.orderitems on distribution."Order_id" = orderitems."Order_id"
            join public.itemlocation on "ItemLocation_id" = "ItemLocationFK"
            WHERE distribution."Order_id" = ${id}`
            const response = await sb.query(sqlGet);
            res.send({ status: 'complete', data: response.rows })
            return
        }
        catch (error) {
            res.sendStatus(500).json({ "message": error.message })
            return
        }
    }

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
    //             const sqlGet = `
    //         select o.Comments, o.DeliveryMethod, Cast(o.RequestDate as char(10)) AS RequestDate, CAST(o.CompletedDate as char(10))AS CompletedDate, o.Partner_id, il.Location_id
    //         from sql5669328.order o
    //         join sql5669328.orderitems oi on o.Order_id = oi.Order_id
    //         join sql5669328.itemlocation il on oi.ItemLocationFK = il.ItemLocation_id
    //         where o.Order_id = ?; 
    //         `;
    //             tempCont.query(sqlGet, [id], (err, result) => {
    //                 tempCont.release()
    //                 if (err) {
    //                     console.log(err)
    //                 }
    //                 else {
    //                     console.log('Distribution edit data found')
    //                     res.send(result);
    //                     res.end()
    //                     return;
    //                 }
    //             })
    //         }
    //     }
    // })

}

const distribution_edit_items = async (req, res) => {
    let id = req.params.id

    if (typeof id != "string") {
        res.sendStatus(400)
        res.end();
        return;
    }

    if (id) {
        try {
            let sqlGet = `SELECT orderitems."Quantity", itemlocation."Item_id" as "Item"
            from public.orderitems
            join public.itemlocation on "ItemLocationFK" = "ItemLocation_id"
            WHERE orderitems."Order_id" = ${id}`
            const response = await sb.query(sqlGet);
            res.send({ status: 'complete', data: response.rows })
            return
        }
        catch (error) {
            res.sendStatus(500).json({ "message": error.message })
            return
        }
    }

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
    //             const sqlGet = `
    //             SELECT oi.Quantity, il.Item_id
    //             from sql5669328.orderitems as oi
    //             join sql5669328.itemlocation il on oi.ItemLocationFK = il. ItemLocation_id
    //             where oi.Order_id = ?;
    //         `;
    //             tempCont.query(sqlGet, [id], (err, result) => {
    //                 tempCont.release()
    //                 if (err) {
    //                     console.log(err)
    //                 }
    //                 else {
    //                     console.log('Distribution edit items found')
    //                     res.send(result);
    //                     res.end()
    //                     return;
    //                 }
    //             })
    //         }
    //     }
    // })

}

const distribution_update = (req, res) => {

    let id = req.params.id
    let Comments = req.body.Comments;
    let DeliveryMethod = req.body.DeliveryMethod;
    let RequestDate = req.body.RequestDate;
    let CompletedDate = req.body.CompletedDate;
    let Partner_id = req.body.Partner_id;

    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else {
    //         if (typeof id != "string" && typeof Comments != "string" && typeof DeliveryMethod != 'string' && typeof RequestDate != 'string' && typeof CompletedDate != 'string' && typeof Partner_id != 'number') {
    //             res.send("Invalid");
    //             console.log("err");
    //             res.end();
    //             return;
    //         }

    //         if (DeliveryMethod && RequestDate && CompletedDate && Partner_id && id) {
    //             const sqlUpdate = "UPDATE sql5669328.order SET Comments= ?, DeliveryMethod= ?, RequestDate= ?, CompletedDate= ?, Partner_id= ? WHERE Order_id = ?;"
    //             tempCont.query(sqlUpdate, [Comments, DeliveryMethod, RequestDate, CompletedDate, Partner_id, id], (err, result) => {
    //                 tempCont.release();
    //                 if (err) {
    //                     console.log(err)
    //                 }
    //                 else {
    //                     console.log('Distribution update complete')
    //                     res.send()
    //                     res.end()
    //                     return;
    //                 }
    //             })
    //         }
    //     }
    // })


}

const distribution_find_ild = async (req, res) => {
    let Items = req.body.Items
    let Location = req.body.Location_id

    if (typeof Items != "object" && typeof Location != "string") {
        res.sendStatus(400)
        res.end();
        return;
    }

    if (Items && Location) {
        try {
            let ids = []
            Items.forEach(element => {
                ids.push(element.Item_id);
            });

            let sqlGet = `SELECT "ItemLocation_id"
            from public.itemlocation
            WHERE "Item_id" IN (${ids}) AND "Location_id" = ${Location}`
            const response = await sb.query(sqlGet);
            res.send({ status: 'complete', data: response.rows })
            return
        } catch (error) {
            res.send({ status: 'error', message: error.message })
            return
        }
    }

    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else {
    //         if (typeof Items != "object" && typeof Location != "string") {
    //             res.send("Invalid");
    //             res.end();
    //             return;
    //         }

    //         if (Items && Location) {
    //             let ids = []
    //             Items.forEach(element => {
    //                 ids.push(element.Item_id);
    //             });

    //             const sqlGet = `SELECT il.ItemLocation_id
    //             from sql5669328.itemlocation il
    //             WHERE il.Item_id IN (?) AND il.Location_id = ?;`

    //             tempCont.query(sqlGet, [ids, Location], (err, result) => {
    //                 tempCont.release()
    //                 if (err) {
    //                     console.log(err)
    //                 }
    //                 else {
    //                     console.log('Distribution itemlocation found')
    //                     res.send(result);
    //                     res.end();
    //                     return;
    //                 }
    //             })

    //         }
    //     }
    // })



}

const validation = async (req, res) => {
    let Items = req.body.Items
    let Location = req.body.Location_id

    if (typeof Items != "object" && typeof Location != "string") {
        res.sendStatus(400)
        res.end();
        return;
    }

    if (Items && Location) {
        try {
            let ids = []
            Items.forEach(element => {
                ids.push(element.Item_id);
            });

            let sqlGet = `SELECT "ItemLocation_id", "Quantity", item."Name" as "Item", item."Item_id"
            from public.itemlocation
            join public.item on itemlocation."Item_id" = item."Item_id"
            WHERE itemlocation."Item_id" IN (${ids}) AND itemlocation."Location_id" = ${Location}`
            const response = await sb.query(sqlGet);
            res.send({ status: 'complete', data: response.rows })
            return
        } catch (error) {
            res.sendStatus(500).json({ "message": error.message })
            return
        }
    }

    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else {
    //         if (typeof Items != "object" && typeof Location != "string") {
    //             res.send("Invalid");
    //             res.end();
    //             return;
    //         }

    //         if (Items && Location) {
    //             let ids = []
    //             Items.forEach(element => {
    //                 ids.push(element.Item_id);
    //             });

    //             const sqlGet = `SELECT il.ItemLocation_id, il.Quantity, i.Name as Item, i.Item_id
    //             from sql5669328.itemlocation il
    //             join sql5669328.item i on i.Item_id = il.Item_id
    //             WHERE il.Item_id IN (?) AND il.Location_id = ?;`


    //             tempCont.query(sqlGet, [ids, Location], (err, result) => {
    //                 tempCont.release();
    //                 if (err) {
    //                     console.log(err);
    //                 }
    //                 else {
    //                     console.log('Previous item location Quantities have been found')
    //                     res.send(result);
    //                     res.end();
    //                     return;
    //                 }

    //             })

    //         }
    //     }
    // })

}


const distribution_find_value = async (req, res) => {
    let Items = req.body.Items

    if (typeof Items != "object") {
        res.sendStatus(400)
        res.end();
        return;
    }

    if (Items) {
        try {
            let ids = []
            Items.forEach(element => {
                ids.push(element.Item_id);
            });

            let sqlGet = `SELECT "FairMarketValue"
            from public.item
            WHERE "Item_id" IN (${ids})`
            const response = await sb.query(sqlGet);
            res.send({ status: 'complete', data: response.rows })
            return
        } catch (error) {
            res.send({ status: 'error', message: error.message })
            return
        }
    }

    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else {
    //         if (typeof Items != "object") {
    //             res.send("Invalid")
    //             res.end();
    //             return;
    //         }

    //         if (Items) {
    //             let ids = []
    //             Items.forEach(element => {
    //                 ids.push(element.Item_id);
    //             });
    //             const sqlGet = `SELECT i.FairMarketValue
    //             from sql5669328.item i
    //             WHERE i.Item_id IN (?);`


    //             tempCont.query(sqlGet, [ids], (err, result) => {
    //                 tempCont.release()
    //                 if (err) {
    //                     console.log(err);
    //                 }
    //                 else {
    //                     console.log('Distribution items value been found')
    //                     res.send(result);
    //                     res.end();
    //                     return;
    //                 }


    //             })
    //         }
    //     }
    // })


}

const distribution_find_id = async (req, res) => {

    try {
        let sqlGet = `SELECT MAX("Order_id") as "Order_id"
        from public.distribution`
        const response = await sb.query(sqlGet);
        res.send({ status: 'complete', data: response.rows })
        return
    }
    catch (error) {
        res.sendStatus(500).json({ "message": error.message })
        return
    }

    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else {
    //         const query = "SELECT MAX(Order_id) as Order_id FROM sql5669328.order;"

    //         tempCont.query(query, (err, result) => {
    //             tempCont.release();
    //             if (err) {
    //                 console.log(err);
    //             }

    //             else {
    //                 console.log('Distribution id found')
    //                 res.send(result);
    //                 res.end()
    //                 return;
    //             }


    //         })
    //     }
    // })


}

const distribution_track = (req, res) => {
    let Items = req.body.Items
    let Values = req.body.Values
    let ItemLocationFK = req.body.ItemLocationFK

    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else {
    //         if (typeof Items != "object" && typeof Values != "object" && typeof ItemLocationFK != "object") {
    //             res.send("Invalid")
    //             res.end();
    //             return;
    //         }

    //         if (Items && Values && ItemLocationFK) {
    //             const sqlInsert = `INSERT INTO sql5669328.orderitems (Order_id, Quantity, Value, ItemLocationFK) VALUES ((SELECT MAX(Order_id) as Order_id FROM sql5669328.order),?,?,?);`
    //             for (var i = 0; i < Items.length; i++) {
    //                 let Value = Items[i].Quantity * Values[i].FairMarketValue
    //                 tempCont.query(sqlInsert, [Items[i].Quantity, Value, ItemLocationFK[i].ItemLocation_id], (err, result) => {

    //                     if (err) {
    //                         console.log(err);
    //                     }
    //                     else {
    //                         console.log(`${i + 1} out of ${Items.length} has been logged`)
    //                         res.send();
    //                         res.end();
    //                         return;
    //                     }
    //                 })
    //             }
    //             tempCont.release();

    //         }
    //     }
    // })



}



const distribution_update_item = (req, res) => {
    let Items = req.body.Items;
    let Location = req.body.Location_id
    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else {
    //         if (typeof Location != "string" && typeof Items != "object") {
    //             res.send("Invalid");
    //             res.end();
    //             return;
    //         }

    //         if (Location && Items) {

    //             let ids = []
    //             Items.forEach(element => {
    //                 ids.push(element.Item_id);
    //             });

    //             const sqlGet = `SELECT il.ItemLocation_id
    //             from sql5669328.itemlocation il
    //             WHERE il.Item_id IN (?) AND il.Location_id = ?;`

    //             tempCont.promise().query(sqlGet, [ids, Location]).then((result) => {
    //                 const sqlUpdate = "UPDATE sql5669328.itemlocation SET Quantity= Quantity - ? WHERE ItemLocation_id = ?;"
    //                 for (var i = 0; i < Items.length; i++) {
    //                     tempCont.query(sqlUpdate, [Items[i].Quantity, result[0][i].ItemLocation_id], (err, result) => {

    //                         if (err) {
    //                             console.log(err);
    //                             throw (error)
    //                         }

    //                         else {
    //                             console.log(`${i + 1} out of ${Items.length} locations have been updated`)
    //                         }

    //                     })
    //                 }
    //             }).catch(error => {
    //                 console.log(error)
    //                 throw error
    //             })


    //             tempCont.release();
    //             res.end()
    //             return;
    //         }
    //     }
    // })

}

const distribution_complete = (req, res) => {
    let id = req.params.id
    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else {
    //         if (typeof id != 'string') {
    //             res.send('Invalid');
    //             res.end();
    //             return
    //         }

    //         if (id) {
    //             const sqlUpdate = "UPDATE sql5669328.order SET Status = 'Submitted' WHERE Order_id = ?;"
    //             tempCont.query(sqlUpdate, [id], (err, result) => {
    //                 tempCont.release();
    //                 if (err) {
    //                     console.log(err);
    //                 }

    //                 else {
    //                     console.log('Status change')
    //                     res.send()
    //                     res.end()
    //                     return;
    //                 }

    //             })
    //         }
    //     }
    // })

}

const distribution_incomplete = (req, res) => {
    let id = req.params.id
    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else {
    //         if (typeof id != 'string') {
    //             res.send('Invalid');
    //             res.end();
    //             return
    //         }

    //         if (id) {
    //             const sqlUpdate = "UPDATE sql5669328.order SET Status = 'Draft' WHERE Order_id = ?;"
    //             tempCont.query(sqlUpdate, [id], (err, result) => {
    //                 tempCont.release();
    //                 if (err) {
    //                     console.log(err);
    //                 }

    //                 else {
    //                     console.log('Status change')
    //                     res.send()
    //                     res.end()
    //                     return;
    //                 }

    //             })
    //         }
    //     }
    // })

}

const distribution_cleanup = async (req, res) => {
    let id = req.params.id

    if (typeof id != "string") {
        res.sendStatus(400)
        res.end();
        return;
    }

    if (id) {
        try {
            let sqlGet = `SELECT orderitems."Quantity" as "Given", orderitems."ItemLocationFK", itemlocation."Quantity"
            from public.orderitems
            join public.itemlocation on "ItemLocationFK" = "ItemLocation_id"
            WHERE orderitems."Order_id" = ${id}`
            const response = await sb.query(sqlGet);
            res.send({ status: 'complete', data: response.rows })
            return
        }
        catch (error) {
            res.sendStatus(500).json({ "message": error.message })
            return
        }
    }

    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else {
    //         if (typeof id != 'string') {
    //             res.send('Invalid');
    //             res.end();
    //             return
    //         }

    //         if (id) {
    //             const sqlUpdate = `SELECT oi.Quantity as Given, oi.ItemLocationFK, il.Quantity
    //             from sql5669328.orderitems as oi
    //             join sql5669328.itemlocation il on oi.ItemLocationFK = il. ItemLocation_id
    //             where oi.Order_id = ?;`
    //             tempCont.query(sqlUpdate, [id], (err, result) => {
    //                 tempCont.release()
    //                 if (err) {
    //                     console.log(err)
    //                 }

    //                 else {
    //                     console.log('Clean up data found')
    //                     res.send(result)
    //                     res.end()
    //                     return;
    //                 }

    //             })
    //         }
    //     }
    // })

}

const distribution_reclaim = (req, res) => {
    let records = req.body.records
    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else {
    //         if (typeof records != "object") {
    //             res.send("Invalid");
    //             res.end();
    //             return;
    //         }

    //         if (records) {
    //             for (let record in records) {
    //                 Quantity = records[record].Quantity + records[record].Given
    //                 const sqlUpdate = "UPDATE sql5669328.itemlocation SET Quantity= ? WHERE ItemLocation_id = ?;"
    //                 tempCont.query(sqlUpdate, [Quantity, records[record].ItemLocationFK], (err, result) => {
    //                     if (err) {
    //                         console.log(err);
    //                     }

    //                     else {
    //                         console.log('Reclaiming in progress')
    //                         res.send()
    //                         res.end()
    //                         return;
    //                     }

    //                 })
    //             }
    //             tempCont.release();
    //             console.log('Reclaiming is done')

    //         }
    //     }
    // })


}

const distribution_update_delete = (req, res) => {
    let id = req.params.id
    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else {
    //         if (typeof id != "string") {
    //             res.send("Invalid");
    //             res.end();
    //             return
    //         }

    //         if (id) {
    //             const sqlDelete = "DELETE FROM sql5669328.orderitems WHERE Order_id = ?;"
    //             tempCont.query(sqlDelete, [id], (err, result) => {
    //                 tempCont.release();
    //                 if (err) {
    //                     console.log(err);
    //                 }

    //                 else {
    //                     console.log('Clean up deletion is done')
    //                     res.send()
    //                     res.end()
    //                     return;
    //                 }

    //             })
    //         }
    //     }
    // })

}

const distribution_print = async (req, res) => {
    let id = req.params.id
    /* Add the total amount distributed to that specific partner */
    if (typeof id != "string") {
        res.sendStatus(400)
        res.end();
        return;
    }

    if (id) {
        try {
            let sqlGet = `SELECT "Comments", "CompletedDate", partner."Name" as "Partner", SUM(orderitems."Quantity") AS "Total", SUM(orderitems."Value") AS "TotalValue"
            from public.distribution
            join public.partner on distribution."Partner_id" = partner."Partner_id"
            join public.orderitems on distribution."Order_id" = orderitems."Order_id
            where distribution."Order_id" = ${id}`
            const response = await sb.query(sqlGet);
            res.send({ status: 'complete', data: response.rows })
            return
        }
        catch (error) {
            res.sendStatus(500).json({ "message": error.message })
            return
        }
    }

    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else {
    //         if (typeof id != "string") {
    //             res.send("Invalid");
    //             res.end();
    //             return
    //         }

    //         if (id) {
    //             const sqlGet = `SELECT o.Comments, CAST(o.CompletedDate as char(10))AS CompletedDate, p.Name AS Partner, SUM(oi.Quantity) AS Total, SUM(oi.Value) AS TotalValue
    //             from sql5669328.order o
    //             join sql5669328.partner p on o.Partner_id = p.Partner_id
    //             join sql5669328.orderitems oi on o.Order_id = oi.Order_id
    //             where o.Order_id = ?;`

    //             tempCont.query(sqlGet, [id], (err, result) => {
    //                 tempCont.release();
    //                 if (err) {
    //                     console.log(err);
    //                 }

    //                 else {
    //                     console.log('Printing information found')
    //                     res.send(result)
    //                     res.end()
    //                     return;
    //                 }

    //             })
    //         }
    //     }
    // })


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
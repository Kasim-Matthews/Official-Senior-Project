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


const data = async (req, res) => {
    try {
        let sqlGet = `SELECT partner."Name", intake."Comments", "RecievedDate", "TotalValue", intake."Intake_id", SUM(intakeitems."Quantity") as "TotalItems", location."Name" as "Location"
        from public.intake
        join public.partner on "Partner" = "Partner_id"
        join public.partnertype on "Type_id" = "PartnerType_id"
        join public.intakeitems on "Intake" = "Intake_id"
        join public.itemlocation on "FKItemLocation" = "ItemLocation_id"
        join public.location on itemlocation."Location_id" = location."Location_id"
        WHERE partnertype."Type" = 'Vendor'
        group by intake."Intake_id", location."Name", partner."Name"`
        const response = await sb.query(sqlGet);
        res.send({ status: 'complete', data: response.rows })
        return
    }
    catch (error) {
        res.sendStatus(500).json({ "message": error.message })
        return
    }
    /*sb.getConnection(function (error, tempCont) {
        if (error) {
            console.log('Error')
            res.status(500).json({'message': error.message})
        }
        else {
            const sqlGet = `
            select p.Name, i.Comments as Comments, Cast(i.RecievedDate as char(10)) as RecievedDate, i.TotalValue as Total, i.Intake_id, SUM(ii.Quantity) as TotalItems, l.Name as Location
            from sql5669328.intake i
            join sql5669328.partner p on i.Partner = p.Partner_id
            join sql5669328.partnertype pt on p.Type = pt.PartnerType_id
            join sql5669328.intakeitems ii on i.Intake_id = ii.Intake_id
            join sql5669328.itemlocation il on ii.FKItemLocation = il.ItemLocation_id
            join sql5669328.location l on il.Location_id = l.Location_id
            WHERE pt.Type = "Vendor"
            group by i.Intake_id, l.Name
            `;
            tempCont.query(sqlGet, (err, result) => {
                tempCont.release()
                if (err) {
                    console.log(err)
                    return
                }

                else {
                    console.log("Purchase data found")
                    res.send(result);
                    res.end();
                    return;
                }

            })
        }
    })*/

}

const create = async (req, res) => {

    let Comments = req.body.Comments;
    let RecievedDate = req.body.Purchase_date;
    let Total = req.body.Total;
    let Partner = req.body.Vendor;
    let Items = req.body.Items
    let Location = req.body.Location_id

    if (typeof Comments != "string" && typeof RecievedDate != "string" && typeof Total != "number" && typeof Partner != "number" && typeof Items != "object" && typeof Location != "string") {
        res.sendStatus(400)
        res.end();
        return;
    }

    try {
        // const purchasecreation = `INSERT INTO public.intake ("Comments", "RecievedDate", "TotalValue", "Partner") VALUES ('${Comments}', '{${RecievedDate}}', ${Total}, ${Partner})`
        // const createpurchase = await sb.query(purchasecreation)

        let ids = []
        Items.forEach(element => {
            ids.push(element.Item_id);
        });

        // let quantities = []
        // Items.forEach(element => {
        //     quantities.push(element.Quantity);
        // });

        // const purchasetrack = `INSERT INTO public.intakeitems ("Intake", "Quantity", "Value", "FKItemLocation")
        // SELECT p."Intake_id", unnest(array[${quantities}]), ${Total}, unnest(t."FKItemLocation")
        // from (SELECT MAX("Intake_id") as "Intake_id" from public.intake)p,
        //      (SELECT array_agg("ItemLocation_id") "FKItemLocation" from public.itemlocation WHERE "Item_id" IN (${ids}) AND "Location_id" = ${Location})t`
        // const trackpurchase = await sb.query(purchasetrack)

        const getitemlocations = `SELECT "ItemLocation_id", "Item_id", "Location_id", "Quantity" from public.itemlocation WHERE "Item_id" IN (${ids}) AND "Location_id" = ${Location}`
        const itemlocations = await sb.query(getitemlocations)
        let results = itemlocations.rows
        let rows = []
        for (let i = 0; i < Items.lenght; i++) {
            rows[i] = results[i].ItemLocation_id, results[i].Item_id, results[i].Location_id, results[i].Quantity + parseInt(Items[i].Quantity)
            console.log(rows)
            console.log(results[i].ItemLocation_id, results[i].Item_id, results[i].Location_id, results[i].Quantity + parseInt(Items[i].Quantity))
        }
        console.log(Items)
        console.log(results[0].Quantity + parseInt(Items[0].Quantity))
        // const updatelocations = `INSERT INTO public.itemlocation ("ItemLocation_id", "Item_id", "Location_id", "Quantity")
        // VALUES ${rows}
        // ON CONFLICT ("ItemLocation_id") DO UPDATE
        // SET "Quantity" = excluded."Quantity"`
        // const locationsupdated = await sb.query(updatelocations)
        
        res.sendStatus(200)
        res.end();
        return;
    }
    catch (error) {
        console.log(error)
        res.status(500).json(error);
        return;
    }

    /*sb.getConnection(function (error, tempCont) {
        if (error) {
            console.log('Error')
            res.status(500).json({'message': error.message})
        }
        else {
            if (typeof Comments != "string" && typeof RecievedDate != "string" && typeof Total != "number" && typeof Partner != "number") {
                res.send("Invalid");
                res.end();
                return;
            }

            if (Partner && RecievedDate && Total) {
                const sqlInsert = "INSERT INTO sql5669328.intake (Comments, RecievedDate, TotalValue, Partner) VALUES (?,?,?,?);"
                tempCont.query(sqlInsert, [Comments, RecievedDate, Total, Partner], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err);
                        return
                    }

                    else {
                        console.log("Purchase log created")
                        res.send()
                        res.end()
                        return;
                    }

                })
            }
        }
    })*/

}

const location = async (req, res) => {
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
    /*sb.getConnection(function (error, tempCont) {
        if (error) {
            console.log('Error')
            res.status(500).json({'message': error.message})
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
                        console.log(err);
                        return
                    }

                    else {
                        console.log("Locations found for purchases")
                        res.send(result);
                        res.end();
                        return;
                    }

                })

            }
        }
    })*/

}

const find_id = async (req, res) => {
    try {
        let sqlGet = `SELECT MAX("Intake_id") as Intake_id
        from public.intake`
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
    //         const query = "SELECT MAX(Intake_id) as Intake_id FROM sql5669328.intake;"

    //         tempCont.query(query, (err, result) => {
    //             tempCont.release()
    //             if (err) {
    //                 console.log(err)
    //                 return
    //             }

    //             else {
    //                 console.log("Latest purchase id found")
    //                 res.send(result);
    //                 res.end()
    //                 return;
    //             }

    //         })
    //     }
    // })

}

const track = (req, res) => {
    let Items = req.body.Items;
    let Value = req.body.Total;
    let FKItemLocation = req.body.FKItemLocation;

    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else {
    //         if (typeof Items != "object" && typeof Value != "number" && typeof FKItemLocation != "object") {
    //             res.send("Invalid")
    //             res.end();
    //             return
    //         }

    //         if (Items && Value && FKItemLocation) {
    //             const sqlInsert = "INSERT INTO sql5669328.intakeitems (Intake_id, Quantity, Value, FKItemLocation) VALUES ((SELECT MAX(Intake_id) as Intake_id FROM sql5669328.intake),?,?,?);"
    //             for (var i = 0; i < Items.length; i++) {
    //                 tempCont.query(sqlInsert, [Items[i].Quantity, Value, FKItemLocation[i].ItemLocation_id], (err, result) => {
    //                     if (err) {
    //                         console.log(err);
    //                         return
    //                     }

    //                     else {
    //                         console.log(`${i + 1} out of ${Items.length} purchase items logged`)
    //                         res.send()
    //                         res.end()
    //                         return;
    //                     }


    //                 })
    //             }
    //             console.log("Tracking process complete")
    //             tempCont.release()


    //         }
    //     }
    // })

}



const update_item = (req, res) => {
    let ItemLocationFK = req.body.ItemLocationFK;
    let Items = req.body.Items;

    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else {
    //         if (typeof ItemLocationFK != "object" && typeof Quantity != "object") {
    //             res.send("Invalid");
    //             res.end();
    //             return;
    //         }

    //         if (ItemLocationFK && Items) {
    //             const sqlUpdate = "UPDATE sql5669328.itemlocation SET Quantity= Quantity + ? WHERE ItemLocation_id = ?;"
    //             for (var i = 0; i < Items.length; i++) {
    //                 tempCont.query(sqlUpdate, [Items[i].Quantity, ItemLocationFK[i].ItemLocation_id], (err, result) => {
    //                     if (err) {
    //                         console.log(err);
    //                         return
    //                     }

    //                     else {
    //                         console.log("Updating location quantities")
    //                         res.send()
    //                         res.end()
    //                         return;
    //                     }

    //                 })
    //             }
    //             console.log("Updating location quantities complete");
    //             tempCont.release()

    //         }
    //     }
    // })

}

const purchase_view = async (req, res) => {
    let id = req.params.id

    if (typeof id != "string") {
        res.sendStatus(400)
        res.end();
        return;
    }

    if (id) {
        try {
            let sqlGet = `SELECT "RecievedDate" as PurchaseDate, partner."Name" as Vendor, item."Name" as Item, location."Name" as Location, intakeitems."Quantity"
            from public.inatkeitems
            join public.itemlocation on "FKItemLocation" = "ItemLocation_id"
            join public.intake on "Intake" = "Intake_id"
            join public.item on item."Item_id" = itemlocation."Item_id"
            join public.location on location."Location_id" = itemlocation."Location_id"
            join public.partner on intake."Partner" = partner."Partner_id"
            WHERE intakeitems."Intake" = ${id}`
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
    //         select Cast(i.RecievedDate as char(10)) as PurchaseDate, p.Name as Vendor, it.Name as Item, l.Name as Location, ii.Quantity
    //         from sql5669328.intakeitems ii
    //         join sql5669328.itemlocation il on ii.FKItemLocation = il.ItemLocation_id
    //         join sql5669328.intake i on ii.Intake_id = i.Intake_id
    //         join sql5669328.item it on it.Item_id = il.Item_id
    //         join sql5669328.location l on l.Location_id = il.Location_id
    //         join sql5669328.partner p on i.Partner = p.Partner_id
    //         where ii.Intake_id = ?; 
    //         `;
    //             tempCont.query(sqlGet, [id], (err, result) => {
    //                 if (err) {
    //                     console.log(err)
    //                     return
    //                 }

    //                 else {
    //                     console.log("Purchase view data found")
    //                     res.send(result);
    //                     res.end();
    //                     return
    //                 }

    //             })
    //         }
    //     }
    // })

}

const edit = async (req, res) => {
    let id = req.params.id

    if (typeof id != "string") {
        res.sendStatus(400)
        res.end();
        return;
    }

    if (id) {
        try {
            let sqlGet = `SELECT "Comments", "TotalValue", "RecievedDate" as PurchaseDate, "Partner" as Vendor, itemlocation."Location_id" as Location
            from public.intake
            join public.intakeitems on "Intake" = "Intake_id"
            join public.itemlocation on "FKItemLocation" = "ItemLocation_id"
            WHERE intake."Intake_id" = ${id}`
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
    //         select i.Comments, i.TotalValue, Cast(i.RecievedDate as char(10)) AS PurchaseDate, i.Partner as Vendor, il.Location_id as Location
    //         from sql5669328.intake i
    //         join sql5669328.intakeitems ii on i.Intake_id = ii.Intake_id
    //         join sql5669328.itemlocation il on ii.FKItemLocation = il.ItemLocation_id
    //         where i.Intake_id = ?; 
    //         `;
    //             tempCont.query(sqlGet, [id], (err, result) => {
    //                 tempCont.release()
    //                 if (err) {
    //                     console.log(err)
    //                     return
    //                 }

    //                 else {
    //                     console.log("Purchase edit data found")
    //                     res.send(result);
    //                     res.end()
    //                     return;
    //                 }

    //             })
    //         }
    //     }
    // })

}

const update = (req, res) => {
    let id = req.params.id
    let Comments = req.body.Comments;
    let RecievedDate = req.body.RecievedDate;
    let Value = req.body.Value;
    let Partner = req.body.Partner;

    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else {
    //         if (typeof id != "string" && typeof Comments != "string" && typeof RecievedtDate != 'string' && typeof Partner != 'number' && typeof Value != 'number') {
    //             res.send("Invalid");
    //             res.end();
    //             return;
    //         }

    //         if (RecievedDate && Value && Partner) {
    //             const sqlUpdate = "UPDATE sql5669328.intake SET Comments= ?, RecievedDate= ?, Partner= ?, TotalValue = ? WHERE Intake_id = ?;"
    //             tempCont.query(sqlUpdate, [Comments, RecievedDate, Partner, Value, id], (err, result) => {
    //                 tempCont.release()
    //                 if (err) {
    //                     console.log(err);
    //                     return
    //                 }

    //                 else {
    //                     console.log("Purchase updated")
    //                     res.send()
    //                     res.end()
    //                     return;
    //                 }

    //             })
    //         }
    //     }
    // })

}




const purchase_cleanup = async (req, res) => {
    let id = req.params.id

    if (typeof id != "string") {
        res.sendStatus(400)
        res.end();
        return;
    }

    if (id) {
        try {
            let sqlGet = `SELECT intakeitems."Quantity" as Given, intakeitems."FKItemLocation", itemlocation."Quantity"
            from public.intakeitems
            join public.itemlocation on "FKItemLocation" = "ItemLocation_id"
            WHERE intakeitems."Intake" = ${id}`
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
    //             const sqlUpdate = `SELECT ii.Quantity as Given, ii.FKItemLocation, il.Quantity
    //             from sql5669328.intakeitems as ii
    //             join sql5669328.itemlocation il on ii.FKItemLocation = il. ItemLocation_id
    //             where ii.Intake_id = ?;`
    //             tempCont.query(sqlUpdate, [id], (err, result) => {
    //                 tempCont.release()
    //                 if (err) {
    //                     console.log(err)
    //                     return
    //                 }

    //                 else {
    //                     console.log("Purchase cleanup data found")
    //                     res.send(result)
    //                     res.end()
    //                     return;
    //                 }

    //             })
    //         }
    //     }
    // })

}

const purchase_reclaim = (req, res) => {
    let records = req.body.records

    // sb.getConnection(function (error, tempCont){
    //     if(error){
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else{
    //         if (typeof records != "object") {
    //             res.send("Invalid");
    //             res.end();
    //             return;
    //         }

    //         if (records) {
    //             for (let record in records) {
    //                 Quantity = records[record].Quantity - records[record].Given
    //                 const sqlUpdate = "UPDATE sql5669328.itemlocation SET Quantity= ? WHERE ItemLocation_id = ?;"
    //                 tempCont.query(sqlUpdate, [Quantity, records[record].FKItemLocation], (err, result) => {

    //                     if (err) {
    //                         console.log(err);
    //                     }

    //                     else {
    //                         console.log("Reclaim in progress")
    //                         res.send()
    //                         res.end()
    //                         return;
    //                     }

    //                 })
    //             }
    //             tempCont.release()
    //             console.log("Reclaim complete")

    //         }
    //     }
    // })

}

const purchase_remove = (req, res) => {

    let id = req.params.id;

    // sb.getConnection(function (error, tempCont){
    //     if(error){
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else{
    //         if (typeof id != "string") {
    //             res.send("Invalid");
    //             res.end();
    //             return;
    //         }

    //         if (id) {
    //             const sqlDelete = 'DELETE FROM sql5669328.intake WHERE Intake_id = ?;'
    //             tempCont.query(sqlDelete, [id], (err, result) => {
    //                 tempCont.release()
    //                 if (err) {
    //                     console.log(err);
    //                     return
    //                 }

    //                 else{
    //                     console.log("Purchase deleted");
    //                     res.send()
    //                     res.end()
    //                     return;
    //                 }

    //             })
    //         }
    //     }
    // })

}

const purchase_edit_items = async (req, res) => {
    let id = req.params.id

    if (typeof id != "string") {
        res.sendStatus(400)
        res.end();
        return;
    }

    if (id) {
        try {
            let sqlGet = `SELECT intakeitems."Quantity", itemlocation."Item_id" as Item
            from public.intakeitems
            join public.itemlocation on "FKItemLocation" = "ItemLocation_id"
            WHERE intakeitems."Intake" = ${id}`
            const response = await sb.query(sqlGet);
            res.send({ status: 'complete', data: response.rows })
            return
        }
        catch (error) {
            res.sendStatus(500).json({ "message": error.message })
            return
        }
    }

    // sb.getConnection(function (error, tempCont){
    //     if(error){
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else{
    //         if (typeof id != "string") {
    //             res.send("Invalid");
    //             res.end();
    //             return;
    //         }

    //         if (id) {
    //             const sqlGet = `
    //             SELECT ii.Quantity, il.Item_id as Item
    //             from sql5669328.intakeitems as ii
    //             join sql5669328.itemlocation il on ii.FKItemLocation= il.ItemLocation_id
    //             where ii.Intake_id = ?;
    //         `;
    //             tempCont.query(sqlGet, [id], (err, result) => {
    //                 tempCont.release()
    //                 if (err) {
    //                     console.log(err)
    //                     return
    //                 }

    //                 else {
    //                     console.log("Purchase edit items data found")
    //                     res.send(result);
    //                     res.end()
    //                     return;
    //                 }

    //             })
    //         }
    //     }
    // })

}

const purchase_update_delete = (req, res) => {
    let id = req.params.id

    // sb.getConnection(function (error, tempCont){
    //     if(error){
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else{
    //         if (typeof id != "string") {
    //             res.send("Invalid");
    //             res.end();
    //             return
    //         }

    //         if (id) {
    //             const sqlDelete = "DELETE FROM sql5669328.intakeitems WHERE Intake_id = ?;"
    //             tempCont.query(sqlDelete, [id], (err, result) => {
    //                 tempCont.release()
    //                 if (err) {
    //                     console.log(err);
    //                     return
    //                 }

    //                 else {
    //                     console.log("Deleting all refernece of this Purchase")
    //                     res.send()
    //                     res.end()
    //                     return;
    //                 }

    //             })
    //         }
    //     }
    // })

}

module.exports = {
    data,
    create,
    location,
    find_id,
    track,
    update_item,
    purchase_view,
    edit,
    update,
    purchase_cleanup,
    purchase_reclaim,
    purchase_remove,
    purchase_edit_items,
    purchase_update_delete
}
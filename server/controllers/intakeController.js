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
        let sqlGet = `SELECT partner."Name", "Comments", "RecievedDate", SUM(intakeitems."Quantity") as TotalItems, "Intake_id", "TotalValue" as Total, location."Name" as Location, partner."Type_id" 
        FROM public.intake
        join public.partner on "Partner" = "Partner_id"
        join public.intakeitems on "Intake" = "Intake_id"
        join public.itemlocation on "FKItemLocation" = "ItemLocation_id"
        join public.location on location."Location_id" = itemlocation."Location_id"
        Join public.partnertype on "PartnerType_id" = "Type_id"
        Where "Type" NOT IN ('Vendor', 'Adjustment')
        group by "Intake_id", location."Name", partner."Name", partner."Type_id"`
        const response = await sb.query(sqlGet);
        res.send({ status: 'complete', data: response.rows })
        return;
    }
    catch (error) {
        res.sendStatus(500).json({ "message": error.message })
        return;
    }

    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else {
    //         const sqlGet = `
    //         select p.Name, i.Comments as Comments, Cast(i.RecievedDate as char(10)) as RecievedDate, SUM(ii.Quantity) as TotalItems, i.Intake_id, i.TotalValue as Total, l.Name as Location, p.Type
    //         from sql5669328.intake i
    //         join sql5669328.partner p on i.Partner = p.Partner_id
    //         join sql5669328.partnertype pt on p.Type = pt.PartnerType_id
    //         join sql5669328.intakeitems ii on i.Intake_id = ii.Intake_id
    //         join sql5669328.itemlocation il on ii.FKItemLocation = il.ItemLocation_id
    //         join sql5669328.location l on l.Location_id = il.Location_id
    //         WHERE pt.Type NOT IN ("Vendor", "Adjustment")
    //         group by i.Intake_id, l.Name
    //         `;
    //         tempCont.query(sqlGet, (err, result) => {
    //             tempCont.release();
    //             if (err) {
    //                 console.log(err)
    //             }

    //             else {
    //                 console.log('Donation data sent')
    //                 res.send(result);
    //                 res.end();
    //                 return;
    //             }
    //         })
    //     }
    // })

}

const create = async (req, res) => {

    let Comments = req.body.Comments;
    let RecievedDate = req.body.RecievedDate;
    let Partner = req.body.Partner;
    let Value = req.body.Value
    let Items = req.body.Items
    let Location = req.body.Location_id

    if (typeof Comments != "string" && typeof RecievedDate != "string" && typeof Partner != "number" && typeof Value != "number" && typeof Items != "object" && typeof Location != "string") {
        res.sendStatus(400)
        res.end();
        return;
    }

    try {
        const intakecreation = `INSERT INTO public.intake ("Comments", "RecievedDate", "TotalValue", "Partner") VALUES ('${Comments}', '{${RecievedDate}}', ${Value}, ${Partner})`
        const createintake = await sb.query(intakecreation)

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

        const intaketrack = `INSERT INTO public.intakeitems ("Intake", "Quantity", "Value", "FKItemLocation")
        SELECT p."Intake_id", unnest(array[${quantities}]), unnest(array[${values}]), unnest(t."FKItemLocation")
        from (SELECT MAX("Intake_id") as "Intake_id" from public.intake)p,
             (SELECT array_agg("ItemLocation_id") "FKItemLocation" from public.itemlocation WHERE "Item_id" IN (${ids}) AND "Location_id" = ${Location})t`
        console.log(intaketrack)
        const trackintake = await sb.query(intaketrack)

        const getitemlocations = `SELECT "ItemLocation_id", "Item_id", "Location_id", "Quantity" from public.itemlocation WHERE "Item_id" IN (${ids}) AND "Location_id" = ${Location}`
        const itemlocations = await sb.query(getitemlocations)

        let results = itemlocations.rows
        let rows = []
        for (let i = 0; i < Items.length; i++) {
            rows[i] = [results[i].ItemLocation_id, results[i].Item_id, results[i].Location_id, results[i].Quantity + parseInt(Items[i].Quantity)]
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

    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else {
    //         if (typeof Comments != "string" && typeof RecievedDate != "string" && typeof Partner != "number" && typeof Value != "number") {
    //             res.send("Invalid");
    //             res.end();
    //             return;
    //         }


    //         if (Partner && RecievedDate) {
    //             const sqlInsert = "INSERT INTO sql5669328.intake (Comments, RecievedDate, Partner, TotalValue) VALUES (?,?,?,?);"
    //             tempCont.query(sqlInsert, [Comments, RecievedDate, Partner, Value], (err, result) => {
    //                 tempCont.release();
    //                 if (err) {
    //                     console.log(err);
    //                 }

    //                 else {
    //                     console.log('Donation log created')
    //                     res.send()
    //                     res.end()
    //                     return;
    //                 }

    //             })
    //         }
    //     }
    // })


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
            return;
        } catch (error) {
            res.send({ status: 'error', message: error.message })
            return;
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
    //                 tempCont.release();
    //                 if (err) {
    //                     console.log(err);
    //                 }

    //                 else {
    //                     console.log('Donation item locations found')
    //                     res.send(result);
    //                     res.end();
    //                     return;
    //                 }

    //             })

    //         }
    //     }
    // })

}

const find_id = async (req, res) => {

    try {
        let sqlGet = `SELECT MAX("Intake_id") as Intake_id
        from public.intake`
        const response = await sb.query(sqlGet);
        res.send({ status: 'complete', data: response.rows })
        return;
    }
    catch (error) {
        res.sendStatus(500).json({ "message": error.message })
        return;
    }

    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else {
    //         const query = "SELECT MAX(Intake_id) as Intake_id FROM sql5669328.intake;"

    //         tempCont.query(query, (err, result) => {
    //             tempCont.release();
    //             if (err) {
    //                 console.log(err)
    //             }

    //             else {
    //                 console.log('Donation id found')
    //                 res.send(result);
    //                 res.end()
    //                 return;
    //             }

    //         })
    //     }
    // })

}

const track = (req, res) => {
    let Items = req.body.Items
    let Values = req.body.Values
    let FKItemLocation = req.body.FKItemLocation

    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else {
    //         if (typeof Items != "object" && typeof Values != "object" && typeof FKItemLocation != "object") {
    //             res.send("Invalid")
    //             res.end();
    //             return;
    //         }

    //         if (Items && Values && FKItemLocation) {
    //             const sqlInsert = `INSERT INTO sql5669328.intakeitems (Intake_id, Quantity, Value, FKItemLocation) VALUES ((SELECT MAX(Intake_id) as Intake_id FROM sql5669328.intake),?,?,?);`
    //             for (var i = 0; i < Items.length; i++) {
    //                 let Value = Items[i].Quantity * Values[i].FairMarketValue
    //                 tempCont.query(sqlInsert, [Items[i].Quantity, Value, FKItemLocation[i].ItemLocation_id], (err, result) => {
    //                     if (err) {
    //                         console.log(err);
    //                         return;
    //                     }

    //                     else {
    //                         console.log(`${i + 1} out of ${Items.length} complete`)
    //                         res.send();
    //                         res.end();
    //                     }

    //                 })
    //             }
    //             tempCont.release();
    //             console.log('Tracking process done')
    //             return;
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
    //         if (typeof ItemLocationFK != "object" && typeof Items != "object") {
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
    //                         return;
    //                     }

    //                     else {
    //                         console.log(`${i + 1} out of ${Items.length} quantities updated`)
    //                         res.send()
    //                         res.end()
    //                         return;
    //                     }
    //                 })
    //             }
    //             tempCont.release();
    //             console.log("All Location Items updated")
    //             return;
    //         }
    //     }
    // })

}

const intake_view = async (req, res) => {
    let id = req.params.id

    if (typeof id != "string") {
        res.sendStatus(400)
        res.end();
        return;
    }

    if (id) {
        try {
            let sqlGet = `SELECT "RecievedDate", partner."Name" as "Partner", item."Name" as "Item", location."Name" as "Location", intakeitems."Quantity", item."FairMaketValue"
            from public.inatkeitems
            join public.itemlocation on "FKItemLocation" = "ItemLocation_id"
            join public.intake on "Intake" = "Intake_id"
            join public.item on item."Item_id" = itemlocation."Item_id"
            join public.location on location."Location_id" = itemlocation."Location_id"
            join public.partner on intake."Partner" = partner."Partner_id"
            WHERE intakeitems."Intake" = ${id}`
            const response = await sb.query(sqlGet);
            res.send({ status: 'complete', data: response.rows })
            return;
        }
        catch (error) {
            res.sendStatus(500).json({ "message": error.message })
            return;
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
    //         select Cast(i.RecievedDate as char(10)) as RecievedDate, p.Name as Partner, it.Name as Item, it.FairMarketValue, l.Name as Location, ii.Quantity
    //         from sql5669328.intakeitems ii
    //         join sql5669328.itemlocation il on ii.FKItemLocation = il.ItemLocation_id
    //         join sql5669328.intake i on ii.Intake_id = i.Intake_id
    //         join sql5669328.item it on it.Item_id = il.Item_id
    //         join sql5669328.location l on l.Location_id = il.Location_id
    //         join sql5669328.partner p on i.Partner = p.Partner_id
    //         where ii.Intake_id = ?; 
    //         `;
    //             tempCont.query(sqlGet, [id], (err, result) => {
    //                 tempCont.release();
    //                 if (err) {
    //                     console.log(err);
    //                 }

    //                 else {
    //                     console.log('Donation view data found')
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
            let sqlGet = `SELECT TO_CHAR("RecievedDate", 'yyyy-mm-dd') as "RecievedDate", "Partner", "Comments", "TotalValue", itemlocation."Location_id", "Type"
            from public.intake
            join public.intakeitems on "Intake" = "Intake_id"
            join public.itemlocation on "FKItemLocation" = "ItemLocation_id"
            join public.partner on intake."Partner" = partner."Partner_id"
            join public.partnertype on "PartnerType_id" = "Type_id"
            WHERE intake."Intake_id" = ${id}`
            const response = await sb.query(sqlGet);
            res.send({ status: 'complete', data: response.rows })
            return;
        }
        catch (error) {
            res.sendStatus(500).json({ "message": error.message })
            return;
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
    //         select i.Comments, i.TotalValue, Cast(i.RecievedDate as char(10)) AS RecievedDate, i.Partner, il.Location_id, pt.Type
    //         from sql5669328.intake i
    //         join sql5669328.intakeitems ii on i.Intake_id = ii.Intake_id
    //         join sql5669328.partner p on i.Partner = p.Partner_id
    //         join sql5669328.partnertype pt on p.Type = pt.PartnerType_id
    //         join sql5669328.itemlocation il on ii.FKItemLocation = il.ItemLocation_id
    //         where i.Intake_id = ?; 
    //         `;
    //             tempCont.query(sqlGet, [id], (err, result) => {
    //                 tempCont.release();
    //                 if (err) {
    //                     console.log(err);
    //                 }

    //                 else {
    //                     console.log('Donation edit data found')
    //                     res.send(result);
    //                     res.end()
    //                     return;
    //                 }

    //             })
    //         }
    //     }
    // })

}

const update = async (req, res) => {
    let id = req.params.id
    let Comments = req.body.Comments;
    let RecievedDate = req.body.RecievedDate;
    let Partner = req.body.Partner;
    let Value = req.body.Value
    let Items = req.body.Items
    let Location = req.body.Location_id


    if (typeof id != "string" && typeof Comments != "string" && typeof RecievedtDate != 'string' && typeof Partner != 'number' && typeof Value != 'number'&& typeof Items != "object" && typeof Location != "string") {
        res.sendStatus(400)
        res.end();
        return;
    }

    try {
        const sqlUpdate = `UPDATE public.intake SET "Comments" = '${Comments}', "RecievedDate" = '{${RecievedDate}}', "Partner" = ${Partner}, "TotalValue" = ${Value} WHERE "Intake_id" = ${id}`
        const update = await sb.query(sqlUpdate)

        let sqlGet = `SELECT intakeitems."Quantity" as "Given", intakeitems."FKItemLocation", itemlocation."Quantity"
            from public.intakeitems
            join public.itemlocation on "FKItemLocation" = "ItemLocation_id"
            WHERE intakeitems."Intake" = ${id}`
        const intakeitemsinfo = await sb.query(sqlGet)

        let deletionresults = intakeitemsinfo.rows
        let deletionrows = []
        for (let i = 0; i < deletionresults.length; i++) {
            deletionrows.push({Given: deletionresults[i].Quantity - deletionresults[i].Given, Id: deletionresults[i].FKItemLocation})
        }

        for (let i = 0; i < deletionresults.length; i++) {
            const reclaiming = `UPDATE public.itemlocation SET "Quantity" = ${deletionrows[i].Given} WHERE "ItemLocation_id" = ${deletionrows[i].Id}`
            const reclaim = await sb.query(reclaiming)
        }

        const deleting = `DELETE from public.intakeitems WHERE "Intake" = ${id}`
        const deletion = await sb.query(deleting)

        let ids = []
        Items.forEach(element => {
            ids.push(element.Item);
        });

        let quantities = []
        Items.forEach(element => {
            quantities.push(element.Quantity);
        });

        let valueget = `SELECT "FairMarketValue"
            from public.item
            WHERE "Item_id" IN (${ids})`
        const response = await sb.query(valueget);
        let valueresults = response.rows
        let values = []

        for (let i = 0; i < Items.length; i++) {
            values.push(Items[i].Quantity * valueresults[i].FairMarketValue)
        }

        const intaketrack = `INSERT INTO public.intakeitems ("Intake", "Quantity", "Value", "FKItemLocation")
        SELECT ${id}, unnest(array[${quantities}]), unnest(array[${values}]), unnest(t."FKItemLocation")
        from (SELECT array_agg("ItemLocation_id") "FKItemLocation" from public.itemlocation WHERE "Item_id" IN (${ids}) AND "Location_id" = ${Location})t`
        console.log(intaketrack)
        const trackintake = await sb.query(intaketrack)

        const getitemlocations = `SELECT "ItemLocation_id", "Item_id", "Location_id", "Quantity" from public.itemlocation WHERE "Item_id" IN (${ids}) AND "Location_id" = ${Location}`
        const itemlocations = await sb.query(getitemlocations)

        let results = itemlocations.rows
        let rows = []
        for (let i = 0; i < Items.length; i++) {
            rows[i] = [results[i].ItemLocation_id, results[i].Item_id, results[i].Location_id, results[i].Quantity + parseInt(Items[i].Quantity)]
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
    
    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else {
    //         if (typeof id != "string" && typeof Comments != "string" && typeof RecievedtDate != 'string' && typeof Partner != 'number' && typeof Value != 'number') {
    //             res.send("Invalid");
    //             console.log("err");
    //             res.end();
    //             return;
    //         }

    //         if (RecievedDate && Partner) {
    //             const sqlUpdate = "UPDATE sql5669328.intake SET Comments= ?, RecievedDate= ?, Partner= ?, TotalValue= ? WHERE Intake_id = ?;"
    //             tempCont.query(sqlUpdate, [Comments, RecievedDate, Partner, Value, id], (err, result) => {
    //                 tempCont.release()
    //                 if (err) {
    //                     console.log(err);
    //                 }

    //                 else {
    //                     console.log('Donation data updated')
    //                     res.send()
    //                     res.end()
    //                     return;
    //                 }

    //             })
    //         }
    //     }
    // })

}

const intake_find_value = async (req, res) => {
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
            return;
        } catch (error) {
            res.send({ status: 'error', message: error.message })
            return;
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



    //             tempCont.query(sqlGet, [ids], (err, result, fields, query) => {
    //                 tempCont.release();
    //                 if (err) {
    //                     console.log(err);
    //                 }

    //                 else {
    //                     console.log('Donation item values found')
    //                     res.send(result);
    //                     res.end();
    //                     return;
    //                 }

    //             })
    //         }
    //     }
    // })


}

const intake_cleanup = async (req, res) => {
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
            return;
        }
        catch (error) {
            res.sendStatus(500).json({ "message": error.message })
            return;
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
    //             const sqlGet = `SELECT ii.Quantity as Given, ii.FKItemLocation, il.Quantity
    //             from sql5669328.intakeitems as ii
    //             join sql5669328.itemlocation il on ii.FKItemLocation = il. ItemLocation_id
    //             where ii.Intake_id = ?;`
    //             tempCont.query(sqlGet, [id], (err, result) => {
    //                 tempCont.release();
    //                 if (err) {
    //                     console.log(err)
    //                 }

    //                 else {
    //                     console.log('Donation cleanup data found')
    //                     res.send(result)
    //                     res.end()
    //                     return;
    //                 }


    //             })
    //         }
    //     }
    // })

}

const intake_reclaim = async (req, res) => {
    let id = req.body.id


    if (typeof id != "number") {
        res.sendStatus(400)
        res.end();
        return;
    }

    try {
        let sqlGet = `SELECT intakeitems."Quantity" as "Given", intakeitems."FKItemLocation", itemlocation."Quantity"
            from public.intakeitems
            join public.itemlocation on "FKItemLocation" = "ItemLocation_id"
            WHERE intakeitems."Intake" = ${id}`
        const intakeitemsinfo = await sb.query(sqlGet)

        let deletionresults = intakeitemsinfo.rows
        let deletionrows = []
        for (let i = 0; i < deletionresults.length; i++) {
            deletionrows.push({Given: deletionresults[i].Quantity - deletionresults[i].Given, Id: deletionresults[i].FKItemLocation})
        }

        for (let i = 0; i < deletionresults.length; i++) {
            const reclaiming = `UPDATE public.itemlocation SET "Quantity" = ${deletionrows[i].Given} WHERE "ItemLocation_id" = ${deletionrows[i].Id}`
            const reclaim = await sb.query(reclaiming)
        }

        const deleting = `DELETE from public.intakeitems WHERE "Intake" = ${id}`
        const deletion = await sb.query(deleting)

        const deletingintake = `DELETE from public.intake WHERE "Intake_id" = ${id}`
        const deletionintake = await sb.query(deletingintake)
    }

    catch (error) {
        console.log(error)
        res.status(500).json(error);
        return;
    }
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
    //                 Quantity = records[record].Quantity - records[record].Given
    //                 const sqlUpdate = "UPDATE sql5669328.itemlocation SET Quantity= ? WHERE ItemLocation_id = ?;"
    //                 tempCont.query(sqlUpdate, [Quantity, records[record].FKItemLocation], (err, result) => {
    //                     if (err) {
    //                         console.log(err);
    //                         return
    //                     }

    //                     else {
    //                         console.log(`Reclaim in progress`)
    //                         res.send()
    //                         res.end()
    //                         return;
    //                     }

    //                 })
    //             }
    //             tempCont.release();
    //             console.log('Reclaim procress done')
    //             return;

    //         }
    //     }
    // })

}

const intake_remove = (req, res) => {
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
    //             const sqlDelete = 'DELETE FROM sql5669328.intake WHERE Intake_id = ?;'
    //             tempCont.query(sqlDelete, [id], (err, result) => {
    //                 tempCont.release();
    //                 if (err) {
    //                     console.log(err);
    //                 }

    //                 else {
    //                     console.log('Donation record deleted')
    //                     res.send()
    //                     res.end()
    //                     return;
    //                 }

    //             })
    //         }
    //     }
    // })


}

const intake_edit_items = async (req, res) => {
    let id = req.params.id

    if (typeof id != "string") {
        res.sendStatus(400)
        res.end();
        return;
    }

    if (id) {
        try {
            let sqlGet = `SELECT intakeitems."Quantity", itemlocation."Item_id" as "Item"
            from public.intakeitems
            join public.itemlocation on "FKItemLocation" = "ItemLocation_id"
            WHERE intakeitems."Intake" = ${id}`
            const response = await sb.query(sqlGet);
            res.send({ status: 'complete', data: response.rows })
            return;
        }
        catch (error) {
            res.sendStatus(500).json({ "message": error.message })
            return;
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
    //             SELECT ii.Quantity, il.Item_id
    //             from sql5669328.intakeitems as ii
    //             join sql5669328.itemlocation il on ii.FKItemLocation= il.ItemLocation_id
    //             where ii.Intake_id = ?;
    //         `;
    //             tempCont.query(sqlGet, [id], (err, result) => {
    //                 tempCont.release()
    //                 if (err) {
    //                     console.log(err)
    //                 }

    //                 else {
    //                     console.log('Donation edit items data found')
    //                     res.send(result);
    //                     res.end()
    //                     return;
    //                 }

    //             })
    //         }
    //     }
    // })

}

const intake_update_delete = (req, res) => {
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
    //             const sqlDelete = "DELETE FROM sql5669328.intakeitems WHERE Intake_id = ?;"
    //             tempCont.query(sqlDelete, [id], (err, result) => {
    //                 tempCont.release()
    //                 if (err) {
    //                     console.log(err);
    //                 }

    //                 else {
    //                     console.log('Donation past records of items deleted')
    //                     res.send()
    //                     res.end()
    //                     return;
    //                 }

    //             })
    //         }
    //     }
    // })

}

const intake_misc = async (req, res) => {

    try {
        let sqlGet = `SELECT "Partner_id"
        from public.partner
        Join public.partnertype on "PartnerType_id" = "Type_id"
        Where "Type" = 'Misc Donation'`
        const response = await sb.query(sqlGet);
        res.send({ status: 'complete', data: response.rows })
        return;
    }
    catch (error) {
        res.sendStatus(500).json({ "message": error.message })
        return;
    }

    // sb.getConnection(function (error, tempCont) {
    //     if (error) {
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else {
    //         const sqlGet = `SELECT p.Partner_id
    //         from sql5669328.partner p
    //         join sql5669328.partnertype pt on p.Type = pt.PartnerType_id
    //         WHERE pt.Type = "Misc Donation";`

    //         tempCont.query(sqlGet, (err, result) => {
    //             tempCont.release();
    //             if (err) {
    //                 console.log(err);
    //             }

    //             else {
    //                 console.log("Misc Donor found")
    //                 res.send(result);
    //                 res.end()
    //                 return
    //             }

    //         })
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
    intake_view,
    edit,
    update,
    intake_find_value,
    intake_cleanup,
    intake_reclaim,
    intake_remove,
    intake_edit_items,
    intake_update_delete,
    intake_misc
}

/*
console.log(sb.format(sqlGet, [ids]))
*/
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



const adjustment = async (req, res) => {
    try {
        let sqlGet = `SELECT "Partner_id", "Name", "Location"
        from public.partner
        WHERE "Location" IS NOT NULL`
        const response = await sb.query(sqlGet);
        res.send({ status: 'complete', data: response.rows })
        return
    }
    catch (error) {
        res.send({ status: 'error', message: error.message })
        return
    }

    /*sb.getConnection(function (error, tempCont){
        if(error){
            console.log('Error')
            res.status(500).json({'message': error.message})
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
    })*/

}

const takeaway = (req, res) => {
    let Location = req.body.Location
    let Items = req.body.Items




    /*sb.getConnection(function (error, tempCont){
        if(error){
            console.log('Error')
            res.status(500).json({'message': error.message})
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
    })*/


}

const give = async (req, res) => {
    let To = req.body.To
    let Items = req.body.Items
    let Comments = req.body.Comments;
    let RecievedDate = req.body.RecievedDate;
    let Partner = req.body.Partner;
    let From = req.body.From;

    if (typeof Comments != "string" && typeof RecievedDate != "string" && typeof Partner != "number" && typeof From != "number" && typeof Items != "object" && typeof To != "string") {
        res.sendStatus(400)
        res.end();
        return;
    }

    try {
        let ids = []
        Items.forEach(element => {
            ids.push(element.Item_id);
        });
        const getitemlocations = `SELECT "ItemLocation_id", "Item_id", "Location_id", "Quantity" from public.itemlocation WHERE "Item_id" IN (${ids}) AND "Location_id" = ${To}`
        const itemlocations = await sb.query(getitemlocations)

        let give = itemlocations.rows
        let giverows = []
        for (let i = 0; i < Items.length; i++) {
            giverows[i] = [give[i].ItemLocation_id, give[i].Item_id, To, give[i].Quantity + parseInt(Items[i].Quantity)]
        }

        for (let i = 0; i < Items.length; i++) {
            const updatelocations = `INSERT INTO public.itemlocation ("ItemLocation_id", "Item_id", "Location_id", "Quantity")
            VALUES (${giverows[i]})
            ON CONFLICT ("ItemLocation_id") DO UPDATE
            SET "Quantity" = excluded."Quantity"`
            console.log(updatelocations)
            const locationsupdated = await sb.query(updatelocations)
        }

        const getitemlocationstake = `SELECT "ItemLocation_id", "Item_id", "Location_id", "Quantity" from public.itemlocation WHERE "Item_id" IN (${ids}) AND "Location_id" = ${From}`
        const itemlocationstake = await sb.query(getitemlocationstake)

        let take = itemlocationstake.rows
        let takerows = []
        for (let i = 0; i < Items.length; i++) {
            takerows[i] = [take[i].ItemLocation_id, take[i].Item_id, From, take[i].Quantity - parseInt(Items[i].Quantity)]
        }

        for (let i = 0; i < Items.length; i++) {
            const updatelocations = `INSERT INTO public.itemlocation ("ItemLocation_id", "Item_id", "Location_id", "Quantity")
            VALUES (${takerows[i]})
            ON CONFLICT ("ItemLocation_id") DO UPDATE
            SET "Quantity" = excluded."Quantity"`
            console.log(updatelocations)
            const locationsupdated = await sb.query(updatelocations)
        }

        let quantities = []
        Items.forEach(element => {
            quantities.push(element.Quantity);
        });

        const intakecreation = `INSERT INTO public.intake ("Comments", "RecievedDate", "TotalValue", "Partner") VALUES ('${Comments}', '{${RecievedDate}}', 0.00, ${Partner})`
        const createintake = await sb.query(intakecreation)

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
             (SELECT array_agg("ItemLocation_id") "FKItemLocation" from public.itemlocation WHERE "Item_id" IN (${ids}) AND "Location_id" = ${To})t`
        const trackintake = await sb.query(intaketrack)

        res.sendStatus(200)
        res.end();
        return;
    }
    catch (error) {
        console.log(error)
        res.status(500).json(error);
        return;
    }

    /*sb.getConnection(function (error, tempCont){
        if(error){
            console.log('Error')
            res.status(500).json({'message': error.message})
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
    })*/

}

const find_value = async (req, res) => {
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
    /*sb.getConnection(function (error, tempCont){
        if(error){
            console.log('Error')
            res.status(500).json({'message': error.message})
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
    })*/

}


const find_ild = async (req, res) => {
    let Items = req.body.Items
    let Location = req.body.Location


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
    /*sb.getConnection(function (error, tempCont){
        if(error){
            console.log('Error')
            res.status(500).json({'message': error.message})
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
    })*/

}

const validation = async (req, res) => {
    let Items = req.body.Items
    let Location = req.body.Location

    
    if (typeof Items != "object" && typeof Location != "number") {
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

            let sqlGet = `SELECT "ItemLocation_id", "Quantity", item."Name" as Item, item."Item_id"
            from public.itemlocation
            join public.item on itemlocation."Item_id" = item."Item_id"
            WHERE itemlocation."Item_id" IN (${ids}) AND itemlocation."Location_id" = ${Location}`
            const response = await sb.query(sqlGet);
            res.send({ status: 'complete', data: response.rows })
            return
        } catch (error) {
            res.sendStatus(500).json({ "message": error.message})
            return
        }
    }
    /*sb.getConnection(function (error, tempCont){
        if(error){
            console.log('Error')
            res.status(500).json({'message': error.message})
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
    })*/

}



const track_intake = (req, res) => {
    let Items = req.body.Items
    let Values = req.body.Values
    let FKItemLocation = req.body.FKItemLocation

    /*sb.getConnection(function (error, tempCont){
        if(error){
            console.log('Error')
            res.status(500).json({'message': error.message})
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
    })*/

}

const transfer = async (req, res) => {
    
    try {
        let sqlGet = `SELECT partner."Name" as "Taken", location."Name" as "Given", "RecievedDate" as "Date", "Intake_id", SUM(intakeitems."Quantity") as "TotalMoved", intake."Comments", partner."Location"
        from public.intake
        join public.partner on "Partner" = "Partner_id"
        join public.partnertype on partner."Type_id" = "PartnerType_id"
        join public.intakeitems on "Intake" = "Intake_id"
        join public.itemlocation on "FKItemLocation" = "ItemLocation_id"
        join public.location on location."Location_id" = itemlocation."Location_id"
        WHERE partnertype."Type" = 'Adjustment'
        group by partner."Name", location."Name", "RecievedDate", intake."Intake_id", partner."Location"`
        const response = await sb.query(sqlGet);
        res.send({ status: 'complete', data: response.rows })
        return
    }
    catch (error) {
        res.sendStatus(500).json({ "message": error.message})
        return
    }
    
    /*sb.getConnection(function (error, tempCont){
        if(error){
            console.log('Error')
            res.status(500).json({'message': error.message})
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
    })*/

}

const transfer_view = async (req, res) => {
    let id = req.params.id
    if(typeof id != "string"){
        res.sendStatus(400)
        res.end();
        return;
    }

    if (id) {
        try {
            let sqlGet = `SELECT partner."Name" as "Taken", location."Name" as "Given", "RecievedDate" as "Date", intakeitems."Quantity", item."Name" as "Item"
            from public.intake
            join public.partner on "Partner" = "Partner_id"
            join public.intakeitems on "Intake" = "Intake_id"
            join public.itemlocation on "FKItemLocation" = "ItemLocation_id"
            join public.item on item."Item_id" = itemlocation."Item_id"
            join public.location on location."Location_id" = itemlocation."Location_id"
            WHERE intake."Intake_id" = ${id}
            group by partner."Name", location."Name", "RecievedDate", item."Name", intakeitems."Quantity"`
            const response = await sb.query(sqlGet);
            res.send({ status: 'complete', data: response.rows })
            return
        }
        catch (error) {
            res.sendStatus(500).json({ "message": error.message})
            return
        }
    }
    /*sb.getConnection(function (error, tempCont){
        if(error){
            console.log('Error')
            res.status(500).json({'message': error.message})
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
    })*/

}

const transfer_cleanup = async (req, res) => {
    let id = req.params.id

    if(typeof id != "string"){
        res.sendStatus(400)
        res.end();
        return;
    }

    if (id) {
        try {
            let sqlGet = `SELECT intakeitems."Quantity" as Given, intakeitems."FKItemLocation", itemlocation."Item_id"
            from public.intakeitems
            join public.itemlocation on "FKItemLocation" = "ItemLocation_id"
            WHERE intakeitems."Intake" = ${id}`
            const response = await sb.query(sqlGet);
            res.send({ status: 'complete', data: response.rows })
            return
        }
        catch (error) {
            res.sendStatus(500).json({ "message": error.message})
            return
        }
    }

    /*sb.getConnection(function (error, tempCont){
        if(error){
            console.log('Error')
            res.status(500).json({'message': error.message})
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
    })*/

}

const transfer_reclaim = (req, res) => {
    let records = req.body.records

    /*sb.getConnection(function (error, tempCont){
        if(error){
            console.log('Error')
            res.status(500).json({'message': error.message})
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
    })*/

}

const transfer_renounce = (req, res) => {
    let records = req.body.records
    let Location = req.body.Location

    /*sb.getConnection(function (error, tempCont){
        if(error){
            console.log('Error')
            res.status(500).json({'message': error.message})
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
    })*/

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
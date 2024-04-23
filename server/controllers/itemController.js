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

const item_index = async (req, res) => {

    try {
        let sqlGet = `SELECT * from public.item`
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
    //         const sqlGet = "SELECT * FROM sql5669328.item;"
    //         tempCont.query(sqlGet, (err, result) => {
    //             tempCont.release()
    //             if (err) {
    //                 console.log(err)
    //             }

    //             else {
    //                 console.log('Item data found')
    //                 res.send(result);
    //                 res.end();
    //                 return;
    //             }

    //         })
    //     }
    // })

}

const anything_else = async (req, res) => {

    try {
        let sqlGet = `SELECT * from public.item WHERE "DeletedAt" IS NULL`
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
    //         const sqlGet = "SELECT * FROM sql5669328.item WHERE DeletedAt IS null;"
    //         tempCont.query(sqlGet, (err, result) => {
    //             tempCont.release();
    //             if (err) {
    //                 console.log(err)
    //             }

    //             else {
    //                 res.send(result);
    //                 res.end();
    //                 return
    //             }

    //         })
    //     }
    // })

}

const item_creation = async (req, res) => {
    let Name = req.body.name;
    let FairMarketValue = req.body.FairMarketValue;
    let PackageCount = req.body.PackageCount

    if (typeof Name != "string" && typeof FairMarketValue != "number" && typeof PackageCount != "number") {
        res.send("Invalid");
        res.end();
        return;
    }

    try {
        if (PackageCount > 0) {
            const insertitem = `INSERT INTO public.item ("Name", "FairMarketValue", "PackageCount") VALUES ('{${Name}}', ${FairMarketValue}, ${PackageCount})`
            const itemcreation = await sb.query(insertitem)
        }

        else {
            const insertitem = `INSERT INTO public.item ("Name", "FairMarketValue") VALUES ('{${Name}}', ${FairMarketValue})`
            const itemcreation = await sb.query(insertitem)
        }

        const itemlocationpairing = `INSERT INTO public.itemlocation ("Item_id", "Location_id")
        SELECT p."Item_id", t."Location_id"
        from (SELECT "Item_id" from public.item ORDER BY "Item_id" DESC Limit 1) p,
             (SELECT "Location_id" from public.location Order by "Location_id") t`
        const itemlocationcreation = await sb.query(itemlocationpairing)
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
    //         if (typeof Name != "string" && typeof FairMarketValue != "number" && typeof PackageCount != "number") {
    //             res.send("Invalid");
    //             res.end();
    //             return;
    //         }

    //         if (Name && FairMarketValue && PackageCount) {
    //             if (PackageCount > 0) {
    //                 const sqlInsert = "INSERT INTO sql5669328.item (Name, FairMarketValue, PackageCount) VALUES (?,?,?);"
    //                 tempCont.query(sqlInsert, [Name, FairMarketValue, PackageCount], (err, result) => {
    //                     tempCont.release();
    //                     if (err) {
    //                         console.log(err)
    //                         return;
    //                     }

    //                     else {
    //                         console.log('Item created')
    //                         res.send();
    //                         res.end();
    //                         return
    //                     }

    //                 })
    //             }
    //             else {
    //                 const sqlInsert = "INSERT INTO sql5669328.item (Name, FairMarketValue) VALUES (?,?);"
    //                 tempCont.query(sqlInsert, [Name, FairMarketValue], (err, result) => {
    //                     tempCont.release()
    //                     if (err) {
    //                         console.log(err);
    //                     }

    //                     else {
    //                         console.log('Item created')
    //                         res.send();
    //                         res.end();
    //                         return;
    //                     }

    //                 })
    //             }
    //         }
    //     }
    // })

}

const item_delete = async (req, res) => {
    let id = req.params.id;
    let date = req.body.date;

    if (typeof id != "string" && typeof date != "string") {
        res.sendStatus(400);
        res.end();
        return;
    }

    try {
        const sqlUpdate = `UPDATE public.item Set "DeletedAt" = '{${date}}' WHERE "Item_id" = ${id}`
        const response = await sb.query(sqlUpdate)
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
    //         if (typeof id != "string" && typeof date != "string") {
    //             res.send("Invalid");
    //             res.end();
    //             return;
    //         }

    //         if (id && date) {
    //             const sqlDelete = `UPDATE sql5669328.item Set DeletedAt= STR_TO_Date(?, '%m/%d/%Y') WHERE Item_id = ?;`
    //             tempCont.query(sqlDelete, [date, id], (err, result) => {
    //                 tempCont.release()
    //                 if (err) {
    //                     console.log(err);
    //                     return
    //                 }

    //                 else {
    //                     console.log('Item deleted')
    //                     res.send()
    //                     res.end();
    //                     return
    //                 }

    //             })
    //         }
    //     }
    // })

}

const item_reactivate = async (req, res) => {
    let id = req.params.id;

    if (typeof id != "string") {
        res.sendStatus(400);
        res.end();
        return;
    }

    try {
        const sqlUpdate = `UPDATE public.item Set "DeletedAt" = NULL WHERE "Item_id" = ${id}`
        const response = await sb.query(sqlUpdate)
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
    //         if (typeof id != "string") {
    //             res.send("Invalid");
    //             res.end();
    //             return;
    //         }

    //         if (id) {
    //             const sqlDelete = `UPDATE sql5669328.item Set DeletedAt= NULL WHERE Item_id = ?;`
    //             tempCont.query(sqlDelete, [id], (err, result) => {
    //                 tempCont.release();
    //                 if (err) {
    //                     console.log(err);
    //                 }

    //                 else {
    //                     console.log('Item reactivated')
    //                     res.send()
    //                     res.end();
    //                     return
    //                 }

    //             })
    //         }
    //     }
    // })

}

const item_edit = async (req, res) => {
    let id = req.params.id

    if (typeof id != "string") {
        req.sendStatus(400);
        res.end();
        return
    }

    if (id) {
        try {
            let sqlGet = `SELECT "Name", "FairMarketValue", "PackageCount" FROM public.item WHERE "Item_id" = ${id};`
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
    //             const sqlGet = 'SELECT Name, FairMarketValue, Item_id, PackageCount FROM sql5669328.item WHERE Item_id = ?;'
    //             tempCont.query(sqlGet, [id], (err, result) => {
    //                 tempCont.release()
    //                 if (err) {
    //                     console.log(err)
    //                     return
    //                 }

    //                 else {
    //                     console.log('Item edit data found')
    //                     res.send(result);
    //                     res.end();
    //                     return
    //                 }

    //             })
    //         }
    //     }
    // })

}

const item_update = async (req, res) => {

    let id = req.params.id
    let Name = req.body.name;
    let FairMarketValue = req.body.FairMarketValue;
    let PackageCount = req.body.PackageCount

    if (typeof id != "string" && typeof Name != "string" && typeof FairMarketValue != "number" && typeof PackageCount != "number") {
        res.send("Invalid");
        res.end();
        return;
    }

    try {
        if (PackageCount > 0) {
            const updateitem = `UPDATE public.item "Name" = '{${Name}}', "FairMarketValue" = ${FairMarketValue}, "PackageCount" = ${PackageCount} WHERE "Item_id" = ${id}`
            const itemupdate = await sb.query(updateitem)
        }

        else {
            const updateitem = `UPDATE public.item "Name" = '{${Name}}', "FairMarketValue" = ${FairMarketValue} WHERE "Item_id" = ${id}`
            const itemupdate = await sb.query(updateitem)
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
    //         if (typeof id != "string" && typeof Name != "string" && typeof FairMarketValue != "number" && typeof PackageCount != "number") {
    //             res.send("Invalid");
    //             res.end();
    //             return;
    //         }

    //         if (Name && FairMarketValue && id && PackageCount) {
    //             if (PackageCount > 0) {
    //                 const sqlUpdate = "UPDATE sql5669328.item SET Name= ?, FairMarketValue= ?, PackageCount= ? WHERE Item_id = ?;"
    //                 tempCont.query(sqlUpdate, [Name, FairMarketValue, PackageCount, id], (err, result) => {
    //                     tempCont.release()
    //                     if (err) {
    //                         console.log(err);
    //                     }

    //                     else {
    //                         console.log('Item updated')
    //                         res.send();
    //                         res.end();
    //                         return
    //                     }


    //                 })

    //             }
    //             else {
    //                 const sqlUpdate = "UPDATE sql5669328.item SET Name= ?, FairMarketValue= ? WHERE Item_id = ?;"
    //                 tempCont.query(sqlUpdate, [Name, FairMarketValue, id], (err, result) => {
    //                     tempCont.release()
    //                     if (err) {
    //                         console.log(err);
    //                     }

    //                     else {
    //                         console.log('Item updated')
    //                         res.send();
    //                         res.end();
    //                         return
    //                     }

    //                 })
    //             }

    //         }
    //     }
    // })

}

const item_view = async (req, res) => {
    let id = req.params.id

    if (typeof id != "string") {
        req.sendStatus(400);
        res.end();
        return
    }

    if (id) {
        try {
            let sqlGet = `SELECT location."Name" as "Location", "Quantity" 
            FROM public.itemlocation
            join public.item on item."Item_id" = itemlocation."Item_id"
            join public.location on location."Location_id = itemlocation."Location_id  
            WHERE itemlocation."Item_id" = ${id};`
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
    //             const sqlGet = `SELECT l.Name as Location, il.Quantity
    //             from sql5669328.itemlocation il
    //             join sql5669328.item i on il.Item_id = i.Item_id
    //             join sql5669328.location l on il.Location_id = l.Location_id
    //             WHERE il.Item_id = ?
    //             order by il.Location_id;`
    //             tempCont.query(sqlGet, [id], (err, result) => {
    //                 tempCont.release()
    //                 if (err) {
    //                     console.log(err)
    //                     return
    //                 }

    //                 else {
    //                     console.log('Item view data found')
    //                     res.send(result);
    //                     res.end()
    //                     return
    //                 }

    //             })
    //         }
    //     }
    // })

}

const last = async (req, res) => {

    try {
        let sqlGet = `SELECT "Item_id" 
        from public.item
        ORDER BY "Item_id" DESC
        Limit 1`
        const response = await sb.query(sqlGet);
        res.send({ status: 'complete', data: response.rows })
        return
    }
    catch (error) {
        res.sendStatus(500).json({ "message": error.message })
        return
    }

    // sb.getConnection(function (error, tempCont){
    //     if(error){
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else{
    //         const sqlGet = `SELECT Item_id from sql5669328.item
    //         ORDER BY Item_id DESC
    //         Limit 1;`
    //         tempCont.query(sqlGet, (err, result) => {
    //             tempCont.release()
    //             if (err) {
    //                 console.log(err)
    //             }

    //             else {
    //                 console.log('Last item id is found')
    //                 res.send(result)
    //                 res.end()
    //                 return
    //             }

    //         })
    //     }
    // })

}

const pair = (req, res) => {
    let Locations = req.body.Locations;
    let Item_id = req.body.Item_id;

    // sb.getConnection(function (error, tempCont){
    //     if(error){
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else{
    //         if (typeof Locations != "object" && typeof Item_id != "number") {
    //             res.send("Invalid");
    //             res.end();
    //             return;
    //         }
    //         if (Locations, Item_id) {
    //             for (let location in Locations) {
    //                 const sqlInsert = `INSERT INTO sql5669328.itemlocation (Location_id, Item_id, Quantity) VALUES (?,?,0);`
    //                 tempCont.query(sqlInsert, [Locations[location].Location_id, Item_id], (err, result) => {
    //                     if (err) {
    //                         console.log(err);
    //                         return
    //                     }

    //                     else {
    //                         console.log('Pairing items to locations in process')
    //                         res.send();
    //                         res.end()
    //                         return
    //                     }

    //                 })
    //             }
    //             tempCont.release()
    //             console.log('Pairing complete')
    //         }
    //     }
    // })


}

const tab2 = async (req, res) => {

    try {
        let sqlGet = `SELECT item."Name" as "Item",itemlocation."Item_id", array_agg(itemlocation."Quantity")as "Quantities"
        from public.itemlocation
        join public.item on item."Item_id" = itemlocation."Item_id"
		group by itemlocation."Item_id", item."Name"
		order by itemlocation."Item_id"`
        const response = await sb.query(sqlGet);
        res.send({ status: 'complete', data: response.rows })
        return
    }
    catch (error) {
        res.sendStatus(500).json({ "message": error.message })
        return
    }

    // sb.getConnection(function (error, tempCont){
    //     if(error){
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else{
    //         const sqlGet = `SELECT i.Name as Item, l.Name as Location, il.Quantity
    //         from sql5669328.itemlocation il
    //         join sql5669328.item i on il.Item_id = i.Item_id
    //         join sql5669328.location l on il.Location_id = l.Location_id
    //         order by i.Name;`

    //           tempCont.query(sqlGet, (err, result) => {
    //             tempCont.release()
    //             if (err) {
    //                 console.log(err)
    //             }  

    //             else {
    //                 console.log('Items tab2 data found')
    //                 res.send(result);
    //                 res.end();
    //                 return;
    //             }

    //           })
    //     }
    // })

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
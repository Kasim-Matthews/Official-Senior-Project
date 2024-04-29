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

const location_index = async (req, res) => {

    try {
        let sqlGet = `SELECT * from public.location`
        const response = await sb.query(sqlGet);
        res.send({ status: 'complete', data: response.rows })
        return
    }
    catch (error) {
        console.log(error)
        return
    }

    // sb.getConnection(function (error, tempCont){
    //     if(error){
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else{
    //         const sqlGet = "SELECT * FROM sql5669328.location;"
    //         tempCont.query(sqlGet, (err, result) => {
    //             tempCont.release()
    //             if (err) {
    //                 console.log(err)
    //                 return
    //             }

    //             else {
    //                 console.log('Location data found')
    //                 res.send(result);
    //                 res.end();
    //                 return
    //             }

    //         })
    //     }
    // })

}

const anything_else = async (req, res) => {

    try {
        let sqlGet = `SELECT * from public.location WHERE "DeletedAt" IS NULL`
        const response = await sb.query(sqlGet);
        res.send({ status: 'complete', data: response.rows })
        return
    }
    catch (error) {
        console.log(error)
        return
    }

    // sb.getConnection(function (error, tempCont){
    //     if(error){
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else{
    //         const sqlGet = "SELECT * FROM sql5669328.location WHERE DeletedAt IS null;"
    //         tempCont.query(sqlGet, (err, result) => {
    //             tempCont.release()
    //             if (err) {
    //                 console.log(err)
    //                 return
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

const location_creation = async (req, res) => {
    let Name = req.body.name;
    let Address = req.body.Address;

    if (typeof Name != "string" && typeof Address != "string") {
        res.sendStatus(400);
        res.end();
        return;
    }

    try {
        const locationinsert = `INSERT INTO public.location ("Name", "Address") VALUES ('{${Name}}', '{${Address}')`
        const locationcreation = await sb.query(locationinsert)

        const partnercreation = `INSERT INTO public.partner ("Name", "Address", "Location", "Type_id") VALUES ('{${Name}}', '{${Address}', (SELECT "Location_id" from public.location ORDER BY "Location_id" DESC Limit 1), (SELECT partnertype."PartnerType_id" from public.partnertype WHERE "Type" = 'Adjustment'))`
        const createpartner = await sb.query(partnercreation)

        const locationpair = `INSERT INTO public.itemlocation ("Location_id", "Item_id")
        SELECT p."Location_id", t."Item_id"
        from (SELECT "Location_id" from public.location ORDER BY "Location_id" DESC Limit 1) p,
             (SELECT "Item_id" from public.item Order by "Item_id") t`
        const locationpairing = await sb.query(locationpair)

        res.sendStatus(200)
        res.end();
        return;
    }

    catch (error) {
        console.log(error)
        res.status(500).json(error);
        return;
    }

    // sb.getConnection(function (error, tempCont){
    //     if(error){
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else{
    //         if (typeof Name != "string" && typeof Address != "string") {
    //             res.send("Invalid");
    //             res.end();
    //             return;
    //         }

    //         if (Name && Address) {
    //             const sqlInsert = "INSERT INTO sql5669328.location (Name, Address) VALUES (?,?);"
    //             tempCont.query(sqlInsert, [Name, Address], (err, result) => {
    //                 tempCont.release()
    //                 if (err) {
    //                     console.log(err);
    //                     return
    //                 }

    //                 else {
    //                     console.log('Location created')
    //                     res.send();
    //                     res.end();
    //                     return
    //                 }

    //             })
    //         }
    //     }
    // })

}

const location_delete = async (req, res) => {
    let id = req.params.id;
    let date = req.body.date;

    if (typeof id != "string" && typeof date != "string") {
        res.sendStatus(400);
        res.end();
        return;
    }

    try {
        const sqlUpdate = `UPDATE public.location Set "DeletedAt" = '{${date}}' WHERE "Location_id" = ${id}`
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

    // sb.getConnection(function (error, tempCont){
    //     if(error){
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else{
    //         if (typeof id != "string" && typeof date != "string") {
    //             res.send("Invalid");
    //             res.end();
    //             return;
    //         }

    //         if (id) {
    //             const sqlDelete = `UPDATE sql5669328.location Set DeletedAt= STR_TO_Date(?, '%m/%d/%Y') WHERE Location_id = ?;`
    //             tempCont.query(sqlDelete, [date, id], (err, result) => {
    //                 tempCont.release()
    //                 if (err) {
    //                     console.log(err);
    //                     return
    //                 }

    //                 else {
    //                     console.log('Location deleted')
    //                     res.send();
    //                     res.end();
    //                     return;
    //                 }

    //             })
    //         }
    //     }
    // })

}

const location_reactivate = async (req, res) => {
    let id = req.params.id;

    if (typeof id != "string") {
        res.sendStatus(400);
        res.end();
        return;
    }

    try {
        const sqlUpdate = `UPDATE public.location Set "DeletedAt" = NULL WHERE "Location_id" = ${id}`
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
    //             const sqlDelete = `UPDATE sql5669328.location Set DeletedAt= NULL WHERE Location_id = ?;`
    //             tempCont.query(sqlDelete, [id], (err, result) => {
    //                 tempCont.release()
    //                 if (err) {
    //                     console.log(err);
    //                     return
    //                 }

    //                 else {
    //                     console.log('Reactivated location')
    //                     res.send();
    //                     res.end();
    //                     return
    //                 }

    //             })
    //         }
    //     }
    // })

}

const location_edit = async (req, res) => {
    let id = req.params.id

    if (typeof id != "string") {
        req.sendStatus(400);
        res.end();
        return
    }

    if (id) {
        try {
            let sqlGet = `SELECT * FROM public.location WHERE "Location_id" = ${id};`
            const response = await sb.query(sqlGet);
            res.send({ status: 'complete', data: response.rows })
            return
        }
        catch (error) {
            console.log(error)
            return
        }
    }

    // sb.getConnection(function (error, tempCont){
    //     if(error){
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //         return
    //     }
    //     else{
    //         if (typeof id != "string") {
    //             res.send("Invalid");
    //             res.end();
    //             return;
    //         }

    //         if (id) {
    //             const sqlGet = 'SELECT * FROM sql5669328.location WHERE Location_id= ?;'
    //             tempCont.query(sqlGet, [id], (err, result) => {
    //                 tempCont.release();
    //                 if (err) {
    //                     console.log(err);
    //                     return
    //                 }

    //                 else {
    //                     console.log('Location edit data found')
    //                     res.send(result);
    //                     res.end();
    //                     return
    //                 }

    //             })
    //         }
    //     }
    // })

}

const tab_1 = async (req, res) => {
    let id = req.params.id

    if (typeof id != "string") {
        req.sendStatus(400);
        res.end();
        return
    }

    if (id) {
        try {
            let sqlGet = `SELECT item."Name" as Item, itemlocation."Quantity" 
            FROM public.itemlocation 
            join public.item on item."Item_id" = itemlocation."Item_id"
            WHERE itemlocation."Location_id" = ${id}
            order by itemlocation."Item_id"`
            const response = await sb.query(sqlGet);
            res.send({ status: 'complete', data: response.rows })
            return
        }
        catch (error) {
            console.log(error)
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
    //             const sqlGet = `SELECT i.Name as Item, il.Quantity
    //             from sql5669328.itemlocation il
    //             join sql5669328.item i on il.Item_id = i.Item_id
    //             WHERE il.Location_id = ?
    //             order by il.Item_id;`
    //             tempCont.query(sqlGet, [id], (err, result) => {
    //                 tempCont.release();
    //                 if (err) {
    //                     console.log(err)
    //                     return
    //                 }

    //                 else {
    //                     console.log('Location tab1 data found')
    //                     res.send(result);
    //                     res.end();
    //                     return
    //                 }

    //             })
    //         }
    //     }
    // })

}

const tab_2 = async (req, res) => {
    let id = req.params.id

    if (typeof id != "string") {
        req.sendStatus(400);
        res.end();
        return
    }

    if (id) {
        try {
            let sqlGet = `SELECT item."Name" as "Item", SUM(orderitems."Quantity") as "Quantity", itemlocation."Item_id" 
            FROM public.itemlocation 
            join public.item on item."Item_id" = itemlocation."Item_id"
            join public.orderitems on "ItemLocationFK" = "ItemLocation_id"
            WHERE itemlocation."Location_id" = ${id}
			group by item."Name", itemlocation."Item_id"
			order by itemlocation."Item_id"`
            const response = await sb.query(sqlGet);
            res.send({ status: 'complete', data: response.rows })
            return
        }
        catch (error) {
            console.log(error)
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
    //             const sqlGet = `SELECT i.Name as Item, SUM(oi.Quantity) as Quantity, il.Item_id
    //             from sql5669328.itemlocation il
    //             join sql5669328.item i on il.Item_id = i.Item_id
    //             join sql5669328.orderitems oi on oi.ItemLocationFK = il.ItemLocation_id
    //             WHERE il.Location_id = ?
    //             group by i.Name, il.Item_id
    //             order by il.Item_id;`
    //             tempCont.query(sqlGet, [id], (err, result) => {
    //                 tempCont.release()
    //                 if (err) {
    //                     console.log(err)
    //                     return
    //                 }

    //                 else {
    //                     console.log('Location tab 2 data found')
    //                     res.send(result);
    //                     res.end();
    //                     return
    //                 }

    //             })
    //         }
    //     }
    // })

}

const tab_3 = async (req, res) => {
    let id = req.params.id

    if (typeof id != "string") {
        req.sendStatus(400);
        res.end();
        return
    }

    if (id) {
        try {
            let sqlGet = `SELECT item."Name" as "Item", SUM(intakeitems."Quantity") as "Quantity", itemlocation."Item_id" 
            FROM public.itemlocation 
            join public.item on item."Item_id" = itemlocation."Item_id"
            join public.intakeitems on "FKItemLocation" = "ItemLocation_id"
            WHERE itemlocation."Location_id" = ${id}
			group by item."Name", itemlocation."Item_id"
			order by itemlocation."Item_id"`
            const response = await sb.query(sqlGet);
            res.send({ status: 'complete', data: response.rows })
            return
        }
        catch (error) {
            console.log(error)
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
    //             const sqlGet = `SELECT i.Name as Item, SUM(ii.Quantity) as Quantity, il.Item_id
    //             from sql5669328.itemlocation il
    //             join sql5669328.item i on il.Item_id = i.Item_id
    //             join sql5669328.intakeitems ii on ii.FKItemLocation = il.ItemLocation_id
    //             WHERE il.Location_id = ?
    //             group by i.Name, il.Item_id
    //             order by il.Item_id;`
    //             tempCont.query(sqlGet, [id], (err, result) => {
    //                 tempCont.release()
    //                 if (err) {
    //                     console.log(err)
    //                     return
    //                 }

    //                 else {
    //                     console.log('Location tab 3 data found')
    //                     res.send(result);
    //                     res.end();
    //                     return
    //                 }

    //             })
    //         }
    //     }
    // })

}

const location_update = async (req, res) => {

    let id = req.params.id
    let Name = req.body.name;
    let Address = req.body.Address;

    if (typeof Name != "string" && typeof Address != "string" && typeof id != "string") {
        res.sendStatus(400);
        res.end();
        return;
    }

    try {
        const updatelocation = `UPDATE public.location SET "Name" = '{${Name}}', "Address" = '{${Address}}' WHERE "Location_id" = ${id}`
        const locationupdate = await sb.query(updatelocation)
        res.sendStatus(200)
        res.end();
        return;
    }
    catch (error) {
        console.log(error)
        res.status(500).json(error);
        return;
    }

    // sb.getConnection(function (error, tempCont){
    //     if(error){
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else{
    //         if (typeof Name != "string" && typeof Address != "string" && typeof id != "string") {
    //             res.send("Invalid");
    //             res.end();
    //             return;
    //         }

    //         if (Name && Address && id) {
    //             const sqlUpdate = "UPDATE sql5669328.location SET Name= ?, Address= ? WHERE Location_id = ?;"
    //             tempCont.query(sqlUpdate, [Name, Address, id], (err, result) => {
    //                 tempCont.release()
    //                 if (err) {
    //                     console.log(err);
    //                 }

    //                 else {
    //                     console.log('Location updated')
    //                     res.send();
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
        let sqlGet = `SELECT "Location_id" 
        from public.location
        ORDER BY "Location_id" DESC
        Limit 1`
        const response = await sb.query(sqlGet);
        res.send({ status: 'complete', data: response.rows })
        return
    }
    catch (error) {
        console.log(error)
        return
    }
    // sb.getConnection(function (error, tempCont){
    //     if(error){
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else{
    //         const sqlGet = `SELECT Location_id from sql5669328.location
    //         ORDER BY Location_id DESC
    //         Limit 1;`
    //         tempCont.query(sqlGet, (err, result) => {
    //             tempCont.release();
    //             if (err) {
    //                 console.log(err)
    //             }

    //             else {
    //                 console.log('Last Location id found')
    //                 res.send(result)
    //                 res.end();
    //                 return
    //             }

    //         })
    //     }
    // })

}

const pair = (req, res) => {
    let Items = req.body.Items;

    // sb.getConnection(function (error, tempCont){
    //     if(error){
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else{
    //         if (typeof Items != "object") {
    //             res.send("Invalid");
    //             res.end();
    //             return;
    //         }
    //         if (Location_id, Items) {
    //             for (let item in Items) {
    //                 const sqlInsert = `INSERT INTO sql5669328.itemlocation (Location_id, Item_id, Quantity) VALUES ((SELECT Location_id as Type from sql5669328.location ORDER BY Location_id DESC Limit 1),?,0);`
    //                 tempCont.query(sqlInsert, [Items[item].Item_id], (err, result) => {
    //                     if (err) {
    //                         console.log(err);
    //                         return
    //                     }

    //                     else {
    //                         console.log('Pairing locations to items in process')
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



const partner = (req, res) => {
    let name = req.body.name
    let address = req.body.address

    // sb.getConnection(function (error, tempCont){
    //     if(error){
    //         console.log('Error')
    //         res.status(500).json({'message': error.message})
    //     }
    //     else{
    //         if(typeof name != " string" && typeof address != "string"){
    //             res.send("Invalid")
    //             res.end();
    //             return;
    //         }

    //         if(name && address){
    //             const sqlInsert = `INSERT INTO sql5669328.partner (Name, Address, Location, Type) VALUES (?,?,(SELECT Location_id as Type from sql5669328.location ORDER BY Location_id DESC Limit 1),(SELECT PartnerType_id as Type from sql5669328.partnertype WHERE Type = 'Adjustment'));`
    //             tempCont.query(sqlInsert, [name, address], (err, result) =>{
    //                 tempCont.release()

    //                 if (err) {
    //                     console.log(err)
    //                     return
    //                 }

    //                 else {
    //                     console.log('Adjustment Partner added')
    //                     res.send();
    //                     res.end();
    //                     return
    //                 }

    //             })
    //         }
    //     }
    // })

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
const mysql = require('mysql2');
const sb = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "WebVoyage2023!",
    port: 3006
});

const item_index = (req, res) => {
    const sqlGet = "SELECT * FROM test.item WHERE active = 1;"
    sb.query(sqlGet, (err, result) =>{
        res.send(result);
    }) 
}

const item_creation = (req, res) => {
    let name = req.body.name;
    let marketValue = req.body.marketValue;
    let packageSize = req.body.packageSize;
    let active = req.body.active;

    if(typeof name != "string" && typeof marketValue != "number" && typeof packageSize != "number"){
        res.send("Invalid");
        res.end();
        return;
    }

    if(name && marketValue && packageSize){
        const sqlInsert = "INSERT INTO test.item (Name, marketValue, packageSize, active) VALUES (?,?,?,?);"
        sb.query(sqlInsert, [name, marketValue, packageSize, active], (err, result) =>{
        console.log(err);
    })
    }
}

const item_delete = (req, res) => {
    let id = req.params.id;
    if(typeof id != "string"){
        res.send("Invalid");
        res.end();
        return;
    }

    if(id){
        const sqlDelete = 'DELETE FROM test.item WHERE iditem = ?;'
        sb.query(sqlDelete, [id], (err, result) => {
        console.log(err);
        })
    }
}

const item_edit = (req, res) => {
    let id = req.params.id

    if(typeof id != "string"){
        res.send("Invalid");
        res.end();
        return;
    }

    if(id){
        const sqlGet = 'SELECT * FROM test.item WHERE iditem = ?;'
        sb.query(sqlGet, [id], (err, result) => {
        res.send(result);
        })
    }    
}

const item_update = (req, res) => {
    
    let id = req.params.id
    let name = req.body.name;
    let marketValue = req.body.marketValue;
    let packageSize = req.body.packageSize;
    let active = req.body.active;


    if(typeof id != "string" && typeof name != "string" && typeof marketValue != "number" && typeof packageSize != "number"){
        res.send("Invalid");
        res.end();
        return;
    }

    if(name && marketValue && packageSize && id){
        const sqlUpdate = "UPDATE test.dis SET name= ?, marketValue= ?, packageSize= ?, active= ? WHERE id = ?;"
        sb.query(sqlUpdate, [name, marketValue, packageSize, active, id], (err, result) =>{
        console.log(err);
    })
    }
}


module.exports = {
    item_index,
    item_creation,
    item_delete,
    item_update,
    item_edit
}
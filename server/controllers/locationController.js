const mysql = require('mysql2');
const sb = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "WebVoyage2023!",
    port: 3006
});

const location_index = (req, res) => {
    const sqlGet = "SELECT * FROM test.location;"
    sb.query(sqlGet, (err, result) =>{
        res.send(result);
    }) 
}

const location_creation = (req, res) => {
    let Name = req.body.name;
    let Adress = req.body.Adress;
    let marketValue = req.body.marketValue;
    let totalInventory = req.body.totalInventory;

    if(typeof Name != "string" && typeof marketValue != "number" && typeof Adress != "string" && typeof totalInventory != "number"){
        res.send("Invalid");
        res.end();
        return;
    }

    if(Name && Adress && marketValue && totalInventory){
        const sqlInsert = "INSERT INTO test.location (Name, Adress, marketValue, totalInventory) VALUES (?,?,?,?);"
        sb.query(sqlInsert, [Name, Adress, marketValue, totalInventory], (err, result) =>{
        console.log(err);
    })
    }
}

const location_delete = (req, res) => {
    let id = req.params.id;
    if(typeof id != "string"){
        res.send("Invalid");
        res.end();
        return;
    }

    if(id){
        const sqlDelete = 'DELETE FROM test.location WHERE id = ?;'
        sb.query(sqlDelete, [id], (err, result) => {
        console.log(err);
        })
    }
}

const location_edit = (req, res) => {
    let id = req.params.id

    if(typeof id != "string"){
        res.send("Invalid");
        res.end();
        return;
    }

    if(id){
        const sqlGet = 'SELECT * FROM test.location WHERE id= ?;'
        sb.query(sqlGet, [id], (err, result) => {
        res.send(result);
        })
    }    
}

const location_update = (req, res) => {
    
    let id = req.params.id
    let Name = req.body.name;
    let Adress = req.body.Adress;
    let marketValue = req.body.marketValue;
    let totalInventory = req.body.totalInventory;

    if(typeof Name != "string" && typeof marketValue != "number" && typeof Adress != "string" && typeof totalInventory != "number" && typeof id != "string"){
        res.send("Invalid");
        res.end();
        return;
    }

    if(Name && Adress && marketValue && totalInventory && id){
        const sqlUpdate = "UPDATE test.location SET Name= ?, Adress= ?, marketValue= ?, totalInventory= ? WHERE id = ?;"
        sb.query(sqlUpdate, [Name, Adress, marketValue, totalInventory, id], (err, result) =>{
        console.log(err);
    })
    }
}


module.exports = {
    location_index,
    location_creation,
    location_delete,
    location_update,
    location_edit
}
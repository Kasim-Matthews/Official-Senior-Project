const mysql = require('mysql2');
const sb = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "WebVoyage2023!",
    database: 'claire',
    port: 3006
});

const partner_index = (req, res) => {
    const sqlGet = "SELECT * FROM partner;"
    sb.query(sqlGet, (err, result) =>{
        res.send(result);
    })
}

const partner_create = (req, res) => {
    let Name = req.body.name;
    let Email = req.body.email;

    if(typeof Name != "string" && typeof Email != "string"){
        res.send("Invalid");
        res.end();
        return;
    }

    if(Name && Email){
        const sqlInsert = "INSERT INTO partner (name, email) VALUES (?,?);"
        sb.query(sqlInsert, [Name, Email], (err, result) =>{
        console.log(result);
    }) 
    }
}

const partner_delete = (req, res) => {
    let id = req.params.id;
    if(typeof id != "string"){
        res.send("Invalid");
        res.end();
        return;
    }

    if(id){
        const sqlDelete = 'DELETE FROM partner WHERE Partner_id = ?;'
        sb.query(sqlDelete, [id], (err, result) => {
        console.log(err);
        })
    }
}

const partner_edit = (req, res) => {
    let id = req.params.id

    if(typeof id != "string"){
        res.send("Invalid");
        res.end();
        return;
    }

    if(id){
        const sqlGet = 'SELECT * FROM partner WHERE Partner_id = ?;'
        sb.query(sqlGet, [id], (err, result) => {
        res.send(result);
        })
    }    
}

const partner_update = (req, res) => {
    
    let id = req.params.id
    let Name = req.body.name;
    let Email = req.body.email;



    if(typeof id != "string" && typeof Name != "string" && typeof Email != "string"){
        res.send("Invalid");
        res.end();
        return;
    }

    if(Name && Email && id){
        const sqlUpdate = "UPDATE partner SET Name= ?, Email= ? WHERE Partner_id = ?;"
        sb.query(sqlUpdate, [Name, Email, id], (err, result) =>{
        console.log(err);
    })
    }
}

module.exports = {
    partner_create,
    partner_index,
    partner_delete,
    partner_update,
    partner_edit
}
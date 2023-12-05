const mysql = require('mysql2');
const sb = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "WebVoyage2023!",
    port: 3006
});

const partner_index = (req, res) => {
    const sqlGet = "SELECT * FROM test.partner;"
    sb.query(sqlGet, (err, result) =>{
        res.send(result);
    })
}

const partner_create = (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let comments = req.body.comments;
    let representative = req.body.representative;

    if(typeof name != "string" && typeof email != "string"){
        res.send("Invalid");
        res.end();
        return;
    }

    if(name && email){
        const sqlInsert = "INSERT INTO test.partner (name, email, comments, representative) VALUES (?,?,?,?);"
        sb.query(sqlInsert, [name, email, comments, representative], (err, result) =>{
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
        const sqlDelete = 'DELETE FROM test.partner WHERE id = ?;'
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
        const sqlGet = 'SELECT * FROM test.partner WHERE id = ?;'
        sb.query(sqlGet, [id], (err, result) => {
        res.send(result);
        })
    }    
}

const partner_update = (req, res) => {
    
    let id = req.params.id
    let name = req.body.name;
    let email = req.body.email;
    let comments = req.body.comments;
    let representative = req.body.representative;


    if(typeof id != "string" && typeof name != "string" && typeof email != "string"){
        res.send("Invalid");
        res.end();
        return;
    }

    if(name && email && id){
        const sqlUpdate = "UPDATE test.partner SET name= ?, email= ?, comments= ?, representative= ? WHERE id = ?;"
        sb.query(sqlUpdate, [name, email, comments, representative, id], (err, result) =>{
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
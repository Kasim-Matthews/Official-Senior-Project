const mysql = require('mysql2');
const sb = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "WebVoyage2023!",
    port: 3006
});

const distribution_index = (req, res) => {
    const sqlGet = "SELECT * FROM test.dis;"
    sb.query(sqlGet, (err, result) =>{
        res.send(result);
    }) 
}

const distribution_creation = (req, res) => {
    
    let partner = req.body.partner;
    let date = req.body.date;
    let source = req.body.source;
    let totalitems = req.body.totalitems;
    let value = req.body.value;
    let deliverymethod = req.body.deliverymethod;
    let comments = req.body.comments;
    let state = req.body.state;

    if(typeof partner != "string" && typeof date != "string" && typeof source != "string" && typeof totalitems != "number" && typeof value != "number" && typeof deliverymethod != "string" && typeof comments != "string"){
        res.send("Invalid");
        res.end();
        return;
    }

    if(partner && date && source && totalitems && value && deliverymethod){
        const sqlInsert = "INSERT INTO test.dis (partner, date, source, totalitems, value, deliverymethod, comments, state) VALUES (?,?,?,?,?,?,?,?);"
        sb.query(sqlInsert, [partner, date, source, totalitems, value, deliverymethod, comments, state], (err, result) =>{
        console.log(err);
    })
    }
}

const distribution_remove = (req, res) => {
    
    let id = req.params.id;
    if(typeof id != "string"){
        res.send("Invalid");
        res.end();
        return;
    }

    if(id){
        const sqlDelete = 'DELETE FROM test.dis WHERE id = ?;'
        sb.query(sqlDelete, [id], (err, result) => {
        console.log(err);
        })
    }
}

module.exports = {
    distribution_index,
    distribution_creation,
    distribution_remove
}
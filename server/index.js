const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mysql = require('mysql2')

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "WebVoyage2023!",
    port: 3006
});
app.use(cors())
app.use(express.json())
app.post('/api/insert', (req, res) =>{

    let partner = req.body.partner;
    let date = req.body.date;
    let source = req.body.source;
    let totalitems = req.body.totalitems;
    let value = req.body.value;
    let deliverymethod = req.body.deliverymethod;
    let comments = req.body.comments;
    let state = req.body.state;

    const sqlInsert = "INSERT INTO test.dis (partner, date, source, totalitems, value, deliverymethod, comments, state) VALUES (?,?,?,?,?,?,?,?);"
    db.query(sqlInsert, [partner, date, source, totalitems, value, deliverymethod, comments, state], (err, result) =>{
        console.log(err);
    })
})

app.get("/", (req, res) => {
    res.send("hello")
    
    const sqlInsert = "INSERT INTO notes.note (name) VALUES ('Kasim');"
    db.query(sqlInsert, (err, result) => {
        if(err){
            console.log('Error: ', err);
            return
        }
        console.log(result);
    })
})

app.listen('4002', () => {
    console.log("running on port 4002");
})

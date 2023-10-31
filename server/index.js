const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mysql = require('mysql2')

const sb = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "WebVoyage2023!",
    port: 3006
});
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true}));

app.get('/api/get', (req, res) =>{
    const sqlGet = "SELECT * FROM test.dis;"
    sb.query(sqlGet, (err, result) =>{
        res.send(result);
    }) 
})

app.get('/partner', (req, res) =>{
    const sqlGet = "SELECT * FROM test.partner;"
    sb.query(sqlGet, (err, result) =>{
        res.send(result);
    }) 
})

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
    sb.query(sqlInsert, [partner, date, source, totalitems, value, deliverymethod, comments, state], (err, result) =>{
        console.log(err);
    })
})

app.post('/addpartner', (req, res) =>{

    let name = req.body.name;
    let email = req.body.email;
    let comments = req.body.comments;
    let representative = req.body.representative;

    const sqlInsert = "INSERT INTO test.partner (name, email, comments, representative) VALUES (?,?,?,?);"
    sb.query(sqlInsert, [name, email, comments, representative], (err, result) =>{
        console.log(result);
    })
})

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Lindsey1!",
    database: "claire",
    port: 3306
})

app.post("/register", (req, res) => {
   
    const username = req.body.username;
    const password = req.body.password;

    db.query(
        "INSERT INTO login (username, password) VALUES (?,?)",
        [username, password],
        (err, result) => {
            console.log(err);
        }
    )
})

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query(
        "SELECT * FROM login WHERE username = ? AND password = ?",
        [username, password],
        (err, result) => {

            if(err){
                res.send({err: err})

            }



            if (result.length > 0) {
                res.send(result)
            }else {
                res.send({message: "Wrong username/password combination!"})
            }
            
        }
    )
})

app.get('/', (req, res) =>{
    res.send('hello world');
})

app.listen('3001', () => {
    console.log("running on port 3001");
})

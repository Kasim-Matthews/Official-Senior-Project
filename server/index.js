const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mysql = require('mysql2')
const cors = require('cors')
app.use(cors())
app.use(express.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
    });


const db = mysql.createPool({
const distributionRoute = require('./routes/distribution');
const partnerRoute = require('./routes/partner');
const itemRoute = require('./routes/item');
const locationRoute = require('./routes/location')
const manufacturersRoute = require('./routes/manufacturers')


app.use(bodyParser.urlencoded({ extended: true}));
app.use('/distribution', distributionRoute);
app.use('/partner', partnerRoute);
app.use('/item', itemRoute);
app.use('/location', locationRoute);
app.use('/manufacturers', manufacturersRoute);
app.use(cors());
app.use(express.json())





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
        "INSERT INTO register (usernameReg, passwordReg) VALUES (?,?)",
        [username, password],
        (err, result) => {
            console.log(err);
        }
    )
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

app.post('/login', (req, res) => {
    console.log(req.body)
    const username = req.body.username;
    const password = req.body.password;

    db.query(
        "SELECT * FROM register WHERE usernameReg = ? AND passwordReg = ?",
        [username, password],
        (err, result) => {

            if(err){
                res.send({err: err})

            }



            if (result.length > 0) {
                res.send({ status: 'ok', user: result[0] }); // Send user data and status
            } else {
                res.send({ status: 'error', message: "Wrong username/password combination!" });
            }
            
        }
    )
})

app.get('/item-location-data', (req, res) => {
    const query = `
        SELECT i.Name as itemName, l.Name as locationName, il.Quantity
        FROM itemlocation il
        JOIN item i ON il.Item_id = i.Item_id
        JOIN location l ON il.Location_id = l.Location_id;
    `;

    db.query(query, (err, result) => {
        if (err) {
            res.send({ status: 'error', message: err.message });
        } else {
            res.send({ status: 'ok', data: result });
        }
    });
});

app.get('/', (req, res) =>{
    res.send('hello world');
})

app.listen('3001', () => {
    console.log("running on port 3001");
})

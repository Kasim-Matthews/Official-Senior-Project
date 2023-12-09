const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors')
const bodyParser = require('body-parser')

const sb = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "WebVoyage2023!",
    database: 'claire',
    port: 3006
});

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true}));

app.get('/intake', (req, res) =>{
    const sqlGet = "SELECT * FROM claire.intake;"
    sb.query(sqlGet, (err, result) =>{
        res.send(result);
    }) 
})

app.post('/intake/new', (req, res) =>{

    let Comments = req.body.Comments;
    let RecievedDate = req.body.RecievedDate;
    let Value = req.body.Value;
    let Partner = req.body.Partner;


    const sqlInsert = "INSERT INTO intake (Comments, RecievedDate, Value, Partner) VALUES (?,?,?,?);"
    sb.query(sqlInsert, [Comments, RecievedDate, Value, Partner], (err, result) =>{
        console.log(err);
    })
})



app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
    });


const distributionRoute = require('./routes/distribution');
const partnerRoute = require('./routes/partner');
const itemRoute = require('./routes/item');
const locationRoute = require('./routes/location')
const manufacturersRoute = require('./routes/manufacturers')
const accountRoute = require('./routes/account')


app.use('/distribution', distributionRoute);
app.use('/partner', partnerRoute);
app.use('/item', itemRoute);
app.use('/location', locationRoute);
app.use('/manufacturers', manufacturersRoute);
app.use('/', accountRoute);






const cb = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "WebVoyage2023!",
    database: 'claire',
    port: 3006
});

app.post("/register", (req, res) => {
   
    const username = req.body.username;
    const password = req.body.password;

    cb.query(
        "INSERT INTO register (usernameReg, passwordReg) VALUES (?,?)",
        [username, password],
        (err, result) => {
            console.log(err);
        }
    )
})





app.post('/login', (req, res) => {
    console.log(req.body)
    const username = req.body.username;
    const password = req.body.password;

    cb.query(
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
        FROM claire.itemlocation il
        JOIN claire.item i ON il.Item_id = i.Item_id
        JOIN claire.location l ON il.Location_id = l.Location_id;
    `;

    cb.query(query, (err, result) => {
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

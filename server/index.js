const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors')
const bodyParser = require('body-parser')

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Piano2601!",
    port: 3306
});

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true}));

app.get('/api/get', (req, res) =>{
    const sqlGet = "SELECT * FROM purchase form;"
    db.query(sqlGet, (err, result) =>{
        res.send(result);
    }) 
})

app.post('/api/insert', (req, res) =>{

    let vendorName = req.body.vendorName;
    let purchaseDate = req.body.purchaseDate;
    let diaperQuantity = req.body.diaperQuantity;
    let diaperPrice = req.body.diaperPrice;
    let wipesQuantity = req.body.wipesQuantity;
    let wipesPrice = req.body.wipesPrice;
    let totalPrice = req.body.totalPrice;
    let comment = req.body.comment;

    const sqlInsert = "INSERT INTO test.dis (vendorName, purchaseDate, diaperQuantity, diaperPrice, wipesQuantity, wipesPrice, totalPrice, comment) VALUES (?,?,?,?,?,?,?,?);"
    db.query(sqlInsert, [vendorName, purchaseDate, diaperQuantity, diaperPrice, wipesQuantity, wipesPrice, totalPrice, comment], (err, result) =>{
        console.log(err);
    })
})

app.post('/api/insert', (req, res) =>{

    let vendorName = req.body.vendorName;
    let organizationType = req.body.organizationType;
    let location = req.body.location;
    let notes = req.body.notes;
    
    const sqlInsert = "INSERT INTO test.dis (vendorName, organizationType, location, notes) VALUES (?,?,?,?);"
    db.query(sqlInsert, [vendorName, organizationType, location, notes], (err, result) =>{
        console.log(err);
    })
})

app.post('/api/insert', (req, res) =>{

    let product = req.body.product;
    let fairMarketValue = req.body.fairMarketValue;
    let Date = req.body.Date;
    let Notes = req.body.Notes;
    
    const sqlInsert = "INSERT INTO test.dis (product, fairMarketValue, Date, Notes) VALUES (?,?,?,?);"
    db.query(sqlInsert, [product, fairMarketValue, Date, Notes], (err, result) =>{
        console.log(err);
    })
})

app.post('/api/insert', (req, res) =>{

    let productName = req.body.productName;
    let productType = req.body.productType;
    let source = req.body.source;
    let description = req.body.description;
    let price = req.body.price;
    
    const sqlInsert = "INSERT INTO test.dis (productName, productType, source, description, price) VALUES (?,?,?,?);"
    db.query(sqlInsert, [productName, productType, source, description, price], (err, result) =>{
        console.log(err);
    })
})
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


const distributionRoute = require('./routes/distribution');
const partnerRoute = require('./routes/partner');
const itemRoute = require('./routes/item');
const locationRoute = require('./routes/location')
const manufacturersRoute = require('./routes/manufacturers')
const accountRoute = require('./routes/account')


app.use(bodyParser.urlencoded({ extended: true}));
app.use('/distribution', distributionRoute);
app.use('/partner', partnerRoute);
app.use('/item', itemRoute);
app.use('/location', locationRoute);
app.use('/manufacturers', manufacturersRoute);
app.use('/', accountRoute);
app.use(cors());
app.use(express.json())





const cb = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Lindsey1!",
    database: "claire",
    port: 3306
})

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
        FROM itemlocation il
        JOIN item i ON il.Item_id = i.Item_id
        JOIN location l ON il.Location_id = l.Location_id;
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

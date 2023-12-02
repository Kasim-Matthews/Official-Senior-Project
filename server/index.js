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

app.listen('3001', () => {
    console.log("running on port 3001");
})
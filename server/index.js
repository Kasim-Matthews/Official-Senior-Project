const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors')
const bodyParser = require('body-parser')

const sb = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Piano2601!",
    database: 'claire',
    port: 3306
});

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true}));

app.get('/intake', (req, res) =>{
    const sqlGet = `
    select p.Name, i.Comments as Comments, i.RecievedDate as RecievedDate, i.Value as Value
    from claire.intake i
    join claire.partner p on i.Partner = p.Partner_id
    `;
    sb.query(sqlGet, (err, result) =>{
        res.send(result);
    }) 
})

app.post('/intake/new', (req, res) =>{

    let Comments = req.body.Comments;
    let RecievedDate = req.body.RecievedDate;
    let Value = req.body.Value;
    let Partner = req.body.Partner;


    const sqlInsert = "INSERT INTO claire.intake (Comments, RecievedDate, Value, Partner) VALUES (?,?,?,?);"
    sb.query(sqlInsert, [Comments, RecievedDate, Value, Partner], (err, result) =>{
        console.log(err);
    })
})

app.post('/intake/location', (req, res) => {
    let Item_id = req.body.Item_id;
    let Location_id = req.body.Location_id;

    const query = `
    select il.ItemLocation_id
    from itemlocation il
    JOIN item i ON il.Item_id = i.Item_id
    JOIN location l ON il.Location_id = l.Location_id
    WHERE i.Item_id = ? AND l.Location_id = ?
    `;

    sb.query(query, [Item_id, Location_id], (err, result) => {
        res.send(result);
    })
})

app.get('/intake/find_id', (req, res) => {
    const query = "SELECT MAX(Intake_id) as Intake_id FROM claire.intake;"

    sb.query(query, (err, result) => {
        res.send(result);
    })
})

app.post('/intake/track', (req, res) => {
    let Intake_id = req.body.Intake_id;
    let Quantity = req.body.Quantity;
    let Value = req.body.Value;
    let FKItemLocation = req.body.FKItemLocation;

    const sqlInsert = "INSERT INTO claire.intakeitems (Intake_id, Quantity, Value, FKItemLocation) VALUES (?,?,?,?);"

    sb.query(sqlInsert, [Intake_id, Quantity, Value, FKItemLocation], (err, result) =>{
        console.log(err);
    })
})

app.post('/intake/find_q', (req, res) => {
    let ItemLocationFK= req.body.ItemLocationFK;
    
    const sqlGet = "SELECT Quantity FROM claire.itemlocation WHERE ItemLocation_id = ?"
    sb.query(sqlGet, [ItemLocationFK], (err, result) =>{
        res.send(result);
    }) 
})

app.put('/intake/update_item', (req, res) => {
    let ItemLocationFK= req.body.ItemLocationFK;
    let Quantity = req.body.Quantity;
    let CurrentQ = req.body.CurrentQ;

    Quantity = +CurrentQ + +Quantity;
    const sqlUpdate = "UPDATE claire.itemlocation SET Quantity= ? WHERE ItemLocation_id = ?;"
    sb.query(sqlUpdate, [Quantity, ItemLocationFK], (err, result) =>{
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
const accountRoute = require('./routes/account')
const intakeRoute = require('./routes/intake')
const donationSiteRoute = require('./routes/donationsite')
const manufacturerRoute = require('./routes/manufacturers')
const vendorRoute = require('./routes/vendor')
const purchaseRoute = require('./routes/purchase')
const dirveRoute = require('./routes/productdrive')
const transferRoute = require('./routes/transfer')
const auditRoute = require('./routes/audit')

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.use('/distribution', distributionRoute);
app.use('/partner', partnerRoute);
app.use('/item', itemRoute);
app.use('/location', locationRoute);
app.use('/', accountRoute);
app.use('/intake', intakeRoute)
app.use('/donationsite', donationSiteRoute)
app.use('/manufacturers', manufacturerRoute)
app.use('/vendor', vendorRoute)
app.use('/purchase', purchaseRoute)
app.use('/productdrive', dirveRoute)
app.use('/transfer', transferRoute)
app.use('/audit', auditRoute)




app.get('/', (req, res) =>{
    res.send('hello world');
})

app.get('/', (req, res) => res.render('home'));
app.get('/Dashboard', (req, res) => res.render('Dashboard'));

app.listen('3306', () => {
    console.log("running on port 3306");
})

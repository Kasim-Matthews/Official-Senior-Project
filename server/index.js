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



app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
    });


const distributionRoute = require('./routes/distribution');
const partnerRoute = require('./routes/partner');
const itemRoute = require('./routes/item');
const locationRoute = require('./routes/location')
const registerRoute = require('./routes/register')
const authRoute = require('./routes/auth')
const dataRoute = require('./routes/data')
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
app.use('/', registerRoute);
app.use('/auth', authRoute);
app.use('/data', dataRoute);
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

app.listen('3001', () => {
    console.log("running on port 3001");
})

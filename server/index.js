const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// Database pool setup
const sb = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Lindsey1!",
    database: 'claire',
    port: 3306
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Route setups
const distributionRoute = require('./routes/distribution');
const partnerRoute = require('./routes/partner');
const itemRoute = require('./routes/item');
const locationRoute = require('./routes/location');
const registerRoute = require('./routes/register');
const authRoute = require('./routes/auth');
const dataRoute = require('./routes/data');
const intakeRoute = require('./routes/intake');
const donationSiteRoute = require('./routes/donationsite');
const manufacturerRoute = require('./routes/manufacturers');
const vendorRoute = require('./routes/vendor');
const purchaseRoute = require('./routes/purchase');
const driveRoute = require('./routes/productdrive'); // Corrected spelling
const transferRoute = require('./routes/transfer');
const auditRoute = require('./routes/audit');
const refreshRoute = require('./routes/refresh');

// Applying routes
app.use('/distribution', distributionRoute);
app.use('/partner', partnerRoute);
app.use('/item', itemRoute);
app.use('/location', locationRoute);
app.use('/', registerRoute);
app.use('/auth', authRoute);
app.use('/data', dataRoute);
app.use('/intake', intakeRoute);
app.use('/donationsite', donationSiteRoute);
app.use('/manufacturers', manufacturerRoute);
app.use('/vendor', vendorRoute);
app.use('/purchase', purchaseRoute);
app.use('/productdrive', driveRoute);
app.use('/transfer', transferRoute);
app.use('/audit', auditRoute);
app.use('/refresh', refreshRoute);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(3001, () => {
    console.log("Server running on port 3001");
});

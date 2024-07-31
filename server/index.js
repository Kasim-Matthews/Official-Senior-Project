const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const verifyJWT = require('./middleware/verifyJWT')
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');


// Database pool setup
const sb = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Lindsey1!",
    database: 'claire',
    port: 3306
});


// app.use(credentials)

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3001, http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Origin");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    next();
});




app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));


// Route setups
const auditRoute = require('./routes/audit');
const refreshRoute = require('./routes/refresh');
const authRoute = require('./routes/auth');
const dataRoute = require('./routes/data');
const registerRoute = require('./routes/register');
const distributionRoute = require('./routes/distribution');
const partnerRoute = require('./routes/partner');
const itemRoute = require('./routes/item');
const locationRoute = require('./routes/location');
const intakeRoute = require('./routes/intake');
const donationSiteRoute = require('./routes/donationsite');
const manufacturerRoute = require('./routes/manufacturers');
const vendorRoute = require('./routes/vendor');
const purchaseRoute = require('./routes/purchase');
const driveRoute = require('./routes/productdrive'); // Corrected spelling
const transferRoute = require('./routes/transfer');
const logoutRoute = require('./routes/logout');
const adminRoute = require('./routes/admin')
const userRoute = require('./routes/user')


// Applying routes
app.use('/', registerRoute);
app.use('/auth', authRoute);
app.use('/refresh', refreshRoute);
app.use('/logout', logoutRoute);


app.use(verifyJWT)
app.use('/distribution', distributionRoute);
app.use('/partner', partnerRoute);
app.use('/item', itemRoute);
app.use('/location', locationRoute);
app.use('/data', dataRoute);
app.use('/intake', intakeRoute);
app.use('/donationsite', donationSiteRoute);
app.use('/manufacturers', manufacturerRoute);
app.use('/vendor', vendorRoute);
app.use('/purchase', purchaseRoute);
app.use('/productdrive', driveRoute);
app.use('/transfer', transferRoute);
app.use('/audit', auditRoute);
app.use('/admin', adminRoute)
app.use('/user', userRoute)



app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(3001, () => {
    console.log("Server running on port 3001");
});

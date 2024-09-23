const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const verifyJWT = require('./middleware/verifyJWT')
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');


app.use(credentials)
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));



app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://diaper-bank-inventory-management-system.onrender.com, https://diaper-bank-inventory-management-system-3ktm.onrender.com");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Origin");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    next();
});


const distributionRoute = require('./routes/distribution');
const partnerRoute = require('./routes/partner');
const itemRoute = require('./routes/item');
const locationRoute = require('./routes/location')
const registerRoute = require('./routes/register')
const authRoute = require('./routes/auth')
const dataRoute = require('./routes/data')
const donationRoute = require('./routes/donation')
const donationSiteRoute = require('./routes/donationsite')
const manufacturerRoute = require('./routes/manufacturers')
const vendorRoute = require('./routes/vendor')
const purchaseRoute = require('./routes/purchase')
const dirveRoute = require('./routes/productdrive')
const transferRoute = require('./routes/transfer')
const auditRoute = require('./routes/audit')
const refreshRoute = require('./routes/refresh')
const logoutRoute = require('./routes/logout');
const adminRoute = require('./routes/admin')
const userRoute = require('./routes/user')



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
app.use('/donation', donationRoute)
app.use('/donationsite', donationSiteRoute)
app.use('/manufacturers', manufacturerRoute)
app.use('/vendor', vendorRoute)
app.use('/purchase', purchaseRoute)
app.use('/productdrive', dirveRoute)
app.use('/transfer', transferRoute)
app.use('/audit', auditRoute)
app.use('/admin', adminRoute)
app.use('/user', userRoute)




app.get('/', (req, res) =>{
    res.send('hello world');
})

app.get('/', (req, res) => res.render('home'));
app.get('/Dashboard', (req, res) => res.render('Dashboard'));

app.listen('3306', () => {
    console.log("running on port 3306");
})


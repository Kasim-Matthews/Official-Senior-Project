const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
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



app.get('/', (req, res) => {
    res.send('hello world');
})

app.listen('3001', () => {
    console.log("running on port 3001");
})

const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const distributionRoute = require('./routes/distribution');
const partnerRoute = require('./routes/partner');
const itemRoute = require('./routes/item');
const locationRoute = require('./routes/location')
const manufacturersRoute = require('./routes/manufacturers')
const accountRoute = require('./routes/account')
const intakeRoute = require('./routes/intake')
const authRoutes = require('./routes/authRoutes')
const updateUserInfoRoutes = require('./routes/updateUserInfo')


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
app.use('/manufacturers', manufacturersRoute);
app.use('/', accountRoute);
app.use('/updateUserInfo', updateUserInfoRoutes)
app.use('/intake', intakeRoute)
app.use('/auth', authRoutes);

app.post('/updateUserInfo', (req, res) => {
    let userId = req.body.userId;
    let name = req.body.name;
    let role = req.body.role;
    const sql = "UPDATE user SET Name = ?, Role = ? WHERE User_id = ?";
    db.query(sql, [name, role, userId], (err, result) => {
        if (err) {
            res.send({ status: 'error', message: err.message });
        } else {
            res.send({ status: 'ok' });
        }
    });
});



app.get('/', (req, res) => {
    res.send('hello world');
})

app.get('/', (req, res) => res.render('home'));
app.get('/Dashboard', (req, res) => res.render('Dashboard'));

app.listen('3001', () => {
    console.log("running on port 3001");
})


/* 
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Lindsey1!",
    database: "claire",
    port: 3306
})
*/
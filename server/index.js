const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors')
const bodyParser = require('body-parser')

const sb = mysql.createPool({
    host: "sql5.freesqldatabase.com",
    user: "sql5669328",
    password: "xJdIL1M3qI",
    database: 'sql5669328',
    port: 3306
});

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true}));

app.get('/intake', (req, res) =>{
    const sqlGet = `
    select p.Name, i.Comments as Comments, i.RecievedDate as RecievedDate, i.Value as Value
    from sql5669328.intake i
    join sql5669328.partner p on i.Partner = p.Partner_id
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


    const sqlInsert = "INSERT INTO intake (Comments, RecievedDate, Value, Partner) VALUES (?,?,?,?);"
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
    const query = "SELECT MAX(Intake_id) as Intake_id FROM sql5669328.intake;"

    sb.query(query, (err, result) => {
        res.send(result);
    })
})

app.post('/intake/track', (req, res) => {
    let Intake_id = req.body.Intake_id;
    let Quantity = req.body.Quantity;
    let Value = req.body.Value;
    let FKItemLocation = req.body.FKItemLocation;

    const sqlInsert = "INSERT INTO sql5669328.intakeitems (Intake_id, Quantity, Value, FKItemLocation) VALUES (?,?,?,?);"

    sb.query(sqlInsert, [Intake_id, Quantity, Value, FKItemLocation], (err, result) =>{
        console.log(err);
    })
})

app.post('/intake/find_q', (req, res) => {
    let ItemLocationFK= req.body.ItemLocationFK;
    
    const sqlGet = "SELECT Quantity FROM itemlocation WHERE ItemLocation_id = ?"
    sb.query(sqlGet, [ItemLocationFK], (err, result) =>{
        res.send(result);
    }) 
})

app.put('/intake/update_item', (req, res) => {
    let ItemLocationFK= req.body.ItemLocationFK;
    let Quantity = req.body.Quantity;
    let CurrentQ = req.body.CurrentQ;

    Quantity = +CurrentQ + +Quantity;
    const sqlUpdate = "UPDATE sql5669328.itemlocation SET Quantity= ? WHERE ItemLocation_id = ?;"
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
const manufacturersRoute = require('./routes/manufacturers')
const accountRoute = require('./routes/account')


app.use('/distribution', distributionRoute);
app.use('/partner', partnerRoute);
app.use('/item', itemRoute);
app.use('/location', locationRoute);
app.use('/manufacturers', manufacturersRoute);
app.use('/', accountRoute);






const cb = mysql.createPool({
    host: "sql5.freesqldatabase.com",
    user: "sql5669328",
    password: "xJdIL1M3qI",
    database: 'sql5669328',
    port: 3306
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
        FROM sql5669328.itemlocation il
        JOIN sql5669328.item i ON il.Item_id = i.Item_id
        JOIN sql5669328.location l ON il.Location_id = l.Location_id;
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

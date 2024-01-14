const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql2')
const authRoutes = require('./routes/authRoutes')


const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
    });


const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Lindsey1!",
    database: "claire",
    port: 3306
})

app.post("/register", (req, res) => {
   
    const username = req.body.username;
    const password = req.body.password;

    db.query(
        "INSERT INTO user (Email, Password) VALUES (?, ?)",
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
    const userId = 
    db.query(
        "SELECT * FROM user WHERE Email = ? AND Password = ?",
        [username, password],
        (err, result) => {

            if(err){
                res.send({err: err})

            }

            if (result.length > 0) {
                if (result[0].Name === null || result[0].Role === null) {
                    res.send({ status: 'additional_info_required', message: "Finish Account Setup!", userId: result[0].User_id});
                } else {
                    res.send({ status: 'ok', user: result[0] });
                }
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

    db.query(query, (err, result) => {
        if (err) {
            res.send({ status: 'error', message: err.message });
        } else {
            res.send({ status: 'ok', data: result });
        }
    });
});



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

//routes
app.get('/', (req, res) => res.render('home'));
app.get('/Dashboard', (req, res) => res.render('Dashboard'));
app.use(authRoutes);

app.listen('3001', () => {
    console.log("running on port 3001");
})

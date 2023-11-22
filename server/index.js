const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mysql = require('mysql2')
const distributionRoute = require('./routes/distribution');
const partnerRoute = require('./routes/partner');
const itemRoute = require('./routes/item');


app.use(bodyParser.urlencoded({ extended: true}));
app.use('/distribution', distributionRoute);
app.use('/partner', partnerRoute);
app.use('/item', itemRoute);
app.use(cors());
app.use(express.json())





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
        "INSERT INTO login (username, password) VALUES (?,?)",
        [username, password],
        (err, result) => {
            console.log(err);
        }
    )
})

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query(
        "SELECT * FROM login WHERE username = ? AND password = ?",
        [username, password],
        (err, result) => {

            if(err){
                res.send({err: err})

            }



            if (result.length > 0) {
                res.send(result)
            }else {
                res.send({message: "Wrong username/password combination!"})
            }
            
        }
    )
})

app.get('/', (req, res) =>{
    res.send('hello world');
})

app.listen('3001', () => {
    console.log("running on port 3001");
})

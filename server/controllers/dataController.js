const mysql =  require('mysql2');
//make it a promise to do an await and not callbacks
const sb = mysql.createPool({
    host: "sql5.freesqldatabase.com",
    user: "sql5669328",
    password: "xJdIL1M3qI",
    database: 'sql5669328',
    port: 3306,
    connectionLimit: 50,
    keepAlive: true
});



const bcrypt = require('bcrypt');



const data = (req, res) => {
    const query = `
        SELECT i.Name as itemName, l.Name as locationName, il.Quantity
        FROM sql5669328.itemlocation il 
        JOIN sql5669328.item i ON il.Item_id = i.Item_id
        JOIN sql5669328.location l ON il.Location_id = l.Location_id`;

    sb.query(query, (err, result) => {

        console.log(result)

        if (err) {
            res.send({ status: 'error', message: err.message });
        } else {
            res.send({ status: 'ok', data: result });
        }
    });
}

module.exports = {
    data
}
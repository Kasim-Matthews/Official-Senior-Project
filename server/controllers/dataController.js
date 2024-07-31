const mysql =  require('mysql2');
//make it a promise to do an await and not callbacks
const sb = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "WebVoyage2023!",
    database: 'claire',
    port: 3006,
    connectionLimit: 50,
    multipleStatements: true
});






const data = (req, res) => {
    const query = `
        SELECT i.Name as itemName, l.Name as locationName, il.Quantity
        FROM claire.itemlocation il 
        JOIN claire.item i ON il.Item_id = i.Item_id
        JOIN claire.location l ON il.Location_id = l.Location_id`;

    sb.query(query, (err, result) => {


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
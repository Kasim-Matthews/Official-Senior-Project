const { Client } = require('pg');
const sb = new Client({
    user: 'claire_a2dn_user',
    password:'TaHQMaIFBkS5eYRJIzhj7uiCZd5Om5Kf',
    host: 'dpg-cnh1rs20si5c73bm4ptg-a.oregon-postgres.render.com',
    port: 5432,
    database: 'claire_a2dn',
    ssl: true,
    connectionString: 'postgres://claire_a2dn_user:TaHQMaIFBkS5eYRJIzhj7uiCZd5Om5Kf@dpg-cnh1rs20si5c73bm4ptg-a.oregon-postgres.render.com/claire_a2dn'
});

sb.connect().then(() => {
    console.log('Connected')
});

const register = (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    sb.connect();
    sb.query(
        "INSERT INTO register (usernameReg, passwordReg) VALUES (?,?)",
        [username, password],
        (err, result) => {
            console.log(err);
        }
    )
    sb.end()
}

const login = async (req, res) => {
    console.log(req.body)
    let username = req.body.username;
    let password = req.body.password;
    await sb.query(
        `SELECT * FROM public.register WHERE "usernameReg" = '{${username}}' AND "passwordReg" = '{${password}}'`,
        (err, result) => {
            console.log(err)
            if (err) {
                res.send({ err: err })

            }



            if (result.rowCount > 0) {
                res.send({ status: 'ok', user: result[0] }); // Send user data and status
            } else {
                res.send({ status: 'error', message: "Wrong username/password combination!" });
            }

        }
    )

}

const data = (req, res) => {
    const query = `
        SELECT i.Name as itemName, l.Name as locationName, il.Quantity
        FROM claire.itemlocation il
        JOIN claire.item i ON il.Item_id = i.Item_id
        JOIN claire.location l ON il.Location_id = l.Location_id;
    `;
    sb.connect();
    sb.query(query, (err, result) => {
        if (err) {
            res.send({ status: 'error', message: err.message });
        } else {
            res.send({ status: 'ok', data: result });
        }
    });
    sb.end()
}

module.exports = {
    login,
    register,
    data
}
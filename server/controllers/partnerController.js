const { Client } = require('pg');
const sb = new Client({
    user: 'claire_a2dn_user',
    password: 'TaHQMaIFBkS5eYRJIzhj7uiCZd5Om5Kf',
    host: 'dpg-cnh1rs20si5c73bm4ptg-a.oregon-postgres.render.com',
    port: '5432',
    database: 'claire_a2dn',
    ssl: true,
    connectionString: 'postgres://claire_a2dn_user:TaHQMaIFBkS5eYRJIzhj7uiCZd5Om5Kf@dpg-cnh1rs20si5c73bm4ptg-a:5432/claire_a2dn'
});

const partner_index = (req, res) => {
    const sqlGet = "SELECT * FROM claire.partner WHERE DeletedAt IS NULL;"
    sb.connect();
    sb.query(sqlGet, (err, result) => {
        res.send(result);
    })
    sb.end();
}

const partner_options = (req, res) => {
    const sqlGet = "SELECT Partner_id as value, Name as label FROM claire.partner;"
    sb.connect();
    sb.query(sqlGet, (err, result) => {
        res.send(result);
    })
    sb.end();
}

const partner_create = (req, res) => {
    let Name = req.body.name;
    let Email = req.body.email;
    let Type = req.body.type;

    if (typeof Name != "string" && typeof Email != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (Name && Email) {
        const sqlInsert = "INSERT INTO claire.partner (name, email) VALUES (?,?);"
        sb.connect();
        sb.query(sqlInsert, [Name, Email], (err, result) => {
            const sqlInsert = "INSERT INTO claire.partnertype (Partner_id, Type) VALUES (?,?);"
            sb.query(sqlInsert, [result.insertId, Type], (err, result) => {
                console.log(err)
            })
        })
        sb.end();
    }
}

const partner_delete = (req, res) => {
    let id = req.params.id;
    let date = req.body.date;
    if (typeof id != "string" && typeof date != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (id) {
        const sqlDelete = `UPDATE claire.partner Set DeletedAt= STR_TO_Date(?, '%m/%d/%Y') WHERE Partner_id = ?;`
        sb.connect();
        sb.query(sqlDelete, [date, id], (err, result) => {
            console.log(err);
        })
        sb.end();
    }
}

const partner_edit = (req, res) => {
    let id = req.params.id

    if (typeof id != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (id) {
        const sqlGet = 'SELECT Name, Email FROM claire.partner WHERE Partner_id = ?;'
        sb.connect();
        sb.query(sqlGet, [id], (err, result) => {
            res.send(result);
        })
        sb.end();
    }
}

const partner_update = (req, res) => {

    let id = req.params.id
    let Name = req.body.name;
    let Email = req.body.email;



    if (typeof id != "string" && typeof Name != "string" && typeof Email != "string") {
        res.send("Invalid");
        res.end();
        return;
    }

    if (Name && Email && id) {
        const sqlUpdate = "UPDATE claire.partner SET Name= ?, Email= ? WHERE Partner_id = ?;"
        sb.connect();
        sb.query(sqlUpdate, [Name, Email, id], (err, result) => {
            console.log(err);
        })
        sb.end();
    }
}


module.exports = {
    partner_create,
    partner_index,
    partner_delete,
    partner_update,
    partner_edit,
    partner_options
}
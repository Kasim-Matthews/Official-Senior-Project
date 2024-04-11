module.exports = {
    user: process.env.Database_user,
    password: process.env.Password,
    host: process.env.Host,
    port: 5432,
    database: process.env.Database_name,
    ssl: true,
    connectionString: process.env.ConnectionString
}


/*
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
*/
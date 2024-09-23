const mysql = require('mysql2');
const pg = require('pg')

const { Pool } = pg
const dbconfig = require('../database')
var sb = new Pool(dbconfig)

sb.on('connect', connection => {
    console.log("Connected")
})
sb.on('error', error => {
    console.log(error);
})





const data = async (req, res) => {
    try {
        const query = `
    SELECT "User_id", "Username", "Role"
    FROM public.user`;
        const response = await sb.query(query)
        res.send({ status: 'complete', data: response.rows })
        return
    } catch (error) {
        console.log(error);
        return;
    }
}

const del = async (req, res) => {
    let id = req.params.id;


    try {
        const deleting = `DELETE from public.user WHERE "User_id" = ${id}`
        const deletion = await sb.query(deleting);
        
        res.sendStatus(200)
        res.end();
        return;
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
        return;
    }

}

module.exports = {
    data,
    del
}


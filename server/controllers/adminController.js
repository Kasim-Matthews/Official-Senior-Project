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
        SELECT User_id, Username, Role
        FROM claire.user`;

    sb.query(query, (err, result) => {


        if (err) {
            res.send({ status: 'error', message: err.message });
        } else {
            res.send({ status: 'ok', data: result });
        }
    });
}

const del = (req, res) => {
    let id = req.params.id;

    
    sb.getConnection(function (error, tempCont){
        if(error){
            tempCont.release();
            console.log('Error')
        }
        else{
            if (typeof id != "string" && typeof date != "string") {
                res.send("Invalid");
                res.end();
                return;
            }
        
            if (id) {
                const sqlDelete = 'DELETE FROM claire.user WHERE User_id = ?;'
                tempCont.query(sqlDelete, [id], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err);
                        return
                    }

                    else {
                        console.log('User deleted')
                        res.send()
                        res.end()
                        return
                    }
                    
                })
            }
        }
    })

}

module.exports = {
    data,
    del
}


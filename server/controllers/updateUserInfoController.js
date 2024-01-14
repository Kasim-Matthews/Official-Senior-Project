const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Lindsey1!",
    database: "claire",
    port: 3306
})

const update_user_info = (req, res) => {
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
}

module.exports = {
    update_user_info
}
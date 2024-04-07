const mysql = require('mysql2');
const dbconfig = require('../database')
var sb = mysql.createPool(dbconfig);

const index = (req, res) => {
    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            const sqlGet = `SELECT a.Audit_id, CAST(a.Date as char(10)) as Date, COUNT(IF(ai.Changed IS NOT null, 1, NULL)) as Affected
            from claire.audit a
            join claire.audititems ai on a.Audit_id = ai.Audit
            group by a.date, a.Audit_id;`

            tempCont.query(sqlGet, (err, result) => {
                tempCont.release();
                if (err) {
                    console.log(err)
                }

                else {
                    console.log('Audit data sent')
                    res.send(result);
                    res.end();
                    return
                }

            })
        }
    })

}

const inventory = (req, res) => {
    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            const sqlGet = `SELECT il.ItemLocation_id, i.Name as Item, l.Name as Location, il.Quantity as Past
            from claire.itemlocation il
            join claire.item i on i.Item_id = il.Item_id
            join claire.location l on l.Location_id = il.Location_id;`

            tempCont.query(sqlGet, (err, result) => {
                tempCont.release();
                if (err) {
                    console.log(err)
                }

                else {
                    console.log('Inventory data sent')
                    res.send(result);
                    res.end();
                    return
                }

            })
        }
    })

}

const log = (req, res) => {
    let date = req.body.date;
    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            if (typeof date != "string") {
                res.send("Invalid");
                res.end();
                return

            }

            if (date) {
                const sqlInsert = `INSERT INTO claire.audit (Date) VALUES (?);`
                tempCont.query(sqlInsert, [date], (err, result) => {
                    tempCont.release();
                    if (err) {
                        console.log(err);
                    }

                    else {
                        console.log('Audit log created')
                        res.send();
                        res.end();
                        return
                    }


                })
            }
        }
    })


}

const create = (req, res) => {
    let Audits = req.body.Audits


    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            if (typeof Audits != "object") {
                res.send("Invalid");
                res.end();
                return

            }

            if (Audits) {
                const sqlInsert = `INSERT INTO claire.audititems (ItemLocation, Past, Changed, Audit) VALUES (?,?,?,(SELECT Audit_id from claire.auditORDER BY Audit_id DESC Limit 1))`

                for (var i = 0; i < Audits.length; i++) {
                    if (Audits[i].Changed) {
                        tempCont.query(sqlInsert, [Audits[i].ItemLocation_id, Audits[i].Past, Audits[i].Changed], (err, result) => {
                            if (err) {
                                console.log(err);
                            }

                            else {
                                console.log(`${i + 1} out of ${Audits.length}`)
                                res.send();
                                res.end();
                                return
                            }

                        })
                    }

                    else {
                        const sqlInsert = `INSERT INTO claire.audititems (ItemLocation, Past, Audit) VALUES (?,?,(SELECT Audit_id from claire.auditORDER BY Audit_id DESC Limit 1))`
                        tempCont.query(sqlInsert, [Audits[i].ItemLocation_id, Audits[i].Past], (err, result) => {
                            if (err) {
                                console.log(err);
                            }

                            else {
                                console.log(`${i + 1} out of ${Audits.length}`)
                                res.send();
                                res.end();
                                return
                            }
                        })
                    }
                }
                tempCont.release();

            }
        }
    })

}

const update = (req, res) => {
    let Audits = req.body.Audits
    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            if (typeof Audits != "object") {
                res.send("Invalid");
                res.end();
                return

            }

            if (Audits) {
                const sqlUpdate = `UPDATE claire.itemlocation set Quantity = ? WHERE ItemLocation_id = ?;`
                for (var i = 0; i < Audits.length; i++) {
                    if (Audits[i].Changed) {
                        tempCont.query(sqlUpdate, [Audits[i].Changed, Audits[i].ItemLocation_id], (err, result) => {
                            if (err) {
                                console.log(err);
                            }

                            else {
                                console.log(`Change has been made`)
                                res.send();
                                res.end();
                                return
                            }

                        })
                    }

                }
                tempCont.release();
            }
        }
    })

}

const last = (req, res) => {
    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            const sqlGet = `SELECT Audit_id from claire.audit
            ORDER BY Audit_id DESC
            Limit 1;`
            tempCont.query(sqlGet, (err, result) => {
                tempCont.release()
                if (err) {
                    console.log(err)
                }

                else {
                    console.log('Last found in audit')
                    res.send(result)
                    res.end();
                    return
                }

            })
        }
    })

}

const view = (req, res) => {
    let id = req.params.id

    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            if (typeof id != "string") {
                res.send("Invalid");
                res.end();
                return;
            }
            if (id) {
                const sqlGet = `SELECT  Cast(a.Date as char(10)) as Date, l.Name as Location, ai.Past, ai.Changed, i.Name as Item 
            from claire.audit a
            join claire.audititems ai on a.Audit_id = ai.Audit
            join claire.itemlocation il on ai.ItemLocation = il.ItemLocation_id
            join claire.location l on il.Location_id = l.Location_id
            join claire.item i on i.Item_id = il.Item_id
            WHERE a.Audit_id = ?
            group by l.Name, i.Name, ai.Past, ai.Changed;`

                tempCont.query(sqlGet, [id], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log('View data found for audit')
                        res.send(result);
                        res.end();
                        return
                    }
                })
            }
        }
    })


}

module.exports = {
    inventory,
    create,
    update,
    last,
    log,
    index,
    view
}
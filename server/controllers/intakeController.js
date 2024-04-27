const mysql = require('mysql2');
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

    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            const sqlGet = `
            select p.Name, i.Comments as Comments, Cast(i.RecievedDate as char(10)) as RecievedDate, SUM(ii.Quantity) as TotalItems, i.Intake_id, i.TotalValue as Total, l.Name as Location, p.Type
            from claire.intake i
            join claire.partner p on i.Partner = p.Partner_id
            join claire.partnertype pt on p.Type = pt.PartnerType_id
            join claire.intakeitems ii on i.Intake_id = ii.Intake_id
            join claire.itemlocation il on ii.FKItemLocation = il.ItemLocation_id
            join claire. location l on l.Location_id = il.Location_id
            WHERE pt.Type NOT IN ("Vendor", "Adjustment")
            group by i.Intake_id, l.Name
            `;
            tempCont.query(sqlGet, (err, result) => {
                tempCont.release();
                if (err) {
                    console.log(err)
                }

                else {
                    console.log('Donation data sent')
                    res.send(result);
                    res.end();
                    return;
                }
            })
        }
    })

}

const create = (req, res) => {

    let Comments = req.body.Comments;
    let RecievedDate = req.body.RecievedDate;
    let Partner = req.body.Partner;
    let Value = req.body.Value

    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            if (typeof Comments != "string" && typeof RecievedDate != "string" && typeof Partner != "number" && typeof Value != "number") {
                res.send("Invalid");
                res.end();
                return;
            }


            if (Partner && RecievedDate) {
                const sqlInsert = "INSERT INTO claire.intake (Comments, RecievedDate, Partner, TotalValue) VALUES (?,?,?,?);"
                tempCont.query(sqlInsert, [Comments, RecievedDate, Partner, Value], (err, result) => {
                    tempCont.release();
                    if (err) {
                        console.log(err);
                    }

                    else {
                        console.log('Donation log created')
                        res.send()
                        res.end()
                        return;
                    }

                })
            }
        }
    })


}

const location = (req, res) => {
    let Items = req.body.Items
    let Location = req.body.Location_id

    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            if (typeof Items != "object" && typeof Location != "string") {
                res.send("Invalid");
                res.end();
                return;
            }

            if (Items && Location) {
                let ids = []
                Items.forEach(element => {
                    ids.push(element.Item_id);
                });

                const sqlGet = `SELECT il.ItemLocation_id
                from claire.itemlocation il
                WHERE il.Item_id IN (?) AND il.Location_id = ?;`

                tempCont.query(sqlGet, [ids, Location], (err, result) => {
                    tempCont.release();
                    if (err) {
                        console.log(err);
                    }

                    else {
                        console.log('Donation item locations found')
                        res.send(result);
                        res.end();
                        return;
                    }

                })

            }
        }
    })

}

const find_id = (req, res) => {
    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            const query = "SELECT MAX(Intake_id) as Intake_id FROM claire.intake;"

            tempCont.query(query, (err, result) => {
                tempCont.release();
                if (err) {
                    console.log(err)
                }

                else {
                    console.log('Donation id found')
                    res.send(result);
                    res.end()
                    return;
                }

            })
        }
    })

}

const track = (req, res) => {
    let Items = req.body.Items
    let Values = req.body.Values
    let FKItemLocation = req.body.FKItemLocation

    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            if (typeof Items != "object" && typeof Values != "object" && typeof FKItemLocation != "object") {
                res.send("Invalid")
                res.end();
                return;
            }

            if (Items && Values && FKItemLocation) {
                const sqlInsert = `INSERT INTO claire.intakeitems (Intake_id, Quantity, Value, FKItemLocation) VALUES ((SELECT MAX(Intake_id) as Intake_id FROM claire.intake),?,?,?);`
                for (var i = 0; i < Items.length; i++) {
                    let Value = Items[i].Quantity * Values[i].FairMarketValue
                    tempCont.query(sqlInsert, [Items[i].Quantity, Value, FKItemLocation[i].ItemLocation_id], (err, result) => {
                        if (err) {
                            console.log(err);
                            return;
                        }

                        else {
                            console.log(`${i + 1} out of ${Items.length} complete`)
                            res.send();
                            res.end();
                        }

                    })
                }
                tempCont.release();
                console.log('Tracking process done')
                return;
            }
        }
    })


}



const update_item = (req, res) => {
    let ItemLocationFK = req.body.ItemLocationFK;
    let Items = req.body.Items;

    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            if (typeof ItemLocationFK != "object" && typeof Items != "object") {
                res.send("Invalid");
                res.end();
                return;
            }

            if (ItemLocationFK && Items) {
                const sqlUpdate = "UPDATE claire.itemlocation SET Quantity= Quantity + ? WHERE ItemLocation_id = ?;"
                for (var i = 0; i < Items.length; i++) {
                    tempCont.query(sqlUpdate, [Items[i].Quantity, ItemLocationFK[i].ItemLocation_id], (err, result) => {
                        if (err) {
                            console.log(err);
                            return;
                        }

                        else {
                            console.log(`${i + 1} out of ${Items.length} quantities updated`)
                            res.send()
                            res.end()
                            return;
                        }
                    })
                }
                tempCont.release();
                console.log("All Location Items updated")
                return;
            }
        }
    })

}

const intake_view = (req, res) => {
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
                const sqlGet = `
            select Cast(i.RecievedDate as char(10)) as RecievedDate, p.Name as Partner, it.Name as Item, it.FairMarketValue, l.Name as Location, ii.Quantity
            from claire.intakeitems ii
            join claire.itemlocation il on ii.FKItemLocation = il.ItemLocation_id
            join claire.intake i on ii.Intake_id = i.Intake_id
            join claire.item it on it.Item_id = il.Item_id
            join claire.location l on l.Location_id = il.Location_id
            join claire.partner p on i.Partner = p.Partner_id
            where ii.Intake_id = ?; 
            `;
                tempCont.query(sqlGet, [id], (err, result) => {
                    tempCont.release();
                    if (err) {
                        console.log(err);
                    }

                    else {
                        console.log('Donation view data found')
                        res.send(result);
                        res.end();
                        return
                    }
                })
            }
        }
    })

}

const edit = (req, res) => {
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
                const sqlGet = `
            select i.Comments, i.TotalValue, Cast(i.RecievedDate as char(10)) AS RecievedDate, i.Partner, il.Location_id, pt.Type
            from claire.intake i
            join claire.intakeitems ii on i.Intake_id = ii.Intake_id
            join claire.partner p on i.Partner = p.Partner_id
            join claire.partnertype pt on p.Type = pt.PartnerType_id
            join claire.itemlocation il on ii.FKItemLocation = il.ItemLocation_id
            where i.Intake_id = ?; 
            `;
                tempCont.query(sqlGet, [id], (err, result) => {
                    tempCont.release();
                    if (err) {
                        console.log(err);
                    }

                    else {
                        console.log('Donation edit data found')
                        res.send(result);
                        res.end()
                        return;
                    }

                })
            }
        }
    })

}

const update = (req, res) => {
    let id = req.params.id
    let Comments = req.body.Comments;
    let RecievedDate = req.body.RecievedDate;
    let Partner = req.body.Partner;
    let Value = req.body.Value

    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            if (typeof id != "string" && typeof Comments != "string" && typeof RecievedtDate != 'string' && typeof Partner != 'number' && typeof Value != 'number') {
                res.send("Invalid");
                console.log("err");
                res.end();
                return;
            }

            if (RecievedDate && Partner) {
                const sqlUpdate = "UPDATE claire.intake SET Comments= ?, RecievedDate= ?, Partner= ?, TotalValue= ? WHERE Intake_id = ?;"
                tempCont.query(sqlUpdate, [Comments, RecievedDate, Partner, Value, id], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err);
                    }

                    else {
                        console.log('Donation data updated')
                        res.send()
                        res.end()
                        return;
                    }

                })
            }
        }
    })

}

const intake_find_value = (req, res) => {
    let Items = req.body.Items

    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            if (typeof Items != "object") {
                res.send("Invalid")
                res.end();
                return;
            }

            if (Items) {
                let ids = []
                Items.forEach(element => {
                    ids.push(element.Item_id);
                });
                const sqlGet = `SELECT i.FairMarketValue
                from claire.item i
                WHERE i.Item_id IN (?);`



                tempCont.query(sqlGet, [ids], (err, result, fields, query) => {
                    tempCont.release();
                    if (err) {
                        console.log(err);
                    }

                    else {
                        console.log('Donation item values found')
                        res.send(result);
                        res.end();
                        return;
                    }

                })
            }
        }
    })


}

const intake_cleanup = (req, res) => {
    let id = req.params.id

    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            if (typeof id != 'string') {
                res.send('Invalid');
                res.end();
                return
            }

            if (id) {
                const sqlGet = `SELECT ii.Quantity as Given, ii.FKItemLocation, il.Quantity
                from claire.intakeitems as ii
                join claire.itemlocation il on ii.FKItemLocation = il. ItemLocation_id
                where ii.Intake_id = ?;`
                tempCont.query(sqlGet, [id], (err, result) => {
                    tempCont.release();
                    if (err) {
                        console.log(err)
                    }

                    else {
                        console.log('Donation cleanup data found')
                        res.send(result)
                        res.end()
                        return;
                    }


                })
            }
        }
    })

}

const intake_reclaim = (req, res) => {
    let records = req.body.records

    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            if (typeof records != "object") {
                res.send("Invalid");
                res.end();
                return;
            }

            if (records) {
                for (let record in records) {
                    Quantity = records[record].Quantity - records[record].Given
                    const sqlUpdate = "UPDATE claire.itemlocation SET Quantity= ? WHERE ItemLocation_id = ?;"
                    tempCont.query(sqlUpdate, [Quantity, records[record].FKItemLocation], (err, result) => {
                        if (err) {
                            console.log(err);
                            return
                        }

                        else {
                            console.log(`Reclaim in progress`)
                            res.send()
                            res.end()
                            return;
                        }

                    })
                }
                tempCont.release();
                console.log('Reclaim procress done')
                return;

            }
        }
    })

}

const intake_remove = (req, res) => {
    let id = req.params.id;

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
                const sqlDelete = 'DELETE FROM claire.intake WHERE Intake_id = ?;'
                tempCont.query(sqlDelete, [id], (err, result) => {
                    tempCont.release();
                    if (err) {
                        console.log(err);
                    }

                    else {
                        console.log('Donation record deleted')
                        res.send()
                        res.end()
                        return;
                    }

                })
            }
        }
    })


}

const intake_edit_items = (req, res) => {
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
                const sqlGet = `
                SELECT ii.Quantity, il.Item_id
                from claire.intakeitems as ii
                join claire.itemlocation il on ii.FKItemLocation= il.ItemLocation_id
                where ii.Intake_id = ?;
            `;
                tempCont.query(sqlGet, [id], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err)
                    }

                    else {
                        console.log('Donation edit items data found')
                        res.send(result);
                        res.end()
                        return;
                    }

                })
            }
        }
    })

}

const intake_update_delete = (req, res) => {
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
                return
            }

            if (id) {
                const sqlDelete = "DELETE FROM claire.intakeitems WHERE Intake_id = ?;"
                tempCont.query(sqlDelete, [id], (err, result) => {
                    tempCont.release()
                    if (err) {
                        console.log(err);
                    }

                    else {
                        console.log('Donation past records of items deleted')
                        res.send()
                        res.end()
                        return;
                    }

                })
            }
        }
    })

}

const intake_misc = (req, res) => {
    sb.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error')
        }
        else {
            const sqlGet = `SELECT p.Partner_id
            from claire.partner p
            join claire.partnertype pt on p.Type = pt.PartnerType_id
            WHERE pt.Type = "Misc Donation";`

            tempCont.query(sqlGet, (err, result) => {
                tempCont.release();
                if (err) {
                    console.log(err);
                }

                else {
                    console.log("Misc Donor found")
                    res.send(result);
                    res.end()
                    return
                }

            })
        }
    })

}

module.exports = {
    data,
    create,
    location,
    find_id,
    track,
    update_item,
    intake_view,
    edit,
    update,
    intake_find_value,
    intake_cleanup,
    intake_reclaim,
    intake_remove,
    intake_edit_items,
    intake_update_delete,
    intake_misc
}

/*
console.log(sb.format(sqlGet, [ids]))
*/
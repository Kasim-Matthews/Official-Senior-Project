import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useNavigate } from "react-router-dom";

function AddAudit() {

    const [inventory, setInventory] = useState([])
    const date = new Date().toJSON().slice(0, 10)

    function handleChange(e, index) {
        const values = [...inventory]
        values[index].Changed = e.target.value
        setInventory(values);
      }


    const handleSubmit = async (e) => {
        e.preventDefault();
        //await Axios.post("http://localhost:3001/audit/log", {date: date});
        //let id = await Axios.get("http://localhost:3001/audit/last")
        //await Axios.post("http://localhost:3001/audit/new", {Audits: inventory, audit: id.data[0].Audit_id});
        await Axios.put("http://localhost:3001/audit/update", {Audits: inventory});
    }

    useEffect(() => {
        Axios.get("http://localhost:3001/audit/inventory").then((response) => {
            setInventory(response.data)
        })
    }, [])


    return (
        <div>

            <form onSubmit={handleSubmit}>
                {inventory.map((val, index) => {
                    return(
                        <div>
                            <h4>{val.Item} + {val.Location}</h4>
                            <input type="Number" name="Changed" defaultValue={val.Past} onChange={(e) => handleChange(e, index)}/>
                        </div>
                    )
                })}

                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}

export default AddAudit;
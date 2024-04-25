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
        await Axios.post("https://diaper-bank-inventory-management-system.onrender.com/audit/log", {date: date});
        await Axios.post("https://diaper-bank-inventory-management-system.onrender.com/audit/new", {Audits: inventory});
        await Axios.put("https://diaper-bank-inventory-management-system.onrender.com/audit/update", {Audits: inventory});
        window.location.href = `/audit`;
    }

    useEffect(() => {
        Axios.get("https://diaper-bank-inventory-management-system.onrender.com/audit/inventory").then((response) => {
            setInventory(response.data.data)
        })
    }, [])


    return (
        <div>

            <form onSubmit={handleSubmit}>
                {inventory.map((val, index) => {
                    return(
                        <div>
                            <h4>{val.Item} + {val.Location}</h4>
                            <input type="Number" name="Changed" defaultValue={val.Past} min="0" onChange={(e) => handleChange(e, index)}/>
                        </div>
                    )
                })}

                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}

export default AddAudit;
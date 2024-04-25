import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useNavigate } from "react-router-dom";

function AddAudit() {

    const [inventory, setInventory] = useState([])
    const date = new Date().toJSON().slice(0, 10)
    const navigate = useNavigate();

    function handleChange(e, index) {
        const values = [...inventory]
        values[index].Changed = e.target.value
        setInventory(values);
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await Axios.post("https://diaper-bank-inventory-management-system.onrender.com/audit/log", { date: date, Audits: inventory });

            if (response.status == 400) {
                alert("Check the values you input. One of the values are not of the correct type.")
            }

            else if (response.status == 200) {
                window.location.href = `/audit`;
            }
        }

        catch (error) {
            alert("Server side error/Contact developer")
        }
    }

    useEffect(() => {
        Axios.get("https://diaper-bank-inventory-management-system.onrender.com/audit/inventory").then((response) => {
            if (response.data.status === 'complete') {
                setInventory(response.data.data)
            }
            else if (response.data.status === 'error in query') {
                navigate('/query')
                console.error("Fail in the query")
                console.error(response.data.message)
            }

        }).catch(error => {
            navigate('/error')
            console.error(error.response.data.message)
        })
    }, [])


    return (
        <div>

            <form onSubmit={handleSubmit}>
                {inventory.map((val, index) => {
                    return (
                        <div>
                            <h4>{val.Item} + {val.Location}</h4>
                            <input type="Number" name="Changed" defaultValue={val.Past} min="0" onChange={(e) => handleChange(e, index)} />
                        </div>
                    )
                })}

                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}

export default AddAudit;
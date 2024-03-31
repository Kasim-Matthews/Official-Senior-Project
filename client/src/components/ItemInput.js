import React, { useEffect } from "react";
import Axios from 'axios';

export default function ItemInput({ objName, handleItem, handleQuantity, index, deleteField }) {

    const [item, setItem] = React.useState([])

    useEffect(() => {
        Axios.get("https://diaper-bank-inventory-management-system.onrender.com/item").then((response) => {
            setItem(response.data);
        })
    }, [])


    return (
        <div style={{ display: "flex" }}>
            <select name={objName} onChange={(e) => handleItem(e, index)}>
                <option value="">--Please choose an option--</option>
                {item.map((val) => {
                    return (
                        <option value={val.Item_id}>{val.Name}</option>
                    )
                })}
            </select>

            <input type="number" name={objName} required onChange={(e) => handleQuantity(e, index)} />

            <div onClick={(e) => deleteField(e, index)}>X</div>
        </div>
    )
}
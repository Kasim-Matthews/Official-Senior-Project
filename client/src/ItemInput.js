import React, { useEffect } from "react";
import Axios from 'axios';

export default function ItemInput({ objName, handleItem, handleLocation, handleQuantity, index, deleteField }) {

    const [item, setItem] = React.useState([])
    const [locations, setLocations] = React.useState([])

    useEffect(() => {
        Axios.get("http://localhost:3001/item").then((response) => {
            setItem(response.data);
        })
    }, [])

    useEffect(() => {
        Axios.get("http://localhost:3001/location").then((response) => {
            setLocations(response.data);
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

            <select name={objName} onChange={(e) => handleLocation(e, index)}>
                <option value="">--Please choose an option--</option>
                {locations.map((val) => {
                    return (
                        <option value={val.Location_id}>{val.Name}</option>
                    )
                })}
            </select>

            <input type="number" name={objName} required onChange={(e) => handleQuantity(e, index)} />

            <div onClick={(e) => deleteField(e, index)}>X</div>
        </div>
    )
}
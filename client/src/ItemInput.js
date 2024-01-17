import React, { useEffect } from "react";
import Axios from 'axios';

export default function ItemInput({objValue, handleItem, handleLocation, handleQuantity, index}) {

    const {name, Item_id, Location_id, Quantity} = objValue
    const [items, setItems] = React.useState([])
    const [locations, setLocations] = React.useState([])

    useEffect(() => {
        Axios.get("http://localhost:3001/item").then((response) => {
            setItems(response.data);
        })
    }, [])

    useEffect(() => {
        Axios.get("http://localhost:3001/location").then((response) => {
            setLocations(response.data);
        })
    }, [])

    return (
        <div style={{ display: "flex" }}>
            <select name={name}>
                <option value="">--Please choose an option--</option>
                {items.map((val) => {
                    return (
                        <option value={val.Item_id}>{val.Name}</option>
                    )
                })}
            </select>

            <select name={name}>
                <option value="">--Please choose an option--</option>
                {locations.map((val) => {
                    return (
                        <option value={val.Location_id}>{val.Name}</option>
                    )
                })}
            </select>

            <input type="number" name={name} required onChange={handleChange} value={value} />
        </div>
    )
}
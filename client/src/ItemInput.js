import React, { useEffect } from "react";
import Axios from 'axios';

export default function ItemInput({ value, handleChange }) {

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
            <select id="item" name="item">
                <option value="">--Please choose an option--</option>
                {items.map((val) => {
                    return (
                        <option value={val.Item_id}>{val.Name}</option>
                    )
                })}
            </select>

            <select id="location" name="location">
                <option value="">--Please choose an option--</option>
                {locations.map((val) => {
                    return (
                        <option value={val.Location_id}>{val.Name}</option>
                    )
                })}
            </select>

            <input type="number" name="Quantity" required onChange={handleChange} value={value} />
        </div>
    )
}
import React, { useState, useEffect } from "react";
import Axios from 'axios';

export default function DriveList({handleChange}) {
    const [drives, setDrives] = React.useState([])

    useEffect(() => {
        Axios.get("http://localhost:3001/productdrive/list").then((response) => {
            setDrives(response.data);
        })
    }, [])

    return (
        <div><label htmlFor="Partner">Partner</label>
            <select id="Partner" name="Partner" onChange={handleChange}>
                <option value="">--Please choose an option--</option>
                {drives.map((val) => {
                    return (
                        <option value={val.Partner_id}>{val.Name}</option>
                    )
                })}
            </select>
            <br /></div>
    )
}
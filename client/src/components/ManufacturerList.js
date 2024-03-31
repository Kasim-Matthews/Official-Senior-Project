import React, { useState, useEffect } from "react";
import Axios from 'axios';

export default function ManufacturerList({handleChange}) {
    const [manulist, setManuList] = React.useState([])

    useEffect(() => {
        Axios.get("http://localhost:3306/manufacturers/list").then((response) => {
          setManuList(response.data);
        })
      }, [])

    return (
        <div><label htmlFor="Partner">Partner</label>
            <select id="Partner" name="Partner" onChange={handleChange}>
                <option value="">--Please choose an option--</option>
                {manulist.map((val) => {
                    return (
                        <option value={val.Partner_id}>{val.Name}</option>
                    )
                })}
            </select>
            <br /></div>
    )
}
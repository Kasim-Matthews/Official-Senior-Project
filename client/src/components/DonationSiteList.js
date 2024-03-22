import React, { useState, useEffect } from "react";
import Axios from 'axios';

export default function DonationSiteList({handleChange}) {
    const [dsites, setDSites] = React.useState([])

    useEffect(() => {
        Axios.get("http://localhost:3001/partner/list").then((response) => {
            setDSites(response.data);
        })
      }, [])

    return (
        <div><label htmlFor="Partner">Partner</label>
            <select id="Partner" name="Partner" onChange={handleChange}>
                <option value="">--Please choose an option--</option>
                {dsites.map((val) => {
                    return (
                        <option value={val.Partner_id}>{val.Name}</option>
                    )
                })}
            </select>
            <br /></div>
    )
}
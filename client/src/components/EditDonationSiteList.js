import React, { useState, useEffect } from "react";
import Axios from 'axios';

export default function EditDonationSiteList({handleChange , id}) {
    const [dsites, setDSites] = React.useState([])

    useEffect(() => {
        Axios.get("https://diaper-bank-inventory-management-system.onrender.com/donationsite/list").then((response) => {
            setDSites(response.data.data);
        })
      }, [])

    return (
        <div><label htmlFor="Partner">Partner</label>
            <select id="Partner" name="Partner" onChange={handleChange}>
                <option value="">--Please choose an option--</option>
                {dsites.map((val) => {
                    if(val.Partner_id == id){
                        return(
                            <option value={val.Partner_id} selected>{val.Name}</option>
                        )
                    }
                    else{
                        return (
                            <option value={val.Partner_id}>{val.Name}</option>
                        )
                    }
                })}
            </select>
            <br /></div>
    )
}
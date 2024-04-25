import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function EditDonationSiteList({ handleChange, id }) {
    const [dsites, setDSites] = React.useState([])
    const navigate = useNavigate();

    useEffect(() => {
        Axios.get("https://diaper-bank-inventory-management-system.onrender.com/donationsite/list").then((response) => {
            if (response.data.status === 'complete') {
                setDSites(response.data.data);
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
        <div><label htmlFor="Partner">Partner</label>
            <select id="Partner" name="Partner" onChange={handleChange}>
                <option value="">--Please choose an option--</option>
                {dsites.map((val) => {
                    if (val.Partner_id == id) {
                        return (
                            <option value={val.Partner_id} selected>{val.Name}</option>
                        )
                    }
                    else {
                        return (
                            <option value={val.Partner_id}>{val.Name}</option>
                        )
                    }
                })}
            </select>
            <br /></div>
    )
}
import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function ManufacturerList({ handleChange }) {
    const [manulist, setManuList] = React.useState([])
    const navigate = useNavigate();

    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/manufacturers/list`).then((response) => {
            if (response.data.status === 'complete') {
                setManuList(response.data.data);
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
                {manulist.map((val) => {
                    return (
                        <option value={val.Partner_id}>{val.Name}</option>
                    )
                })}
            </select>
            <br /></div>
    )
}
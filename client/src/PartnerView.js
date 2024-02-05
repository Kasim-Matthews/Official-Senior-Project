import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useNavigate, Link } from "react-router-dom";


function PartnerView(){

    const [partnerList, setPartnerList] = useState([])
    const navigate = useNavigate();
    
    const handleRemove = (id) => {
        Axios.delete(`http://localhost:3001/partner/remove/${id}`);
    }

    const handleEdit = (id) =>{
        navigate(`/partner/${id}/edit`)
    }
    
    const handleView =(id) => {
        navigate(`/partner/${id}`)
    }

    useEffect(() => {
        Axios.get("http://localhost:3001/partner").then((response) => {
            setPartnerList(response.data)
        })
    }, [])

    return (
        <div>
            <button><Link to="/partner/new">Add</Link></button>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {partnerList.map((val) => {
                        return (
                            <tr>
                                <td>{val.Name}</td>
                                <td>{val.Email}</td>
                                <td>
                                    <button /*onClick={() => handleRemove(val.Partner_id)}*/>Delete</button>
                                    <button onClick={() => handleEdit(val.Partner_id)}>Edit</button>
                                    <button onClick={() => handleView(val.Partner_id)}>View</button>
                                </td>

                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <p style={{ display: "none" }}>Make sure when doing input validation you give an error if email is already used and don't allow submit, can cause some weird errors</p>
            <button><Link to="/Dashboard">Dasboard</Link></button>
        </div>
    );
}

export default PartnerView;
import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useNavigate, Link } from "react-router-dom";


function DonationSiteView() {

    const [dsiteList, setDsiteList] = useState([])
    const navigate = useNavigate();

    const handleRemove = (id, Name) => {
        if (window.confirm(`Are you sure you want to delete ${Name} from the partner list?`) == true) {
            let date = new Date().toLocaleDateString();
            Axios.put(`https://diaper-bank-inventory-management-system.onrender.com/donationsite/remove/${id}`, { date: date });
            window.location.reload(false);
        }

    }

    const handleEdit = (id) => {
        navigate(`/donationsite/${id}/edit`)
    }

    const handleView = (id) => {
        navigate(`/donationsite/${id}`)
    }

    useEffect(() => {
        Axios.get("https://diaper-bank-inventory-management-system.onrender.com/donationsite").then((response) => {
            setDsiteList(response.data)
        })
    }, [])

    return (
        <div>
            <button><Link to="/donationsite/new">Add</Link></button>
            <table>
                <thead>
                    <tr>
                        <th>Donation Site</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {dsiteList.map((val) => {
                        return (
                            <tr>
                                <td>{val.Name}</td>
                                <td>{val.Address}</td>
                                <td>
                                    <button onClick={() => handleRemove(val.Partner_id, val.Name)}>Delete</button>
                                    <button onClick={() => handleEdit(val.Partner_id)}>Edit</button>
                                    <button onClick={() => handleView(val.Partner_id)}>View</button>
                                </td>

                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <button><Link to="/Dashboard">Dasboard</Link></button>
        </div>
    );
}

export default DonationSiteView;
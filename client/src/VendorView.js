import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useNavigate, Link } from "react-router-dom";


function VendorView() {

    const [vendorList, setVendorList] = useState([])
    const navigate = useNavigate();

    const handleRemove = (id, Name) => {
        if (window.confirm(`Are you sure you want to delete ${Name} from the partner list?`) == true) {
            let date = new Date().toLocaleDateString();
            Axios.put(`http://localhost:3001/vendor/remove/${id}`, { date: date });
            window.location.reload(false);
        }

    }

    const handleEdit = (id) => {
        navigate(`/vendor/${id}/edit`)
    }

    const handleView = (id) => {
        navigate(`/vendor/${id}`)
    }

    useEffect(() => {
        Axios.get("http://localhost:3001/vendor").then((response) => {
            setVendorList(response.data)
        })
    }, [])

    return (
        <div>
            <button><Link to="/vendor/new">Add</Link></button>
            <table>
                <thead>
                    <tr>
                        <th>Business Name</th>
                        <th>Contact Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {vendorList.map((val) => {
                        return (
                            <tr>
                                <td>{val.Name}</td>
                                <td>{val.Contact}</td>
                                <td>{val.Phone}</td>
                                <td>{val.Email}</td>
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

export default VendorView;
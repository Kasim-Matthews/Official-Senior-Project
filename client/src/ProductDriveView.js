import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useNavigate, Link } from "react-router-dom";

function ProductDriveView(){
    const navigate = useNavigate();

    const [driveList, setDriveList] = React.useState([])

    useEffect(() => {
        Axios.get("http://localhost:3001/productdrive").then((response) => {
            setDriveList(response.data);
        })
    }, [])

    const handleView = (id) => {
        navigate(`/productdrive/${id}`)
    }

    const handleEdit = (id) => {
        navigate(`/productdrive/${id}/edit`)
    }

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Product Drive Name</th>
                        <th>Quantity of Items</th>
                        <th>Variety of Items</th>
                        <th>In-Kind Value</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {driveList.map((val) => {
                        return (
                            <tr>
                                <td>{val.Drive}</td>
                                <td>{val.Quantity}</td>
                                <td>{val.Variety}</td>
                                <td>{val.Total}</td>
                                <td>
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

export default ProductDriveView;
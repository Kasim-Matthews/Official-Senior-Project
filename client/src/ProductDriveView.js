import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useNavigate, Link } from "react-router-dom";

function ProductDriveView() {
    const navigate = useNavigate();

    const [partners, setPartners] = React.useState([])
    const [driveList, setDriveList] = React.useState([])
    const [records, setRecords] = React.useState([])
    const [filters, setFilters] = React.useState({
        Drive: "",
    })


    useEffect(() => {
        Axios.get("http://localhost:3306/productdrive").then((response) => {
            setDriveList(response.data);
            setRecords(response.data);
        })
    }, [])

    const handleView = (id) => {
        navigate(`/productdrive/${id}`)
    }

    const handleEdit = (id) => {
        navigate(`/productdrive/${id}/edit`)
    }

    function handleSubmit(e) {
        e.preventDefault();
        var temp = driveList;

        if (filters.Drive != "") {
            temp = temp.filter(f => f.Drive == filters.Drive);
        }



        setRecords(temp);
    }

    function handleChange(event) {
        setFilters(prevFilters => {
            return {
                ...prevFilters,
                [event.target.name]: event.target.value
            }
        })
    }

    useEffect(() => {
        Axios.get("http://localhost:3306/productdrive/list").then((response) => {
          setPartners(response.data);
        })
      }, [])

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="Drive">
                Drive
                    <select id="Drive" name="Drive" value={filters.Drive} onChange={handleChange}>
                        <option value=""></option>
                        {partners.map((val) => {
                            return (
                                <option value={val.Name}>{val.Name}</option>
                            )
                        })}

                    </select>

                </label>
                <input type="submit" value="Filter" />
            </form>

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
                    {records.map((val) => {
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
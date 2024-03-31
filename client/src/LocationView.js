import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, Link } from "react-router-dom";

function LocationView() {
    const navigate = useNavigate();

    const [locationList, setLocationList] = React.useState([])

    useEffect(() => {
        Axios.get("http://localhost:3306/location").then((response) => {
            setLocationList(response.data);
        })
    }, [])

    const handleRemove = (id) => {
        let date = new Date().toLocaleDateString()
        Axios.put(`http://localhost:3306/location/remove/${id}`, {date: date});
        window.location.reload(false);
    }

    const handleEdit = (id) => {
        navigate(`/location/${id}/edit`)
    }

    return (
        <div>
            <button><Link to="/location/new">Add</Link></button>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {locationList.map((val) => {
                        return (
                            <tr>
                                <td>{val.Name}</td>
                                <td>{val.Address}</td>
                                <td>
                                    <button onClick={() => handleRemove(val.Location_id)}>Delete</button>
                                    <button onClick={() => handleEdit(val.Location_id)}>Edit</button>
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

export default LocationView;
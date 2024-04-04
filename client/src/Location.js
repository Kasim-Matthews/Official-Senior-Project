import React, { useEffect } from "react";
import Axios from 'axios';
import {useNavigate, Link} from "react-router-dom";

function Location(){
    const navigate = useNavigate();

    const [locationList, setLocationList] = React.useState([])

    useEffect(() => {
        Axios.get("http://localhost:3306/location").then((response) =>{
            setLocationList(response.data);
        })
    })

    const handleRemove = (id) =>{
        Axios.delete(`http://localhost:3306/location/remove/${id}`);
    }

    const handleEdit = (id) => {
        navigate(`/location/${id}/edit`)
    }

    return(
        <div>
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
                        return(
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

export default Location;
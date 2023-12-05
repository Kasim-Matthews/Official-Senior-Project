import React, { useEffect } from "react";
import './Distribution.css';
import Axios from 'axios';
import {useNavigate} from "react-router-dom";

function Location(){
    const navigate = useNavigate();

    const [locationList, setLocationList] = React.useState([])

    useEffect(() => {
        Axios.get("http:////localhost:3001/location").then((response) =>{
            setItemList(response.data);
        })
    })

    const handleRemove = (id) =>{
        Axios.delete(`http://localhost:3001/location/remove/${id}`);
    }

    const handleEdit = (id) => {
        navigate(`/location/${id}/edit`)
    }

    return(
        <div>
            <table>
                <thead>
                    <th>
                        <tr>
                            <td>Name</td>
                            <td>Market Value</td>
                            <td>Actions</td>
                        </tr>
                    </th>
                </thead>
                <tbody>
                    {locationList.map((val) => {
                        return(
                            <tr>
                                <td>{val.Name}</td>
                                <td>{val.Address}</td>
                                <td>{val.totalInventory}</td>
                                <td>${val.marketValue}</td>
                                <td>
                                    <button onClick={() => handleRemove(val.id)}>Delete</button>
                                    <button onClick={() => handleEdit(val.id)}>Edit</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default Location;
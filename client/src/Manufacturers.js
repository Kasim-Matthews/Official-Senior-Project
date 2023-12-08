import React, { useEffect } from "react";
import Axios from 'axios';
import {useNavigate, Link} from "react-router-dom";

function Manufacturers(){
    const navigate = useNavigate();

    const [manuList, setManuList] = React.useState([])

    useEffect(() => {
        Axios.get("http:////localhost:3001/manufacturers").then((response) =>{
            setManuList(response.data);
        })
    })

    const handleRemove = (id) =>{
        Axios.delete(`http://localhost:3001/manufacturers/remove/${id}`);
    }

    const handleEdit = (id) => {
        navigate(`/manufacturers/${id}/edit`)
    }

    return(
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Market Value</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {manuList.map((val) => {
                        return(
                            <tr>
                                <td>{val.Name}</td>
                                <td>0</td>
                                <td>
                                    <button onClick={() => handleRemove(val.id)}>Delete</button>
                                    <button onClick={() => handleEdit(val.id)}>Edit</button>
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

export default Manufacturers;
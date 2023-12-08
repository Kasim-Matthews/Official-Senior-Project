import React, { useEffect } from "react";
import Axios from 'axios';
import {useNavigate} from "react-router-dom";

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
                    <th>
                        <tr>
                            <td>Name</td>
                            <td>Market Value</td>
                            <td>Actions</td>
                        </tr>
                    </th>
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
        </div>
    );
}

export default Manufacturers;
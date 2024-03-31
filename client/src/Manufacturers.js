import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, Link } from "react-router-dom";

function Manufacturers() {
    const navigate = useNavigate();

    const [manuList, setManuList] = React.useState([])

    useEffect(() => {
        Axios.get("http://localhost:3001/manufacturers").then((response) => {
            setManuList(response.data);
        })
    }, [])


    const handleEdit = (id) => {
        navigate(`/manufacturers/${id}/edit`)
    }

    const handleView = (id) => {
        navigate(`/manufacturers/${id}`)
    }

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Total Items</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {manuList.map((val) => {
                        return (
                            <tr>
                                <td>{val.Name}</td>
                                <td>{val.TotalItems}</td>
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

export default Manufacturers;
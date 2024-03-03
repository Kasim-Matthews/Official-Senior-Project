import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, useParams, Link } from "react-router-dom";

function ViewPartner() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [record, setRecord] = React.useState([])



    useEffect(() => {
        Axios.get(`http://localhost:3001/partner/${id}/edit`).then((response) => {
            setRecord(response.data[0])
        });
    }, [])


    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{record.Name}</td>
                        <td>{record.Email}</td>
                    </tr>
                </tbody>
            </table>
            <button><Link to="/Dashboard">Dasboard</Link></button>
        </div>
    )
}

export default ViewPartner;
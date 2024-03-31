import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, useParams, Link } from "react-router-dom";

function ViewItem() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [record, setRecord] = React.useState({})

    useEffect(() => {
        Axios.get(`https://diaper-bank-inventory-management-system.onrender.com/item/${id}/view`).then((response) => {
            response.data.map((key, value) => { setRecord(key) });
        })
    }, [])

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Market Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{record.Name}</td>
                        <td>${record.FairMarketValue}</td>
                    </tr>
                </tbody>
            </table>
            <button><Link to="/Dashboard">Dasboard</Link></button>
        </div>
    )
}

export default ViewItem;
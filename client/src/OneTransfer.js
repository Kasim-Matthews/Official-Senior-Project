import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, useParams, Link } from "react-router-dom";

function ViewTransfer() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [record, setRecord] = React.useState([])


    useEffect(() => {
        Axios.get(`https://diaper-bank-inventory-management-system.onrender.com/transfer/${id}/view`).then((response) => {
            setRecord(response.data.data)
        });
    }, [])


    return (
        <div>

            <table>
                <thead>
                    <tr>
                        <h3>{`Transfer from ${record.Taken[0]} to ${record.Given[0]} on ${new Date(record[0].Date).toLocaleDateString()}`}</h3>
                    </tr>
                    <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {record.map((val) => {
                        return (
                            <tr>
                                <td>{val.Item}</td>
                                <td>{val.Quantity}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <button><Link to="/Dashboard">Dasboard</Link></button>
        </div>
    )
}


export default ViewTransfer;
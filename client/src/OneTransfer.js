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

    console.log(record.Taken)
    console.log(record.Given)
    console.log(record.Date)

    return (
        <div>

            <table>
                <thead>
                    <tr>
                        <h3>{`Transfer from ${record.Taken} to ${record.Given} on ${new Date(record.Date).toLocaleDateString()}`}</h3>
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
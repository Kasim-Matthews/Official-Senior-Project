import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, useParams, Link } from "react-router-dom";
import Navbar from "./components/navbar";

function ViewTransfer() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [record, setRecord] = React.useState([])


    useEffect(() => {
        Axios.get(`http://localhost:3001/transfer/${id}/view`).then((response) => {
            setRecord(response.data)
        });
    }, [])


    return (
        <div>

            <table>
                <thead>
                    <tr>
                        <h3>{`Transfer from ${record.Taken} to ${record.Given} on ${record.Date}`}</h3>
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
import React, { useEffect } from "react";
import Axios from 'axios';
import { useParams, Link } from "react-router-dom";

function ViewIntake() {

    const { id } = useParams();
    const [record, setRecord] = React.useState([])
    const [itemList, setItemList] = React.useState([])

    useEffect(() => {
        Axios.get(`https://diaper-bank-inventory-management-system.onrender.com/intake/${id}/view`).then((response) => {
            setRecord(response.data[0])
            setItemList(response.data)
        });
    }, [])

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Source</th>
                        <th>Received Date</th>
                        <th>Storage Location</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{record.Partner}</td>
                        <td>{record.RecievedDate}</td>
                        <td>{record.Location}</td>
                    </tr>
                </tbody>
            </table>
            <table>
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Inkind Value</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {itemList.map((val) => {
                        return (
                            <tr>
                                <td>{val.Item}</td>
                                <td>{Math.round((val.FairMarketValue * val.Quantity) * 100) / 100}</td>
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

export default ViewIntake;
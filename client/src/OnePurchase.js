import React, { useEffect } from "react";
import Axios from 'axios';
import { useParams, Link } from "react-router-dom";

function ViewPurchase() {

    const { id } = useParams();
    const [record, setRecord] = React.useState([])
    const [itemList, setItemList] = React.useState([])

    useEffect(() => {
        Axios.get(`http://localhost:3001/purchase/${id}/view`).then((response) => {
            setRecord(response.data[0])
            setItemList(response.data)
        });
    }, [])

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Vendor</th>
                        <th>Received Date</th>
                        <th>Storage Location</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{record.Vendor}</td>
                        <td>{record.PurchaseDate}</td>
                        <td>{record.Location}</td>
                    </tr>
                </tbody>
            </table>
            <table>
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {itemList.map((val) => {
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

export default ViewPurchase;
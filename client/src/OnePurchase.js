import React, { useEffect } from "react";
import Axios from 'axios';
import { useParams, Link, useNavigate } from "react-router-dom";

function ViewPurchase() {

    const { id } = useParams();
    const [record, setRecord] = React.useState([])
    const [itemList, setItemList] = React.useState([])
    const navigate = useNavigate();

    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/purchase/${id}/view`).then((response) => {
            if (response.data.status === 'complete') {
                setRecord(response.data.data[0])
                setItemList(response.data.data)
            }
            else if (response.data.status === 'error in query') {
                navigate('/query')
                console.error("Fail in the query")
                console.error(response.data.message)
            }

        }).catch(error => {
            navigate('/error')
            console.error(error.response.data.message)
        })
    }, [])

    if (record.length == 0 && itemList.length == 0) {
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

                </table>
                <table>
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>

                    <tfoot>
                        <tr>
                            <th>Total</th>
                        </tr>
                    </tfoot>
                </table>
                <button><Link to="/Dashboard">Dasboard</Link></button>
            </div>
        )
    }


    else {
        const totalQuantity = itemList.reduce((sum, val) => sum + parseInt(val.Quantity), 0);

        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Vendor</th>
                            <th>Purchase Date</th>
                            <th>Storage Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{record.Vendor}</td>
                            <td>{new Date(record.PurchaseDate).toISOString().slice(0, 10)}</td>
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
                    <tfoot>
                        <tr>
                            <th>Total</th>
                            <td>{totalQuantity}</td>
                        </tr>
                    </tfoot>
                </table>
                <button><Link to="/Dashboard">Dasboard</Link></button>
            </div>
        )
    }

}

export default ViewPurchase;
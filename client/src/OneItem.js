import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, useParams, Link } from "react-router-dom";

function ViewItem() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [record, setRecord] = React.useState({})
    const [list, setList] = React.useState([])

    useEffect(() => {
        Axios.get(`http://localhost:3001/item/${id}/edit`).then((response) => {
            response.data.map((key, value) => { setRecord(key) });
        })
    }, [])

    useEffect(() => {
        Axios.get(`http://localhost:3001/item/${id}/view`).then((response) => {
            setList(response.data)
        })
    }, [])

    return (
        <div>
            <h2>Item Information for {record.Name}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Market Value</th>
                        <th>Package Size</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${record.FairMarketValue}</td>
                        <td>{typeof record.PackageCount != "object" ? record.PackageCount : null}</td>
                    </tr>
                </tbody>
            </table>

            <table>
                <thead>
                    <tr>
                        <header>This Item Is Contained In These Inventories</header>
                    </tr>
                </thead>
                <thead>
                    <tr>
                        <th>Storage Location</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {list.map((val) => {
                        return (
                            <tr>
                                <td>{val.Location}</td>
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

export default ViewItem;
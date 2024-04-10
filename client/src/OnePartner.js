import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, useParams, Link } from "react-router-dom";

function ViewPartner() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [record, setRecord] = React.useState({})
    const [distributionList, setDistributionList] = React.useState([])

    const handleView = (id) => {
        navigate(`/distribution/${id}`)
    }
    const handleprint = (id) => {
        navigate(`/distribution/${id}/print.pdf`)
    }

    useEffect(() => {
        Axios.get(`http://localhost:3001/partner/${id}/edit`).then((response) => {
            setRecord(response.data[0])
        });
    }, [])

    useEffect(() => {
        Axios.get(`http://localhost:3001/partner/${id}/view`).then((response) => {
            setDistributionList(response.data)
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
            <h3>Prior Distributions</h3>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Source Location</th>
                        <th>Total Items</th>
                    </tr>
                </thead>
                <tbody>
                    {distributionList.map((val) => {
                        return (
                            <tr>
                                <td>{val.CompletedDate}</td>
                                <td>{val.Location}</td>
                                <td>{val.Total}</td>
                                <td>
                                    <button onClick={() => handleprint(val.Order_id)}>Print</button>
                                    <button onClick={() => handleView(val.Order_id)}>View</button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <button><Link to="/Dashboard">Dasboard</Link></button>
        </div>
    )
}

export default ViewPartner;
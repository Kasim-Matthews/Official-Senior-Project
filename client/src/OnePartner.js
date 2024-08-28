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
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/partner/${id}/edit`).then((response) => {
            if (response.data.status === 'complete') {
                setRecord(response.data.data[0])
            }

            else if (response.data.status === 'error in query') {
                navigate('/query')
                console.error("Fail in the query")
                console.error(response.data.message)
            }
        }).catch(error => {
            navigate('/error')
            console.error(error.response.data.message)
        });
    }, [])

    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/partner/${id}/view`).then((response) => {
            if (response.data.status === 'complete') {
                setDistributionList(response.data.data)
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

    if (distributionList.length === 0) {
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
                </table>
                <button><Link to="/Dashboard">Dasboard</Link></button>
            </div>
        )
    }
    else {
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
                                    <td>{new Date(val.CompletedDate).toISOString().slice(0, 10)}</td>
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
}

export default ViewPartner;
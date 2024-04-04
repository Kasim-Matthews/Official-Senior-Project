import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, useParams, Link } from "react-router-dom";

function ViewVendor() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [record, setRecord] = React.useState({})
    const [intakeList, setIntakeList] = React.useState([])

    const handleView = (id) => {
        navigate(`/purchase/${id}`)
    }


    useEffect(() => {
        Axios.get(`http://localhost:3306/vendor/${id}/edit`).then((response) => {
            setRecord(response.data[0])
        });
    }, [])

    useEffect(() => {
        Axios.get(`http://localhost:3306/vendor/${id}/view`).then((response) => {
            setIntakeList(response.data)
        });
    }, [])


    return (
        <div>
            <h3>Vendor Information for {record.BusinessName}</h3>
            <table>
                <thead>
                    <tr>
                        <th>Business Name</th>
                        <th>Contact Name</th>
                        <th>Phone Number</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{record.BusinessName}</td>
                        <td>{record.ContactName}</td>
                        <td>{record.Phone}</td>
                        <td>{record.Email}</td>
                    </tr>
                </tbody>
            </table>

            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Total Items</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {intakeList.map((val) => {
                        return (
                            <tr>
                                <td>{val.PurchaseDate}</td>
                                <td>{val.Total}</td>
                                <td>
                                    <button onClick={() => handleView(val.Intake_id)}>View Details</button>
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

export default ViewVendor;
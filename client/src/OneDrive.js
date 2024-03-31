import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, useParams, Link } from "react-router-dom";

function ViewDrive() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [record, setRecord] = React.useState({})
    const [intakeList, setIntakeList] = React.useState([])

    const handleView = (id) => {
        navigate(`/intake/${id}`)
    }


    useEffect(() => {
        Axios.get(`http://localhost:3001/productdrive/${id}/edit`).then((response) => {
            setRecord(response.data[0])
        });
    }, [])

    useEffect(() => {
        Axios.get(`http://localhost:3001/productdrive/${id}/view`).then((response) => {
            setIntakeList(response.data)
        });
    }, [])


    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{record.Name}</td>
                    </tr>
                </tbody>
            </table>

            <table>
                <thead>
                    <tr>
                        <th>Location</th>
                        <th>Quantity</th>
                        <th>Total Items</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {intakeList.map((val) => {
                        return (
                            <tr>
                                <td>{val.Location}</td>
                                <td>{val.Quantity}</td>
                                <td>{val.TotalItems}</td>
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
/*Cannot edit till the purchase functionality is a thing*/

export default ViewDrive;
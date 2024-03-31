import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, useParams, Link } from "react-router-dom";

function ViewManufacturer() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [record, setRecord] = React.useState([])


    useEffect(() => {
        Axios.get(`https://diaper-bank-inventory-management-system.onrender.com/manufacturers/${id}/view`).then((response) => {
            setRecord(response.data)
        });
    }, [])

    const handleView = (id) => {
        navigate(`/intake/${id}`)
    }


    return (
        <div>

            <table>
                <thead>
                    <tr>
                        <h3>{`Past Donations from ${record[0].Manufacturer}`}</h3>
                    </tr>
                    <tr>
                        <th>Date</th>
                        <th>Volume</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {record.map((val) => {
                        return (
                            <tr>
                                <td>{val.Date}</td>
                                <td>{val.Volume}</td>
                                <td><button onClick={() => handleView(val.Intake_id)}> View donation details</button></td>
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

export default ViewManufacturer;
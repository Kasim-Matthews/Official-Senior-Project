import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, useParams, Link } from "react-router-dom";

function ViewIntake() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [record, setRecord] = React.useState([])

    useEffect(() => {
        Axios.get(`http://localhost:3001/intake/${id}/view`).then((response) => {
            setRecord(response.data[0])
        });
    }, [])

    let q = new Date(record.RecievedDate);
    let monthRecievedDate = ""
    let dayRecievedDate = ""
    let yearRecievedDate = ""
    let concatRecievedDate = ""
    monthRecievedDate = q.getMonth() + 1
    dayRecievedDate = q.getDate() + 1
    yearRecievedDate = q.getFullYear() + 1
    concatRecievedDate = yearRecievedDate + "-" + monthRecievedDate + "-" + dayRecievedDate

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Partner</th>
                        <th>Received Date</th>
                        <th>Value</th>
                        <th>Comments</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{record.Name}</td>
                        <td>{concatRecievedDate}</td>
                        <td>{record.Value}</td>
                        <td>{record.Comments}</td>
                    </tr>
                </tbody>
            </table>
            <button><Link to="/Dashboard">Dasboard</Link></button>
        </div>
    )
}

export default ViewIntake;